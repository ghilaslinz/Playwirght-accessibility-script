# Playwright Accessibility Audit

Auto-generates accessibility reports (RGAA 4.1 & WCAG 2.1) using Playwright and Axe-core.

## English
An automated web accessibility auditing tool that scans websites for compliance with French (RGAA 4.1) and international (WCAG 2.1) standards. Built using Playwright and Axe-core, it automatically maps automated scan violations to official accessibility criteria, captures visual screenshots on failure, and compiles detailed Markdown reports to streamline compliance and QA workflows.

## French
Un outil d'audit d'accessibilité automatisé conçu pour évaluer la conformité des sites web aux référentiels français (RGAA 4.1) et internationaux (WCAG 2.1). Développé avec Playwright et Axe-core, il associe dynamiquement les erreurs détectées aux critères légaux, capture des preuves visuelles en cas de non-conformité et génère un rapport détaillé en Markdown pour accélérer la correction par les équipes techniques

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
