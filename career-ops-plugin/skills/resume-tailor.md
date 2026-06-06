# /resume-tailor

AI-rewrite your resume summary and skills section to match a specific job description.

## Usage
```
/resume-tailor <job-url-or-paste-description>
```

## What it does
- Reads your uploaded resume and profile skills
- Analyzes the job description for key requirements and ATS keywords
- Rewrites your summary/headline to mirror the job's language
- Reorders or highlights skills that match the posting
- Does NOT fabricate experience — only rephrases what you already have
- Outputs a diff of suggested changes

## Flags
- `--ats` — optimize specifically for ATS keyword scanning
- `--save` — save the tailored version as a new resume variant
