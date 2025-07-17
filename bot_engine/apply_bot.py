import asyncio
from playwright.async_api import async_playwright
from datetime import datetime
from database.crud import log_applied_job


from backend.db.models import UserProfile
from backend.db.database import SessionLocal

async def apply_to_jobs_naukri(username, password, keywords, location="", user_id=None):
    db = SessionLocal()
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

    # Handle blacklist filters
    blacklist_keywords = profile.blacklisted_keywords.split(",") if profile and profile.blacklisted_keywords else []
    blacklist_companies = profile.blacklisted_companies.split(",") if profile and profile.blacklisted_companies else []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # True in production
        context = await browser.new_context()
        page = await context.new_page()

        try:
            print("🔐 Logging in...")
            await page.goto("https://www.naukri.com/mnjuser/login")
            await page.fill('input[name="username"]', username)
            await page.fill('input[name="password"]', password)
            await page.click('button[type="submit"]')
            await page.wait_for_timeout(5000)

            print("🔍 Searching jobs...")
            search_url = f"https://www.naukri.com/{keywords}-jobs-in-{location}".replace(" ", "-")
            await page.goto(search_url)
            await page.wait_for_timeout(5000)

            job_cards = await page.query_selector_all('article.jobTuple')
            print(f"🔎 Found {len(job_cards)} jobs")

            for job in job_cards:
                try:
                    job_title_elem = await job.query_selector("a.title")
                    company_elem = await job.query_selector("a.subTitle")

                    job_title_text = await job_title_elem.inner_text() if job_title_elem else "Unknown Title"
                    company_text = await company_elem.inner_text() if company_elem else "Unknown Company"

                    # Skip if blacklisted
                    if any(b.lower() in job_title_text.lower() for b in blacklist_keywords):
                        print(f"⛔ Skipping due to blacklisted keyword: {job_title_text}")
                        continue
                    if any(c.lower() in company_text.lower() for c in blacklist_companies):
                        print(f"⛔ Skipping blacklisted company: {company_text}")
                        continue

                    apply_btn = await job.query_selector('a[title="Apply"]')
                    if apply_btn:
                        job_url = await job.get_attribute("data-url")
                        await apply_btn.click()
                        await page.wait_for_timeout(3000)
                        print("✅ Applied to:", job_title_text)

                        # Log to database
                        if user_id:
                            log_applied_job(user_id, job_title_text, company_text, job_url)

                        await page.go_back()
                        await page.wait_for_timeout(2000)
                except Exception as e:
                    print("⚠️ Error processing job:", e)
                    continue

        except Exception as e:
            print("❌ Bot failed:", e)
        finally:
            await context.close()
            await browser.close()
            db.close()

# Test Run (Optional)
if __name__ == "__main__":
    asyncio.run(apply_to_jobs_naukri(
        username="your_email@example.com",
        password="your_password",
        keywords="python developer",
        location="noida",
        user_id=1  # Pass your test user_id
    ))
