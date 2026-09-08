# 📁 Complete File Manifest

## Directory Structure Overview

```
public_html/                          # Root folder (upload to Hostinger)
│
├── 🔴 CRITICAL FILES (Must Upload)
│   ├── .htaccess                     # URL rewriting (SPA routing)
│   ├── index.html                    # Storefront (main entry point)
│   ├── payments.html                 # Payment page
│   └── sw.js                         # Service Worker (PWA)
│
├── 📂 admin/                         # Admin dashboard
│   ├── .htaccess                     # Admin routing
│   ├── index.html                    # Admin entry point
│   ├── payments-subtab.js            # v=4 (polling optimization)
│   ├── product-cost-and-summary.js   # v=8 (purchased price + PDF)
│   └── [compiled bundle files]
│
├── 📂 api/                           # Backend API
│   ├── .htaccess                     # API routing
│   ├── index.php                     # API router
│   ├── config.php                    # ⚠️ DATABASE CREDENTIALS (edit after upload)
│   │
│   ├── 📂 routes/                    # API endpoints
│   │   ├── auth.php                  # Login/logout/register
│   │   ├── products.php              # Product listing
│   │   ├── categories.php            # Category management
│   │   ├── orders.php                # Order management
│   │   ├── coupons.php               # Coupon validation
│   │   └── admin.php                 # Admin operations (FIXED)
│   │
│   ├── 📂 uploads/                   # User uploads
│   │   └── .htaccess                 # Prevent script execution
│   │
│   └── 📂 db/                        # Database utilities
│       └── connection.php            # DB connection helper
│
├── 📂 assets/                        # Static assets
│   ├── customer-enhancements.js      # v=7 (coupon UI + API caching)
│   ├── index-B-0Rpxca.js             # Main React bundle
│   ├── index.css                     # Styles
│   ├── html2canvas.esm-*.js          # PDF generation
│   ├── purify.es-*.js                # XSS protection
│   └── [other CSS/JS files]
│
├── 📂 images/                        # Product & UI images
│   ├── favicon.ico
│   ├── logo.png
│   └── [other images]
│
└── 📂 public/                        # Additional static files
    └── [manifest, icons, etc]
```

---

## File Descriptions & Modifications

### 🔴 Root .htaccess (CRITICAL)
**Location:** `/public_html/.htaccess`

**Purpose:** 
- Force HTTPS
- Redirect to canonical domain
- Enable SPA routing to index.html

**Last Modified:** Latest version includes:
- Lines 1-5: Error suppression
- Lines 7-10: HTTPS + www redirect
- Lines 13-18: SPA routing

---

### 📄 index.html (Storefront)
**Location:** `/public_html/index.html`

**Key Changes:**
- Line 20: Added customer-enhancements.js v=7
  ```html
  <script src="/assets/customer-enhancements.js?v=7"></script>
  ```

**What It Does:**
- Renders React storefront
- Loads coupon UI enhancement
- Initializes API caching layer

---

### 📄 admin/index.html (Admin Dashboard)
**Location:** `/public_html/admin/index.html`

**Key Changes:**
- Line X: payments-subtab.js v=4
  ```html
  <script src="payments-subtab.js?v=4"></script>
  ```
- Line Y: product-cost-and-summary.js v=8
  ```html
  <script src="product-cost-and-summary.js?v=8"></script>
  ```

**What It Does:**
- Renders React admin dashboard
- Adds purchased price field
- Enables PDF export with totals
- Reduces API polling

---

### ⚙️ admin/product-cost-and-summary.js (v=8)
**Location:** `/public_html/admin/product-cost-and-summary.js`

**Functionality:**
- ✅ Injects "Purchased Price" input field in product form
- ✅ Generates "Order Full Summary PDF" with:
  - S.No, Product Name, Qty
  - Actual Price, Purchased Price
  - Total Price (Qty × Price)
  - Total Purchased Price (Qty × Purchased Price)
  - Grand totals row
- ✅ Caches order list (60s TTL)
- ✅ Reduces API calls with in-flight request lock
- ✅ Polls every 1200ms (increased from 600ms)

**Key Code Sections:**
- Lines 172-210: Order ID mapping with cache
- Lines 240-282: PDF generation
- Lines 300+: Main polling loop

---

### 📦 admin/payments-subtab.js (v=4)
**Location:** `/public_html/admin/payments-subtab.js`

**Functionality:**
- ✅ Adds loop guard to prevent overlapping polling
- ✅ Increased polling interval 600ms → 1200ms
- ✅ Reduces redundant API calls

---

### 🎟️ assets/customer-enhancements.js (v=7)
**Location:** `/public_html/assets/customer-enhancements.js`

**Functionality:**
- ✅ Injects "Apply Coupon Code" box on /checkout page
- ✅ Implements API response caching (45s TTL)
- ✅ Deduplicates in-flight requests (prevents duplicates)
- ✅ Displays discount when coupon applied
- ✅ Hides discount row when discount = 0

**Key Features:**
- Lines 1-65: API caching layer
- Lines 72-125: Coupon validation
- Lines 140-190: DOM injection targeting Place Enquiry button
- Lines 195-240: Coupon apply event handler
- Lines 250-295: Summary discount display

---

### 🔑 api/config.php (⚠️ MUST EDIT)
**Location:** `/public_html/api/config.php`

**DEFAULT CONTENT:**
```php
<?php
// Database credentials (EDIT THESE!)
define('DB_HOST', 'localhost');
define('DB_USER', 'mydiwalicrackers_user');
define('DB_PASS', 'your_strong_password_here');
define('DB_NAME', 'mydiwalicrackers_db');

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
?>
```

**WHAT TO REPLACE:**
1. `DB_USER` → Your Hostinger MySQL username
2. `DB_PASS` → Your Hostinger MySQL password
3. `DB_NAME` → Your Hostinger database name

**Example After Editing:**
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'myd_user_123');
define('DB_PASS', 'SecurePass@2024!');
define('DB_NAME', 'myd_store_db');
```

---

### 🛣️ api/.htaccess
**Location:** `/public_html/api/.htaccess`

**Purpose:** 
- Route API requests to index.php
- Prevent direct file access

**Content:**
```apache
RewriteEngine On
RewriteRule ^(.*)$ index.php?route=$1 [QSA,L]
```

---

### 🛣️ admin/.htaccess
**Location:** `/public_html/admin/.htaccess`

**Purpose:**
- Route admin requests to index.html
- Enable SPA routing

---

### ✅ api/routes/admin.php (FIXED)
**Location:** `/public_html/api/routes/admin.php`

**Critical Fix Applied:**
- Line 584-585: Fixed coupon save bind_param type mismatch
  ```php
  // BEFORE: 'ssssdddiiissi' (13 types for 12 values) ❌
  // AFTER: 'ssssdddiissi' (12 types for 12 values) ✅
  $stmt->bind_param('ssssdddiissi', $name, $code, $description, $discountValue, ...);
  ```

**Functionality:**
- Save coupons ✅
- Update coupons ✅
- Delete coupons ✅
- Support maxUsesPerCustomer field ✅

---

### 📊 api/routes/products.php
**Location:** `/public_html/api/routes/products.php`

**Functionality:**
- GET: Fetch all products with purchased price ✅
- POST: Create product (admin only)
- PUT: Update product including purchased price ✅

---

### 📦 api/routes/orders.php
**Location:** `/public_html/api/routes/orders.php`

**Functionality:**
- GET: Fetch all orders ✅
- POST: Create order ✅
- PUT: Update order status ✅

---

### 🎟️ api/routes/coupons.php
**Location:** `/public_html/api/routes/coupons.php`

**Functionality:**
- GET: List coupons ✅
- POST: Validate coupon code ✅
- Response format: `{valid: true, data: {...}}`

---

## 📦 Compression & Upload

### mydiwalicrackers-hostinger.zip (Latest)

**Contents:** All files above, properly organized

**Size:** ~406 KB

**Included:** ✅
- index.html with customer-enhancements.js v=7
- admin/ with all scripts v=4 & v=8
- api/ with all routes (admin.php FIXED)
- assets/ with bundles and libs
- images/ directory
- All .htaccess files

**NOT Included:**
- node_modules/ (not needed for production)
- .git/ (not needed for hosting)
- api/config.php credentials (you edit locally)

---

## ✅ Pre-Upload Verification

Before uploading, verify:

```bash
✓ index.html has v=7 reference
✓ admin/index.html has v=4 and v=8
✓ api/config.php exists (placeholder)
✓ All .htaccess files present (5 total)
✓ assets/customer-enhancements.js exists
✓ admin/product-cost-and-summary.js exists
✓ admin/payments-subtab.js exists
✓ api/routes/admin.php exists
```

---

## 🚀 Upload Steps

1. **Extract zip** to local folder
2. **Edit api/config.php** with your Hostinger DB credentials
3. **Upload** via FTP to `/public_html/`
4. **Test** each endpoint

---

## 📞 File Issues & Solutions

### Issue: "Cannot find payments-subtab.js"
- Verify file exists: `/admin/payments-subtab.js`
- Check version number in `/admin/index.html` matches

### Issue: "Coupon box not showing"
- Check `/index.html` loads `/assets/customer-enhancements.js?v=7`
- Check browser console for errors

### Issue: "API returns database error"
- Edit `/api/config.php`
- Verify DB_USER, DB_PASS, DB_NAME match Hostinger

### Issue: "404 on all routes"
- Verify all `.htaccess` files uploaded
- Check `AllowOverride All` is enabled on Hostinger

---

## 📝 Summary

| File | Version | Status | Purpose |
|------|---------|--------|---------|
| customer-enhancements.js | 7 | ✅ Active | Coupon UI + API caching |
| product-cost-and-summary.js | 8 | ✅ Active | Purchased price + PDF |
| payments-subtab.js | 4 | ✅ Active | API optimization |
| admin.php | FIXED | ✅ Active | Coupon save working |
| .htaccess (root) | Current | ✅ Active | HTTPS + domain + routing |
| .htaccess (admin) | Current | ✅ Active | Admin routing |
| .htaccess (api) | Current | ✅ Active | API routing |
| config.php | Template | ⚠️ Edit | Database credentials |

