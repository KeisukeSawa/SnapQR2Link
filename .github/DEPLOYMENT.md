# Deployment Guide

## GitHub Pages Setup

This project is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch.

### Initial Setup

1. **Enable GitHub Pages in Repository Settings**:
   - Go to your repository on GitHub
   - Navigate to **Settings** > **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save the settings

2. **Push to Main Branch**:
   ```bash
   git push origin main
   ```

3. **Monitor Deployment**:
   - Go to the **Actions** tab in your GitHub repository
   - Watch the "Deploy to GitHub Pages" workflow run
   - Once complete, your site will be available at:
     `https://keisukesawa.github.io/SnapQR2Link/`

### CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) performs:

1. **Test Stage**:
   - Runs unit tests with Vitest (42 tests)
   - Runs E2E tests with Playwright (19 tests)
   - Uploads Playwright report as artifact

2. **Build Stage**:
   - Builds static site with Astro
   - Uploads build artifacts
   - Deploys to GitHub Pages

### Manual Deployment

You can manually trigger a deployment from the Actions tab:

1. Go to **Actions** > **Deploy to GitHub Pages**
2. Click **Run workflow**
3. Select the `main` branch
4. Click **Run workflow**

### Local Testing

To test the production build locally:

```bash
# Build the site
pnpm build

# Preview the built site
pnpm preview
```

Visit `http://localhost:4321/SnapQR2Link/` to preview the site with the GitHub Pages base path.

### Troubleshooting

**Issue**: Site shows 404 or broken links

**Solution**: Ensure the `base` path in `astro.config.mjs` matches your repository name:
```js
export default defineConfig({
  site: 'https://keisukesawa.github.io',
  base: '/SnapQR2Link',
  // ...
});
```

**Issue**: Workflow fails on test stage

**Solution**:
- Check the Actions logs for specific test failures
- Run tests locally: `pnpm test && pnpm test:e2e`
- Fix failing tests before pushing

**Issue**: Deployment fails

**Solution**:
- Verify GitHub Pages is enabled in repository settings
- Check that the repository has the correct permissions for the GITHUB_TOKEN
- Review the workflow logs in the Actions tab

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain
2. Update `site` in `astro.config.mjs`:
   ```js
   site: 'https://yourdomain.com',
   base: '/', // Remove base path for custom domain
   ```
3. Configure DNS settings at your domain provider
