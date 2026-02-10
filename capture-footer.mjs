import { chromium } from 'playwright';

async function captureFooterScreenshot() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  // Go to homepage
  await page.goto('http://localhost:5173/hero');
  await page.waitForLoadState('networkidle');

  // Wait a bit for page to fully render
  await page.waitForTimeout(2000);

  // Scroll to the very bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Wait for scroll to complete
  await page.waitForTimeout(1000);

  // Take a screenshot of the current viewport (should show footer area)
  await page.screenshot({ path: 'footer-screenshot.png' });
  console.log('Footer area screenshot saved to footer-screenshot.png');

  // Also take a full page screenshot for reference
  await page.screenshot({ path: 'full-page.png', fullPage: true });
  console.log('Full page screenshot saved to full-page.png');

  await browser.close();
}

captureFooterScreenshot().catch(console.error);