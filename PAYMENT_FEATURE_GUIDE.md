# Payment Feature Implementation Guide

## Backend Setup Complete ✅

The payment system has been set up in the backend with the following:

### 1. **Database**
- Added `payments` table to track all payments for each order
- Payments table includes: amount, payment method, reference number, notes, recorded by, timestamps

### 2. **API Endpoints**

#### Get Payment Summary for an Order
```
GET /payments/:orderId
```
**Response:**
```json
{
  "data": {
    "payments": [
      {
        "id": "uuid",
        "orderId": "uuid",
        "amount": 5000.00,
        "paymentMethod": "Bank Transfer",
        "referenceNumber": "REF123",
        "notes": "Payment received",
        "recordedBy": "admin-id",
        "createdAt": { "seconds": 1234567890 }
      }
    ],
    "orderTotal": 47550.00,
    "amountCollected": 5000.00,
    "balanceDue": 42550.00,
    "paymentStatus": "Partial Payment"  // "Unpaid" | "Partial Payment" | "Paid"
  }
}
```

#### Record a Payment
```
POST /payments/:orderId
```
**Request Body:**
```json
{
  "amount": 5000.00,
  "paymentMethod": "Bank Transfer",
  "referenceNumber": "REF123",
  "notes": "Payment received"
}
```

#### Delete a Payment
```
DELETE /payments/:paymentId
```

#### Get Orders with Payment Status (Admin)
```
GET /admin/orders
GET /admin/orders?paymentStatus=unpaid
GET /admin/orders?paymentStatus=partial%20payment
GET /admin/orders?paymentStatus=paid
```

**The order response now includes:**
```json
{
  "id": "uuid",
  "orderNumber": "ORD-101",
  "total": 47550.00,
  "amountCollected": 0.00,
  "balanceDue": 47550.00,
  "paymentStatus": "Unpaid",
  // ... other order fields
}
```

---

## Frontend Components to Build

### 1. **Order Details - Payments Tab**

Based on the screenshot, create a Payments tab with:

#### Payment Summary Cards
- **Order Total**: Display in grey box
- **Amount Collected**: Display in green box  
- **Balance Due**: Display in orange box
- **Status Badge**: "Unpaid" | "Partial Payment" | "Paid"

#### Payment History Table
Columns:
- Date
- Amount
- Payment Method
- Reference Number
- Notes
- Delete button (admin only)

#### Record Payment Button
Opens modal with form:
- Amount (required)
- Payment Method (dropdown: "Cash", "Bank Transfer", "Check", "Other")
- Reference Number (optional)
- Notes (optional)
- Submit button

### 2. **Sales Orders Page - Payment Filter**

Add dropdown filter to the sales/orders list with options:
- ✓ All Payments (default)
- Partial Payment
- Unpaid
- Paid

This filters orders by `paymentStatus` query parameter.

### 3. **Orders List - Payment Status Column**

Add a column showing payment status badge for each order:
- 🟢 **Paid** - Green
- 🟡 **Partial Payment** - Yellow/Orange
- 🔴 **Unpaid** - Red

---

## Implementation Steps

1. **Order Details Page**
   - Fetch payment data on mount: `GET /payments/:orderId`
   - Display summary cards with totals and status
   - Show payment history table
   - Add "Record Payment" button that opens modal

2. **Record Payment Modal**
   - Form with amount, method, reference, notes
   - POST to `/payments/:orderId`
   - Refresh payment list on success
   - Show toast notification

3. **Sales Orders Page**
   - Add filter dropdown showing payment status options
   - When selected, fetch with query param: `?paymentStatus=unpaid`
   - Display payment status badge for each order

4. **Styling**
   - Use Tailwind classes for cards:
     - Order Total: `bg-surface-50 border border-surface-200`
     - Amount Collected: `bg-green-50 border border-green-200 text-green-700`
     - Balance Due: `bg-orange-50 border border-orange-200 text-orange-700`

---

## API Response Examples

### Payment Status Calculation
```
if (balanceDue <= 0) → "Paid"
else if (amountCollected > 0) → "Partial Payment"
else → "Unpaid"
```

### Filter Query Examples
```
/admin/orders?paymentStatus=unpaid
/admin/orders?paymentStatus=partial%20payment
/admin/orders?paymentStatus=paid
/admin/orders?status=pending&paymentStatus=unpaid
```

---

## Database Sync Required

Before using the payment features, run this SQL on your Hostinger MySQL database:

```sql
-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id CHAR(36) NOT NULL,
  order_id CHAR(36) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(100),
  reference_number VARCHAR(255),
  notes TEXT,
  recorded_by CHAR(36),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL,
  KEY idx_payments_order (order_id),
  KEY idx_payments_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```
