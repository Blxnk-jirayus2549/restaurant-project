-- ============================================================
--  schema.sql — ระบบร้านอาหาร (นิสิตออกแบบและเขียนเอง)
--  กติกา: 1 ออเดอร์มีหลายเมนู (M:N: order × menu_item ผ่าน order_item),
--          เมนูชุด combo = M:N (menu_item × menu_item)
--  ต้องมี: PK ทุกตาราง, FK ครบ, ชื่อตรงกับ db.py, sample data
-- ============================================================

DROP TABLE IF EXISTS combo;
DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS food_order;
DROP TABLE IF EXISTS dining_table;
DROP TABLE IF EXISTS menu_item;
DROP TABLE IF EXISTS customer;

-- 1. ตารางลูกค้า (customer)
CREATE TABLE customer (
    cust_id         INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    phone           VARCHAR(20),
    member_tier     VARCHAR(20) DEFAULT 'regular'
);

-- 2. ตารางเมนูอาหาร (menu_item)
CREATE TABLE menu_item (
    item_id         INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    category        VARCHAR(50),
    price           DECIMAL(10,2) NOT NULL,
    is_available    BOOLEAN NOT NULL DEFAULT TRUE
);

-- 3. ตารางโต๊ะอาหาร (dining_table)
CREATE TABLE dining_table (
    table_id        INT AUTO_INCREMENT PRIMARY KEY,
    seats           INT NOT NULL,
    zone            VARCHAR(20) NOT NULL
);

-- 4. ตารางออเดอร์ (food_order)
-- ★ ไม่ต้องมีคอลัมน์ยอดรวม — คำนวณจาก order_item × menu_item (ดู search_orders ใน db.py)
CREATE TABLE food_order (
    order_id        INT AUTO_INCREMENT PRIMARY KEY,
    cust_id         INT,
    table_id        INT NOT NULL,
    order_time      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status          ENUM('open', 'paid') NOT NULL DEFAULT 'open',
    FOREIGN KEY (cust_id) REFERENCES customer(cust_id) ON DELETE SET NULL,
    FOREIGN KEY (table_id) REFERENCES dining_table(table_id)
);

-- 5. ตาราง รายการในออเดอร์ (order_item) — M:N: food_order × menu_item
CREATE TABLE order_item (
    order_id        INT NOT NULL,
    item_id         INT NOT NULL,
    qty             INT NOT NULL DEFAULT 1,
    note            VARCHAR(255),
    PRIMARY KEY (order_id, item_id),
    FOREIGN KEY (order_id) REFERENCES food_order(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES menu_item(item_id)
);

-- 6. ตารางชุดคอมโบ (combo) — M:N: menu_item × menu_item
CREATE TABLE combo (
    combo_id        INT AUTO_INCREMENT PRIMARY KEY,
    item_id         INT NOT NULL,
    sub_item_id     INT NOT NULL,
    amount          INT NOT NULL DEFAULT 1,
    FOREIGN KEY (item_id) REFERENCES menu_item(item_id) ON DELETE CASCADE,
    FOREIGN KEY (sub_item_id) REFERENCES menu_item(item_id) ON DELETE CASCADE
);

-- ============================================================
-- INSERT ข้อมูลตัวอย่างทุกตาราง (Sample Data)
-- ============================================================

-- 1. ข้อมูลลูกค้า
INSERT INTO customer (name, phone, member_tier) VALUES
('John Doe', '0812345678', 'vip'),
('Jane Smith', '0898765432', 'regular'),
('Bob Brown', '0823334444', 'vip'),
('Alice Johnson', '0855555555', 'regular');

-- 2. ข้อมูลเมนูอาหาร (มีทั้งเมนูปกติและเมนูที่เป็นชุด combo)
INSERT INTO menu_item (name, category, price, is_available) VALUES
('Burger Set Combo', 'Combo', 130.00, TRUE),  -- item_id = 1
('Burger', 'Main Course', 80.00, TRUE),      -- item_id = 2
('Potato Chips', 'Appetizer', 60.00, TRUE),    -- item_id = 3
('Pepsi', 'Beverage', 20.00, TRUE),           -- item_id = 4
('Pizza', 'Main Course', 120.00, TRUE),       -- item_id = 5
('Salad', 'Appetizer', 60.00, TRUE);         -- item_id = 6

-- 3. ข้อมูลโต๊ะอาหาร
INSERT INTO dining_table (seats, zone) VALUES
(4, 'A'), -- table_id = 1
(2, 'B'), -- table_id = 2
(6, 'C'); -- table_id = 3

-- 4. ข้อมูลออเดอร์
-- ★ มีสถานะ 'open' ที่โต๊ะ 1 (table_id = 1) ไว้ทดสอบ "เปิดออเดอร์ซ้ำโต๊ะเดิมไม่ได้"
INSERT INTO food_order (cust_id, table_id, order_time, status) VALUES
(1, 1, '2026-10-09 12:00:00', 'open'),  -- โต๊ะ 1: สถานะ open (ไว้ทดสอบระบบล็อกโต๊ะ)
(2, 2, '2026-10-09 12:30:00', 'paid'),  -- โต๊ะ 2: สถานะ paid
(3, 3, '2026-10-09 13:00:00', 'open');  -- โต๊ะ 3: สถานะ open

-- 5. ข้อมูลรายการในออเดอร์ (order_item)
INSERT INTO order_item (order_id, item_id, qty, note) VALUES
(1, 2, 2, 'No onions'),          -- ออเดอร์ 1 สั่ง Burger 2 ชิ้น
(1, 3, 1, 'Extra cheese'),       -- ออเดอร์ 1 สั่ง Potato Chips 1 จาน
(2, 6, 1, 'Dressing on the side'), -- ออเดอร์ 2 สั่ง Salad 1 จาน
(2, 4, 1, 'Less ice');           -- ออเดอร์ 2 สั่ง Pepsi 1 แก้ว

-- 6. ข้อมูลชุดคอมโบ (combo)
-- เช่น Burger Set Combo (item_id = 1) ประกอบด้วย Burger (item_id = 2) 1 ชิ้น, Potato Chips (item_id = 3) 1 จาน, Pepsi (item_id = 4) 1 แก้ว
INSERT INTO combo (item_id, sub_item_id, amount) VALUES
(1, 2, 1),
(1, 3, 1),
(1, 4, 1);