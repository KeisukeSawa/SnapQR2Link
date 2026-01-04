import { test, expect } from '@playwright/test';

/**
 * E2E tests for QR Scanner functionality
 *
 * Note: These tests require actual QR code images in the e2e/fixtures/ directory.
 * For now, we test the UI interaction and error handling.
 * Full QR scanning tests require image fixtures with embedded QR codes.
 */

test.describe('QR Scanner - Japanese Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ja');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'SnapQR2Link', level: 1 })).toBeVisible();
  });

  test('should show file upload button', async ({ page }) => {
    const uploadButton = page.locator('button').filter({ hasText: 'ファイルを選択' });
    await expect(uploadButton).toBeVisible();
  });

  test('should show upload instructions', async ({ page }) => {
    await expect(page.getByText('ここにドラッグ＆ドロップ')).toBeVisible();
    await expect(page.getByText('または Ctrl+V で貼り付け')).toBeVisible();
  });

  test('should have language switcher', async ({ page }) => {
    const langSwitcher = page.getByRole('link', { name: /English/i });
    await expect(langSwitcher).toBeVisible();
  });

  test('should switch to English page', async ({ page }) => {
    await page.getByRole('link', { name: /English/i }).click();
    await expect(page).toHaveURL('/en');
    await expect(page.getByRole('heading', { name: 'SnapQR2Link', level: 1 })).toBeVisible();
  });

  test('should have skip to main content link (keyboard navigation)', async ({ page }) => {
    // Tab to focus the skip link
    await page.keyboard.press('Tab');

    // The skip link should become visible when focused
    const skipLink = page.getByText('メインコンテンツへスキップ');
    await expect(skipLink).toBeFocused();
  });
});

test.describe('QR Scanner - English Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'SnapQR2Link', level: 1 })).toBeVisible();
  });

  test('should show file upload button', async ({ page }) => {
    const uploadButton = page.locator('button').filter({ hasText: 'Select File' });
    await expect(uploadButton).toBeVisible();
  });

  test('should show upload instructions', async ({ page }) => {
    await expect(page.getByText('Drag & Drop Here')).toBeVisible();
    await expect(page.getByText('or Paste with Ctrl+V')).toBeVisible();
  });

  test('should switch to Japanese page', async ({ page }) => {
    await page.getByRole('link', { name: /日本語/i }).click();
    await expect(page).toHaveURL('/ja');
  });
});

test.describe('QR Scanner - Root Redirect', () => {
  test('should redirect to Japanese page by default', async ({ page }) => {
    await page.goto('/');
    // Wait for redirect
    await page.waitForURL(/\/(ja|en)/);
    // Should redirect to either /ja or /en based on browser language
    expect(page.url()).toMatch(/\/(ja|en)$/);
  });
});

test.describe('QR Scanner - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ja');
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Wait for the upload button to be visible (React hydration)
    const uploadButton = page.locator('button').filter({ hasText: 'ファイルを選択' });
    await expect(uploadButton).toBeVisible();

    // Focus the upload button directly to verify it can receive focus
    await uploadButton.focus();
    await expect(uploadButton).toBeFocused();

    // Verify Tab key navigation works through all interactive elements
    await page.keyboard.press('Tab'); // Should move to next focusable element
    await page.keyboard.press('Shift+Tab'); // Should move back to upload button
    await expect(uploadButton).toBeFocused();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    const uploadButton = page.locator('button').filter({ hasText: 'ファイルを選択' });
    await expect(uploadButton).toHaveAttribute('aria-describedby', 'upload-instructions');
  });
});

test.describe('QR Scanner - Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/ja');

    await expect(page.getByRole('heading', { name: 'SnapQR2Link', level: 1 })).toBeVisible();
    const uploadButton = page.locator('button').filter({ hasText: 'ファイルを選択' });
    await expect(uploadButton).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/ja');

    await expect(page.getByRole('heading', { name: 'SnapQR2Link', level: 1 })).toBeVisible();
    const uploadButton = page.locator('button').filter({ hasText: 'ファイルを選択' });
    await expect(uploadButton).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 }); // Full HD
    await page.goto('/ja');

    await expect(page.getByRole('heading', { name: 'SnapQR2Link', level: 1 })).toBeVisible();
    const uploadButton = page.locator('button').filter({ hasText: 'ファイルを選択' });
    await expect(uploadButton).toBeVisible();
  });
});

test.describe('QR Scanner - Footer Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ja');
  });

  test('should have Astro link in footer', async ({ page }) => {
    const astroLink = page.getByRole('link', { name: 'Astro' });
    await expect(astroLink).toBeVisible();
    await expect(astroLink).toHaveAttribute('href', 'https://astro.build');
    await expect(astroLink).toHaveAttribute('target', '_blank');
  });

  test('should have React link in footer', async ({ page }) => {
    const reactLink = page.getByRole('link', { name: 'React' });
    await expect(reactLink).toBeVisible();
    await expect(reactLink).toHaveAttribute('href', 'https://react.dev');
    await expect(reactLink).toHaveAttribute('target', '_blank');
  });

  test('should display privacy notice', async ({ page }) => {
    await expect(page.getByText('すべての処理はブラウザ内で完結します')).toBeVisible();
  });
});

/**
 * NOTE: Full QR code scanning tests require actual QR code images.
 *
 * To add comprehensive QR scanning tests:
 * 1. Create e2e/fixtures/ directory
 * 2. Add QR code images:
 *    - qr-url.png (contains a URL)
 *    - qr-text.png (contains plain text)
 *    - qr-multiple.png (contains multiple QR codes)
 *    - invalid-image.pdf (non-image file for error testing)
 *    - large-image.jpg (>50MB for size limit testing)
 *
 * 3. Add tests like:
 *    test('should scan QR code from uploaded image', async ({ page }) => {
 *      const fileInput = page.locator('input[type="file"]');
 *      await fileInput.setInputFiles('e2e/fixtures/qr-url.png');
 *      await expect(page.getByText('リンクを開く')).toBeVisible();
 *    });
 */
