# GitHub Secrets Setup for Hostinger Deployment

To enable automatic deployment to your Hostinger server via GitHub Actions, you need to configure the following repository secrets.

## How to Add Secrets

1. Go to your GitHub repository: `https://github.com/Gravity-Innovations/prodemyx`
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret below

## Required Secrets for Hostinger Deployment

### Server Connection Secrets

| Secret Name | Value | Description |
|------------|-------|-------------|
| `HOSTINGER_HOST` | `72.61.243.218` | Hostinger server IP address |
| `HOSTINGER_USER` | `prodemyxdev` | SSH username |
| `HOSTINGER_PASSWORD` | `Dev@2025` | SSH password |

### Optional Secrets for Email Features

These are optional and only needed if you're using EmailJS:

| Secret Name | Description |
|------------|-------------|
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key |

## Step-by-Step Instructions

### 1. Add HOSTINGER_HOST
```
Name: HOSTINGER_HOST
Value: 72.61.243.218
```

### 2. Add HOSTINGER_USER
```
Name: HOSTINGER_USER
Value: prodemyxdev
```

### 3. Add HOSTINGER_PASSWORD
```
Name: HOSTINGER_PASSWORD
Value: Dev@2025
```

### 4. (Optional) Add Email Secrets
If you have EmailJS configured, add:
```
Name: VITE_EMAILJS_SERVICE_ID
Value: your_service_id

Name: VITE_EMAILJS_TEMPLATE_ID
Value: your_template_id

Name: VITE_EMAILJS_PUBLIC_KEY
Value: your_public_key
```

## Testing the Deployment

Once secrets are configured:

### Test Backend Deployment
1. Make a change to any file in the `backend/` folder
2. Commit and push to `main` branch
3. Go to **Actions** tab in GitHub
4. Watch the "Deploy Backend to Hostinger" workflow run

### Test Dashboard Deployment
1. Make a change to any file in the `dashboard/` folder
2. Commit and push to `main` branch
3. Go to **Actions** tab in GitHub
4. Watch the "Deploy Dashboard to Hostinger" workflow run

### Test Website Deployment
1. Make a change to any file in the `prodemyx/` folder
2. Commit and push to `main` branch
3. Go to **Actions** tab in GitHub
4. Watch the "Deploy Prodemyx Website to Hostinger" workflow run

## Manual Trigger

You can also manually trigger any deployment:

1. Go to **Actions** tab
2. Select the workflow you want to run:
   - Deploy Backend to Hostinger
   - Deploy Dashboard to Hostinger
   - Deploy Prodemyx Website to Hostinger
3. Click **Run workflow**
4. Select branch (usually `main`)
5. Click **Run workflow**

## Deployment Flow

### First Time Setup
Run workflows in this order:
1. **Backend** - Sets up MySQL, Node.js, PM2, and Nginx
2. **Dashboard** - Builds and deploys dashboard
3. **Website** - Builds and deploys main website

### Subsequent Deployments
Workflows automatically run when you push changes to their respective folders.

## What Each Workflow Does

### Backend Workflow
- Installs MySQL, Node.js, PM2, and Nginx (if not present)
- Creates database and user
- Imports SQL file if changed
- Deploys backend code
- Starts backend with PM2
- Configures Nginx for all routes

### Dashboard Workflow
- Builds React dashboard
- Deploys to `/var/www/prodemyx-dashboard/`
- Reloads Nginx
- Available at: `http://72.61.243.218/app`

### Website Workflow
- Builds React website
- Deploys to `/var/www/prodemyx-website/`
- Reloads Nginx
- Available at: `http://72.61.243.218`

## Troubleshooting

### Workflow Fails with "Connection Refused"
- Verify server IP is correct
- Check if server firewall allows GitHub Actions IPs
- Contact Hostinger support to whitelist GitHub Actions IP ranges

### Permission Denied Errors
- Verify password is correct in secrets
- Check if user has sudo privileges

### Build Failures
- Check the workflow logs in GitHub Actions
- Verify all dependencies are in package.json
- Check for syntax errors in code

## Security Best Practices

### After Initial Setup:
1. **Change the default password** (`Dev@2025`) to something more secure
2. **Update the `HOSTINGER_PASSWORD` secret** with new password
3. **Change database password** in MySQL:
   ```sql
   ALTER USER 'prodemyx_user'@'localhost' IDENTIFIED BY 'NewSecurePassword!';
   ```
4. **Update `.env` file** on server with new DB password
5. **Restart backend**: `pm2 restart prodemyx-backend`

### Additional Security:
- Consider using SSH keys instead of passwords
- Setup firewall rules to restrict access
- Enable SSL/TLS certificates
- Keep server packages updated

## Monitoring Deployments

### View Deployment Logs
1. Go to GitHub **Actions** tab
2. Click on the workflow run
3. Click on the job to see detailed logs

### Check Server Status
SSH into server and check:
```bash
# Backend status
pm2 status
pm2 logs prodemyx-backend

# Nginx status
sudo systemctl status nginx

# MySQL status
sudo systemctl status mysql
```

## Next Steps

After successful deployment:
1. Visit `http://72.61.243.218` to see your website
2. Visit `http://72.61.243.218/app` to access dashboard
3. Check API docs at `http://72.61.243.218/api-docs`
4. Setup domain name and SSL certificate
5. Configure production environment variables
