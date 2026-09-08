# ⚡ Hostinger Quick Setup Guide

## 📋 Before You Start
1. Have Hostinger login credentials ready
2. FTP credentials from Hostinger Control Panel
3. Database credentials (will create in next step)
4. Domain: mydiwalicrackers.com

---

## 🔄 Step 1: Create Database

**Via Hostinger cPanel:**

1. Log in to your Hostinger Control Panel
2. Go to **Databases** → **MySQL Databases**
3. Create new database:
   ```
   Database name: mydiwalicrackers_db
   ```
4. Click **Create Database**

5. Go to **Databases** → **MySQL Users**
6. Create new user:
   ```
   Username: mydiwalicrackers_user
   Password: (strong 16+ char password with !@#$%^&*)
   ```
7. Click **Add User**

8. Assign user to database:
   - Go to **MySQL User Accounts**
   - Find your user
   - Add privileges to `mydiwalicrackers_db`
   - Grant **ALL** privileges
   - Click **Update**

9. **Copy these credentials** - you'll need them in Step 3

---

## 📥 Step 2: Upload Files via FTP

### Option A: File Manager (Recommended for beginners)

1. Go to Hostinger Control Panel
2. Click **File Manager**
3. Navigate to **public_html** folder
4. Right-click → **Upload Files**
5. Select all files from `mydiwalicrackers-hostinger.zip` (extract first)
6. Upload maintaining folder structure:
   ```
   public_html/
   ├── index.html
   ├── .htaccess
   ├── admin/
   ├── api/
   ├── assets/
   └── images/
   ```

### Option B: FTP Client (Faster for large files)

**Using FileZilla or WinSCP:**

1. Download and install FileZilla
2. File → Site Manager → New Site
3. Enter:
   ```
   Host: ftp.mydiwalicrackers.com  (or from Hostinger)
   Port: 21
   Username: [FTP username from Hostinger]
   Password: [FTP password from Hostinger]
   Protocol: FTP
   ```
4. Click **Connect**
5. Navigate to **public_html** folder
6. Drag and drop all files from mydiwalicrackers-hostinger.zip
7. Wait for upload to complete

---

## ⚙️ Step 3: Configure API Database Connection

### Edit `/api/config.php` via File Manager

1. Go to **File Manager** → **public_html/api/**
2. Right-click **config.php** → **Edit**
3. Find these lines:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'mydiwalicrackers_user');
   define('DB_PASS', 'your_strong_password');
   define('DB_NAME', 'mydiwalicrackers_db');
   ```
4. Replace with your values from Step 1:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'mydiwalicrackers_user');  // Your username
   define('DB_PASS', 'YourPassword@123!');     // Your password
   define('DB_NAME', 'mydiwalicrackers_db');   // Your database name
   ```
5. Click **Save**

---

## 🗄️ Step 4: Import Database Schema

**Via phpMyAdmin:**

1. Go to Hostinger Control Panel
2. Click **phpMyAdmin**
3. Select your database: `mydiwalicrackers_db`
4. Click **Import** tab
5. Click **Choose File**
6. Select `database.sql` (if provided)
7. Click **Import**

**If no database.sql file:**

Create tables manually via SQL queries. Contact support for schema.

---

## 🔗 Step 5: Configure Domain & SSL

1. Go to Hostinger Control Panel
2. Click **Domains**
3. Click on **mydiwalicrackers.com**
4. Go to **DNS Zone Editor**
5. Verify nameservers point to Hostinger

**SSL Certificate:**
- Hostinger auto-enables Let's Encrypt
- Wait 24-48 hours for SSL to activate
- Test: https://mydiwalicrackers.com (should be secure)

---

## 🧪 Step 6: Verify Deployment

### Test Each URL:

1. **Storefront:** https://mydiwalicrackers.com
   - Should load home page
   - Should show products

2. **Products:** https://mydiwalicrackers.com/products
   - Should load products page

3. **Checkout:** https://mydiwalicrackers.com/checkout
   - Should show enquiry form
   - Should show **Apply Coupon Code** box 🎟️

4. **Admin:** https://mydiwalicrackers.com/admin
   - Should load admin dashboard
   - Should be able to log in

5. **API Test:** https://mydiwalicrackers.com/api/products
   - Should return JSON with product data
   - Example response:
     ```json
     {
       "success": true,
       "data": [...]
     }
     ```

### If Pages Don't Load:

1. **Clear Browser Cache:**
   - Press `Ctrl + Shift + Delete`
   - Clear all data
   - Reload page

2. **Check .htaccess:**
   - Verify all 5 .htaccess files are uploaded:
     - `/public_html/.htaccess`
     - `/public_html/admin/.htaccess`
     - `/public_html/api/.htaccess`
     - `/public_html/api/uploads/.htaccess`

3. **Check Database:**
   - Go to phpMyAdmin
   - Select `mydiwalicrackers_db`
   - Check if tables exist
   - If empty, import database.sql

4. **Check API Config:**
   - Edit `/api/config.php`
   - Verify all credentials are correct
   - Test: https://mydiwalicrackers.com/api/products

---

## 🚀 Common Issues & Fixes

### Issue: "Page Not Found" (404)

**Fix:**
1. Check `/public_html/.htaccess` exists
2. Verify file permissions are correct
3. Clear cache: `Ctrl+F5`
4. Test API: https://mydiwalicrackers.com/api/products

**If still not working:**
1. Go to Hostinger Control Panel
2. Click **Settings** → **Advanced**
3. Find "AllowOverride" and set to "All"
4. Restart Apache

### Issue: API Returns "Database Connection Failed"

**Fix:**
1. Go to File Manager → `/api/config.php`
2. Verify database credentials match Step 1:
   - DB_USER
   - DB_PASS
   - DB_NAME
3. Test connection in phpMyAdmin
4. If password has special characters, escape them in config.php

### Issue: "Certificate Error" or "Not Secure"

**Fix:**
1. Force HTTPS redirect:
   - Edit `/public_html/.htaccess`
   - Uncomment HTTPS redirect lines
   - Save
2. Clear cache
3. Wait 24-48 hours for SSL to fully activate
4. Test: https://mydiwalicrackers.com

### Issue: Coupon Box Not Showing

**Fix:**
1. Check script version in `/index.html`:
   ```html
   <script src="/assets/customer-enhancements.js?v=7"></script>
   ```
2. Open browser DevTools (`F12`)
3. Go to **Console** tab
4. Check for JavaScript errors
5. Go to **Network** tab
6. Check if script loads (should see 200 status)

### Issue: Admin Scripts Not Working

**Fix:**
1. Check script versions in `/admin/index.html`:
   ```html
   <script src="payments-subtab.js?v=4"></script>
   <script src="product-cost-and-summary.js?v=8"></script>
   ```
2. Verify both files exist in `/admin/` folder
3. Check browser console for errors

---

## 📊 Performance Monitoring

### Check Page Speed:

1. Open browser DevTools (`F12`)
2. Go to **Network** tab
3. Reload page
4. Look for:
   - **Green requests** (200 status) = good
   - **Red requests** (404/500) = bad
   - Repeated requests = cache not working

### Reduce API Calls:

- Caching is enabled (45-second TTL)
- Should see fewer duplicate requests on reload
- If seeing same request 5+ times = cache issue

### Monitor Database:

1. Go to phpMyAdmin
2. Select `mydiwalicrackers_db`
3. Check table sizes
4. Optimize tables if slow: Right-click table → Optimize

---

## 📞 Support & Escalation

### If deployment fails:

1. **Check Error Logs:**
   - Go to Hostinger Control Panel
   - Click **Tools** → **Error Logs**
   - Look for PHP errors

2. **Test API Manually:**
   ```
   https://mydiwalicrackers.com/api/products
   ```
   - Should return JSON
   - If error, check `/api/config.php`

3. **Contact Hostinger Support:**
   - Mention: "My PHP app won't load"
   - Include: `public_html/` files
   - Ask: "Is mod_rewrite enabled?"

---

## ✅ Deployment Checklist

Before considering deployment complete:

- [ ] Database created with correct name
- [ ] Database user created with all privileges
- [ ] All files uploaded to public_html/
- [ ] api/config.php edited with database credentials
- [ ] Database tables imported (database.sql)
- [ ] SSL certificate active (HTTPS works)
- [ ] Storefront loads at https://mydiwalicrackers.com
- [ ] Admin loads at https://mydiwalicrackers.com/admin
- [ ] API responds at https://mydiwalicrackers.com/api/products
- [ ] Coupon box shows on /checkout page
- [ ] No JavaScript errors in browser console
- [ ] No 404 errors in Network tab

---

## 🎉 You're Done!

Your Diwali Crackers store is now live on Hostinger!

**Next Steps:**
1. Add products via admin panel
2. Create coupons
3. Invite users to order
4. Monitor sales
5. Process orders

**Happy Selling! 🚀**

---

**For Issues:**
1. Check browser console (F12 → Console)
2. Check Network tab (F12 → Network)
3. Review this guide's troubleshooting section
4. Contact Hostinger support

**Documentation:** See HOSTINGER_DEPLOYMENT_GUIDE.md for detailed info
