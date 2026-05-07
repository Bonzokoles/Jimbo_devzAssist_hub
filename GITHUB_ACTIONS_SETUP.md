# 🔐 GitHub Actions Setup for Cloudflare Pages

This guide explains how to set up automatic deployment to Cloudflare Pages using GitHub Actions.

## 📋 Prerequisites

1. A Cloudflare account
2. GitHub repository admin access
3. Cloudflare API token with Pages permissions

## 🔑 Step 1: Get Cloudflare Credentials

### Get Account ID

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to "Workers & Pages" in the left sidebar
3. Your **Account ID** is visible in the right sidebar or in the URL
   - URL format: `https://dash.cloudflare.com/{ACCOUNT_ID}/workers-and-pages`

### Create API Token

1. Go to [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Click "Use template" next to "Edit Cloudflare Workers"
4. Or create a custom token with these permissions:
   ```
   Account - Cloudflare Pages - Edit
   ```
5. Click "Continue to summary"
6. Click "Create Token"
7. **Copy the token** (you won't be able to see it again!)

## 🔒 Step 2: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, go to "Secrets and variables" → "Actions"
4. Click "New repository secret"

### Add CLOUDFLARE_API_TOKEN

- **Name**: `CLOUDFLARE_API_TOKEN`
- **Secret**: Paste the API token from Step 1
- Click "Add secret"

### Add CLOUDFLARE_ACCOUNT_ID

- **Name**: `CLOUDFLARE_ACCOUNT_ID`
- **Secret**: Paste your Account ID from Step 1
- Click "Add secret"

## ✅ Step 3: Verify Setup

Your GitHub repository should now have these secrets:
- ✅ `CLOUDFLARE_API_TOKEN`
- ✅ `CLOUDFLARE_ACCOUNT_ID`

## 🚀 How It Works

The GitHub Actions workflow (`.github/workflows/cloudflare-pages.yml`) will:

1. **Trigger on**:
   - Every push to `main` branch
   - Every pull request to `main` branch
   - Manual workflow dispatch

2. **Build Process**:
   - Checkout code
   - Setup Node.js 18
   - Install dependencies
   - Build the project (`npm run build`)
   - Deploy to Cloudflare Pages

3. **Deployment**:
   - Main branch → Production deployment
   - Pull requests → Preview deployments
   - Each deployment gets a unique URL

## 📊 Monitoring Deployments

### GitHub Actions

1. Go to your repository
2. Click "Actions" tab
3. View workflow runs and logs

### Cloudflare Dashboard

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Select your project
3. View deployment history and logs

## 🌐 Deployment URLs

After successful deployment, you'll get:

**Production**: `https://jimbo-devassist-hub.pages.dev`

**Preview** (for PRs): `https://[branch-name].jimbo-devassist-hub.pages.dev`

## 🔧 Customization

### Change Project Name

Edit `.github/workflows/cloudflare-pages.yml`:

```yaml
projectName: your-custom-name  # Change this line
```

### Change Branch

To deploy from a different branch:

```yaml
on:
  push:
    branches:
      - your-branch-name  # Change this
```

### Add Environment Variables

If you need build-time environment variables:

```yaml
- name: Build
  run: npm run build
  env:
    NODE_ENV: production
    VITE_API_URL: ${{ secrets.API_URL }}  # Add more as needed
```

## 🐛 Troubleshooting

### Workflow Fails with "Invalid API Token"

- Verify the API token has correct permissions
- Check token hasn't expired
- Re-create the secret in GitHub

### Build Fails

- Check the build logs in GitHub Actions
- Test locally: `npm run build`
- Verify all dependencies are in `package.json`

### Deployment Succeeds but Site is Blank

- Check `_redirects` file is in `public/` directory
- Verify build output is in `dist/` directory
- Check browser console for errors

## 📚 Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloudflare Pages Action](https://github.com/cloudflare/pages-action)

## 🎉 Success!

Once set up, your deployments will be fully automated:
- ✅ Push to main → Automatic production deployment
- ✅ Open PR → Automatic preview deployment
- ✅ Rollback capability via Cloudflare dashboard
- ✅ Build logs and deployment history

---

**Need help?** Check the [main deployment guide](CLOUDFLARE_DEPLOYMENT.md) or open an issue.
