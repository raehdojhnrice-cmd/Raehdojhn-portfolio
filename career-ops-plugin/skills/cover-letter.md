# /cover-letter

Generate a tailored cover letter for a specific job.

## Usage
```
/cover-letter <job-url-or-paste-description>
```

## What it does
- Reads your default cover letter template from `/profile`
- Substitutes `{company}`, `{role}`, and `{skills}` placeholders
- Uses AI (if configured) to tailor the letter to the specific job description
- Highlights your portfolio site and relevant experience
- Outputs ready-to-paste text or saves it to the job record

## Template variables
| Variable | Replaced with |
|----------|--------------|
| `{company}` | Company name |
| `{role}` | Job title |
| `{skills}` | Your top matching skills |
| `{name}` | Your full name |
| `{portfolio}` | Your portfolio URL |
