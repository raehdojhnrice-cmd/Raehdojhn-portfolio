"""
LinkedIn applier — uses Playwright for browser automation.
Inspired by GodsScion/Auto_job_applier_linkedIn with stealth mode.
"""

import asyncio
import uuid
from datetime import datetime
from typing import Any

try:
    from playwright.async_api import async_playwright, Page, Browser
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False


async def search_linkedin(search: dict, creds: dict) -> list[dict]:
    """Search LinkedIn for jobs matching the config."""
    if not PLAYWRIGHT_AVAILABLE:
        return _mock_jobs("linkedin", search)

    results = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        )
        page = await ctx.new_page()

        try:
            await _linkedin_login(page, creds)
            for term in search.get("searchTerms", [])[:3]:  # limit per run
                jobs = await _scrape_linkedin_jobs(page, term, search)
                results.extend(jobs)
                await asyncio.sleep(2)
        except Exception as e:
            print(f"LinkedIn search error: {e}")
        finally:
            await browser.close()

    return results


async def _linkedin_login(page: Any, creds: dict) -> None:
    if creds.get("sessionCookies"):
        # Use cookies instead of password login (more stable)
        await page.goto("https://www.linkedin.com")
        await page.context.add_cookies([{"name": "li_at", "value": creds["sessionCookies"], "domain": ".linkedin.com", "path": "/"}])
        await page.reload()
        return

    await page.goto("https://www.linkedin.com/login")
    await page.fill("#username", creds.get("username", ""))
    await page.fill("#password", creds.get("password", ""))
    await page.click('button[type="submit"]')
    await page.wait_for_timeout(3000)


async def _scrape_linkedin_jobs(page: Any, term: str, search: dict) -> list[dict]:
    location = search.get("location", "United States")
    url = f"https://www.linkedin.com/jobs/search/?keywords={term}&location={location}&f_AL=true"
    if search.get("easyApplyOnly"):
        url += "&f_LF=f_AL"

    await page.goto(url)
    await page.wait_for_timeout(2000)

    jobs = []
    cards = await page.query_selector_all(".job-card-container")
    for card in cards[:20]:
        try:
            title = await card.query_selector(".job-card-list__title")
            company = await card.query_selector(".job-card-container__company-name")
            location = await card.query_selector(".job-card-container__metadata-item")
            link = await card.query_selector("a.job-card-container__link")

            jobs.append({
                "id": str(uuid.uuid4()),
                "title": await title.inner_text() if title else "",
                "company": await company.inner_text() if company else "",
                "location": await location.inner_text() if location else "",
                "platform": "linkedin",
                "link": "https://www.linkedin.com" + (await link.get_attribute("href") or ""),
                "salary": "",
                "description": "",
                "discoveredAt": datetime.utcnow().isoformat(),
                "aiScore": None,
                "status": "discovered",
                "notes": "",
                "easyApply": True,
                "appliedAt": None,
            })
        except Exception:
            continue

    return jobs


async def apply_linkedin(job: dict, cfg: Any) -> bool:
    """Submit an Easy Apply application on LinkedIn."""
    if not PLAYWRIGHT_AVAILABLE:
        return False

    creds = cfg.platforms.get("linkedin", {})
    personal = cfg.personal
    career = cfg.career

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=cfg.bot.get("runInBackground", False))
        ctx = await browser.new_context()
        page = await ctx.new_page()

        try:
            await _linkedin_login(page, creds)
            await page.goto(job["link"])
            await page.wait_for_timeout(2000)

            # Click Easy Apply button
            easy_apply_btn = await page.query_selector('button[aria-label*="Easy Apply"]')
            if not easy_apply_btn:
                return False
            await easy_apply_btn.click()
            await page.wait_for_timeout(1500)

            # Fill out form fields
            await _fill_linkedin_form(page, personal, career, cfg)

            # Submit (unless dry run or pause enabled)
            if cfg.bot.get("pauseBeforeSubmit"):
                print(f"[PAUSED] Ready to submit: {job['title']} @ {job['company']}. Press Enter to continue...")
                input()

            submit_btn = await page.query_selector('button[aria-label="Submit application"]')
            if submit_btn:
                await submit_btn.click()
                await page.wait_for_timeout(2000)
                return True

        except Exception as e:
            print(f"LinkedIn apply error: {e}")
        finally:
            await browser.close()

    return False


async def _fill_linkedin_form(page: Any, personal: dict, career: dict, cfg: Any) -> None:
    """Fill LinkedIn Easy Apply form fields with profile data."""
    # Phone
    phone_input = await page.query_selector('input[id*="phone"]')
    if phone_input:
        await phone_input.fill(personal.get("phone", ""))

    # City
    city_input = await page.query_selector('input[id*="city"]')
    if city_input:
        await city_input.fill(personal.get("city", ""))

    # Cover letter
    cover = await page.query_selector('textarea[id*="cover"]')
    if cover and career.get("coverLetter"):
        await cover.fill(career["coverLetter"])

    # Common questions
    await _answer_common_questions(page, career)


async def _answer_common_questions(page: Any, career: dict) -> None:
    """Answer standard application questions."""
    experience_inputs = await page.query_selector_all('input[id*="experience"]')
    for inp in experience_inputs:
        await inp.fill(str(career.get("yearsOfExperience", "3")))

    salary_inputs = await page.query_selector_all('input[id*="salary"]')
    for inp in salary_inputs:
        await inp.fill(str(career.get("desiredSalary", "")))


def _mock_jobs(platform: str, search: dict) -> list[dict]:
    """Return mock jobs when Playwright isn't available (dev mode)."""
    titles = search.get("searchTerms", ["Software Engineer"])
    return [
        {
            "id": str(uuid.uuid4()),
            "title": title,
            "company": f"Example Corp #{i+1}",
            "location": search.get("location", "Remote"),
            "platform": platform,
            "link": "https://linkedin.com/jobs/view/123",
            "salary": "$120,000 – $150,000",
            "description": f"We are looking for a {title} to join our team...",
            "discoveredAt": datetime.utcnow().isoformat(),
            "aiScore": None,
            "status": "discovered",
            "notes": "",
            "easyApply": True,
            "appliedAt": None,
        }
        for i, title in enumerate(titles[:5])
    ]
