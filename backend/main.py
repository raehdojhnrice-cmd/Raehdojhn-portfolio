"""
CareerOps Backend — FastAPI server that drives browser automation.
Run with: uvicorn main:app --reload --port 8000
The Next.js frontend connects to http://localhost:8000
"""

import asyncio
import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="CareerOps API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = Path(__file__).parent / "data" / "jobs.json"
DATA_FILE.parent.mkdir(exist_ok=True)


# ── Models ─────────────────────────────────────────────────────────────────────

class Config(BaseModel):
    personal: dict[str, Any]
    career: dict[str, Any]
    search: dict[str, Any]
    bot: dict[str, Any]
    platforms: dict[str, Any]


class RunRequest(BaseModel):
    config: Config
    dry_run: bool = True


class RunStatus(BaseModel):
    stage: str = "idle"
    message: str = "Ready"
    discovered: int = 0
    scored: int = 0
    applied: int = 0
    skipped: int = 0
    started_at: str | None = None
    log: list[str] = []


# ── State (in-memory for simplicity) ──────────────────────────────────────────

run_status = RunStatus()
jobs: list[dict] = []


def load_jobs() -> list[dict]:
    if DATA_FILE.exists():
        return json.loads(DATA_FILE.read_text())
    return []


def save_jobs(data: list[dict]) -> None:
    DATA_FILE.write_text(json.dumps(data, indent=2))


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@app.get("/api/status")
def get_status():
    return run_status


@app.get("/api/jobs")
def get_jobs():
    return load_jobs()


@app.post("/api/run")
async def start_run(req: RunRequest, bg: BackgroundTasks):
    global run_status
    if run_status.stage not in ("idle", "done", "error"):
        raise HTTPException(409, "A run is already in progress")
    run_status = RunStatus(
        stage="discovering",
        message="Starting job discovery...",
        started_at=datetime.utcnow().isoformat(),
        log=["[DRY RUN] Starting..." if req.dry_run else "Starting job discovery..."],
    )
    bg.add_task(run_pipeline, req)
    return {"ok": True, "dry_run": req.dry_run}


@app.post("/api/stop")
def stop_run():
    global run_status
    run_status.stage = "idle"
    run_status.message = "Stopped by user"
    run_status.log.append("Run stopped by user.")
    return {"ok": True}


# ── Pipeline ───────────────────────────────────────────────────────────────────

async def run_pipeline(req: RunRequest):
    global run_status
    cfg = req.config
    dry = req.dry_run

    try:
        # Stage 1: Discover
        run_status.stage = "discovering"
        run_status.message = "Searching for jobs..."
        discovered = await discover_jobs(cfg)
        run_status.discovered = len(discovered)
        run_status.log.append(f"Found {len(discovered)} jobs matching your criteria.")

        # Stage 2: Score
        run_status.stage = "scoring"
        run_status.message = "AI scoring jobs..."
        scored = await score_jobs(discovered, cfg)
        run_status.scored = len(scored)
        min_score = cfg.search.get("minAiScore", 6)
        approved = [j for j in scored if (j.get("aiScore") or 0) >= min_score]
        skipped = len(scored) - len(approved)
        run_status.log.append(f"Scored {len(scored)} jobs. {len(approved)} above threshold ({min_score}/10).")

        # Stage 3: Apply
        run_status.stage = "applying"
        run_status.message = f"{'[DRY RUN] ' if dry else ''}Applying to {len(approved)} jobs..."
        applied_count = 0
        existing = load_jobs()

        for job in approved:
            if run_status.stage == "idle":  # stopped
                break
            await asyncio.sleep(0.5)  # rate limiting
            if not dry:
                success = await apply_to_job(job, cfg)
                if success:
                    job["status"] = "applied"
                    job["appliedAt"] = datetime.utcnow().isoformat()
                    applied_count += 1
                    run_status.log.append(f"✓ Applied: {job['title']} @ {job['company']}")
                else:
                    job["status"] = "skipped"
                    skipped += 1
            else:
                job["status"] = "approved"
                applied_count += 1
                run_status.log.append(f"[DRY RUN] Would apply: {job['title']} @ {job['company']}")

            existing = [e for e in existing if e.get("id") != job["id"]]
            existing.insert(0, job)
            save_jobs(existing)

        run_status.applied = applied_count
        run_status.skipped = skipped
        run_status.stage = "done"
        run_status.message = f"{'[DRY RUN] ' if dry else ''}Done! {applied_count} applications submitted."
        run_status.log.append("Run complete!")

    except Exception as exc:
        run_status.stage = "error"
        run_status.message = f"Error: {exc}"
        run_status.log.append(f"ERROR: {exc}")


async def discover_jobs(cfg: Config) -> list[dict]:
    """Search for jobs across enabled platforms."""
    from appliers.linkedin import search_linkedin
    from appliers.indeed import search_indeed

    found: list[dict] = []
    platforms = cfg.platforms
    search = cfg.search

    if platforms.get("linkedin", {}).get("enabled"):
        jobs_li = await search_linkedin(search, platforms["linkedin"])
        found.extend(jobs_li)
        run_status.log.append(f"LinkedIn: found {len(jobs_li)} jobs")

    if platforms.get("indeed", {}).get("enabled"):
        jobs_in = await search_indeed(search, platforms["indeed"])
        found.extend(jobs_in)
        run_status.log.append(f"Indeed: found {len(jobs_in)} jobs")

    # Filter bad words
    bad = [w.lower() for w in search.get("badWords", [])]
    bad_co = [w.lower() for w in search.get("badCompanyWords", [])]
    filtered = []
    for j in found:
        title_lower = j.get("title", "").lower()
        co_lower = j.get("company", "").lower()
        if any(b in title_lower for b in bad):
            continue
        if any(b in co_lower for b in bad_co):
            continue
        filtered.append(j)

    return filtered


async def score_jobs(jobs: list[dict], cfg: Config) -> list[dict]:
    """Score jobs using AI (or heuristic if no AI configured)."""
    ai_provider = cfg.bot.get("aiProvider", "none")
    career = cfg.career

    for job in jobs:
        if ai_provider != "none" and cfg.bot.get("aiApiKey"):
            score = await ai_score_job(job, career, cfg.bot)
        else:
            score = heuristic_score(job, career)
        job["aiScore"] = score
        job["status"] = "scored"

    return jobs


def heuristic_score(job: dict, career: dict) -> int:
    """Simple keyword-based scoring."""
    score = 5
    skills = [s.lower() for s in career.get("skills", [])]
    desc = (job.get("description", "") + " " + job.get("title", "")).lower()
    matches = sum(1 for s in skills if s in desc)
    score += min(matches, 4)
    if job.get("easyApply"):
        score += 1
    return min(max(score, 1), 10)


async def ai_score_job(job: dict, career: dict, bot: dict) -> int:
    """Score job using LLM."""
    provider = bot.get("aiProvider", "none")
    api_key = bot.get("aiApiKey", "")
    if not api_key:
        return heuristic_score(job, career)

    prompt = f"""Rate how well this job fits the candidate on a scale of 1-10.
Job: {job.get('title')} at {job.get('company')}
Description snippet: {job.get('description', '')[:500]}
Candidate skills: {', '.join(career.get('skills', []))}
Target roles: {', '.join(career.get('targetRoles', []))}
Return ONLY a single integer 1-10."""

    try:
        if provider == "anthropic":
            import httpx
            r = httpx.post(
                "https://api.anthropic.com/v1/messages",
                headers={"x-api-key": api_key, "anthropic-version": "2023-06-01", "content-type": "application/json"},
                json={"model": "claude-haiku-4-5-20251001", "max_tokens": 10, "messages": [{"role": "user", "content": prompt}]},
                timeout=15,
            )
            text = r.json()["content"][0]["text"].strip()
            return min(max(int(text), 1), 10)
    except Exception:
        pass

    return heuristic_score(job, career)


async def apply_to_job(job: dict, cfg: Config) -> bool:
    """Apply to a single job using the appropriate platform applier."""
    platform = job.get("platform", "other")
    try:
        if platform == "linkedin":
            from appliers.linkedin import apply_linkedin
            return await apply_linkedin(job, cfg)
        elif platform == "indeed":
            from appliers.indeed import apply_indeed
            return await apply_indeed(job, cfg)
        else:
            from appliers.generic import apply_generic
            return await apply_generic(job, cfg)
    except Exception as e:
        run_status.log.append(f"Failed to apply to {job.get('title')}: {e}")
        return False


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
