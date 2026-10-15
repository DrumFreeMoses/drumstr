import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'https://drumstr.drumfreeexperience.org';

test.describe('Drumstr — Just Drum (index)', () => {

  test('title and hero say Just Drum', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Just Drum/);
    await expect(page.locator('h1.just-title')).toHaveText('Just Drum.');
  });

  test('sub promises free 10-minute daily block', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('.just-sub')).toContainText('Free. 10 minutes');
    await expect(page.locator('.just-sub')).toContainText('5 PM Mountain');
  });

  test('zero-friction note present', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('.just-note')).toContainText(/explain later/i);
  });

  test('join button targets self-hosted SFU with drumMode', async ({ page }) => {
    await page.goto(BASE_URL);
    const link = page.locator('#room-link');
    await expect(link).toBeVisible();
    await expect(link).toContainText("Join Today's Block");
    await expect(link).toHaveAttribute('href', /av\.drumfreeexperience\.org\/join\/drumstr-block-\d{4}-\d{2}-\d{2}\?drumMode=1/);
  });

  test('what-is-this and DFE links present', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('a:has-text("What is this?")')).toBeVisible();
    await expect(page.locator('a:has-text("Details at Drum Free Experience")')).toHaveAttribute('href', 'https://drumfreeexperience.org');
  });

  test('vision link in nav and footer', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('.nav-links a:has-text("Vision")')).toBeVisible();
    await expect(page.locator('.footer-links a:has-text("Vision")')).toBeVisible();
  });

  test('no jargon on the simple page', async ({ page }) => {
    await page.goto(BASE_URL);
    const content = (await page.content()).toLowerCase();
    for (const word of ['bitcoin', 'lightning', 'nostr', 'dao', 'facilitator training']) {
      expect(content, `index should not mention ${word}`).not.toContain(word);
    }
  });

  test('no dfe.org references', async ({ page }) => {
    await page.goto(BASE_URL);
    const content = await page.content();
    expect(content).not.toContain('dfe.org');
    expect(content).toContain('drumfreeexperience.org');
  });

  test('mobile: nav collapses, title scales', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await expect(page.locator('.nav-brand')).toBeVisible();
    await expect(page.locator('h1.just-title')).toBeVisible();
  });

});

test.describe('Drumstr — Vision page (archived full site)', () => {

  test('hero headline renders EXHILARATE TRANSCEND BELONG', async ({ page }) => {
    await page.goto(`${BASE_URL}/vision.html`);
    const words = page.locator('.hero-word');
    await expect(words).toHaveCount(3);
    await expect(words.nth(0)).toHaveText('EXHILARATE');
    await expect(words.nth(1)).toHaveText('TRANSCEND');
    await expect(words.nth(2)).toHaveText('BELONG');
  });

  test('upcoming blocks list renders five weekdays', async ({ page }) => {
    await page.goto(`${BASE_URL}/vision.html`);
    await expect(page.locator('#upcoming-list li')).toHaveCount(5);
  });

  test('vision room link points at self-hosted SFU', async ({ page }) => {
    await page.goto(`${BASE_URL}/vision.html`);
    await expect(page.locator('#room-link')).toBeVisible();
    await expect(page.locator('#room-link')).toHaveAttribute('href', /av\.drumfreeexperience\.org/);
  });

  test('footer has NostrHub and DFE links', async ({ page }) => {
    await page.goto(`${BASE_URL}/vision.html`);
    await expect(page.locator('a:has-text("Drum Free Experience")')).toBeVisible();
    await expect(page.locator('a:has-text("NostrHub")')).toBeVisible();
  });

  test('facilitators Coming soon', async ({ page }) => {
    await page.goto(`${BASE_URL}/vision.html`);
    await expect(page.locator('.coming-soon')).toContainText('Coming soon');
  });

});
