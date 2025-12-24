#!/bin/bash
# Manual Backend Update Script
# Run this on the Hostinger server to update the backend

set -e

echo "========================================="
echo "Manual Backend Update"
echo "========================================="

cd ~/prodemyx/backend

echo "Pulling latest code..."
git pull origin main

echo "Installing dependencies..."
npm install

echo "Updating environment variables..."
cat > .env << 'ENVEOF'
PORT=5000
DB_HOST=localhost
DB_USER=prodemyx_user
DB_PASSWORD=ProdemyxSecure2024!
DB_NAME=prodemyx
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=production
PUBLIC_URL=http://72.61.243.218
RAZORPAY_KEY_ID=rzp_test_RjxogaraG7bKKe
RAZORPAY_KEY_SECRET=4KluvJFN2FvqOgLL21Pwczmt
ENVEOF

echo "Restarting backend..."
pm2 restart prodemyx-backend

echo "Waiting for backend to start..."
sleep 5

echo "Checking backend status..."
pm2 list

echo ""
echo "========================================="
echo "Backend logs (last 30 lines):"
echo "========================================="
pm2 logs prodemyx-backend --lines 30 --nostream

echo ""
echo "========================================="
echo "✓ Update complete!"
echo "========================================="
echo "Backend should now be running at http://72.61.243.218:5000"
echo "API Docs: http://72.61.243.218/api-docs"
echo ""
echo "To monitor logs in real-time: pm2 logs prodemyx-backend"
echo "========================================="
