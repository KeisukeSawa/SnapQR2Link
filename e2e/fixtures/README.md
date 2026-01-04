# E2E Test Fixtures

This directory contains test fixtures for E2E tests.

## Required QR Code Images

To enable full QR code scanning E2E tests, add the following images:

### 1. `qr-url.png`
- **Content**: QR code containing a URL (e.g., `https://example.com`)
- **Size**: < 50MB
- **Format**: PNG, JPG, or WebP
- **Purpose**: Test URL detection and "Open Link" button

### 2. `qr-text.png`
- **Content**: QR code containing plain text (e.g., `Hello World`)
- **Size**: < 50MB
- **Format**: PNG, JPG, or WebP
- **Purpose**: Test text detection and "Copy" button

### 3. `qr-multiple.png`
- **Content**: Image with multiple QR codes
- **Size**: < 50MB
- **Format**: PNG, JPG, or WebP
- **Purpose**: Test multiple QR code detection

### 4. `invalid-image.pdf`
- **Content**: PDF file (not an image)
- **Purpose**: Test unsupported format error handling

### 5. `large-image.jpg`
- **Content**: Image larger than 50MB
- **Purpose**: Test file size limit error handling

### 6. `no-qr.png`
- **Content**: Image without any QR code
- **Size**: < 50MB
- **Format**: PNG, JPG, or WebP
- **Purpose**: Test "No QR code detected" error

## Generating QR Code Images

You can generate QR code images using:
- Online tools: qr-code-generator.com, qrcode.com
- Command line: `qrencode` tool
- Libraries: qrcode.js, python-qrcode

Example using `qrencode`:
```bash
# Install qrencode
# macOS: brew install qrencode
# Ubuntu: sudo apt-get install qrencode

# Generate URL QR code
qrencode -o qr-url.png "https://example.com"

# Generate text QR code
qrencode -o qr-text.png "Hello World"
```

## Adding Tests

Once fixtures are added, uncomment and expand the test cases in `e2e/qr-scanner.spec.ts`:

```typescript
test('should scan QR code from uploaded image', async ({ page }) => {
  await page.goto('/ja');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('e2e/fixtures/qr-url.png');

  // Wait for scanning
  await expect(page.getByText('リンクを開く')).toBeVisible({ timeout: 5000 });

  // Verify result card is displayed
  await expect(page.getByText('https://example.com')).toBeVisible();
});
```
