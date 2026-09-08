#!/bin/bash

echo "🚀 My Diwali Crackers - Hostinger Deployment Verification"
echo "=========================================================="
echo ""

# Check root files
echo "✓ Checking Root Files..."
[ -f "index.html" ] && echo "  ✓ index.html" || echo "  ✗ index.html MISSING"
[ -f "payments.html" ] && echo "  ✓ payments.html" || echo "  ✗ payments.html MISSING"
[ -f ".htaccess" ] && echo "  ✓ .htaccess" || echo "  ✗ .htaccess MISSING"
[ -f "sw.js" ] && echo "  ✓ sw.js" || echo "  ✗ sw.js MISSING"
echo ""

# Check admin files
echo "✓ Checking Admin Files..."
[ -f "admin/index.html" ] && echo "  ✓ admin/index.html" || echo "  ✗ admin/index.html MISSING"
[ -f "admin/.htaccess" ] && echo "  ✓ admin/.htaccess" || echo "  ✗ admin/.htaccess MISSING"
[ -f "admin/payments-subtab.js" ] && echo "  ✓ admin/payments-subtab.js" || echo "  ✗ admin/payments-subtab.js MISSING"
[ -f "admin/product-cost-and-summary.js" ] && echo "  ✓ admin/product-cost-and-summary.js" || echo "  ✗ admin/product-cost-and-summary.js MISSING"
echo ""

# Check assets
echo "✓ Checking Assets..."
[ -f "assets/customer-enhancements.js" ] && echo "  ✓ assets/customer-enhancements.js" || echo "  ✗ assets/customer-enhancements.js MISSING"
[ -f "assets/index-B-0Rpxca.js" ] && echo "  ✓ assets/index-B-0Rpxca.js" || echo "  ✗ assets/index-B-0Rpxca.js MISSING"
echo ""

# Check API files
echo "✓ Checking API Files..."
[ -f "api/.htaccess" ] && echo "  ✓ api/.htaccess" || echo "  ✗ api/.htaccess MISSING"
[ -f "api/index.php" ] && echo "  ✓ api/index.php" || echo "  ✗ api/index.php MISSING"
[ -f "api/config.php" ] && echo "  ✓ api/config.php" || echo "  ✗ api/config.php MISSING"
echo ""

# Check routes
echo "✓ Checking API Routes..."
[ -f "api/routes/auth.php" ] && echo "  ✓ api/routes/auth.php" || echo "  ✗ api/routes/auth.php MISSING"
[ -f "api/routes/orders.php" ] && echo "  ✓ api/routes/orders.php" || echo "  ✗ api/routes/orders.php MISSING"
[ -f "api/routes/products.php" ] && echo "  ✓ api/routes/products.php" || echo "  ✗ api/routes/products.php MISSING"
[ -f "api/routes/categories.php" ] && echo "  ✓ api/routes/categories.php" || echo "  ✗ api/routes/categories.php MISSING"
[ -f "api/routes/coupons.php" ] && echo "  ✓ api/routes/coupons.php" || echo "  ✗ api/routes/coupons.php MISSING"
[ -f "api/routes/admin.php" ] && echo "  ✓ api/routes/admin.php" || echo "  ✗ api/routes/admin.php MISSING"
echo ""

# Check uploads
echo "✓ Checking Uploads Directory..."
[ -d "api/uploads" ] && echo "  ✓ api/uploads/ (exists)" || echo "  ✗ api/uploads/ MISSING"
[ -f "api/uploads/.htaccess" ] && echo "  ✓ api/uploads/.htaccess" || echo "  ✗ api/uploads/.htaccess MISSING"
echo ""

echo "=========================================================="
echo "✅ Deployment Verification Complete!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Download mydiwalicrackers-hostinger.zip"
echo "2. Extract to local folder"
echo "3. Edit api/config.php with your Hostinger database details"
echo "4. Upload to public_html/ via FTP"
echo "5. Test: https://mydiwalicrackers.com"
echo ""
