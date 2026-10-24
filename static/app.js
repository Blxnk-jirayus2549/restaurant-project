// ============================================================
//  app.js  —  ตรรกะหน้าเว็บ (ทำให้เสร็จแล้ว ★ นิสิตไม่ต้องแก้)
//  ปรับช่องค้นหา/ฟอร์มได้ที่ตัวแปร ENTITIES ด้านล่าง
// ============================================================
// ★ ตัวอย่าง dropdown ที่อ่านข้อมูลจากฐานข้อมูล: ฟอร์ม "ออเดอร์" ช่อง cust_id
//   แสดง name แต่ส่งค่าเป็น cust_id (อ่านรายการจาก /api/customers)
//   ช่อง FK อื่น ๆ ทำแบบเดียวกันได้ — เปลี่ยน "type": "number" เป็น select + optionsFrom
const ENTITIES = {
  "customers": {
    "label": "ลูกค้า",
    "api": "/api/customers",
    "idKey": "cust_id",
    "search": [
      {
        "key": "name",
        "label": "ชื่อ",
        "type": "text"
      },
      {
        "key": "phone",
        "label": "เบอร์โทร",
        "type": "text"
      },
      {
        "key": "member_tier",
        "label": "ระดับ",
        "type": "select",
        "options": [
          "",
          "regular",
          "vip"
        ]
      }
    ],
    "form": [
      {
        "key": "name",
        "label": "ชื่อ",
        "type": "text"
      },
      {
        "key": "phone",
        "label": "เบอร์โทร",
        "type": "text"
      },
      {
        "key": "member_tier",
        "label": "ระดับ",
        "type": "select",
        "options": [
          "regular",
          "vip"
        ]
      }
    ]
  },
  "items": {
    "label": "เมนูอาหาร",
    "api": "/api/menu-items",
    "idKey": "item_id",
    "search": [
      {
        "key": "name",
        "label": "ชื่อเมนู",
        "type": "text"
      },
      {
        "key": "category",
        "label": "หมวดหมู่",
        "type": "select",
        "options": [
          "",
          "Main Course",
          "Appetizer",
          "Beverage",
          "Combo"
        ]
      }
    ],
    "form": [
      {
        "key": "name",
        "label": "ชื่อเมนู",
        "type": "text"
      },
      {
        "key": "category",
        "label": "หมวดหมู่",
        "type": "select",
        "options": [
          "Main Course",
          "Appetizer",
          "Beverage",
          "Combo"
        ]
      },
      {
        "key": "price",
        "label": "ราคา",
        "type": "number"
      },
      {
        "key": "is_available",
        "label": "พร้อมขาย",
        "type": "select",
        "options": [
          { "value": 1, "label": "มี (พร้อมขาย)" },
          { "value": 0, "label": "หมด / ยกเลิก" }
        ]
      }
    ]
  },

"orders": {
    "label": "ออเดอร์",
    "api": "/api/orders",
    "idKey": "order_id",
    "search": [
      {
        "key": "cust_id",
        "label": "รหัสลูกค้า",
        "type": "number"
      },
      {
        "key": "table_id",
        "label": "รหัสโต๊ะ",
        "type": "number"
      },
      {
        "key": "status",
        "label": "สถานะ",
        "type": "select",
        "options": [
          "",
          "open",
          "paid"
        ]
      }
    ],
    "form": [
      {
        "key": "cust_id",
        "label": "ลูกค้า",
        "type": "select",
        "optionsFrom": {
          "api": "/api/customers",
          "value": "cust_id",
          "label": "name"
        }
      },
      {
        "key": "table_id",
        "label": "รหัสโต๊ะ",
        "type": "number"
      },
      {
        "key": "order_time",
        "label": "เวลาสั่ง",
        "type": "datetime-local"
      },
      {
        "key": "status",
        "label": "สถานะ",
        "type": "select",
        "options": [
          "open",
          "paid"
        ]
      },
      {
        "key": "item_id",
        "label": "เลือกเมนูอาหาร 1",
        "type": "select",
        "optionsFrom": {
          "api": "/api/menu-items",
          "value": "item_id",
          "label": "name"
        }
      },
      {
        "key": "qty",
        "label": "จำนวนที่สั่ง (เมนูที่ 1)",
        "type": "number"
      },
      {
        "key": "item_id2",
        "label": "เลือกเมนูอาหาร 2 (ถ้ามี)",
        "type": "select",
        "optionsFrom": {
          "api": "/api/menu-items",
          "value": "item_id",
          "label": "name"
        }
      },
      {
        "key": "qty2",
        "label": "จำนวนที่สั่ง (เมนูที่ 2)",
        "type": "number"
      },
      {
        "key": "note",
        "label": "หมายเหตุ",
        "type": "textarea"
      }
    ]
  },


//  รายการออเดอร์
  "order_items": {
    "label": "รายการออเดอร์",
    "api": "/api/order-items",
    "idKey": "order_id",
    "columns": [
      { "key": "order_id", "label": "รหัสออเดอร์" },
      { "key": "cust_name", "label": "ชื่อลูกค้า" },
      { "key": "item_name", "label": "ชื่อเมนูอาหาร" },
      { "key": "qty", "label": "จำนวน (ชิ้น)" },
      { "key": "price", "label": "ราคา/หน่วย (บาท)" },
      { "key": "subtotal", "label": "ราคารวม (บาท)" }
    ],
    "search": [
      {
        "key": "cust_name",
        "label": "ชื่อลูกค้า",
        "type": "text"
      },
      {
        "key": "order_id",
        "label": "รหัสออเดอร์",
        "type": "number"
      }
    ],
    "form": [] // ปล่อยว่างไว้เพื่อไม่ให้แสดงปุ่ม/ฟอร์มเพิ่มข้อมูลใหม่
  },
"combos": {
    "label": "ชุดคอมโบ",
    "api": "/api/combos",
    "idKey": "combo_id",
    "columns": [
      { "key": "combo_id", "label": "ID" },
      { "key": "combo_name", "label": "เมนูชุดคอมโบ" },
      { "key": "sub_item_name", "label": "เมนูย่อยข้างใน" },
      { "key": "sub_price", "label": "ราคา/หน่วย" },
      { "key": "amount", "label": "จำนวน" },
      { "key": "sub_total", "label": "ราคารวม" }
    ],
    "search": [
      {
        "key": "item_id",
        "label": "เมนูหลัก (Combo)",
        "type": "select",
        "optionsFrom": { "api": "/api/menu-items", "value": "item_id", "label": "name" }
      }
    ],
    "form": [
      {
        "key": "combo_name",
        "label": "ตั้งชื่อเมนูชุดคอมโบ (เช่น Super Burger Set)",
        "type": "text"
      },
      {
        "key": "sub_item_id",
        "label": "เลือกเมนูย่อยที่ 1",
        "type": "select",
        "optionsFrom": { "api": "/api/menu-items", "value": "item_id", "label": "name" }
      },
      {
        "key": "amount",
        "label": "จำนวน (เมนูที่ 1)",
        "type": "number"
      },
      {
        "key": "sub_item_id2",
        "label": "เลือกเมนูย่อยที่ 2",
        "type": "select",
        "optionsFrom": { "api": "/api/menu-items", "value": "item_id", "label": "name" }
      },
      {
        "key": "amount2",
        "label": "จำนวน (เมนูที่ 2)",
        "type": "number"
      },
      {
        "key": "sub_item_id3",
        "label": "เลือกเมนูย่อยที่ 3",
        "type": "select",
        "optionsFrom": { "api": "/api/menu-items", "value": "item_id", "label": "name" }
      },
      {
        "key": "amount3",
        "label": "จำนวน (เมนูที่ 3)",
        "type": "number"
      }  
   ]
  },
  // review
"ratings": {
    "label": "คะแนนรีวิว",
    "api": "/api/reviews",
    "idKey": "review_id",
    "columns": [
      { "key": "review_id", "label": "ID" },
      { "key": "cust_name", "label": "ชื่อลูกค้า" },
      { "key": "order_id", "label": "รหัสออเดอร์" },
      { "key": "item_name", "label": "เมนู" },
      { "key": "rating", "label": "คะแนน" },
      { "key": "comment", "label": "ความคิดเห็น" },
      { "key": "created_at", "label": "วันที่รีวิว" }
    ],
    "search": [
      {
        "key": "name",
        "label": "ชื่อลูกค้า",
        "type": "text"
      },
      {
        "key": "order_id",
        "label": "รหัสออเดอร์",
        "type": "number"
      }
    ],
    "form": [
      {
        "key": "cust_id",
        "label": "รหัสลูกค้า (ไม่ระบุได้)",
        "type": "number"
      },
      {
        "key": "order_id",
        "label": "รหัสออเดอร์ (ไม่ระบุได้)",
        "type": "number"
      },
      {
        "key": "item_id",
        "label": "รหัสเมนู (ไม่ระบุได้)",
        "type": "number"
      },
      {
        "key": "rating",
        "label": "คะแนน (1-5)",
        "type": "number"
      },
      {
        "key": "comment",
        "label": "ความคิดเห็น",
        "type": "textarea"
      }
    ]
  },
  "bills": {
    "label": "เช็คบิล",
    "api": "/api/bills",
    "idKey": "order_id",
    "columns": [
      { "key": "order_id", "label": "รหัสออเดอร์" },
      { "key": "customer_name", "label": "ชื่อลูกค้า" },
      { "key": "table_id", "label": "รหัสโต๊ะ" },
      { "key": "order_time", "label": "เวลาสั่งซื้อ" },
      { "key": "status", "label": "สถานะ" },
      { "key": "total", "label": "ยอดรวม (บาท)" }
    ],
    "search": [
      { "key": "cust_id", "label": "รหัสลูกค้า", "type": "number" },
      { "key": "table_id", "label": "รหัสโต๊ะ", "type": "number" }
    ],
    "form": []
  },
};



let current = Object.keys(ENTITIES)[0];
let editingId = null;
const $ = (s) => document.querySelector(s);
function setStatus(el, msg, cls = "") { el.className = "status " + cls; el.textContent = msg; }
async function api(url, opts) { const res = await fetch(url, opts); return res.json(); }

function fieldHtml(f, prefix, value = "") {
  if (f.type === "heading") return '<div class="form-section">' + f.label + '</div>';
  let input;
  if (f.type === "select") {
    // options เป็นข้อความ "a" หรือ {value, label} ก็ได้
    input = '<select id="' + prefix + f.key + '">' +
      f.options.map(o => {
        const v = typeof o === "object" ? o.value : o;
        const t = typeof o === "object" ? o.label : (o || "ทั้งหมด");
        return '<option value="' + v + '"' + (String(v) === String(value ?? "") ? " selected" : "") + '>' + t + '</option>';
      }).join("") + '</select>';
  } else { input = '<input id="' + prefix + f.key + '" type="' + f.type + '" value="' + (value ?? "") + '">'; }
  return '<div class="field"><label>' + f.label + '</label>' + input + '</div>';
}
// ช่อง select ที่มี optionsFrom → ดึงตัวเลือกจาก API (เช่น รายชื่อหมวดหมู่จากฐานข้อมูล)
async function loadOptions(fields, forSearch) {
  for (const f of fields.filter(f => f.optionsFrom)) {
    const src = f.optionsFrom, r = await api(src.api);
    f.options = r.ok ? (r.data || []).map(row => ({ value: row[src.value], label: row[src.label] }))
                     : [{ value: "", label: (r.todo ? "🚧 " : "⚠️ ") + r.error }];
    if (forSearch && r.ok) f.options.unshift({ value: "", label: "ทั้งหมด" });
  }
}
// ช่องในฟอร์มที่ใช้อยู่ตอนนี้ (ช่อง editOnly แสดงเฉพาะตอนแก้ไข)
function formFields() { return ENTITIES[current].form.filter(f => !f.editOnly || editingId !== null); }
async function buildSearch() {
  const cfg = ENTITIES[current];
  await loadOptions(cfg.search, true);
  if (cfg !== ENTITIES[current]) return;   // ผู้ใช้เปลี่ยนแท็บระหว่างรอ
  $("#searchTitle").textContent = cfg.label;
  $("#searchFields").innerHTML = cfg.search.map(f => fieldHtml(f, "s_")).join("");
}
async function doSearch() {
  const cfg = ENTITIES[current];
  const params = new URLSearchParams();
  cfg.search.forEach(f => { const v = $("#s_" + f.key).value; if (v) params.append(f.key, v); });
  setStatus($("#status"), "กำลังค้นหา...");
  renderTable(await api(cfg.api + "?" + params.toString()));
}
function renderTable(r) {
  const head = $("#tableHead"), body = $("#tableBody"), st = $("#status");
  head.innerHTML = ""; body.innerHTML = "";
  if (!r.ok) { setStatus(st, (r.todo ? "🚧 " : "⚠️ ") + r.error, r.todo ? "todo" : "err"); return; }
  const rows = r.data || [];
  if (rows.length === 0) { setStatus(st, "ไม่พบข้อมูล"); return; }
  setStatus(st, "พบ " + rows.length + " รายการ");
  const cols = Object.keys(rows[0]);
  head.innerHTML = cols.map(c => "<th>" + c + "</th>").join("") + "<th>จัดการ</th>";
  body.innerHTML = rows.map(row => {
    const id = row[ENTITIES[current].idKey];
    return "<tr>" + cols.map(c => "<td>" + (row[c] ?? "—") + "</td>").join("") +
      '<td><button class="btn sm" onclick="editRow(' + id + ')">แก้ไข</button> ' +
      '<button class="btn sm del" onclick="deleteRow(' + id + ')">ลบ</button></td></tr>';
  }).join("");
}
async function openForm(title, data = {}) {
  await loadOptions(formFields(), false);
  $("#modalTitle").textContent = title;
  $("#formFields").innerHTML = formFields().map(f => fieldHtml(f, "f_", data[f.key])).join("");
  $("#modal").classList.remove("hidden");
}
function collectForm() { const d = {}; formFields().filter(f => f.key).forEach(f => d[f.key] = $("#f_" + f.key).value); return d; }
async function editRow(id) {
  const cfg = ENTITIES[current];
  const r = await api(cfg.api + "/" + id);
  if (!r.ok) { alert((r.todo ? "🚧 " : "⚠️ ") + r.error); return; }
  editingId = id; openForm("แก้ไขข้อมูล", r.data);
}
async function deleteRow(id) {
  if (!confirm("ยืนยันการลบ?")) return;
  const r = await api(ENTITIES[current].api + "/" + id, { method: "DELETE" });
  if (!r.ok) { alert((r.todo ? "🚧 " : "⚠️ ") + r.error); return; }
  doSearch();
}
async function save() {
  const cfg = ENTITIES[current], data = collectForm();
  const opts = { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) };
  const r = await api(editingId ? cfg.api + "/" + editingId : cfg.api, opts);
  if (!r.ok) { alert((r.todo ? "🚧 " : "⚠️ ") + r.error); return; }
  $("#modal").classList.add("hidden"); doSearch();
}
document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
  t.classList.add("active"); current = t.dataset.entity;
  buildSearch(); $("#tableHead").innerHTML = ""; $("#tableBody").innerHTML = "";
  setStatus($("#status"), 'กด "ค้นหา" เพื่อแสดงข้อมูล');
}));
$("#btnSearch").onclick = doSearch;
$("#btnClear").onclick = () => buildSearch();
$("#btnAdd").onclick = () => { editingId = null; openForm("เพิ่มข้อมูลใหม่"); };
$("#btnSave").onclick = save;
$("#btnCancel").onclick = () => $("#modal").classList.add("hidden");
buildSearch();
setStatus($("#status"), 'กด "ค้นหา" เพื่อแสดงข้อมูล');




 // combo//
async function saveForm() {
  const config = ENTITIES[currentEntity];
  const payload = {};

  // ดึงค่าฟิลด์ทั้งหมดจาก Form ใน Modal
  (config.form || []).forEach(f => {
    const el = document.getElementById(`form_${f.key}`);
    if (el) payload[f.key] = el.value;
  });

  const url = editId ? `${config.api}/${editId}` : config.api;
  const method = editId ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (res.ok) {
      closeModal();
      doSearch(); // รีโหลดตารางข้อมูลทันทีหลังบันทึก
    } else {
      alert(result.error || "เกิดข้อผิดพลาดในการบันทึก");
    }
  } catch (err) {
    alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
  }
}

function renderTable(r) {
  const head = $("#tableHead"), body = $("#tableBody"), st = $("#status");
  head.innerHTML = ""; body.innerHTML = "";
  if (!r.ok) { setStatus(st, (r.todo ? "⚠️ " : "⚠️ ") + r.error, r.todo ? "todo" : "err"); return; }
  const rows = r.data || [];
  if (rows.length === 0) { setStatus(st, "ไม่พบข้อมูล"); return; }
  setStatus(st, "พบ " + rows.length + " รายการ");

  // 🟢 ประกาศ entity ให้ครอบคลุมทั้ง current หรือ currentEntity
  const entity = typeof current !== "undefined" ? current : (typeof currentEntity !== "undefined" ? currentEntity : "");

  // 🟢 1. กรณีเป็นหน้า "ชุดคอมโบ"
  if (entity === "combos") {
    head.innerHTML = "<th>item_id</th><th>combo_name</th><th>sub_item_id</th><th>sub_item_name</th><th>sub_price</th><th>amount</th><th>sub_total</th><th class='text-center'>จัดการ</th>";

    const itemCounts = {};
    rows.forEach(row => {
      itemCounts[row.item_id] = (itemCounts[row.item_id] || 0) + 1;
    });

    const renderedItems = new Set();
    let html = "";

    rows.forEach((row) => {
      const idKey = (ENTITIES[entity] && ENTITIES[entity].idKey) ? ENTITIES[entity].idKey : "item_id";
      const id = row[idKey];
      const isFirstRow = !renderedItems.has(row.item_id);
      const span = itemCounts[row.item_id];

      const borderStyle = isFirstRow ? "border-top: 2px solid #3b82f6;" : "border-top: 1px solid #e2e8f0;";

      html += "<tr style='" + borderStyle + "'>";

      if (isFirstRow) {
        html += "<td rowspan='" + span + "' style='vertical-align: middle; text-align: center; background-color: #f8fafc;'>" + (row.item_id ?? "-") + "</td>";
        html += "<td rowspan='" + span + "' style='vertical-align: middle; background-color: #f8fafc;'><strong>" + (row.combo_name ?? "-") + "</strong></td>";
      }

      html += "<td style='vertical-align: middle; text-align: center;'>" + (row.sub_item_id ?? "-") + "</td>";
      html += "<td style='vertical-align: middle;'>" + (row.sub_item_name ?? "-") + "</td>";
      html += "<td style='vertical-align: middle; text-align: right;'>" + (row.sub_price ?? "-") + "</td>";
      html += "<td style='vertical-align: middle; text-align: center;'>" + (row.amount ?? "-") + "</td>";
      html += "<td style='vertical-align: middle; text-align: right;'>" + (row.sub_total ?? "-") + "</td>";

      if (isFirstRow) {
        html += "<td rowspan='" + span + "' style='vertical-align: middle; text-align: center; background-color: #f8fafc;'>" +
          '<button class="btn sm" onclick="editRow(\'' + id + '\')">แก้ไข</button> ' +
          '<button class="btn sm del" onclick="deleteRow(\'' + id + '\')">ลบ</button>' +
          "</td>";
        renderedItems.add(row.item_id);
      }

      html += "</tr>";
    });

    body.innerHTML = html;

  } else {
    // 🔵 2. สำหรับหน้าอื่นๆ (ลูกค้า, เมนูอาหาร, ออเดอร์, เช็คบิล ฯลฯ)
    const cols = Object.keys(rows[0]);
    head.innerHTML = cols.map(c => "<th>" + c + "</th>").join("") + "<th>จัดการ</th>";

    body.innerHTML = rows.map(row => {
      const idKey = (ENTITIES[entity] && ENTITIES[entity].idKey) ? ENTITIES[entity].idKey : cols[0];
      const id = row[idKey] ?? "";

      let actionBtn = "";
      if (entity === "bills") {
        let payBtn = "";
        if (row.status === "open") {
          payBtn = `<button class="btn sm success" onclick="payBill(${row.order_id})">💵 ชำระเงิน</button> `;
        }
        actionBtn = payBtn + `<button class="btn sm primary" onclick="viewBillDetails(${row.order_id})">📋 รายละเอียด</button>`;
      } else {
        actionBtn = `<button class="btn sm" onclick="editRow('${id}')">แก้ไข</button> ` +
                    `<button class="btn sm del" onclick="deleteRow('${id}')">ลบ</button>`;
      }

      return "<tr>" + cols.map(c => "<td>" + (row[c] ?? "-") + "</td>").join("") +
        '<td>' + actionBtn + '</td></tr>';
    }).join("");
  }
}
// ซ่อนปุ่มสีเขียวเฉพาะเมื่อ currentEntity คือ order_items
const btnAdd = document.getElementById("btnAdd");
if (btnAdd) {
  if (currentEntity === "order_items") {
    btnAdd.style.setProperty("display", "none", "important");
  } else {
    btnAdd.style.setProperty("display", "inline-block", "important");
  }
}

// ฟังก์ชันแสดง Modal รายละเอียดบิล
async function viewBillDetails(orderId) {
    try {
        const res = await fetch(`/api/order_items?order_id=${orderId}`);
        const items = await res.json();
        
        let detailHtml = `<h4>รายการอาหารสำหรับออเดอร์ #${orderId}</h4>`;
        detailHtml += `<table style="width:100%; text-align:left; margin-top:10px; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom: 2px solid #ccc;">
                    <th style="padding: 8px;">รายการ</th>
                    <th style="padding: 8px; text-align: center;">จำนวน</th>
                    <th style="padding: 8px; text-align: right;">ราคา/หน่วย</th>
                </tr>
            </thead>
            <tbody>`;
            
        let totalSum = 0;
        const itemList = Array.isArray(items) ? items : (items.data || []);

        itemList.forEach(item => {
            const price = parseFloat(item.price || 0);
            const qty = parseInt(item.qty || 0);
            totalSum += price * qty;

            detailHtml += `<tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px;">${item.item_name || item.name || item.item_id}</td>
                <td style="padding: 8px; text-align: center;">${qty}</td>
                <td style="padding: 8px; text-align: right;">${price.toFixed(2)}</td>
            </tr>`;
        });
        
        detailHtml += `</tbody>
            <tfoot>
                <tr style="font-weight: bold; background-color: #f8fafc;">
                    <td colspan="2" style="padding: 10px; text-align: right;">ราคารวมทั้งสิ้น:</td>
                    <td style="padding: 10px; text-align: right; color: #2563eb;">${totalSum.toFixed(2)} บาท</td>
                </tr>
            </tfoot>
        </table>`;
        
        const modal = document.getElementById("modal");
        const modalTitle = document.getElementById("modalTitle");
        const formFields = document.getElementById("formFields");
        const btnSave = document.getElementById("btnSave");
        
        if (modal && formFields) {
            modalTitle.innerText = "รายละเอียดบิล";
            formFields.innerHTML = detailHtml;
            if (btnSave) btnSave.style.display = "none";
            modal.classList.remove("hidden");
        }
    } catch (err) {
        alert("ไม่สามารถดึงข้อมูลรายการอาหารได้");
    }
}

// ฟังก์ชันชำระเงิน
async function payBill(orderId) {
    if (!confirm(`ยืนยันการชำระเงินสำหรับออเดอร์ #${orderId}?`)) return;
    
    try {
        const res = await fetch(`/api/orders/${orderId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "paid" })
        });
        const result = await res.json();
        if (res.ok) {
            alert("ชำระเงินเรียบร้อยแล้ว!");
            const btnSearch = document.getElementById("btnSearch");
            if (btnSearch) btnSearch.click();
        } else {
            alert(result.error || "เกิดข้อผิดพลาดในการชำระเงิน");
        }
    } catch (err) {
        alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
}