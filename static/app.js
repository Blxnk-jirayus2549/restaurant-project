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
          "combo"
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
          "combo"
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
          "1",
          "0"
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
        "label": "เลือกเมนูย่อยที่ 2 (ถ้ามี)",
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
        "label": "เลือกเมนูย่อยที่ 3 (ถ้ามี)",
        "type": "select",
        "optionsFrom": { "api": "/api/menu-items", "value": "item_id", "label": "name" }
      },
      {
        "key": "amount3",
        "label": "จำนวน (เมนูที่ 3)",
        "type": "number"
      }  
   ]
  }
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

  // 🟢 1. กรณีเป็นหน้า "ชุดคอมโบ" (ซ่อน combo_id ตามแบบที่ 1)
  if (current === "combos") {
    // กำหนดหัวตารางเฉพาะหน้าชุดคอมโบ
    head.innerHTML = "<th>item_id</th><th>combo_name</th><th>sub_item_id</th><th>sub_item_name</th><th>sub_price</th><th>amount</th><th>sub_total</th><th class='text-center'>จัดการ</th>";

    const itemCounts = {};
    rows.forEach(row => {
      itemCounts[row.item_id] = (itemCounts[row.item_id] || 0) + 1;
    });

    const renderedItems = new Set();
    let html = "";

    rows.forEach((row) => {
      const id = row[ENTITIES[current].idKey];
      const isFirstRow = !renderedItems.has(row.item_id);
      const span = itemCounts[row.item_id];

      // เส้นขอบแบ่งกลุ่มคอมโบแต่ละเซ็ต
      const borderStyle = isFirstRow ? "border-top: 2px solid #3b82f6;" : "border-top: 1px solid #e2e8f0;";

      html += "<tr style='" + borderStyle + "'>";
      
      // ควบรวม item_id และ combo_name เป็นบล็อกหลักฝั่งซ้าย (ซ่อน combo_id ออก)
      if (isFirstRow) {
        html += "<td rowspan='" + span + "' style='vertical-align: middle; text-align: center; background-color: #f8fafc;'>" + (row.item_id ?? "-") + "</td>";
        html += "<td rowspan='" + span + "' style='vertical-align: middle; background-color: #f8fafc;'><strong>" + (row.combo_name ?? "-") + "</strong></td>";
      }

      // รายการย่อยตรงกลาง
      html += "<td style='vertical-align: middle; text-align: center;'>" + (row.sub_item_id ?? "-") + "</td>";
      html += "<td style='vertical-align: middle;'>" + (row.sub_item_name ?? "-") + "</td>";
      html += "<td style='vertical-align: middle; text-align: right;'>" + (row.sub_price ?? "-") + "</td>";
      html += "<td style='vertical-align: middle; text-align: center;'>" + (row.amount ?? "-") + "</td>";
      html += "<td style='vertical-align: middle; text-align: right;'>" + (row.sub_total ?? "-") + "</td>";

      // ปุ่มจัดการควบรวมฝั่งขวา
      if (isFirstRow) {
        html += "<td rowspan='" + span + "' style='vertical-align: middle; text-align: center; background-color: #f8fafc;'>" +
          '<button class="btn sm" onclick="editRow(' + id + ')">แก้ไข</button> ' +
          '<button class="btn sm del" onclick="deleteRow(' + id + ')">ลบ</button>' +
          "</td>";
        renderedItems.add(row.item_id);
      }

      html += "</tr>";
    });

    body.innerHTML = html;

  } else {
    // 🔵 2. สำหรับหน้าอื่นๆ (ลูกค้า, เมนูอาหาร, ออเดอร์) ดึงหัวตารางและข้อมูลจากโหมดปกติ
    const cols = Object.keys(rows[0]);
    head.innerHTML = cols.map(c => "<th>" + c + "</th>").join("") + "<th>จัดการ</th>";

    body.innerHTML = rows.map(row => {
      const id = row[ENTITIES[current].idKey];
      return "<tr>" + cols.map(c => "<td>" + (row[c] ?? "-") + "</td>").join("") +
        '<td><button class="btn sm" onclick="editRow(' + id + ')">แก้ไข</button> ' +
        '<button class="btn sm del" onclick="deleteRow(' + id + ')">ลบ</button></td></tr>';
    }).join("");
  }
}