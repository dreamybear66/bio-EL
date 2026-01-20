# AmulFeedGuard Treatment Optimizer - Deployment Guide

Complete guide for deploying the Treatment Optimizer system to production.

## 📋 Pre-Deployment Checklist

- [ ] Backend tested locally
- [ ] Frontend tested locally
- [ ] API endpoints documented
- [ ] Environment variables configured
- [ ] Security settings reviewed
- [ ] Performance optimized
- [ ] Error handling tested

## 🖥️ Backend Deployment

### Option 1: Traditional Server (Linux)

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.11
sudo apt install python3.11 python3.11-venv python3-pip -y

# Install Nginx
sudo apt install nginx -y

# Install Supervisor (process manager)
sudo apt install supervisor -y
```

#### 2. Application Setup
```bash
# Create application directory
sudo mkdir -p /var/www/amulfeedguard
cd /var/www/amulfeedguard

# Clone or upload your code
# Copy backend files here

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn
```

#### 3. Environment Configuration
Create `/var/www/amulfeedguard/.env`:
```
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-change-this
CORS_ORIGINS=https://yourdomain.com
```

#### 4. Gunicorn Configuration
Create `/var/www/amulfeedguard/gunicorn_config.py`:
```python
bind = "127.0.0.1:5000"
workers = 4
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
errorlog = "/var/log/amulfeedguard/error.log"
accesslog = "/var/log/amulfeedguard/access.log"
loglevel = "info"
```

#### 5. Supervisor Configuration
Create `/etc/supervisor/conf.d/amulfeedguard.conf`:
```ini
[program:amulfeedguard]
directory=/var/www/amulfeedguard
command=/var/www/amulfeedguard/venv/bin/gunicorn -c gunicorn_config.py app:app
user=www-data
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
stderr_logfile=/var/log/amulfeedguard/err.log
stdout_logfile=/var/log/amulfeedguard/out.log
```

Start the service:
```bash
sudo mkdir -p /var/log/amulfeedguard
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start amulfeedguard
```

#### 6. Nginx Configuration
Create `/etc/nginx/sites-available/amulfeedguard`:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/amulfeedguard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 7. SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.yourdomain.com
```

### Option 2: Docker Deployment

#### Dockerfile
Create `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - SECRET_KEY=${SECRET_KEY}
    restart: unless-stopped
```

Deploy:
```bash
docker-compose up -d
```

### Option 3: Cloud Platforms

#### Heroku
```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create amulfeedguard-api

# Add Procfile
echo "web: gunicorn app:app" > Procfile

# Deploy
git push heroku main

# Set environment variables
heroku config:set SECRET_KEY=your-secret-key
heroku config:set FLASK_ENV=production
```

#### AWS Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p python-3.11 amulfeedguard

# Create environment
eb create amulfeedguard-env

# Deploy
eb deploy
```

## 🌐 Frontend Deployment

### Option 1: Static Hosting (Nginx)

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/amulfeedguard/frontend;
    index treatment-optimizer.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache static assets
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Option 2: CDN (Cloudflare, AWS CloudFront)

1. Upload files to S3 bucket
2. Configure CloudFront distribution
3. Update API URLs in JavaScript
4. Enable HTTPS

### Option 3: Netlify/Vercel

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.
```

## 🔒 Security Configuration

### Backend Security

#### 1. Update config.py
```python
class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.getenv('SECRET_KEY')
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '').split(',')
```

#### 2. Add Rate Limiting
```bash
pip install Flask-Limiter
```

```python
from flask_limiter import Limiter

limiter = Limiter(
    app,
    key_func=lambda: request.remote_addr,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/v1/optimize/temperature', methods=['POST'])
@limiter.limit("10 per minute")
def optimize_temperature():
    # ...
```

#### 3. Add HTTPS Redirect
```python
@app.before_request
def before_request():
    if not request.is_secure and app.config['ENV'] == 'production':
        url = request.url.replace('http://', 'https://', 1)
        return redirect(url, code=301)
```

### Frontend Security

#### Update API URLs
```javascript
const API_CONFIG = {
    baseURL: 'https://api.yourdomain.com/api/v1',
    // ...
};
```

#### Add Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline' fonts.googleapis.com; 
               font-src fonts.gstatic.com;">
```

## 📊 Monitoring & Logging

### Application Monitoring

#### Install Sentry
```bash
pip install sentry-sdk[flask]
```

```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FlaskIntegration()],
    environment="production"
)
```

### Server Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Check application logs
sudo tail -f /var/log/amulfeedguard/error.log

# Check Nginx logs
sudo tail -f /var/nginx/error.log

# Check Supervisor status
sudo supervisorctl status
```

## 🚀 Performance Optimization

### Backend

1. **Enable Gzip Compression** (Nginx)
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

2. **Add Caching Headers**
```python
@app.after_request
def add_header(response):
    response.cache_control.max_age = 300
    return response
```

### Frontend

1. **Minify JavaScript**
```bash
npm install -g terser
terser js/temperature.js -o js/temperature.min.js -c -m
```

2. **Optimize Images**
```bash
# Install ImageMagick
sudo apt install imagemagick

# Optimize
convert image.png -quality 85 image-optimized.png
```

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/amulfeedguard
            git pull
            source venv/bin/activate
            pip install -r requirements.txt
            sudo supervisorctl restart amulfeedguard
```

## 🧪 Post-Deployment Testing

```bash
# Health check
curl https://api.yourdomain.com/health

# Test endpoint
curl -X POST https://api.yourdomain.com/api/v1/optimize/temperature \
  -H "Content-Type: application/json" \
  -d '{"current_temperature":80,...}'

# Load testing
ab -n 1000 -c 10 https://api.yourdomain.com/health
```

## 📝 Maintenance

### Backup
```bash
# Backup application
tar -czf amulfeedguard-backup-$(date +%Y%m%d).tar.gz /var/www/amulfeedguard

# Backup logs
tar -czf logs-backup-$(date +%Y%m%d).tar.gz /var/log/amulfeedguard
```

### Updates
```bash
cd /var/www/amulfeedguard
git pull
source venv/bin/activate
pip install -r requirements.txt --upgrade
sudo supervisorctl restart amulfeedguard
```

## 🆘 Troubleshooting

### Application won't start
```bash
# Check logs
sudo tail -100 /var/log/amulfeedguard/error.log

# Check supervisor
sudo supervisorctl status amulfeedguard

# Restart
sudo supervisorctl restart amulfeedguard
```

### High CPU usage
```bash
# Check processes
htop

# Increase workers in gunicorn_config.py
workers = 8  # Increase from 4
```

### Memory issues
```bash
# Check memory
free -h

# Add swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## ✅ Deployment Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] SSL certificate installed
- [ ] Environment variables set
- [ ] CORS configured correctly
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team notified

## 📞 Support

For deployment issues, contact the DevOps team or refer to the main documentation.
