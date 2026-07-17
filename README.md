# Automated Accessibility Auditor (RGAA 4.1 & WCAG 2.1)

## English
An automated accessibility testing tool built with **Playwright** and **Axe-core**. It performs hybrid accessibility audits by scanning any target URL, mapping technical violations to French (**RGAA 4.1**) and international (**WCAG 2.1**) standards, and generating actionable reports.

## French
Un outil d'audit d'accessibilité automatisé conçu pour évaluer la conformité des sites web aux référentiels français (RGAA 4.1) et internationaux (WCAG 2.1). Développé avec Playwright et Axe-core, il associe dynamiquement les erreurs détectées aux critères légaux, capture des preuves visuelles en cas de non-conformité et génère un rapport détaillé en Markdown pour accélérer la correction par les équipes techniques

##  Key Features

*   **Hybrid Audit Mapping:** Automatically maps technical Axe-core rule violations to their corresponding RGAA 4.1 criteria and WCAG guidelines.
*   **Visual Evidence:** Automatically captures full-page screenshots (`accessibility-fail.png`) when violations are detected to serve as visual debugging aids.
*   **Actionable Reports:** Generates a structured Markdown report (`audit-report.md`) categorizing findings into:
    *   ❌ **Violations (FAIL):** Critical accessibility bugs with target selectors, severity, and remediation links.
    *   ⚠️ **Manual Checks (TO-DO):** Issues that cannot be fully automated and require human verification.
    *   ✅ **Passed Checks:** Validated criteria grouped by theme.
*   **CI/CD Ready:** Fully configurable via environment variables, making it easy to run inside pipelines.

##  Tech Stack

*   **Core:** Node.js, JavaScript
*   **Automation:** Playwright
*   **Audit Engine:** Axe-core (`@axe-core/playwright`)

##  Quick Start

### 1. Installation
Install the project dependencies and Playwright browsers:
```bash
npm install
npx playwright install
```

### 2. Configure Target URL
Set the `AUDIT_URL` environment variable for the site you want to test:

*   **Windows (PowerShell):** `$env:AUDIT_URL="https://example.com"`
*   **Windows (CMD):** `set AUDIT_URL=https://example.com`
*   **Linux / macOS:** `export AUDIT_URL="https://example.com"`

### 3. Run the Audit
Execute the Playwright test:
```bash
npx playwright test
```

## 📊 Output
Upon completion, the tool generates:
*   `audit-report.md` - The detailed audit report.
*   `accessibility-fail.png` - Full-page screenshot (only if violations are found).
