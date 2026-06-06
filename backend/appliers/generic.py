"""Generic form-filler for Greenhouse, Lever, Workday, Ashby, and any other ATS."""

try:
    from playwright.async_api import async_playwright
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False

# Common field selectors across ATS platforms
FIELD_MAP = {
    "first_name": ["input[name*='first']", "input[id*='first']", "input[placeholder*='First']"],
    "last_name": ["input[name*='last']", "input[id*='last']", "input[placeholder*='Last']"],
    "email": ["input[type='email']", "input[name*='email']", "input[id*='email']"],
    "phone": ["input[type='tel']", "input[name*='phone']", "input[id*='phone']"],
    "resume": ["input[type='file'][accept*='pdf']", "input[type='file']"],
    "cover_letter": ["textarea[name*='cover']", "textarea[id*='cover']", "textarea[placeholder*='cover']"],
    "linkedin": ["input[name*='linkedin']", "input[id*='linkedin']", "input[placeholder*='linkedin']"],
    "website": ["input[name*='website']", "input[name*='portfolio']", "input[id*='website']"],
    "github": ["input[name*='github']", "input[id*='github']"],
}


async def apply_generic(job: dict, cfg) -> bool:
    """Attempt to fill and submit a job application form on any ATS."""
    if not PLAYWRIGHT_AVAILABLE or not job.get("link"):
        return False

    personal = cfg.personal
    career = cfg.career

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=cfg.bot.get("runInBackground", False))
        page = await browser.new_page()
        try:
            await page.goto(job["link"])
            await page.wait_for_timeout(3000)

            # Find and click Apply button
            apply_selectors = [
                "a:has-text('Apply')", "button:has-text('Apply')",
                "a:has-text('Apply Now')", "button:has-text('Apply Now')",
                "[aria-label*='Apply']",
            ]
            for sel in apply_selectors:
                btn = await page.query_selector(sel)
                if btn:
                    await btn.click()
                    await page.wait_for_timeout(2000)
                    break

            # Fill form fields
            fill_map = {
                "first_name": personal.get("firstName", ""),
                "last_name": personal.get("lastName", ""),
                "email": personal.get("email", ""),
                "phone": personal.get("phone", ""),
                "cover_letter": career.get("coverLetter", "").replace("{company}", job.get("company", "")).replace("{role}", job.get("title", "")),
                "linkedin": personal.get("linkedIn", ""),
                "website": personal.get("website", ""),
                "github": personal.get("github", ""),
            }

            for field_key, value in fill_map.items():
                if not value:
                    continue
                for selector in FIELD_MAP.get(field_key, []):
                    el = await page.query_selector(selector)
                    if el:
                        await el.fill(value)
                        break

            # Upload resume if available
            if career.get("resumeFileName") and career.get("resumeBase64"):
                await _upload_resume(page, career)

            # Pause before submit if configured
            if cfg.bot.get("pauseBeforeSubmit"):
                print(f"[PAUSED] Ready to submit: {job['title']} @ {job['company']}. Press Enter...")
                input()
                return True  # user confirms separately

            # Submit
            submit_selectors = [
                "button[type='submit']", "input[type='submit']",
                "button:has-text('Submit')", "button:has-text('Send Application')",
            ]
            for sel in submit_selectors:
                btn = await page.query_selector(sel)
                if btn:
                    await btn.click()
                    await page.wait_for_timeout(2000)
                    return True

        except Exception as e:
            print(f"Generic apply error for {job.get('link')}: {e}")
        finally:
            await browser.close()

    return False


async def _upload_resume(page, career: dict) -> None:
    """Write base64 resume to temp file and upload it."""
    import base64
    import tempfile
    import os

    b64 = career["resumeBase64"].split(",")[-1]  # strip data URL prefix
    data = base64.b64decode(b64)
    suffix = ".pdf" if "pdf" in career.get("resumeFileName", "").lower() else ".doc"

    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(data)
        tmp_path = tmp.name

    try:
        for selector in FIELD_MAP["resume"]:
            el = await page.query_selector(selector)
            if el:
                await el.set_input_files(tmp_path)
                break
    finally:
        os.unlink(tmp_path)
