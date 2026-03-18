#!/usr/bin/env node
/**
 * Post-deploy verification script using Playwright.
 * Checks all routes for JS errors and verifies key content is present.
 *
 * Usage:
 *   node scripts/verify-deploy.js [base-url]
 *   node scripts/verify-deploy.js https://deploy-preview-65--igra-landing.netlify.app
 *
 * Defaults to https://igralabs.com if no URL provided.
 */

const BASE = process.argv[2] || 'https://igralabs.com';

const routes = [
  '/',
  '/public-auction',
  '/public-auction/facts',
  '/public-auction/faq',
  '/public-auction/attester-calculator',
  '/public-auction/support',
  '/igra-token',
];

// Key content checks: [route, description, substring]
const contentChecks = [
  ['/public-auction', 'Overview heading', 'Overview'],
  ['/public-auction/facts', 'Token supply', '350,000,000'],
  ['/public-auction/facts', 'Auction dates', '4PM UTC'],
  ['/public-auction/faq', 'FAQ items', 'What is $IGRA'],
  ['/public-auction/attester-calculator', 'Calculator', 'Summary after 6 months'],
  ['/igra-token', 'Token sale link', 'Token sale is on'],
  ['/', 'ZAP nav link', 'ZAP'],
  ['/', 'Hero date', '26 MAR 2026'],
];

async function main() {
  let playwright;
  try {
    playwright = require('playwright');
  } catch {
    const globalRoot = require('child_process')
      .execSync('npm root -g', { encoding: 'utf8' }).trim();
    playwright = require(require('path').join(globalRoot, 'playwright'));
  }

  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  const errors = [];
  const routeErrors = {};
  let currentRoute = '';

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({ route: currentRoute, text: msg.text() });
    }
  });
  page.on('pageerror', err => {
    errors.push({ route: currentRoute, text: 'UNCAUGHT: ' + err.message });
  });

  console.log(`\nVerifying deploy: ${BASE}\n`);

  // 1. Check all routes for JS errors
  console.log('--- Route checks ---');
  for (const route of routes) {
    currentRoute = route;
    try {
      await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(1000);
      console.log(`  ✓ ${route}`);
    } catch (e) {
      console.log(`  ✗ ${route} — ${e.message}`);
      errors.push({ route, text: 'NAVIGATION: ' + e.message });
    }
  }

  // 2. Content verification
  console.log('\n--- Content checks ---');
  const contentFailures = [];
  for (const [route, desc, expected] of contentChecks) {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    const text = await page.textContent('body');
    if (text.includes(expected)) {
      console.log(`  ✓ ${desc}`);
    } else {
      console.log(`  ✗ ${desc} — expected "${expected}"`);
      contentFailures.push({ route, desc, expected });
    }
  }

  // 3. Screenshot homepage
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const screenshotPath = '/tmp/deploy-verify-home.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`\n  Screenshot: ${screenshotPath}`);

  await browser.close();

  // Summary
  console.log('\n--- Summary ---');
  console.log(`  Routes checked: ${routes.length}`);
  console.log(`  JS errors: ${errors.length}`);
  console.log(`  Content checks: ${contentChecks.length - contentFailures.length}/${contentChecks.length} passed`);

  if (errors.length > 0) {
    console.log('\n  JS Errors:');
    errors.forEach(e => console.log(`    ✗ [${e.route}] ${e.text}`));
  }

  const failed = errors.length > 0 || contentFailures.length > 0;
  console.log(`\n  Result: ${failed ? '✗ ISSUES FOUND' : '✓ ALL CLEAR'}\n`);
  process.exit(failed ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
