# Local Development Setup

## Prerequisites

Make sure you have PHP and MySQL installed:

```bash
# Check PHP version
php -v

# Check MySQL
mysql --version
```

If not installed on macOS:
```bash
# Install Homebrew if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PHP (includes MySQL client)
brew install php mysql
```

---

## Environment Setup

### 1. Create `.env` file (or update `api/config.php`)

The API reads from environment variables. Set these before starting:

```bash
export DB_HOST="localhost"
export DB_USER="root"
export DB_PASS="your_password"
export DB_NAME="diwali_crackers"
export JWT_SECRET="your-64-character-secret-key-here"
export BACKEND_URL="http://localhost:8000"
```

Or edit `api/config.php` directly with your database credentials.

---

## 2. Set Up MySQL Database

```bash
# Start MySQL (if using Homebrew)
brew services start mysql

# Connect to MySQL
mysql -u root

# Inside MySQL:
CREATE DATABASE diwali_crackers CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE diwali_crackers;
SOURCE /Users/guru-20229/Desktop/mydiwalicrackerfinal/api/mysql-schema.sql;
EXIT;
```

---

## 3. Start Development Server

From the project root (`/Users/guru-20229/Desktop/mydiwalicrackerfinal/`):

```bash
# Option 1: PHP Built-in Server (Recommended for development)
php -S localhost:8000

# Option 2: If you need a specific port
php -S 127.0.0.1:3000
```

---

## 4. Access the Application

- **Frontend (Customer)**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **API**: http://localhost:8000/api/health

---

## Database Initialization Script

After creating the database, populate some initial data:

```bash
mysql -u root diwali_crackers < /Users/guru-20229/Desktop/mydiwalicrackerfinal/api/mysql-schema.sql
```

Initialize admin account:
```sql
INSERT INTO counters (`key`, last_id) VALUES ('orders', 100);

-- Create admin user
INSERT INTO users (id, email, password_hash) 
VALUES ('admin-uuid', 'admin@example.com', '$2y$10$...');

INSERT INTO profiles (id, name, email, role, status)
VALUES ('admin-uuid', 'Admin', 'admin@example.com', 'admin', 'active');
```

---

## Troubleshooting

### Port 8000 Already in Use
```bash
# Find process using port 8000
lsof -i :8000

# Kill it
kill -9 <PID>
```

### MySQL Connection Error
```bash
# Check if MySQL is running
brew services list

# Restart MySQL
brew services restart mysql

# Test connection
mysql -u root
```

### CORS Errors
The API already has CORS enabled for all origins. Check browser console for actual error.

### "api/config.php" not found
Ensure you're running from the correct directory:
```bash
cd /Users/guru-20229/Desktop/mydiwalicrackerfinal
php -S localhost:8000
```

---

## Next Steps

1. Start PHP server
2. Access admin at `http://localhost:8000/admin`
3. Build payment UI components (see PAYMENT_FEATURE_GUIDE.md)
4. Test payment endpoints with Postman or curl
