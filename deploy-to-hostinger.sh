#!/bin/bash

# Hostinger Deployment Script for Prodemyx
# Server: 72.61.243.218
# Username: prodemyxdev

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SERVER="72.61.243.218"
USER="prodemyxdev"
PASSWORD="Dev@2025"

# Directories
BACKEND_DIR="/home/prodemyxdev/prodemyx/backend"
DASHBOARD_DIR="/var/www/prodemyx-dashboard"
WEBSITE_DIR="/var/www/prodemyx-website"

echo "========================================="
echo "Prodemyx Deployment to Hostinger"
echo "========================================="

# Function to run commands on remote server
run_remote() {
    sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no "$USER@$SERVER" "$@"
}

# Function to copy files to remote server
copy_to_remote() {
    sshpass -p "$PASSWORD" rsync -avz --delete -e 'ssh -o StrictHostKeyChecking=no' "$@"
}

echo -e "${YELLOW}Step 1: Testing connection...${NC}"
if run_remote "echo 'Connected successfully'"; then
    echo -e "${GREEN}✓ Connection successful${NC}"
else
    echo -e "${RED}✗ Connection failed. Please check server credentials and network access.${NC}"
    exit 1
fi

# ==========================================
# 1. SETUP SERVER ENVIRONMENT
# ==========================================
echo -e "\n${YELLOW}Step 2: Setting up server environment...${NC}"
run_remote 'bash -s' << 'EOF'
set -e

echo "Updating system packages..."
sudo apt-get update

# Install Node.js if not present
if ! command -v node > /dev/null 2>&1; then
    echo "Installing Node.js 18.x..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install PM2 if not present
if ! command -v pm2 > /dev/null 2>&1; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi
echo "PM2 installed"

# Install Nginx if not present
if ! command -v nginx > /dev/null 2>&1; then
    echo "Installing Nginx..."
    sudo apt-get install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
fi
echo "Nginx installed"

# Install MySQL if not present
if ! command -v mysql > /dev/null 2>&1; then
    echo "Installing MySQL Server..."
    sudo DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server
    sudo systemctl enable mysql
    sudo systemctl start mysql
fi
echo "MySQL installed"

echo "✓ Server environment setup complete"
EOF

echo -e "${GREEN}✓ Server environment ready${NC}"

# ==========================================
# 2. SETUP MYSQL DATABASE
# ==========================================
echo -e "\n${YELLOW}Step 3: Setting up MySQL database...${NC}"
run_remote 'bash -s' << 'EOF'
set -e

echo "Creating database and user..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS prodemyx;" 2>/dev/null || true
sudo mysql -e "CREATE USER IF NOT EXISTS 'prodemyx_user'@'localhost' IDENTIFIED BY 'ProdemyxSecure2024!';" 2>/dev/null || true
sudo mysql -e "GRANT ALL PRIVILEGES ON prodemyx.* TO 'prodemyx_user'@'localhost';" 2>/dev/null || true
sudo mysql -e "FLUSH PRIVILEGES;" 2>/dev/null || true

echo "✓ Database configured"
EOF

# Import SQL file if exists
if [ -f "prodemyx.sql" ]; then
    echo -e "${YELLOW}Importing database schema...${NC}"
    sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no prodemyx.sql "$USER@$SERVER:/tmp/prodemyx.sql"
    run_remote "sudo mysql prodemyx < /tmp/prodemyx.sql && rm /tmp/prodemyx.sql"
    echo -e "${GREEN}✓ Database imported${NC}"
fi

# ==========================================
# 3. DEPLOY BACKEND
# ==========================================
echo -e "\n${YELLOW}Step 4: Deploying backend...${NC}"

# Create backend directory on server
run_remote "mkdir -p $BACKEND_DIR"

# Copy backend files
copy_to_remote backend/ "$USER@$SERVER:$BACKEND_DIR/"

# Setup backend
run_remote "bash -s" << EOF
set -e
cd $BACKEND_DIR

echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cat > .env << 'ENVEOF'
PORT=5000
DB_HOST=localhost
DB_USER=prodemyx_user
DB_PASSWORD=ProdemyxSecure2024!
DB_NAME=prodemyx
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=production
ENVEOF
fi

# Stop existing PM2 process
pm2 stop prodemyx-backend || true
pm2 delete prodemyx-backend || true

# Start backend with PM2
pm2 start server.js --name prodemyx-backend
pm2 save
pm2 startup | tail -1 | sudo bash || true

echo "✓ Backend deployed and running"
EOF

echo -e "${GREEN}✓ Backend deployment complete${NC}"

# ==========================================
# 4. DEPLOY DASHBOARD
# ==========================================
echo -e "\n${YELLOW}Step 5: Building and deploying dashboard...${NC}"

cd dashboard

# Install dependencies and build
echo "Installing dashboard dependencies..."
npm install

# Set API URL for production
export VITE_API_URL="http://72.61.243.218:5000"

echo "Building dashboard..."
npm run build

cd ..

# Create directory on server
run_remote "sudo mkdir -p $DASHBOARD_DIR && sudo chown -R $USER:$USER $DASHBOARD_DIR"

# Deploy dashboard build
copy_to_remote dashboard/dist/ "$USER@$SERVER:$DASHBOARD_DIR/"

# Set permissions
run_remote "sudo chown -R www-data:www-data $DASHBOARD_DIR && sudo chmod -R 755 $DASHBOARD_DIR"

echo -e "${GREEN}✓ Dashboard deployment complete${NC}"

# ==========================================
# 5. DEPLOY WEBSITE
# ==========================================
echo -e "\n${YELLOW}Step 6: Building and deploying main website...${NC}"

cd prodemyx

# Install dependencies and build
echo "Installing website dependencies..."
npm install --legacy-peer-deps

# Set environment variables
export VITE_API_URL="http://72.61.243.218:5000"

echo "Building website..."
npm run build

cd ..

# Create directory on server
run_remote "sudo mkdir -p $WEBSITE_DIR && sudo chown -R $USER:$USER $WEBSITE_DIR"

# Deploy website build
copy_to_remote prodemyx/dist/ "$USER@$SERVER:$WEBSITE_DIR/"

# Set permissions
run_remote "sudo chown -R www-data:www-data $WEBSITE_DIR && sudo chmod -R 755 $WEBSITE_DIR"

echo -e "${GREEN}✓ Website deployment complete${NC}"

# ==========================================
# 6. CONFIGURE NGINX
# ==========================================
echo -e "\n${YELLOW}Step 7: Configuring Nginx...${NC}"

run_remote 'bash -s' << 'EOF'
set -e

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/prodemyx > /dev/null << 'NGINXEOF'
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

    # Handle static assets
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
NGINXEOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/prodemyx /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
echo "Testing Nginx configuration..."
sudo nginx -t

echo "Reloading Nginx..."
sudo systemctl reload nginx

echo "✓ Nginx configured"
EOF

echo -e "${GREEN}✓ Nginx configuration complete${NC}"

# ==========================================
# 7. VERIFY DEPLOYMENT
# ==========================================
echo -e "\n${YELLOW}Step 8: Verifying deployment...${NC}"

run_remote 'bash -s' << 'EOF'
set -e

echo "Checking services..."

# Check PM2
echo "Backend status:"
pm2 list | grep prodemyx-backend || echo "Backend not running"

# Check Nginx
echo "Nginx status:"
sudo systemctl status nginx --no-pager | head -5

# Check MySQL
echo "MySQL status:"
sudo systemctl status mysql --no-pager | head -5

# Check deployed files
echo "Checking deployed files..."
[ -f "/var/www/prodemyx-website/index.html" ] && echo "✓ Website deployed" || echo "✗ Website not found"
[ -f "/var/www/prodemyx-dashboard/index.html" ] && echo "✓ Dashboard deployed" || echo "✗ Dashboard not found"

echo "✓ Verification complete"
EOF

echo ""
echo "========================================="
echo -e "${GREEN}✓ DEPLOYMENT SUCCESSFUL!${NC}"
echo "========================================="
echo ""
echo "Access your applications:"
echo "  • Main Website:  http://72.61.243.218"
echo "  • Dashboard:     http://dashboard.72.61.243.218"
echo "  • Backend API:   http://72.61.243.218:5000"
echo ""
echo "To check backend logs:"
echo "  ssh prodemyxdev@72.61.243.218"
echo "  pm2 logs prodemyx-backend"
echo ""
echo "========================================="
