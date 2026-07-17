# Automated Accessibility Auditor (RGAA 4.1 & WCAG 2.1)

## English
An automated web accessibility auditing tool designed to bridge the gap between developer-facing errors and regulatory compliance. Built with **Playwright** and **Axe-core**, the project uses a custom rule-mapping dictionary to translate raw DOM violations (e.g., image-alt or color-contrast) directly to official **French RGAA 4.1** criteria (e.g., Criteria 1.1) and **WCAG 2.1** guidelines (e.g., 1.1.1). It automates the generation of full-page screenshots as visual evidence and compiles structured Markdown reports to accelerate legal audits and QA workflows.

## French
Un outil d'audit automatisé de l'accessibilité web conçu pour lier les erreurs techniques de développement aux exigences réglementaires. Développé avec **Playwright** et **Axe-core**, le projet intègre un dictionnaire de correspondance (mapping) personnalisé qui traduit les violations brutes du DOM (ex: image-alt ou color-contrast) directement en critères officiels du **RGAA 4.1** (ex: Critère 1.1) et directives du **WCAG 2.1** (ex: 1.1.1). L'outil automatise la capture d'écrans comme preuve visuelle et produit des rapports Markdown structurés pour accélérer les audits de conformité légale

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
