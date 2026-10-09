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
    
    
    """ค้นหา ลูกค้า ตามเงื่อนไข (name, phone, member_tier)
    คำใบ้: เริ่มจาก sql = "SELECT * FROM customer WHERE 1=1"
    แล้วต่อเงื่อนไขเฉพาะ filter ที่มีค่า (ข้อความใช้ LIKE %s, อื่น ๆ ใช้ = %s)"""
    # TODO: เขียน SQL ค้นหาแบบยืดหยุ่นตาม filters (ใช้ %s เสมอ)
    _todo("search_customers")


def get_customer(cust_id):
    sql = "SELECT * FROM customer WHERE cust_id = %s"
    rows = run_query(sql, (cust_id,))
    return rows[0] if rows else None
    """ดึง ลูกค้า 1 รายการตาม cust_id (ใช้ตอนเปิดฟอร์มแก้ไข)"""
    # TODO: SELECT * FROM customer WHERE cust_id = %s แล้วคืนแถวเดียว
    _todo("get_customer")


def create_customer(data):
    return run_command("INSERT INTO customer (name, phone, member_tier) VALUES (%s, %s, %s)",
                           (data["name"], data["phone"], data["member_tier"]))
    """เพิ่ม ลูกค้า ใหม่ — data มีคีย์: name, phone, member_tier"""
    # TODO: INSERT INTO customer (...) VALUES (%s, ...)
    _todo("create_customer")


def update_customer(cust_id, data):
    return run_command(
                            "UPDATE customer SET name=%s,"
                            "phone=%s, member_tier=%s WHERE cust_id=%s",
                            (data["name"], data["phone"], data["member_tier"], cust_id))
    """แก้ไข ลูกค้า ตาม cust_id"""
    # TODO: UPDATE customer SET ... WHERE cust_id=%s
    _todo("update_customer")


def delete_customer(cust_id):
    return run_command("DELETE FROM customer WHERE cust_id=%s",(cust_id,))
    """ลบ ลูกค้า ตาม cust_id"""
    # TODO: DELETE FROM customer WHERE cust_id=%s
    _todo("delete_customer")

# ---------- เมนูอาหาร (menu_item) ----------
def search_items(filters):
    sql = ("SELECT m.item_id, m.name, m.category, "
               "m.price, m.is_available "
               "FROM menu_item m "
               "WHERE 1=1")
    params = []
    if filters.get("name"):
            sql += " AND m.name LIKE %s"
            params.append("%" + filters["name"] + "%")
    if filters.get("category"):
            sql += " AND m.category = %s"
            params.append(filters["category"])
    sql += " ORDER BY m.item_id"
    return run_query(sql, params)
    """ค้นหา เมนูอาหาร ตามเงื่อนไข (name, category)
    คำใบ้: เริ่มจาก sql = "SELECT * FROM menu_item WHERE 1=1"
    แล้วต่อเงื่อนไขเฉพาะ filter ที่มีค่า (ข้อความใช้ LIKE %s, อื่น ๆ ใช้ = %s)"""
    # TODO: เขียน SQL ค้นหาแบบยืดหยุ่นตาม filters (ใช้ %s เสมอ)
    _todo("search_items")


def get_item(item_id):
    sql = "SELECT * FROM menu_item WHERE item_id = %s"
    rows = run_query(sql, (item_id,))
    return rows[0] if rows else None
    """ดึง เมนูอาหาร 1 รายการตาม item_id (ใช้ตอนเปิดฟอร์มแก้ไข)"""
    # TODO: SELECT * FROM menu_item WHERE item_id = %s แล้วคืนแถวเดียว
    _todo("get_item")


def create_item(data):
    sql = "INSERT INTO menu_item (name, category, price, is_available) VALUES (%s, %s, %s, %s)"
    is_avail = int(data.get("is_available", 1))
    params = (data["name"], data["category"], data["price"], is_avail)
    return run_command(sql, params)
    """เพิ่ม เมนูอาหาร ใหม่ — data มีคีย์: name, category, price, is_available"""
    # TODO: INSERT INTO menu_item (...) VALUES (%s, ...)
    _todo("create_item")


def update_item(item_id, data):
    sql = ("UPDATE menu_item SET name=%s, category=%s, price=%s, is_available=%s "
           "WHERE item_id=%s")
    is_avail = int(data.get("is_available", 1))
    params = (data["name"], data["category"], data["price"], is_avail, item_id)
    return run_command(sql, params)
    """แก้ไข เมนูอาหาร ตาม item_id"""
    # TODO: UPDATE menu_item SET ... WHERE item_id=%s
    _todo("update_item")


def delete_item(item_id):
    return run_command("DELETE FROM menu_item WHERE item_id=%s", (item_id,))
    """ลบ เมนูอาหาร ตาม item_id"""
    # TODO: DELETE FROM menu_item WHERE item_id=%s
    _todo("delete_item")

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

    # 🟢 บันทึกรายการอาหารลง order_item ถ้ามีการเลือกเมนูและจำนวนมาจากหน้าเว็บ
    if data.get("item_id") and data.get("qty"):
        sql_item = ("INSERT INTO order_item (order_id, item_id, qty) VALUES (%s, %s, %s) "
                    "ON DUPLICATE KEY UPDATE qty = VALUES(qty)")
        run_command(sql_item, (order_id, data["item_id"], data["qty"]))

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

    # 🟢 บันทึก/อัปเดตรายการอาหารลง order_item ถ้ามีการเลือกเมนูและจำนวนมาจากหน้าเว็บ
    if data.get("item_id") and data.get("qty"):
        sql_item = ("INSERT INTO order_item (order_id, item_id, qty) VALUES (%s, %s, %s) "
                    "ON DUPLICATE KEY UPDATE qty = VALUES(qty)")
        run_command(sql_item, (order_id, data["item_id"], data["qty"]))

    return res


def delete_order(order_id):
    return run_command("DELETE FROM food_order WHERE order_id=%s", (order_id,))


# ============================================================
#  REPORT (รายงาน — ใช้ JOIN + GROUP BY + subquery)
#  ★ ชื่อคอลัมน์ใน SELECT จะกลายเป็นหัวตารางบนเว็บ — ใช้ AS 'ชื่อภาษาไทย' ได้
# ============================================================
def report_summary():
    """ตัวเลขสรุปบนการ์ด dashboard — คืน dict {ชื่อการ์ด: ตัวเลข}  (1 คีย์ = 1 การ์ด)
    ตอนนี้ยังไม่ได้เขียน SQL → คืนค่า None ทุกการ์ด หน้าเว็บจึงแสดง "—" รอไว้
    ★ งานของนิสิต: เขียน SQL ตามตัวอย่างด้านล่าง (1 คอลัมน์ใน SELECT = 1 การ์ด
      ชื่อหลัง AS = ข้อความใต้ตัวเลข) แล้วลบ return {...} ชุดล่างสุดทิ้ง
    ★ การ์ด "คิดเพิ่มเอง" 2 ใบ: ตั้งชื่อการ์ดใหม่ แล้วเขียน SQL เอง
    ★ ผลรวมเงินใช้ IFNULL(SUM(...), 0) — ถ้ายังไม่มีข้อมูล SUM จะได้ NULL"""
    # ---- ตัวอย่างเมื่อเขียน SQL แล้ว (เอา # ข้างหน้าออก แล้วเติมให้ครบทุกการ์ด) ----
    # sql = """SELECT
    #            (SELECT COUNT(*) FROM ...) AS 'ลูกค้า',
    #            (SELECT ...)               AS 'เมนู',
    #            ...
    #          """
    # return run_query(sql)[0]      ← [0] = เอาแถวแรก (ผลมีแถวเดียว) ได้เป็น dict

    # TODO: ระหว่างที่ยังไม่ได้เขียน SQL คืนค่า None ให้การ์ดแสดง "—" รอไว้
    return {
        "ลูกค้า":         None,   # (SELECT COUNT(*) FROM customer)
        "เมนู":           None,   # นับเมนูทั้งหมด
        "ออเดอร์":        None,   # นับออเดอร์ทั้งหมด
        "ยอดขายรวม":      None,   # IFNULL(SUM(qty × price), 0) จาก order_item JOIN menu_item
        "คิดเพิ่มเอง 1":  None,   # ตั้งชื่อการ์ดใหม่ + เขียน SQL เอง
        "คิดเพิ่มเอง 2":  None,   # ตั้งชื่อการ์ดใหม่ + เขียน SQL เอง
    }

def report_popular_items():
    """📈 เมนูขายดี (Best Sellers)
    คำใบ้: JOIN order_item→menu_item, GROUP BY item, SUM(qty), ORDER BY DESC, LIMIT 5"""
    # TODO: เขียน SQL รายงานนี้ (เขียน JOIN แบบ explicit INNER JOIN ... ON ...)
    _todo("report_popular_items")

def report_daily_sales():
    """💰 ยอดขายรวมต่อวัน (Daily Sales)
    คำใบ้: JOIN food_order→order_item→menu_item, GROUP BY วันที่, SUM(qty*price)"""
    # TODO: เขียน SQL รายงานนี้ (เขียน JOIN แบบ explicit INNER JOIN ... ON ...)
    _todo("report_daily_sales")

def report_big_orders():
    """🧾 ออเดอร์ยอดเกิน 500 บาท (HAVING)
    คำใบ้: GROUP BY order, HAVING SUM(qty*price) > 500"""
    # TODO: เขียน SQL รายงานนี้ (เขียน JOIN แบบ explicit INNER JOIN ... ON ...)
    _todo("report_big_orders")

# ============================================================
#  รายการรายงานที่แสดงบนหน้า /report  (เรียงตามลำดับที่แสดง)
#  ★ วิธีเพิ่มรายงานใหม่ (ไม่ต้องแก้ไฟล์อื่น):
#    1) เขียนฟังก์ชัน report_xxx() ด้านบน ให้ return run_query(sql)
#    2) เพิ่ม 1 บรรทัดในรายการนี้:  ("ชื่อใน-url", "หัวข้อที่แสดง", ชื่อฟังก์ชัน)
#  ★ รายการนี้ต้องอยู่ท้ายไฟล์ (หลังฟังก์ชันทั้งหมด) ไม่งั้น Python หาชื่อฟังก์ชันไม่เจอ
#  ★ ห้ามตั้งชื่อ url ว่า "summary" (ใช้แล้วสำหรับการ์ดสรุป)
# ============================================================
REPORTS = [
    ("popular-items", "📈 เมนูขายดี (Best Sellers)",        report_popular_items),
    ("daily-sales",   "💰 ยอดขายรวมต่อวัน (Daily Sales)",   report_daily_sales),
    ("big-orders",    "🧾 ออเดอร์ยอดเกิน 500 บาท (HAVING)", report_big_orders),
    # ("my-report", "📋 รายงานของฉัน", report_my_report),   ← ตัวอย่างการเพิ่มรายงานที่ 4
]
