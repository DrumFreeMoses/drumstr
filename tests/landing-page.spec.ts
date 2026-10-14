import { test, expect, type Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'https://drumstr.drumfreeexperience.org';

test.describe('Drumstr Landing Page', () => {

  test('hero headline renders EXHILARATE TRANSCEND BELONG', async ({ page }) => {
    await page.goto(BASE_URL);
    const words = page.locator('.hero-word');
    await expect(words).toHaveCount(3);
    await expect(words.nth(0)).toHaveText('EXHILARATE');
    await expect(words.nth(1)).toHaveText('TRANSCEND');
    await expect(words.nth(2)).toHaveText('BELONG');
  });

  test('hero has two CTAs: Daily Block and Drum up a Circle', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('a:has-text("Join the Daily Block")')).toBeVisible();
    await expect(page.locator('a:has-text("Drum up a Circle")')).toBeVisible();
  });

  test('demand-driven model section renders all four steps', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('h3:has-text("Drum Call")')).toBeVisible();
    await expect(page.locator('h3:has-text("Hear & Respond")')).toBeVisible();
    await expect(page.locator('h3:has-text("Threshold Met")')).toBeVisible();
    await expect(page.locator('h3:has-text("Session Begins")')).toBeVisible();
  });

  test('drum-up section has real-time tapping, lightning, auto-dispatch', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('h4:has-text("Real-Time Tapping")')).toBeVisible();
    await expect(page.locator('h4:has-text("Lightning-Powered")')).toBeVisible();
    await expect(page.locator('h4:has-text("Auto-Dispatch")')).toBeVisible();
  });

  test('gallery strip renders three DFE images', async ({ page }) => {
    await page.goto(BASE_URL);
    const imgs = page.locator('.gallery-item img');
    await expect(imgs).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await expect(imgs.nth(i)).toBeVisible();
    }
  });

  test('daily blocks section shows schedule and join button', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('#next-block-time')).toContainText('Mountain Time');
    await expect(page.locator('#room-link')).toBeVisible();
    await expect(page.locator('#room-link')).toHaveAttribute('href', /jit\.si/);
  });

  test('upcoming blocks list renders five weekdays', async ({ page }) => {
    await page.goto(BASE_URL);
    const items = page.locator('#upcoming-list li');
    await expect(items).toHaveCount(5);
  });

  test('facilitators section uses professional framing with Coming soon', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('h2:has-text("Trained Facilitators")')).toBeVisible();
    await expect(page.locator('.coming-soon')).toContainText('Coming soon');
  });

  test('training section shows single Coming soon line', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('.training-line')).toContainText('5-Element Theory');
    await expect(page.locator('.training-line strong')).toContainText('Coming soon');
  });

  test('interest section has FluentForm iframe', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('#fluentform-container iframe')).toBeVisible();
  });

  test('footer has NostrHub, DFE, and Nostr links', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('a:has-text("Drum Free Experience")')).toBeVisible();
    await expect(page.locator('a:has-text("NostrHub")')).toBeVisible();
    await expect(page.locator('a:has-text("Nostr")').first()).toBeVisible();
  });

  test('nav renders brand and links', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('.nav-name')).toHaveText('Drumstr');
    await expect(page.locator('.nav-tag')).toHaveText('Powered by Nostr');
  });

  test('no dfe.org references anywhere in page', async ({ page }) => {
    await page.goto(BASE_URL);
    const content = await page.content();
    expect(content).not.toContain('dfe.org');
    expect(content).toContain('drumfreeexperience.org');
  });

  test('mobile responsive: nav links hidden on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await expect(page.locator('.nav-brand')).toBeVisible();
    await expect(page.locator('.nav-links')).toBeHidden();
  });

  test('mobile responsive: hero CTAs stack vertically', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await expect(page.locator('.hero-cta .btn').first()).toBeVisible();
  });

});
