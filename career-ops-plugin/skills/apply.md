# /apply

Trigger the auto-apply pipeline: discover jobs → score with AI → apply with resume, cover letter, and portfolio link.

## Usage
```
/apply [--dry-run] [--platform linkedin|indeed|all] [--limit N]
```

## What it does
1. Reads your config from `localStorage` (or prompts you to set it up at `/profile`)
2. Searches enabled platforms for jobs matching your search terms
3. Scores each job 1-10 against your skills and target roles
4. Filters out jobs below your minimum score threshold
5. Fills forms with your name, resume, cover letter (with `{company}` / `{role}` substituted), and portfolio URL
6. Submits applications (or pauses for review if `pauseBeforeSubmit` is enabled)

## Examples
- `/apply` — full run using your saved config
- `/apply --dry-run` — simulate without submitting
- `/apply --platform linkedin --limit 10` — only LinkedIn, max 10 apps
