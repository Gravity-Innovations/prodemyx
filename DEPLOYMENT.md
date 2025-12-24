# Hostinger Deployment Guide

## Server Information
- **Server IP**: 72.61.243.218
- **Username**: prodemyxdev
- **Password**: Dev@2025

## Deployment Methods

### Option 1: Using the Deployment Script (Recommended)

The deployment script will automatically:
- Setup the server environment (Node.js, PM2, Nginx, MySQL)
- Configure MySQL database
- Deploy and start the backend API
- Build and deploy the dashboard
- Build and deploy the main website
- Configure Nginx for all services

**Prerequisites:**
- SSH access to the server
- `sshpass` installed on your local machine
- `rsync` installed on your local machine

**Steps:**
1. Make sure you're on a machine that can access the Hostinger server
2. Run the deployment script:
   ```bash
   ./deploy-to-hostinger.sh
   ```

### Option 2: Manual Deployment

#### 1. Connect to Server
```bash
ssh prodemyxdev@72.61.243.218
# Password: Dev@2025
```

#### 2. Setup Environment
```bash
# Update system
sudo apt-get update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt-get install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Install MySQL
sudo apt-get install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql
```

#### 3. Setup Database
```bash
sudo mysql -e "CREATE DATABASE IF NOT EXISTS prodemyx;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'prodemyx_user'@'localhost' IDENTIFIED BY 'ProdemyxSecure2024!';"
sudo mysql -e "GRANT ALL PRIVILEGES ON prodemyx.* TO 'prodemyx_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

#### 4. Deploy Backend
```bash
# From local machine, copy backend files
scp -r backend/ prodemyxdev@72.61.243.218:~/prodemyx/backend/

# On server
cd ~/prodemyx/backend
npm install

# Create .env file
cat > .env << EOF
PORT=5000
DB_HOST=localhost
DB_USER=prodemyx_user
DB_PASSWORD=ProdemyxSecure2024!
DB_NAME=prodemyx
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=production
EOF

# Start with PM2
pm2 start server.js --name prodemyx-backend
pm2 save
pm2 startup
```

#### 5. Deploy Dashboard
```bash
# On local machine - build dashboard
cd dashboard
npm install
VITE_API_URL=http://72.61.243.218:5000 npm run build

# Copy to server
scp -r dist/ prodemyxdev@72.61.243.218:/tmp/dashboard-dist/

# On server
sudo mkdir -p /var/www/prodemyx-dashboard
sudo mv /tmp/dashboard-dist/* /var/www/prodemyx-dashboard/
sudo chown -R www-data:www-data /var/www/prodemyx-dashboard
sudo chmod -R 755 /var/www/prodemyx-dashboard
```

#### 6. Deploy Main Website
```bash
# On local machine - build website
cd prodemyx
npm install --legacy-peer-deps
VITE_API_URL=http://72.61.243.218:5000 npm run build

# Copy to server
scp -r dist/ prodemyxdev@72.61.243.218:/tmp/website-dist/

# On server
sudo mkdir -p /var/www/prodemyx-website
sudo mv /tmp/website-dist/* /var/www/prodemyx-website/
sudo chown -R www-data:www-data /var/www/prodemyx-website
sudo chmod -R 755 /var/www/prodemyx-website
```

#### 7. Configure Nginx
```bash
# On server - create Nginx config
sudo nano /etc/nginx/sites-available/prodemyx
```

Paste the following configuration:
```nginx
# Backend API
server {
    listen 5000;
    server_name 72.61.243.218;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Main Website
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name 72.61.243.218;
    
    root /var/www/prodemyx-website;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Dashboard
server {
    listen 80;
    server_name dashboard.72.61.243.218;
    
    root /var/www/prodemyx-dashboard;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
sudo ln -sf /etc/nginx/sites-available/prodemyx /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## Access Your Applications

After deployment, access your applications at:
- **Main Website**: http://72.61.243.218
- **Dashboard**: http://dashboard.72.61.243.218 (requires DNS setup)
- **Backend API**: http://72.61.243.218:5000

## Monitoring & Maintenance

### Check Backend Status
```bash
ssh prodemyxdev@72.61.243.218
pm2 status
pm2 logs prodemyx-backend
```

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Check MySQL Status
```bash
sudo systemctl status mysql
sudo mysql -u prodemyx_user -p prodemyx
```

### Update Deployment
To update after making changes:
```bash
./deploy-to-hostinger.sh
```

## Troubleshooting

### Cannot Connect to Server
- Verify the server IP is correct
- Check if your IP is whitelisted in Hostinger firewall
- Ensure SSH port 22 is open

### Backend Not Starting
```bash
pm2 logs prodemyx-backend
# Check for errors in the logs
```

### Database Connection Issues
```bash
sudo mysql -u prodemyx_user -p
# Verify credentials and database exist
```

### Nginx Issues
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

## Security Notes

1. **Change default passwords** in production
2. **Setup SSL/TLS** using Let's Encrypt
3. **Configure firewall** to restrict access
4. **Setup proper DNS** for dashboard subdomain
5. **Enable PM2 monitoring** for production alerts
