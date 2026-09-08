# 🚀 Hostinger Deployment Guide - My Diwali Crackers

## ✅ Pre-Deployment Checklist

### 1. Database Setup (cPanel/Hostinger)
```bash
# Create MySQL database
Database Name: mydiwalicrackers_db
Username: mydiwalicrackers_user
Password: [Use strong password]

# Import database.sql (if available)
# OR create tables manually via SQL queries in phpMyAdmin
```

### 2. Domain Configuration
- Point domain to Hostinger nameservers
- SSL certificate: Auto-enabled (Let's Encrypt)
- Main domain: https://mydiwalicrackers.com
- Redirect all traffic to HTTPS

---

## 📁 Directory Structure

```
public_html/
├── index.html                    (Main storefront)
├── payments.html                 (Payment page)
├── .htaccess                     (URL rewrites + redirects)
├── sw.js                         (Service worker)
│
├── admin/
│   ├── index.html                (Admin dashboard)
│   ├── .htaccess
│   ├── payments-subtab.js        (Admin optimization script v=4)
│   ├── product-cost-and-summary.js (PDF export script v=8)
│   └── assets/
│       └── (compiled JS bundles)
│
├── assets/
│   ├── customer-enhancements.js  (Coupon + API caching v=7)
│   ├── index-B-0Rpxca.js         (Frontend bundle)
│   ├── index.es-B4z7Q1vZ.js      (Frontend ES module)
│   ├── html2canvas.esm-*.js      (PDF generation)
│   ├── purify.es-*.js            (XSS protection)
│   └── (other assets)
│
├── api/
│   ├── .htaccess                 (API routing)
│   ├── index.php                 (API entry point)
│   ├── config.php                (Database config - EDIT THIS!)
│   │
│   ├── routes/
│   │   ├── auth.php
│   │   ├── orders.php
│   │   ├── products.php
│   │   ├── categories.php
│   │   ├── coupons.php
│   │   ├── payments.php
│   │   ├── settings.php
│   │   ├── upload.php
│   │   └── admin.php
│   │
│   └── uploads/
│       ├── .htaccess
│       └── product-images/
│
└── images/
    └── (logo, etc.)
```

---

## 🔧 Critical Configuration Files

### 1. `.htaccess` (Root Directory)
```apache
# Enable mod_rewrite
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Force HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  
  # Force www.mydiwalicrackers.com
  RewriteCond %{HTTP_HOST} !^www\.mydiwalicrackers\.com$ [NC]
  RewriteCond %{HTTP_HOST} ^(.+)$ [NC]
  RewriteRule ^(.*)$ https://www.mydiwalicrackers.com/$1 [L,R=301]
  
  # SPA routing - all requests go to index.html
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Disable directory listing
Options -Indexes

# Cache control
<FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

<FilesMatch "\.(html|php)$">
  Header set Cache-Control "max-age=3600, must-revalidate"
</FilesMatch>
```

### 2. `/api/.htaccess`
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /api/
  
  # Route all requests to index.php
  RewriteRule ^(.*)$ index.php?route=$1 [QSA,L]
</IfModule>

# Allow CORS
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type, Authorization"
```

### 3. `/api/config.php` - **EDIT THIS!**
```php
<?php
// Database Configuration - UPDATE FOR HOSTINGER
define('DB_HOST', 'localhost');
define('DB_USER', 'mydiwalicrackers_user');      // Change this
define('DB_PASS', 'your_strong_password');      // Change this
define('DB_NAME', 'mydiwalicrackers_db');       // Change this

// API Configuration
define('API_URL', 'https://mydiwalicrackers.com/api');
define('UPLOAD_DIR', __DIR__ . '/uploads');
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024);     // 5MB

// Email Configuration (Optional)
define('SMTP_HOST', 'mail.mydiwalicrackers.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'noreply@mydiwalicrackers.com');
define('SMTP_PASS', 'email_password');
?>
```

### 4. `/admin/.htaccess`
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /admin/
  
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /admin/index.html [L]
</IfModule>

# Protect admin directory
<FilesMatch "^(index\.html|\.git|\.env)$">
  Deny from all
</FilesMatch>
```

### 5. `/api/uploads/.htaccess`
```apache
# Deny PHP execution in uploads
<FilesMatch "\.php$">
  Deny from all
</FilesMatch>

# Allow image files
<FilesMatch "\.(jpg|jpeg|png|gif|webp)$">
  Allow from all
</FilesMatch>

# Disable directory listing
Options -Indexes
```

---

## 📜 File Verification Checklist

**Root Level:**
- [ ] index.html (storefront)
- [ ] payments.html
- [ ] .htaccess
- [ ] sw.js

**Admin Directory:**
- [ ] admin/index.html
- [ ] admin/.htaccess
- [ ] admin/payments-subtab.js (v=4)
- [ ] admin/product-cost-and-summary.js (v=8)

**Assets Directory:**
- [ ] assets/customer-enhancements.js (v=7)
- [ ] assets/index-B-0Rpxca.js
- [ ] assets/index.es-B4z7Q1vZ.js
- [ ] assets/html2canvas.esm-*.js
- [ ] assets/purify.es-*.js

**API Directory:**
- [ ] api/.htaccess
- [ ] api/index.php
- [ ] api/config.php (**EDIT THIS**)
- [ ] api/routes/auth.php
- [ ] api/routes/orders.php
- [ ] api/routes/products.php
- [ ] api/routes/categories.php
- [ ] api/routes/coupons.php
- [ ] api/routes/payments.php
- [ ] api/routes/settings.php
- [ ] api/routes/upload.php
- [ ] api/routes/admin.php
- [ ] api/uploads/.htaccess
- [ ] api/uploads/product-images/ (create if empty)

---

## 🚀 Step-by-Step Deployment

### Step 1: Connect via FTP/File Manager

1. **Via Hostinger Control Panel:**
   - Go to File Manager
   - Navigate to public_html/
   - Upload all files maintaining directory structure

2. **Via FTP Client (Recommended):**
   ```
   Host: mydiwalicrackers.com or ftp.mydiwalicrackers.com
   Port: 21
   Username: FTP username from Hostinger
   Password: FTP password from Hostinger
   ```

### Step 2: Upload Files

1. Delete existing files in public_html/
2. Upload all files from mydiwalicrackers-hostinger.zip
3. Verify directory structure is intact

### Step 3: Configure Database

1. **Go to Hostinger cPanel** → phpMyAdmin
2. **Create new database:**
   - Name: mydiwalicrackers_db
   - User: mydiwalicrackers_user
   - Password: (strong password)

3. **Import database schema:**
   - Run SQL queries from database.sql (if provided)
   - OR manually create tables via phpMyAdmin

4. **Edit `/api/config.php`:**
   - Update DB_USER
   - Update DB_PASS
   - Update DB_NAME

### Step 4: Update Environment

1. **Edit `/index.html`:**
   - Verify script versions are correct:
     - customer-enhancements.js?v=7
     - index-B-0Rpxca.js?v=2

2. **Edit `/admin/index.html`:**
   - Verify admin script versions:
     - payments-subtab.js?v=4
     - product-cost-and-summary.js?v=8

3. **Edit `/api/index.php`:**
   - Verify CORS headers are set correctly
   - Check API_URL matches domain

### Step 5: Set Permissions

```bash
# Via SSH (if available)
chmod 755 /public_html/
chmod 755 /public_html/api/
chmod 755 /public_html/api/uploads/
chmod 644 /public_html/.htaccess
chmod 644 /public_html/api/.htaccess
chmod 644 /public_html/api/config.php
chmod 644 /public_html/api/uploads/.htaccess
```

### Step 6: Test Deployment

1. **Storefront:** https://mydiwalicrackers.com
2. **Admin:** https://mydiwalicrackers.com/admin
3. **API Test:** https://mydiwalicrackers.com/api/products (should return JSON)
4. **Coupon Box:** Check /checkout page for coupon input
5. **PDF Export:** Admin orders page - test "Order Full Summary PDF"

---

## 🐛 Troubleshooting

### Page Shows 404 Not Found

**Fix:**
1. Verify .htaccess file exists in root
2. Check `AllowOverride All` is enabled on Hostinger
3. Clear browser cache (Ctrl+F5)
4. Test API: https://mydiwalicrackers.com/api/products

### API Returns Error

**Check:**
1. `/api/config.php` - database credentials are correct
2. Database exists and is accessible
3. API routes in `/api/routes/` are uploaded
4. Database tables exist (run SQL schema)

### Coupon Box Not Showing

**Check:**
1. Script version: `customer-enhancements.js?v=7`
2. Browser dev console for errors
3. API endpoint: `/api/coupons/validate` responds

### Admin Panel Not Loading

**Check:**
1. `/admin/.htaccess` exists and is correct
2. `/admin/index.html` exists
3. Scripts in `/admin/` directory:
   - payments-subtab.js v=4
   - product-cost-and-summary.js v=8

### Products Not Showing

**Check:**
1. Database has products table
2. Products are added via admin panel
3. API endpoint: `/api/products` returns JSON
4. Network tab in browser dev tools for failed requests

---

## 📊 Performance Optimization

### Enabled Features:
- ✅ API Response Caching (45 seconds)
- ✅ Request Deduplication
- ✅ HTTPS/SSL
- ✅ Gzip Compression (via .htaccess)
- ✅ Browser Caching Headers
- ✅ Service Worker (offline support)

### Monitoring:
- Monitor browser Network tab for API calls
- Check for repeated requests (should be cached)
- Monitor page load time

---

## 🔐 Security Checklist

- [ ] HTTPS enabled on all pages
- [ ] Database credentials in config.php (not in version control)
- [ ] Disable PHP execution in /api/uploads/
- [ ] Disable directory listing (Options -Indexes)
- [ ] Validate all user inputs in API routes
- [ ] CORS headers configured correctly
- [ ] XSS protection (purify.js included)
- [ ] SQL injection protection (prepared statements used)

---

## 📞 Support

**If pages are not working:**

1. Check browser console (F12 → Console) for JS errors
2. Check Network tab (F12 → Network) for failed requests
3. Check `/api/config.php` database credentials
4. Verify `.htaccess` files are present
5. Clear all caches (browser + CDN)

**Common Issues:**
- 404 errors → check .htaccess
- API errors → check config.php
- Coupon not showing → check customer-enhancements.js v=7
- Admin issues → check admin/.htaccess

---

**Version:** 1.0
**Last Updated:** 2026-09-06
**Status:** Ready for Production
