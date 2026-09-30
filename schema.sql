-- ============================================================
--  schema.sql — ระบบร้านอาหาร
-- ============================================================

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
CREATE TABLE food_order (
    order_id        INT AUTO_INCREMENT PRIMARY KEY,
    cust_id         INT,                
    table_id        INT NOT NULL,
    order_time      DATETIME NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',
    FOREIGN KEY (cust_id) REFERENCES customer(cust_id) ON DELETE SET NULL,
    FOREIGN KEY (table_id) REFERENCES dining_table(table_id)
);

-- 5. ตาราง รายการในออเดอร์ (order_item) - M:N (food_order × menu_item)
CREATE TABLE order_item (
    order_id        INT NOT NULL,
    item_id         INT NOT NULL,
    qty             INT NOT NULL DEFAULT 1,
    note            VARCHAR(255),
    PRIMARY KEY (order_id, item_id),
    FOREIGN KEY (order_id) REFERENCES food_order(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES menu_item(item_id)
);

-- 6. ตารางชุดคอมโบ (combo) - M:N (menu_item × menu_item)
CREATE TABLE combo (
    combo_id        INT AUTO_INCREMENT PRIMARY KEY,
    item_id         INT NOT NULL,
    sub_item_id     INT NOT NULL,
    amount          INT NOT NULL DEFAULT 1,
    FOREIGN KEY (item_id) REFERENCES menu_item(item_id) ON DELETE CASCADE,
    FOREIGN KEY (sub_item_id) REFERENCES menu_item(item_id) ON DELETE CASCADE
);

-- ============================================================
-- insert Data (ข้อมูล)
-- ============================================================

INSERT INTO customer (name, phone, member_tier) VALUES
('John Doe', '1234567890', 'vip'),
('Jane Smith', '0987654321', 'regular'),
('Alice Johnson', '5555555555', 'regular');

INSERT INTO menu_item (name, category, price, is_available) VALUES
('Burger', 'Main Course', 5.99, TRUE),
('Pizza', 'Main Course', 8.99, TRUE),
('Salad', 'Appetizer', 4.99, TRUE);

INSERT INTO dining_table (seats, zone) VALUES
(4, 'A'),
(2, 'B'),
(6, 'C');

INSERT INTO food_order (cust_id, table_id, order_time, status) VALUES
(1, 1, '2024-06-01 12:00:00', 'pending'),
(2, 2, '2024-06-01 12:30:00', 'completed'),
(3, 3, '2024-06-01 13:00:00', 'in_progress');

INSERT INTO order_item (order_id, item_id, qty, note) VALUES
(1, 1, 2, 'No onions'),
(1, 2, 1, 'Extra cheese'),
(2, 3, 1, 'Dressing on the side');

INSERT INTO combo (item_id, sub_item_id, amount) VALUES
(1, 2, 1),
(2, 3, 2);