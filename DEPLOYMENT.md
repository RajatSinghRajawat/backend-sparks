# EduSpark Backend Deployment Guide 🚀
**Domain:** `api.sparks-learning.com`  
**Process Manager:** `PM2`  
**Web Server / Reverse Proxy:** `Nginx`  
**SSL Certificate:** `Let's Encrypt (Certbot)`  

---

## 📌 Prerequisites
Your server should be running **Ubuntu 20.04 / 22.04 / 24.04 LTS** (AWS EC2, DigitalOcean, Hetzner, or VPS).

---

## Step 1: DNS Configuration
Go to your DNS provider (Cloudflare, GoDaddy, Namecheap, etc.) and add an **A Record**:
- **Type:** `A`
- **Name / Host:** `api` (or `api.sparks-learning.com`)
- **IPv4 Address:** `<YOUR_SERVER_PUBLIC_IP>`
- **TTL:** Auto or 5 min
- *(If using Cloudflare: Set SSL mode to "Full" or "Full (Strict)" and initially set Proxy status to DNS only while issuing SSL).*

---

## Step 2: Install Node.js, PM2 & Nginx on the Server
SSH into your server:
```bash
ssh root@<YOUR_SERVER_IP>
```

Update system packages:
```bash
sudo apt update && sudo apt upgrade -y
```

Install Node.js (v20 LTS recommended):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx certbot python3-certbot-nginx
```

Install PM2 globally:
```bash
sudo npm install -g pm2
```

Verify installations:
```bash
node -v
npm -v
pm2 -v
nginx -v
```

---

## Step 3: Clone Code & Configure Environment
Navigate to web directory (e.g. `/var/www`):
```bash
sudo mkdir -p /var/www
cd /var/www
git clone https://github.com/RajatSinghRajawat/backend-sparks.git eduspark-backend
cd eduspark-backend
```

Install dependencies:
```bash
npm install --production
```

Create production `.env` file:
```bash
cp .env.example .env
nano .env
```
Fill in your production MongoDB connection string, JWT secrets, AWS S3 keys, and SMTP credentials. Save with `Ctrl+O`, `Enter`, and exit with `Ctrl+X`.

---

## Step 4: Run Application with PM2
Start the application using the included PM2 configuration:
```bash
pm2 start ecosystem.config.js --env production
```

Configure PM2 to auto-start on server reboot:
```bash
pm2 startup
```
*(Copy and run the `sudo env PATH=...` command that PM2 prints in terminal)*

Save the current running list:
```bash
pm2 save
```

Useful PM2 Commands:
```bash
pm2 status                       # Check status
pm2 logs sparks-backend-api      # View live logs
pm2 restart sparks-backend-api   # Restart application
pm2 stop sparks-backend-api      # Stop application
pm2 monit                        # Real-time CPU/RAM monitor
```

---

## Step 5: Configure Nginx Reverse Proxy
Copy the provided Nginx configuration to `sites-available`:
```bash
sudo cp nginx/api.sparks-learning.com.conf /etc/nginx/sites-available/api.sparks-learning.com
```

Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/api.sparks-learning.com /etc/nginx/sites-enabled/
```

Test Nginx configuration for syntax errors:
```bash
sudo nginx -t
```

Reload Nginx:
```bash
sudo systemctl reload nginx
```

---

## Step 6: Configure Firewall (UFW)
Ensure ports 80 (HTTP), 443 (HTTPS), and 22 (SSH) are open:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## Step 7: Secure Domain with SSL (Certbot)
Run Certbot to automatically generate and link the Let's Encrypt SSL certificate:
```bash
sudo certbot --nginx -d api.sparks-learning.com
```
Follow prompts:
- Enter your email address.
- Agree to terms of service.
- Choose whether to redirect HTTP traffic to HTTPS (Select `2: Redirect`).

Test auto-renewal:
```bash
sudo certbot renew --dry-run
```

---

## Step 8: Verify Deployment
Test API health:
```bash
curl https://api.sparks-learning.com/api/health
```
Expected response:
```json
{"success":true,"message":"Server is healthy ✅",...}
```

Test API Docs in browser:
👉 `https://api.sparks-learning.com/api-docs`
