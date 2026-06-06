"""Indeed SmartApply applier."""

import uuid
from datetime import datetime

try:
    from playwright.async_api import async_playwright
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False


async def search_indeed(search: dict, creds: dict) -> list[dict]:
    if not PLAYWRIGHT_AVAILABLE:
        return _mock_jobs(search)

    results = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        page = await browser.new_page()
        try:
            for term in search.get("searchTerms", [])[:2]:
                location = search.get("location", "United States")
                url = f"https://www.indeed.com/jobs?q={term}&l={location}"
                await page.goto(url)
                await page.wait_for_timeout(2000)

                cards = await page.query_selector_all(".job_seen_beacon")
                for card in cards[:15]:
                    try:
                        title_el = await card.query_selector("h2.jobTitle span")
                        company_el = await card.query_selector("[data-testid='company-name']")
                        location_el = await card.query_selector("[data-testid='text-location']")
                        salary_el = await card.query_selector(".salary-snippet-container")
                        link_el = await card.query_selector("a.jcs-JobTitle")

                        href = await link_el.get_attribute("href") if link_el else ""
                        results.append({
                            "id": str(uuid.uuid4()),
                            "title": await title_el.inner_text() if title_el else term,
                            "company": await company_el.inner_text() if company_el else "",
                            "location": await location_el.inner_text() if location_el else location,
                            "platform": "indeed",
                            "link": f"https://www.indeed.com{href}",
                            "salary": await salary_el.inner_text() if salary_el else "",
                            "description": "",
                            "discoveredAt": datetime.utcnow().isoformat(),
                            "aiScore": None,
                            "status": "discovered",
                            "notes": "",
                            "easyApply": False,
                            "appliedAt": None,
                        })
                    except Exception:
                        continue
        finally:
            await browser.close()

    return results


async def apply_indeed(job: dict, cfg) -> bool:
    """Apply to an Indeed job."""
    if not PLAYWRIGHT_AVAILABLE:
        return False

    creds = cfg.platforms.get("indeed", {})
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=cfg.bot.get("runInBackground", False))
        page = await browser.new_page()
        try:
            await page.goto(job["link"])
            await page.wait_for_timeout(2000)
            apply_btn = await page.query_selector("button#indeedApplyButton, [aria-label*='Apply']")
            if apply_btn:
                await apply_btn.click()
                await page.wait_for_timeout(3000)
                return True
        finally:
            await browser.close()
    return False


def _mock_jobs(search: dict) -> list[dict]:
    return [
        {
            "id": str(uuid.uuid4()),
            "title": term,
            "company": f"Indeed Corp #{i}",
            "location": search.get("location", "Remote"),
            "platform": "indeed",
            "link": "https://indeed.com/viewjob?jk=abc123",
            "salary": "$90,000 – $130,000",
            "description": f"Looking for {term}...",
            "discoveredAt": datetime.utcnow().isoformat(),
            "aiScore": None,
            "status": "discovered",
            "notes": "",
            "easyApply": False,
            "appliedAt": None,
        }
        for i, term in enumerate(search.get("searchTerms", ["Engineer"])[:3])
    ]
