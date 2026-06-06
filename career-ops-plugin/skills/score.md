# /score

Score a job posting against your profile using AI.

## Usage
```
/score <job-url-or-description>
```

## What it does
- Extracts the job title, company, requirements, and description
- Compares against your skills, years of experience, target roles, and avoid list
- Returns a 1-10 fit score with a brief explanation
- Optionally adds the job to your queue with the score attached

## Output format
```
Score: 8/10
Reasons:
  ✓ Matches 6/8 of your listed skills
  ✓ Remote-friendly
  ✗ Requires security clearance (you opted out)
```
