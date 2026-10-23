# ============================================================
#  db.py — ชั้นติดต่อฐานข้อมูล  ★★★ นิสิตเขียน SQL ในไฟล์นี้ ★★★
#  มองหาคำว่า  # TODO  ทุกฟังก์ชัน — ใช้ %s เป็น placeholder เสมอ (กัน SQL injection)
# ============================================================
import mysql.connector
import config


def get_connection():
    return mysql.connector.connect(
        host=config.DB_HOST, user=config.DB_USER, password=config.DB_PASSWORD,
        database=config.DB_NAME, port=config.DB_PORT)


def run_query(sql, params=None):
    """รัน SELECT คืนผลเป็น list ของ dict"""
    conn = get_connection(); cur = conn.cursor(dictionary=True)
    cur.execute(sql, params or ()); rows = cur.fetchall()
    cur.close(); conn.close(); return rows


def run_command(sql, params=None):
    """รัน INSERT / UPDATE / DELETE แล้ว commit"""
    conn = get_connection(); cur = conn.cursor()
    cur.execute(sql, params or ()); conn.commit()
    out = {"new_id": cur.lastrowid, "affected": cur.rowcount}
    cur.close(); conn.close(); return out


def blank_to_none(value):
    """ช่องที่ไม่ได้กรอกในฟอร์มจะส่งมาเป็น "" — แปลงเป็น None (= NULL ใน SQL)
    ใช้กับคอลัมน์ที่ว่างได้ เช่น return_date, paid_date  เพราะ MySQL ไม่รับ '' เป็น DATE"""
    return None if value in ("", None) else value


def _todo(name):
    raise NotImplementedError(f"TODO: ยังไม่ได้เขียนฟังก์ชัน {name} ใน db.py")


# ---------- ลูกค้า (customer) ----------
def search_customers(filters):
    sql = "SELECT * FROM customer WHERE 1=1"
    params = []
    if filters.get("name"):
        sql += " AND name LIKE %s"
        params.append("%" + filters["name"] + "%")
    if filters.get("phone"):
        sql += " AND phone LIKE %s"
        params.append("%" + filters["phone"] + "%")
    if filters.get("member_tier"):
        sql += " AND member_tier = %s"
        params.append(filters["member_tier"])
    sql += " ORDER BY cust_id"
    return run_query(sql, params)
    
    


def get_customer(cust_id):
    sql = "SELECT * FROM customer WHERE cust_id = %s"
    rows = run_query(sql, (cust_id,))
    return rows[0] if rows else None



def create_customer(data):
    return run_command("INSERT INTO customer (name, phone, member_tier) VALUES (%s, %s, %s)",
                           (data["name"], data["phone"], data["member_tier"]))



def update_customer(cust_id, data):
    return run_command(
                            "UPDATE customer SET name=%s,"
                            "phone=%s, member_tier=%s WHERE cust_id=%s",
                            (data["name"], data["phone"], data["member_tier"], cust_id))



def delete_customer(cust_id):
    return run_command("DELETE FROM customer WHERE cust_id=%s",(cust_id,))


# ---------- เมนูอาหาร (menu_item) ----------
def search_items(filters):
    sql = """
        SELECT 
            item_id,
            name,
            category,
            price,
            CASE 
                WHEN is_available = 1 THEN 'มี'
                ELSE 'หมด'
            END AS is_available
        FROM menu_item
        WHERE 1=1
    """
    params = []
    if filters.get("name"):
        sql += " AND name LIKE %s"
        params.append(f"%{filters['name']}%")
    if filters.get("category"):
        sql += " AND category = %s"
        params.append(filters["category"])
        
    sql += " ORDER BY item_id ASC"
    return run_query(sql, params)



def get_item(item_id):
    sql = "SELECT * FROM menu_item WHERE item_id = %s"
    rows = run_query(sql, (item_id,))
    return rows[0] if rows else None



def create_item(data):
    sql = "INSERT INTO menu_item (name, category, price, is_available) VALUES (%s, %s, %s, %s)"
    is_avail = int(data.get("is_available", 1))
    params = (data["name"], data["category"], data["price"], is_avail)
    return run_command(sql, params)



def update_item(item_id, data):
    sql = ("UPDATE menu_item SET name=%s, category=%s, price=%s, is_available=%s "
           "WHERE item_id=%s")
    is_avail = int(data.get("is_available", 1))
    params = (data["name"], data["category"], data["price"], is_avail, item_id)
    return run_command(sql, params)


def delete_item(item_id):
    return run_command("DELETE FROM menu_item WHERE item_id=%s", (item_id,))



# ---------- ออเดอร์ (food_order) ----------
# ---------- ออเดอร์ (food_order) ----------

def search_orders(filters):
    sql = ("SELECT "
           "    o.order_id, "
           "    o.cust_id, "
           "    c.name AS customer_name, "
           "    o.table_id, "
           "    o.order_time, "
           "    o.status, "
           "    IFNULL(totals.total, 0) AS total "
           "FROM food_order o "
           "LEFT JOIN customer c ON o.cust_id = c.cust_id "
           "LEFT JOIN ("
           "    SELECT oi.order_id, SUM(oi.qty * m.price) AS total "
           "    FROM order_item oi "
           "    JOIN menu_item m ON oi.item_id = m.item_id "
           "    GROUP BY oi.order_id"
           ") totals ON o.order_id = totals.order_id "
           "WHERE 1=1")
    params = []
    if filters.get("cust_id"):
        sql += " AND o.cust_id = %s"
        params.append(filters["cust_id"])
    if filters.get("table_id"):
        sql += " AND o.table_id = %s"
        params.append(filters["table_id"])
    if filters.get("status"):
        sql += " AND o.status = %s"
        params.append(filters["status"])
    sql += " ORDER BY o.order_id"
    return run_query(sql, params)


def get_order(order_id):
    sql = "SELECT * FROM food_order WHERE order_id = %s"
    rows = run_query(sql, (order_id,))
    return rows[0] if rows else None


def check_table_free(table_id, order_id=None, order_time=None):
    table = run_query("SELECT * FROM dining_table WHERE table_id = %s", (table_id,))
    if not table:
        raise ValueError(f"ไม่พบโต๊ะหมายเลข {table_id}")

    target_order_id = order_id or 0
    
    if order_time:
        sql = ("SELECT COUNT(*) AS n FROM food_order "
               "WHERE table_id = %s AND status = 'open' AND order_id <> %s AND order_time = %s")
        result = run_query(sql, (table_id, target_order_id, order_time))
    else:
        sql = ("SELECT COUNT(*) AS n FROM food_order "
               "WHERE table_id = %s AND status = 'open' AND order_id <> %s")
        result = run_query(sql, (table_id, target_order_id))
    
    if result and result[0]["n"] > 0:
        raise ValueError(f"โต๊ะ {table_id} มีออเดอร์ที่ยังไม่ชำระเงินในช่วงเวลานี้แล้ว")
    return True


def create_order(data):
    if data.get("status") == "open":
        check_table_free(data["table_id"], order_time=blank_to_none(data.get("order_time")))
        
    sql = ("INSERT INTO food_order (cust_id, table_id, order_time, status) "
           "VALUES (%s, %s, %s, %s)")
    params = (
        blank_to_none(data.get("cust_id")),
        data["table_id"],
        blank_to_none(data.get("order_time")),
        data["status"]
    )
    res = run_command(sql, params)
    order_id = res["new_id"]

    # 🟢 บันทึกรายการอาหารที่ 1
    if data.get("item_id") and data.get("qty"):
        sql_item = ("INSERT INTO order_item (order_id, item_id, qty) VALUES (%s, %s, %s) "
                    "ON DUPLICATE KEY UPDATE qty = VALUES(qty)")
        run_command(sql_item, (order_id, data["item_id"], data["qty"]))

    # 🟢 บันทึกรายการอาหารที่ 2 (ถ้าเลือกมา)
    if data.get("item_id2") and data.get("qty2"):
        sql_item = ("INSERT INTO order_item (order_id, item_id, qty) VALUES (%s, %s, %s) "
                    "ON DUPLICATE KEY UPDATE qty = VALUES(qty)")
        run_command(sql_item, (order_id, data["item_id2"], data["qty2"]))

    return res


def update_order(order_id, data):
    if data.get("status") == "open":
        check_table_free(data["table_id"], order_id=order_id, order_time=blank_to_none(data.get("order_time")))
        
    sql = ("UPDATE food_order SET cust_id=%s, table_id=%s, order_time=%s, status=%s "
           "WHERE order_id=%s")
    params = (
        blank_to_none(data.get("cust_id")),
        data["table_id"],
        blank_to_none(data.get("order_time")),
        data["status"],
        order_id
    )
    res = run_command(sql, params)

    # 🟢 1. ล้างรายการอาหารเก่าทั้งหมดของออเดอร์นี้ออกก่อน เพื่อไม่ให้รายการเก่าค้าง
    run_command("DELETE FROM order_item WHERE order_id = %s", (order_id,))

    # 🟢 2. บันทึกเฉพาะรายการใหม่ที่เลือกเข้ามาล่าสุด
    if data.get("item_id") and data.get("qty"):
        sql_item = "INSERT INTO order_item (order_id, item_id, qty) VALUES (%s, %s, %s)"
        run_command(sql_item, (order_id, data["item_id"], data["qty"]))

    # 🟢 3. บันทึกรายการที่ 2 (ถ้ามีการเลือกมา)
    if data.get("item_id2") and data.get("qty2"):
        sql_item = "INSERT INTO order_item (order_id, item_id, qty) VALUES (%s, %s, %s)"
        run_command(sql_item, (order_id, data["item_id2"], data["qty2"]))

    return res


def delete_order(order_id):
    return run_command("DELETE FROM food_order WHERE order_id=%s", (order_id,))


# ---- รายการออเดอร์ (order_item) ----
def search_order_items(filters):
    sql = """
        SELECT 
            oi.order_id,
            COALESCE(c.name, 'ไม่ระบุชื่อ') AS cust_name,
            m.name AS item_name,
            oi.qty,
            m.price,
            (oi.qty * m.price) AS subtotal
        FROM order_item oi
        INNER JOIN food_order fo ON oi.order_id = fo.order_id
        INNER JOIN menu_item m ON oi.item_id = m.item_id
        LEFT JOIN customer c ON fo.cust_id = c.cust_id
        WHERE 1=1
    """
    params = []

    # ค้นหาตามชื่อลูกค้า
    if filters.get("cust_name"):
        sql += " AND c.name LIKE %s"
        params.append(f"%{filters['cust_name']}%")

    # ค้นหาตามรหัสออเดอร์
    if filters.get("order_id"):
        sql += " AND oi.order_id = %s"
        params.append(filters["order_id"])

    sql += " ORDER BY oi.order_id asc, oi.item_id asc"
    return run_query(sql, params)

# ---------- ชุดคอมโบ (combo) ----------

def search_combos(filters):
    sql = ("SELECT c.combo_id, c.item_id, m1.name AS combo_name, "
           "c.sub_item_id, m2.name AS sub_item_name, "
           "m2.price AS sub_price, c.amount, "
           "(m2.price * c.amount) AS sub_total "
           "FROM combo c "
           "JOIN menu_item m1 ON c.item_id = m1.item_id "
           "JOIN menu_item m2 ON c.sub_item_id = m2.item_id "
           "WHERE 1=1")
    params = []
    if filters.get("item_id"):
        sql += " AND c.item_id = %s"
        params.append(filters["item_id"])
    sql += " ORDER BY c.item_id ASC, c.combo_id ASC"
    return run_query(sql, params)


# 🟢 แก้ไข: ดึงข้อมูลยกเซ็ต (เมนูย่อยที่ 1 และ 2) มาใส่ Modal พร้อมกัน
# 🟢 1. แก้ไข get_combo_by_id: ดึงเมนูย่อยที่ 3 ไปแสดงใน Modal
def get_combo_by_id(combo_id):
    find_sql = "SELECT item_id FROM combo WHERE combo_id = %s"
    res = run_query(find_sql, (combo_id,))
    if not res:
        return {}
    
    item_id = res[0]["item_id"]
    
    sql = ("SELECT c.combo_id, c.item_id, m1.name AS combo_name, "
           "c.sub_item_id, c.amount "
           "FROM combo c "
           "JOIN menu_item m1 ON c.item_id = m1.item_id "
           "WHERE c.item_id = %s "
           "ORDER BY c.combo_id ASC")
    items = run_query(sql, (item_id,))
    
    if not items:
        return {}

    return {
        "combo_id": combo_id,
        "item_id": item_id,
        "combo_name": items[0]["combo_name"],
        "sub_item_id": items[0]["sub_item_id"] if len(items) > 0 else "",
        "amount": items[0]["amount"] if len(items) > 0 else 1,
        "sub_item_id2": items[1]["sub_item_id"] if len(items) > 1 else "",
        "amount2": items[1]["amount"] if len(items) > 1 else 1,
        # 🟢 เพิ่มรายการที่ 3
        "sub_item_id3": items[2]["sub_item_id"] if len(items) > 2 else "",
        "amount3": items[2]["amount"] if len(items) > 2 else 1
    }


# 🟢 2. แก้ไข create_combo: บันทึกรายการย่อยที่ 3 ลงฐานข้อมูล
def create_combo(data):
    combo_name = data.get("combo_name") or data.get("name")
    
    check_sql = "SELECT item_id FROM menu_item WHERE name = %s"
    existing = run_query(check_sql, (combo_name,))
    
    if existing:
        item_id = existing[0]["item_id"]
    else:
        insert_menu = "INSERT INTO menu_item (name, category, price, is_available) VALUES (%s, 'Combo', 0.00, TRUE)"
        res_menu = run_command(insert_menu, (combo_name,))
        item_id = res_menu["new_id"]

    if data.get("sub_item_id"):
        sub1 = data["sub_item_id"]
        amt1 = int(data.get("amount") or 1)
        run_command("INSERT INTO combo (item_id, sub_item_id, amount) VALUES (%s, %s, %s)", (item_id, sub1, amt1))

    if data.get("sub_item_id2"):
        sub2 = data["sub_item_id2"]
        amt2 = int(data.get("amount2") or 1)
        run_command("INSERT INTO combo (item_id, sub_item_id, amount) VALUES (%s, %s, %s)", (item_id, sub2, amt2))

    # 🟢 เพิ่มการบันทึกรายการย่อยที่ 3
    if data.get("sub_item_id3"):
        sub3 = data["sub_item_id3"]
        amt3 = int(data.get("amount3") or 1)
        run_command("INSERT INTO combo (item_id, sub_item_id, amount) VALUES (%s, %s, %s)", (item_id, sub3, amt3))

    # คำนวณราคารวม (SQL SUM จะคำนวณรวมทั้ง 3 รายการให้อัตโนมัติ)
    calc_sql = """
        SELECT SUM(m.price * c.amount) AS original_total
        FROM combo c
        JOIN menu_item m ON c.sub_item_id = m.item_id
        WHERE c.item_id = %s
    """
    total_res = run_query(calc_sql, (item_id,))
    original_total = total_res[0]["original_total"] if total_res and total_res[0]["original_total"] else 0

    discount_rate = 0.85
    combo_price = round(float(original_total) * discount_rate, 2)

    update_price_sql = "UPDATE menu_item SET price = %s WHERE item_id = %s"
    run_command(update_price_sql, (combo_price, item_id))

    return {"status": "success", "combo_price": combo_price}


# 🟢 3. แก้ไข update_combo: อัปเดตรายการย่อยที่ 3
def update_combo(combo_id, data):
    combo_name = data.get("combo_name") or data.get("name")
    
    find_sql = "SELECT item_id FROM combo WHERE combo_id = %s"
    res = run_query(find_sql, (combo_id,))
    if not res:
        return {"error": "ไม่พบรายการที่ต้องการแก้ไข"}
        
    item_id = res[0]["item_id"]

    if combo_name:
        run_command("UPDATE menu_item SET name = %s WHERE item_id = %s", (combo_name, item_id))

    run_command("DELETE FROM combo WHERE item_id = %s", (item_id,))

    if data.get("sub_item_id"):
        sub1 = data["sub_item_id"]
        amt1 = int(data.get("amount") or 1)
        run_command("INSERT INTO combo (item_id, sub_item_id, amount) VALUES (%s, %s, %s)", (item_id, sub1, amt1))

    if data.get("sub_item_id2"):
        sub2 = data["sub_item_id2"]
        amt2 = int(data.get("amount2") or 1)
        run_command("INSERT INTO combo (item_id, sub_item_id, amount) VALUES (%s, %s, %s)", (item_id, sub2, amt2))

    # 🟢 เพิ่มการบันทึกรายการย่อยที่ 3 ตอนแก้ไข
    if data.get("sub_item_id3"):
        sub3 = data["sub_item_id3"]
        amt3 = int(data.get("amount3") or 1)
        run_command("INSERT INTO combo (item_id, sub_item_id, amount) VALUES (%s, %s, %s)", (item_id, sub3, amt3))

    calc_sql = """
        SELECT SUM(m.price * c.amount) AS original_total
        FROM combo c
        JOIN menu_item m ON c.sub_item_id = m.item_id
        WHERE c.item_id = %s
    """
    total_res = run_query(calc_sql, (item_id,))
    original_total = total_res[0]["original_total"] if total_res and total_res[0]["original_total"] else 0

    discount_rate = 0.85
    combo_price = round(float(original_total) * discount_rate, 2)

    run_command("UPDATE menu_item SET price = %s WHERE item_id = %s", (combo_price, item_id))

    return {"status": "success", "combo_price": combo_price}

def delete_combo(combo_id):
    find_sql = "SELECT item_id FROM combo WHERE combo_id = %s"
    res = run_query(find_sql, (combo_id,))
    if res:
        item_id = res[0]["item_id"]
        run_command("DELETE FROM combo WHERE item_id = %s", (item_id,))
        run_command("DELETE FROM menu_item WHERE item_id = %s", (item_id,))
        return {"status": "success"}
    return {"status": "error"}


# // ---------- รีวิว (review) ----------

def search_reviews(filters):
    sql = """
        SELECT r.review_id, 
               r.cust_id, 
               COALESCE(c.name, 'ไม่ระบุชื่อ') AS cust_name,
               r.order_id, 
               r.item_id, 
               COALESCE(m.name, 'ไม่ระบุเมนู') AS item_name,
               r.rating, 
               r.comment, 
               r.created_at
        FROM review r
        LEFT JOIN customer c ON r.cust_id = c.cust_id
        LEFT JOIN menu_item m ON r.item_id = m.item_id
        WHERE 1=1
    """
    params = []

    if filters.get("name"):
        sql += " AND c.name LIKE %s"
        params.append(f"%{filters['name']}%")

    if filters.get("phone"):
        sql += " AND c.phone LIKE %s"
        params.append(f"%{filters['phone']}%")

    if filters.get("order_id"):
        sql += " AND r.order_id = %s"
        params.append(filters["order_id"])

    if filters.get("cust_id"):
        sql += " AND r.cust_id = %s"
        params.append(filters["cust_id"])

    if filters.get("item_id"):
        sql += " AND r.item_id = %s"
        params.append(filters["item_id"])

    sql += " ORDER BY r.review_id ASC"
    return run_query(sql, params)

def get_review(review_id):
    sql = "SELECT * FROM review WHERE review_id = %s"
    rows = run_query(sql, (review_id,))
    return rows[0] if rows else None


def create_review(data):
    sql = (
        "INSERT INTO review (cust_id, order_id, item_id, rating, comment) "
        "VALUES (%s, %s, %s, %s, %s)"
    )
    # 🟢 แปลงค่าว่าง "" หรือ 0 ให้กลายเป็น None (NULL ใน SQL)
    def clean_val(val):
        return int(val) if val and str(val).strip() != "" else None

    cust_id = clean_val(data.get("cust_id"))
    order_id = clean_val(data.get("order_id"))
    item_id = clean_val(data.get("item_id"))
    rating = int(data.get("rating")) if data.get("rating") else None
    comment = data.get("comment") or None

    params = (cust_id, order_id, item_id, rating, comment)
    return run_command(sql, params)

def update_review(review_id, data):
    fields = []
    params = []

    def clean_val(val):
        return int(val) if val and str(val).strip() != "" else None

    for key in ["cust_id", "order_id", "item_id", "rating", "comment"]:
        if key in data:
            fields.append(f"{key} = %s")
            if key in ["cust_id", "order_id", "item_id"]:
                params.append(clean_val(data[key]))
            elif key == "rating":
                params.append(int(data[key]) if data[key] else None)
            else:
                params.append(data[key] or None)

    if not fields:
        return False

    sql = f"UPDATE review SET {', '.join(fields)} WHERE review_id = %s"
    params.append(review_id)

    return run_command(sql, tuple(params))

def delete_review(review_id):
    return run_command("DELETE FROM review WHERE review_id = %s", (review_id,))


# ============================================================
#  REPORT (รายงาน — ใช้ JOIN + GROUP BY + subquery)
# ============================================================
def report_summary():
    """ตัวเลขสรุปบนการ์ด dashboard — คืน dict {ชื่อการ์ด: ตัวเลข}"""
    sql = """
        SELECT 
            -- 🔹 [การ์ดหลักตามโจทย์กำหนด]
            (SELECT COUNT(*) FROM customer) AS 'ลูกค้า',
            (SELECT COUNT(*) FROM menu_item) AS 'เมนู',
            (SELECT COUNT(*) FROM food_order) AS 'ออเดอร์',
            (SELECT IFNULL(SUM(oi.qty * m.price), 0) 
             FROM order_item oi 
             JOIN menu_item m ON oi.item_id = m.item_id) AS 'ยอดขายรวม',
            
            -- 🟢 [คิดเพิ่มเอง 1]: คำนวณคะแนนรีวิวเฉลี่ยจากตาราง review
            (SELECT IFNULL(ROUND(AVG(rating), 2), 0) FROM review) AS 'คะแนนรีวิวเฉลี่ย',
            
            -- 🟢 [คิดเพิ่มเอง 2]: นับจำนวนรีวิวทั้งหมดจากตาราง review
            (SELECT COUNT(*) FROM review) AS 'จำนวนรีวิวทั้งหมด'
    """
    res = run_query(sql)
    return res[0] if res else {}


def report_popular_items():
    """📈 เมนูขายดี (Best Sellers)"""
    sql = """
        SELECT 
            m.item_id AS 'รหัสเมนู',
            m.name AS 'ชื่อเมนู',
            m.category AS 'หมวดหมู่',
            SUM(oi.qty) AS 'จำนวนที่ขายได้ (ชิ้น)',
            SUM(oi.qty * m.price) AS 'ยอดขายรวม (บาท)'
        FROM order_item oi
        INNER JOIN menu_item m ON oi.item_id = m.item_id
        GROUP BY m.item_id, m.name, m.category
        ORDER BY SUM(oi.qty) DESC
        LIMIT 5
    """
    return run_query(sql)


def report_daily_sales():
    """💰 ยอดขายรวมต่อวัน (Daily Sales)"""
    # 🟢 เปลี่ยน fo.order_date เป็น fo.order_time
    sql = """
        SELECT 
            DATE(fo.order_time) AS 'วันที่',
            COUNT(DISTINCT fo.order_id) AS 'จำนวนออเดอร์',
            m.name AS 'ชื่อเมนู',
            SUM(oi.qty) AS 'จำนวนรายการอาหารที่ขาย',
            SUM(oi.qty * m.price) AS 'ยอดขายรวม (บาท)'
        FROM food_order fo
        INNER JOIN order_item oi ON fo.order_id = oi.order_id
        INNER JOIN menu_item m ON oi.item_id = m.item_id
        GROUP BY DATE(fo.order_time), m.name
        ORDER BY DATE(fo.order_time) DESC
    """
    return run_query(sql)


def report_big_orders():
    """🧾 ออเดอร์ยอดเกิน 500 บาท (HAVING)"""
    # 🟢 เปลี่ยน fo.order_date เป็น fo.order_time
    sql = """
        SELECT 
            fo.order_id AS 'รหัสออเดอร์',
            COALESCE(c.name, 'ไม่ระบุชื่อ') AS 'ชื่อลูกค้า',
            m.name AS 'ชื่อเมนู',
            fo.order_time AS 'วัน-เวลาสั่งซื้อ',
            SUM(oi.qty * m.price) AS 'ราคารวม (บาท)'
        FROM food_order fo
        INNER JOIN order_item oi ON fo.order_id = oi.order_id
        INNER JOIN menu_item m ON oi.item_id = m.item_id
        LEFT JOIN customer c ON fo.cust_id = c.cust_id
        GROUP BY fo.order_id, c.name, fo.order_time, m.name
        HAVING SUM(oi.qty * m.price) > 500
        ORDER BY SUM(oi.qty * m.price) DESC
    """
    return run_query(sql)


REPORTS = [
    ("popular-items", "📈 เมนูขายดี (Best Sellers)",        report_popular_items),
    ("daily-sales",   "💰 ยอดขายรวมต่อวัน (Daily Sales)",   report_daily_sales),
    ("big-orders",    "🧾 ออเดอร์ยอดเกิน 500 บาท (HAVING)", report_big_orders),
]

