import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'fs';

const RULE_MAPPING = {
  // ==========================================
  // RGAA 1 : IMAGES
  // ==========================================
  'image-alt': { rgaa: 'Critère 1.1', wcag: '1.1.1', description: 'Image text alternative' },
  'image-redundant-alt': { rgaa: 'Critère 1.2', wcag: 'N/A', description: 'Decorative image has irrelevant alt' },
  'object-alt': { rgaa: 'Critère 1.1', wcag: '1.1.1', description: 'Object text alternative' },

  // ==========================================
  // RGAA 2 : CADRES (Iframes)
  // ==========================================
  'frame-title': { rgaa: 'Critère 2.1', wcag: '4.1.2', description: 'Iframe must have a title' },
  'frame-title-unique': { rgaa: 'Critère 2.2', wcag: '4.1.2', description: 'Iframe titles must be unique' },

  // ==========================================
  // RGAA 3 : COULEURS
  // ==========================================
  'color-contrast': { rgaa: 'Critère 3.2', wcag: '1.4.3', description: 'Contrast ratio (AA)' },
  'color-contrast-enhanced': { rgaa: 'Critère 3.3', wcag: '1.4.6', description: 'Contrast ratio (AAA)' },

  // ==========================================
  // RGAA 4 : MULTIMÉDIA
  // ==========================================
  'video-caption': { rgaa: 'Critère 4.1', wcag: '1.2.2', description: 'Video needs captions' },
  'audio-caption': { rgaa: 'Critère 4.1', wcag: '1.2.2', description: 'Audio needs transcript/captions' },
  'video-description': { rgaa: 'Critère 4.2', wcag: '1.2.5', description: 'Video needs audio description' },

  // ==========================================
  // RGAA 5 : TABLEAUX
  // ==========================================
  'table-duplicate-name': { rgaa: 'Critère 5.3', wcag: 'N/A', description: 'Table summary and caption must not be identical' },
  'table-fake-caption': { rgaa: 'Critère 5.1', wcag: '1.3.1', description: 'Data tables should use <caption> instead of normal text' },
  'th-has-data-cells': { rgaa: 'Critère 5.7', wcag: '1.3.1', description: 'Table header has no data cells' },
  'td-headers-attr': { rgaa: 'Critère 5.7', wcag: '1.3.1', description: 'Table headers are incorrect' },

  // ==========================================
  // RGAA 6 : LIENS
  // ==========================================
  'link-name': { rgaa: 'Critère 6.1', wcag: '2.4.4', description: 'Link must have discernible text' },

  // ==========================================
  // RGAA 7 : SCRIPTS & ARIA
  // ==========================================
  'button-name': { rgaa: 'Critère 7.1', wcag: '4.1.2', description: 'Button must have discernible text' },
  'aria-allowed-attr': { rgaa: 'Critère 7.1', wcag: '4.1.2', description: 'ARIA attributes must be allowed for the role' },
  'aria-roles': { rgaa: 'Critère 7.1', wcag: '4.1.2', description: 'ARIA roles must be valid' },
  'aria-valid-attr': { rgaa: 'Critère 7.1', wcag: '4.1.2', description: 'ARIA attributes must be valid' },
  'aria-valid-attr-value': { rgaa: 'Critère 7.1', wcag: '4.1.2', description: 'ARIA attributes must have valid values' },
  'aria-hidden-body': { rgaa: 'Critère 7.1', wcag: '4.1.2', description: 'Body must not have aria-hidden="true"' },
  'duplicate-id-aria': { rgaa: 'Critère 7.1', wcag: '4.1.2', description: 'IDs used in ARIA must be unique' },
  'aria-required-attr': { rgaa: 'Critère 7.1', wcag: '4.1.2', description: 'Required ARIA attributes must be provided' },
  'aria-required-children': { rgaa: 'Critère 7.1', wcag: '4.1.2', description: 'Certain ARIA roles must contain specific children' },
  'aria-required-parent': { rgaa: 'Critère 7.1', wcag: '4.1.2', description: 'Certain ARIA roles must be contained by specific parents' },
  'aria-command-name': { rgaa: 'Critère 7.1', wcag: '4.1.2', description: 'ARIA commands (button, link, menuitem) must have a name' },
  'aria-dialog-name': { rgaa: 'Critère 7.1', wcag: '4.1.2', description: 'ARIA dialogs and alertdialogs must have a name' },
  'aria-meter-name': { rgaa: 'Critère 7.1', wcag: '1.1.1', description: 'ARIA meter nodes must have an accessible name' },
  'aria-progressbar-name': { rgaa: 'Critère 7.1', wcag: '1.1.1', description: 'ARIA progressbar nodes must have an accessible name' },
  'aria-tooltip-name': { rgaa: 'Critère 7.1', wcag: '4.1.2', description: 'ARIA tooltips must have an accessible name' },
  'aria-treeitem-name': { rgaa: 'Critère 7.1', wcag: '4.1.2', description: 'ARIA treeitems must have an accessible name' },
  'aria-toggle-field-name': { rgaa: 'Critère 7.1', wcag: '4.1.2', description: 'ARIA toggle fields must have an accessible name' },
  'nested-interactive': { rgaa: 'Critère 7.3', wcag: '4.1.2', description: 'Interactive controls must not be nested' },

  // ==========================================
  // RGAA 8 : ÉLÉMENTS OBLIGATOIRES
  // ==========================================
  'html-has-lang': { rgaa: 'Critère 8.3', wcag: '3.1.1', description: 'HTML tag needs lang attribute' },
  'valid-lang': { rgaa: 'Critère 8.4', wcag: '3.1.2', description: 'Lang attribute must be valid' },
  'html-xml-lang-mismatch': { rgaa: 'Critère 8.3', wcag: '3.1.1', description: 'lang and xml:lang must match' },
  'document-title': { rgaa: 'Critère 8.6', wcag: '2.4.2', description: 'Page must have a <title>' },
  'duplicate-id-active': { rgaa: 'Critère 8.2', wcag: '4.1.1', description: 'IDs of active elements must be unique' },

  // ==========================================
  // RGAA 9 : STRUCTURATION DE L'INFORMATION
  // ==========================================
  'empty-heading': { rgaa: 'Critère 9.1', wcag: '1.3.1', description: 'Headings must not be empty' },
  'heading-order': { rgaa: 'Critère 9.1', wcag: '1.3.1', description: 'Heading levels should not skip' },
  'page-has-heading-one': { rgaa: 'Critère 9.1', wcag: '1.3.1', description: 'Page must contain a level-one heading' },
  'p-as-heading': { rgaa: 'Critère 9.1', wcag: '1.3.1', description: 'Bold, italic text should not be used to style <p> as a heading' },
  'landmark-one-main': { rgaa: 'Critère 9.2', wcag: '1.3.1', description: 'Document must have one main landmark' },
  'region': { rgaa: 'Critère 9.2', wcag: '1.3.1', description: 'Content must be inside landmarks' },
  'list': { rgaa: 'Critère 9.3', wcag: '1.3.1', description: 'Lists must be formatted correctly (<ol>, <ul>)' },
  'listitem': { rgaa: 'Critère 9.3', wcag: '1.3.1', description: 'List items (<li>) must be in a list' },
  'dlitem': { rgaa: 'Critère 9.3', wcag: '1.3.1', description: 'Definition lists (<dl>) must be formatted correctly' },
  'definition-list': { rgaa: 'Critère 9.3', wcag: '1.3.1', description: 'Definition lists must have terms and descriptions' },

  // ==========================================
  // RGAA 10 : PRÉSENTATION DE L'INFORMATION
  // ==========================================
  'meta-viewport': { rgaa: 'Critère 10.4', wcag: '1.4.4', description: 'Zoom must not be disabled' },
  'avoid-inline-spacing': { rgaa: 'Critère 10.12', wcag: '1.4.12', description: 'Inline text spacing must be adjustable' },
  'css-orientation-lock': { rgaa: 'Critère 10.14', wcag: '1.3.4', description: 'Display orientation must not be locked' },
  'link-in-text-block': { rgaa: 'Critère 10.15', wcag: '1.4.1', description: 'Links in text must be distinguishable without color' },

  // ==========================================
  // RGAA 11 : FORMULAIRES
  // ==========================================
  'label': { rgaa: 'Critère 11.1', wcag: '3.3.2', description: 'Form inputs must have labels' },
  'input-image-alt': { rgaa: 'Critère 11.1', wcag: '1.1.1', description: 'Image inputs must have alt text' },
  'select-name': { rgaa: 'Critère 11.1', wcag: '4.1.2', description: 'Select elements must have accessible name' },
  'form-field-multiple-labels': { rgaa: 'Critère 11.1', wcag: '3.3.2', description: 'Form field must not have multiple labels' },
  'autocomplete-valid': { rgaa: 'Critère 11.13', wcag: '1.3.5', description: 'Autocomplete attribute must be valid' },


  // ==========================================
  // RGAA 12 : NAVIGATION
  // ==========================================
  'bypass': { rgaa: 'Critère 12.7', wcag: '2.4.1', description: 'Must have skip links' },
  'tabindex': { rgaa: 'Critère 12.8', wcag: '2.4.3', description: 'Elements should not have tabindex > 0' },
  'aria-hidden-focus': { rgaa: 'Critère 12.8', wcag: '4.1.2', description: 'ARIA hidden element must not be focusable' },
  'focus-order-semantics': { rgaa: 'Critère 12.8', wcag: '2.4.3', description: 'Elements in focus order should have appropriate roles' },
  'scrollable-region-focusable': { rgaa: 'Critère 12.8', wcag: '2.1.1', description: 'Scrollable region must have keyboard access' },
  'accesskeys': { rgaa: 'Critère 12.11', wcag: 'N/A', description: 'Accesskeys must be unique' },

  // ==========================================
  // FALLBACK
  // ==========================================
  'default': { rgaa: 'Non mappé (Vérification requise)', wcag: 'N/A', description: 'Axe rule not explicitly mapped to RGAA' }
};

const getMapping = (ruleId) => RULE_MAPPING[ruleId] || RULE_MAPPING['default'];

function formatTableRow(rule, node, status) {
  const mapping = getMapping(rule.id);
  const selector = node && node.target ? node.target.join(' ') : 'N/A';
  // Escape pipes in selector to avoid breaking markdown tables
  const safeSelector = selector.replace(/\|/g, '\\|').replace(/\n/g, ' ');
  // Impact might be undefined for some passes or incomplete
  const impact = rule.impact ? rule.impact.toUpperCase() : 'N/A';
  return `| ${mapping.rgaa} / WCAG ${mapping.wcag} | ${rule.id} | ${status} | ${impact} | \`${safeSelector}\` | [Help](${rule.helpUrl}) |`;
}

test('Hybrid Accessibility Audit (RGAA 4.1 / WCAG 2.1)', async ({ page }) => {
  // Target URL (can be customized via environment variable or edited here)
  const targetUrl = process.env.AUDIT_URL || 'https://example.com/';

  console.log(`Starting accessibility audit for: ${targetUrl}`);

  // Navigate and wait for network to be idle to ensure dynamic content loads
  await page.goto(targetUrl, { waitUntil: 'networkidle' });

  // Initialize AxeBuilder and configure tags for WCAG 2.1 A & AA
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  // 1. Evidence: Take screenshot if any violations are found
  if (results.violations.length > 0) {
    console.log(`Found ${results.violations.length} types of violations. Attempting to take a screenshot...`);
    await page.screenshot({ path: 'accessibility-fail.png', fullPage: true });
    console.log(`Screenshot saved to accessibility-fail.png`);
  }

  // Generate Markdown Report
  let markdownReport = `# Accessibility Audit Report\n\n`;
  markdownReport += `**Target URL:** [${targetUrl}](${targetUrl})  \n`;
  markdownReport += `**Date:** ${new Date().toLocaleString()}  \n`;
  markdownReport += `**Summary:** ${results.violations.length} Violations, ${results.incomplete.length} Manual Checks, ${results.passes.length} Passed Rules.  \n\n`;

  const tableHeader = `| ID (RGAA/WCAG) | Rule Name | Status | Impact | Target Element (Selector) | Help Link |\n| --- | --- | --- | --- | --- | --- |\n`;

  // 2. FAIL Category
  markdownReport += `## ❌ Violations (FAIL)\n`;
  if (results.violations.length > 0) {
    markdownReport += tableHeader;
    for (const rule of results.violations) {
      for (const node of rule.nodes) {
        markdownReport += formatTableRow(rule, node, 'FAIL') + '\n';
      }
    }
  } else {
    markdownReport += `*No violations found! Awesome!*  \n`;
  }
  markdownReport += `\n`;

  // 3. MANUAL CHECK Category (To-Do List)
  markdownReport += `## ⚠️ Manual Checks Required (TO-DO)\n`;
  if (results.incomplete.length > 0) {
    markdownReport += tableHeader;
    for (const rule of results.incomplete) {
      for (const node of rule.nodes) {
        markdownReport += formatTableRow(rule, node, 'MANUAL CHECK') + '\n';
      }
    }
  } else {
    markdownReport += `*No manual checks required.*  \n`;
  }
  markdownReport += `\n`;

  // 4. PASS Category (Grouped by Criteria)
  markdownReport += `## ✅ Passed Checks\n`;
  if (results.passes.length > 0) {
    const groupedPasses = {};
    for (const rule of results.passes) {
      const mapping = getMapping(rule.id);
      const groupName = `${mapping.rgaa} / WCAG ${mapping.wcag}`;
      if (!groupedPasses[groupName]) {
        groupedPasses[groupName] = [];
      }
      groupedPasses[groupName].push(rule);
    }

    for (const [groupName, rules] of Object.entries(groupedPasses)) {
      markdownReport += `### ${groupName}\n`;
      markdownReport += tableHeader;
      for (const rule of rules) {
        // Since passes can contain thousands of nodes, we aggregate the node count as the "Target Element"
        const elementDescr = rule.nodes.length > 0 ? `${rule.nodes.length} compliant element(s)` : 'Page level compliance';
        markdownReport += `| ${groupName} | ${rule.id} | PASS | N/A | \`${elementDescr}\` | [Help](${rule.helpUrl}) |\n`;
      }
      markdownReport += '\n';
    }
  } else {
    markdownReport += `*No passed rules found.*  \n`;
  }

  // Save the report
  fs.writeFileSync('audit-report.md', markdownReport);
  console.log('Accessibility audit completed. Report saved to audit-report.md');
});
