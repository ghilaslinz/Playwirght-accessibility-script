# Playwright Accessibility Audit

Auto-generates accessibility reports (RGAA 4.1 & WCAG 2.1) using Playwright and Axe-core.

## Quick Start

Run these commands in your terminal to get started:

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Set the target URL and run the audit (Windows PowerShell)
$env:AUDIT_URL="https://your-target-website.com"
npx playwright test

# (For Linux / macOS, use: export AUDIT_URL="..." before running tests)
```

## Output
- `audit-report.md`: Detailed accessibility findings.
- `accessibility-fail.png`: Screenshot of the target page (only if violations are found).
