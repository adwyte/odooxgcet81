# odooxgcet81
Odoo x GCET 2026 - Group 81

Core User & Auth Tables
1️⃣ users

All roles live in one table.

users
-----
id (uuid, pk)
name
email (unique)
password_hash
role ENUM('ADMIN','VENDOR','CUSTOMER')
company_name
gstin
is_active
created_at
updated_at


💡 Notes:

GSTIN mandatory for vendors/customers (as per invoicing rules)

Admin may have NULL company_name & gstin

2️⃣ user_addresses

Customers can have multiple delivery/pickup addresses.

user_addresses
--------------
id (uuid, pk)
user_id (fk -> users.id)
address_line1
address_line2
city
state
pincode
country
is_default

📦 Step 2: Product & Inventory Modeling

This is critical for rental systems.

3️⃣ products
products
--------
id (uuid, pk)
vendor_id (fk -> users.id)
name
description
is_rentable (boolean)
quantity_on_hand
cost_price
is_published
created_at
updated_at

4️⃣ product_pricing

Supports hourly / daily / weekly / custom pricing.

product_pricing
---------------
id (uuid, pk)
product_id (fk)
pricing_type ENUM('HOUR','DAY','WEEK','CUSTOM')
price

5️⃣ product_attributes
product_attributes
------------------
id (uuid, pk)
name   -- Brand, Color, Size

6️⃣ product_attribute_values
product_attribute_values
------------------------
id (uuid, pk)
attribute_id (fk)
value

7️⃣ product_variants

Variant-based pricing & inventory.

product_variants
----------------
id (uuid, pk)
product_id (fk)
sku
quantity
additional_price

8️⃣ variant_attribute_map
variant_attribute_map
---------------------
variant_id (fk)
attribute_value_id (fk)

🧾 Step 3: Quotation → Order Lifecycle (MOST IMPORTANT)
9️⃣ quotations
quotations
----------
id (uuid, pk)
customer_id (fk -> users)
status ENUM('DRAFT','SENT','CONFIRMED')
valid_until
total_amount
created_at

🔟 quotation_lines
quotation_lines
---------------
id (uuid, pk)
quotation_id (fk)
product_id (fk)
variant_id (fk, nullable)
rental_start
rental_end
quantity
price


💡 Editable until confirmed.

1️⃣1️⃣ rental_orders
rental_orders
-------------
id (uuid, pk)
quotation_id (fk)
customer_id (fk)
vendor_id (fk)
status ENUM('CONFIRMED','ACTIVE','COMPLETED','CANCELLED')
rental_start
rental_end
created_at

1️⃣2️⃣ rental_order_lines
rental_order_lines
------------------
id (uuid, pk)
order_id (fk)
product_id (fk)
variant_id (fk)
quantity
rental_start
rental_end
price

⛔ Step 4: Reservation Logic (Prevents Overbooking)

This is non-negotiable in a rental system.

1️⃣3️⃣ reservations
reservations
------------
id (uuid, pk)
product_id (fk)
variant_id (fk)
order_id (fk)
reserved_from
reserved_to
quantity
status ENUM('ACTIVE','RELEASED')


🔒 Logic:

Before confirming order → check overlapping reservations

(reserved_from, reserved_to) must not overlap

🚚 Step 5: Pickup & Return Tracking
1️⃣4️⃣ pickups
pickups
-------
id (uuid, pk)
order_id (fk)
scheduled_date
actual_date
status ENUM('PENDING','COMPLETED')
instructions

1️⃣5️⃣ returns
returns
-------
id (uuid, pk)
order_id (fk)
scheduled_date
actual_date
late_fee
status ENUM('PENDING','COMPLETED','LATE')

💰 Step 6: Invoicing & Payments
1️⃣6️⃣ invoices
invoices
--------
id (uuid, pk)
order_id (fk)
invoice_number
status ENUM('DRAFT','PARTIALLY_PAID','PAID')
subtotal
tax_amount
total_amount
security_deposit
created_at

1️⃣7️⃣ payments
payments
--------
id (uuid, pk)
invoice_id (fk)
amount
payment_method
payment_status ENUM('PENDING','SUCCESS','FAILED')
transaction_ref
paid_at


✅ Supports:

Partial payment

Security deposit

Online gateway callbacks

⚙️ Step 7: Settings & Configurations
1️⃣8️⃣ rental_settings
rental_settings
---------------
id (uuid, pk)
enable_hourly
enable_daily
enable_weekly
gst_percentage
late_fee_per_day

1️⃣9️⃣ coupons
coupons
-------
id (uuid, pk)
code
discount_type ENUM('PERCENT','FLAT')
discount_value
valid_from
valid_to

📊 Step 8: Reporting Support Tables (Optional but Smart)
2️⃣0️⃣ audit_logs
audit_logs
----------
id (uuid, pk)
user_id (fk)
action
entity
entity_id
timestamp


Judges LOVE audit trails 😄

🧱 Final Table Count (Hackathon-Ready)
Category	Tables
Auth & Users	2
Products & Inventory	6
Quotations & Orders	4
Reservations	1
Pickup & Return	2
Invoices & Payments	2
Settings & Reports	3
Total	20 tables