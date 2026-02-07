import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

// Set viewport to desktop size
await page.setViewportSize({ width: 1440, height: 900 });

// Navigate to the local development server
await page.goto('http://localhost:5173/');

// Wait for the page to load
await page.waitForTimeout(3000);

// Find and scroll to the Roadmap section
await page.evaluate(() => {
  const sections = document.querySelectorAll('section');
  for (let section of sections) {
    const title = section.querySelector('h2');
    if (title && title.textContent.includes('Roadmap')) {
      section.scrollIntoView({ behavior: 'instant', block: 'start' });
      break;
    }
  }
});

await page.waitForTimeout(1000);

// Take a screenshot of the viewport showing the roadmap
await page.screenshot({ path: 'roadmap-section.png' });

console.log('Roadmap section screenshot saved as roadmap-section.png');

await browser.close();