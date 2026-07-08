const STORAGE_KEY = "study-abroad-checklist-materials";

const categories = ["全部", "申请材料", "学术材料", "语言材料", "签证材料", "住宿材料", "付款材料", "其他"];
const statuses = ["未开始", "准备中", "已完成", "已上传", "已确认"];
const readyStatuses = ["已完成", "已上传", "已确认"];

const defaultMaterials = [
  { name: "护照", category: "签证材料", status: "未开始", deadline: "", note: "" },
  { name: "Conditional Offer", category: "申请材料", status: "未开始", deadline: "", note: "" },
  { name: "Unconditional Offer", category: "申请材料", status: "未开始", deadline: "", note: "" },
  { name: "CAS", category: "签证材料", status: "未开始", deadline: "", note: "" },
  { name: "毕业证", category: "学术材料", status: "未开始", deadline: "", note: "" },
  { name: "学位证", category: "学术材料", status: "未开始", deadline: "", note: "" },
  { name: "中英文成绩单", category: "学术材料", status: "未开始", deadline: "", note: "" },
  { name: "雅思成绩单", category: "语言材料", status: "未开始", deadline: "", note: "" },
  { name: "TB 肺结核检测证明", category: "签证材料", status: "未开始", deadline: "", note: "" },
  { name: "签证申请表", category: "签证材料", status: "未开始", deadline: "", note: "" },
  { name: "IHS 付款证明", category: "付款材料", status: "未开始", deadline: "", note: "" },
  { name: "住宿合同", category: "住宿材料", status: "未开始", deadline: "", note: "" },
  { name: "学费付款证明", category: "付款材料", status: "未开始", deadline: "", note: "" },
];

const templates = [
  {
    name: "英国留学申请",
    description: "Offer、学术、语言成绩",
    items: [
      { name: "护照", category: "签证材料", note: "确保护照有效期覆盖申请和入境时间" },
      { name: "个人陈述 Personal Statement", category: "申请材料", note: "" },
      { name: "推荐信", category: "申请材料", note: "通常需要 1-2 封" },
      { name: "CV / 简历", category: "申请材料", note: "" },
      { name: "Conditional Offer", category: "申请材料", note: "" },
      { name: "Unconditional Offer", category: "申请材料", note: "" },
      { name: "Offer 接受确认", category: "申请材料", note: "" },
      { name: "毕业证", category: "学术材料", note: "" },
      { name: "学位证", category: "学术材料", note: "" },
      { name: "中英文成绩单", category: "学术材料", note: "" },
      { name: "雅思成绩单", category: "语言材料", note: "" },
      { name: "押金付款证明", category: "付款材料", note: "如学校要求缴纳押金" },
    ],
  },
  {
    name: "英国学生签证",
    description: "CAS、IHS、资金、TB",
    items: [
      { name: "护照", category: "签证材料", note: "" },
      { name: "CAS", category: "签证材料", note: "等学校发 CAS 后核对信息" },
      { name: "签证申请表", category: "签证材料", note: "" },
      { name: "IHS 付款证明", category: "付款材料", note: "" },
      { name: "签证费付款证明", category: "付款材料", note: "" },
      { name: "TB 肺结核检测证明", category: "签证材料", note: "" },
      { name: "资金证明", category: "签证材料", note: "按签证要求准备存款证明或银行流水" },
      { name: "银行流水 / 存款证明", category: "签证材料", note: "" },
      { name: "签证预约确认信", category: "签证材料", note: "" },
      { name: "ATAS 证明（如适用）", category: "签证材料", note: "理工科部分专业可能需要" },
      { name: "BRP / eVisa 信息", category: "签证材料", note: "按最新签证流程确认" },
    ],
  },
  {
    name: "申根旅游签",
    description: "行程、酒店、保险、资金",
    items: [
      { name: "护照", category: "签证材料", note: "检查有效期和空白签证页" },
      { name: "申根签证申请表", category: "签证材料", note: "" },
      { name: "白底证件照", category: "签证材料", note: "" },
      { name: "往返机票预订单", category: "其他", note: "" },
      { name: "酒店预订单", category: "住宿材料", note: "" },
      { name: "旅行行程单", category: "其他", note: "列出每天城市和住宿" },
      { name: "旅行保险", category: "其他", note: "确认覆盖申根要求" },
      { name: "银行流水 / 存款证明", category: "签证材料", note: "" },
      { name: "在读证明 / 工作证明", category: "签证材料", note: "" },
      { name: "户口本 / 身份证明", category: "签证材料", note: "按申请地要求准备" },
    ],
  },
  {
    name: "日本旅游签",
    description: "申请表、行程、财力证明",
    items: [
      { name: "护照", category: "签证材料", note: "" },
      { name: "日本签证申请表", category: "签证材料", note: "" },
      { name: "证件照", category: "签证材料", note: "" },
      { name: "身份证复印件", category: "签证材料", note: "" },
      { name: "户口本复印件", category: "签证材料", note: "" },
      { name: "赴日行程单", category: "其他", note: "" },
      { name: "酒店预订单", category: "住宿材料", note: "" },
      { name: "机票预订单", category: "其他", note: "" },
      { name: "银行流水 / 存款证明", category: "签证材料", note: "" },
      { name: "在职证明 / 在读证明", category: "签证材料", note: "" },
    ],
  },
  {
    name: "美国旅游签",
    description: "DS-160、预约、面签材料",
    items: [
      { name: "护照", category: "签证材料", note: "" },
      { name: "DS-160 确认页", category: "签证材料", note: "" },
      { name: "签证预约确认页", category: "签证材料", note: "" },
      { name: "签证费付款证明", category: "付款材料", note: "" },
      { name: "证件照", category: "签证材料", note: "" },
      { name: "旅行计划", category: "其他", note: "" },
      { name: "银行流水 / 存款证明", category: "签证材料", note: "" },
      { name: "在职证明 / 在读证明", category: "签证材料", note: "" },
      { name: "房产 / 资产证明（如有）", category: "其他", note: "" },
      { name: "旧护照和过往签证（如有）", category: "签证材料", note: "" },
    ],
  },
  {
    name: "行前准备",
    description: "机票、住宿、保险、到校",
    items: [
      { name: "机票订单", category: "其他", note: "" },
      { name: "住宿合同", category: "住宿材料", note: "" },
      { name: "住宿押金付款证明", category: "付款材料", note: "" },
      { name: "学费付款证明", category: "付款材料", note: "" },
      { name: "保险信息", category: "其他", note: "" },
      { name: "接机 / 到校注册信息", category: "其他", note: "" },
      { name: "学校注册邮件", category: "申请材料", note: "" },
      { name: "银行卡办理材料", category: "其他", note: "" },
      { name: "电话卡 / 网络准备", category: "其他", note: "" },
      { name: "重要文件电子备份", category: "其他", note: "护照、签证、Offer、住宿、付款证明等" },
    ],
  },
];

let materials = loadMaterials();
let activeCategory = "全部";
let searchText = "";
let sortMode = "default";

const elements = {
  filterButtons: document.querySelector("#filter-buttons"),
  templateButtons: document.querySelector("#template-buttons"),
  templateMessage: document.querySelector("#template-message"),
  list: document.querySelector("#material-list"),
  listTitle: document.querySelector("#list-title"),
  visibleCount: document.querySelector("#visible-count"),
  progressCount: document.querySelector("#progress-count"),
  progressPercent: document.querySelector("#progress-percent"),
  progressBar: document.querySelector("#progress-bar"),
  doneCount: document.querySelector("#done-count"),
  uploadedCount: document.querySelector("#uploaded-count"),
  confirmedCount: document.querySelector("#confirmed-count"),
  search: document.querySelector("#material-search"),
  sort: document.querySelector("#material-sort"),
  form: document.querySelector("#material-form"),
  formTitle: document.querySelector("#form-title"),
  submitButton: document.querySelector("#submit-btn"),
  cancelEditButton: document.querySelector("#cancel-edit-btn"),
  id: document.querySelector("#material-id"),
  name: document.querySelector("#material-name"),
  category: document.querySelector("#material-category"),
  status: document.querySelector("#material-status"),
  deadline: document.querySelector("#material-deadline"),
  note: document.querySelector("#material-note"),
};

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadMaterials() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return defaultMaterials.map((material) => ({
    ...material,
    id: createId(),
  }));
}

function saveMaterials() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
}

function fillSelectOptions() {
  elements.category.innerHTML = categories
    .filter((category) => category !== "全部")
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");

  elements.status.innerHTML = statuses
    .map((status) => `<option value="${status}">${status}</option>`)
    .join("");
}

function renderTemplates() {
  elements.templateButtons.innerHTML = templates
    .map(
      (template) => `
        <button class="template-button" type="button" data-template="${template.name}">
          <strong>${template.name}</strong>
          <span>${template.description}</span>
        </button>
      `
    )
    .join("");
}

function renderFilters() {
  elements.filterButtons.innerHTML = categories
    .map((category) => {
      const activeClass = category === activeCategory ? " active" : "";
      return `<button class="filter-button${activeClass}" type="button" data-category="${category}">${category}</button>`;
    })
    .join("");
}

function renderProgress() {
  const total = materials.length;
  const ready = materials.filter((material) => readyStatuses.includes(material.status)).length;
  const done = materials.filter((material) => material.status === "已完成").length;
  const uploaded = materials.filter((material) => material.status === "已上传").length;
  const confirmed = materials.filter((material) => material.status === "已确认").length;
  const percent = total === 0 ? 0 : Math.round((ready / total) * 100);

  elements.progressCount.textContent = `准备进度：${ready} / ${total}`;
  elements.progressPercent.textContent = `${percent}%`;
  elements.progressBar.style.width = `${percent}%`;
  elements.doneCount.textContent = done;
  elements.uploadedCount.textContent = uploaded;
  elements.confirmedCount.textContent = confirmed;
}

function getVisibleMaterials() {
  let visibleMaterials = materials;

  if (activeCategory !== "全部") {
    visibleMaterials = visibleMaterials.filter((material) => material.category === activeCategory);
  }

  if (searchText) {
    visibleMaterials = visibleMaterials.filter((material) => {
      const searchTarget = `${material.name} ${material.note}`.toLowerCase();
      return searchTarget.includes(searchText.toLowerCase());
    });
  }

  return sortMaterials(visibleMaterials);
}

function sortMaterials(items) {
  const clonedItems = [...items];

  if (sortMode === "deadline") {
    return clonedItems.sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return a.deadline.localeCompare(b.deadline);
    });
  }

  if (sortMode === "status") {
    return clonedItems.sort((a, b) => statuses.indexOf(a.status) - statuses.indexOf(b.status));
  }

  return clonedItems;
}

function getDeadlineInfo(deadline) {
  if (!deadline) {
    return { text: "未设置截止日期", level: "none" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(`${deadline}T00:00:00`);
  const daysLeft = Math.ceil((deadlineDate - today) / 86400000);

  if (daysLeft < 0) {
    return { text: `已逾期 ${Math.abs(daysLeft)} 天`, level: "overdue" };
  }

  if (daysLeft === 0) {
    return { text: "今天截止", level: "urgent" };
  }

  if (daysLeft <= 7) {
    return { text: `${daysLeft} 天内截止`, level: "urgent" };
  }

  if (daysLeft <= 30) {
    return { text: `${daysLeft} 天内截止`, level: "soon" };
  }

  return { text: `截止：${deadline}`, level: "normal" };
}

function renderMaterials() {
  const visibleMaterials = getVisibleMaterials();
  const titleCategory = activeCategory === "全部" ? "全部" : activeCategory;

  elements.listTitle.textContent = `材料列表 · ${titleCategory}`;
  elements.visibleCount.textContent = `${visibleMaterials.length} 项`;

  if (visibleMaterials.length === 0) {
    elements.list.innerHTML = '<div class="empty-state">没有找到符合条件的材料。</div>';
    return;
  }

  elements.list.innerHTML = visibleMaterials
    .map((material) => {
      const deadline = getDeadlineInfo(material.deadline);
      const noteText = material.note ? material.note : "暂无备注";

      return `
        <article class="material-card">
          <div class="card-top">
            <h3 class="material-name">${escapeHtml(material.name)}</h3>
            <span class="pill status status-${material.status}">${material.status}</span>
          </div>
          <div class="meta">
            <span class="pill">${material.category}</span>
            <span class="pill deadline deadline-${deadline.level}">${deadline.text}</span>
          </div>
          <p class="note">${escapeHtml(noteText)}</p>
          <div class="card-actions">
            <button class="text-button" type="button" data-action="edit" data-id="${material.id}">编辑</button>
            <button class="danger-button" type="button" data-action="delete" data-id="${material.id}">删除</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function render() {
  renderTemplates();
  renderFilters();
  renderProgress();
  renderMaterials();
}

function resetForm() {
  elements.form.reset();
  elements.id.value = "";
  elements.status.value = "未开始";
  elements.formTitle.textContent = "添加新材料";
  elements.submitButton.textContent = "添加材料";
  elements.cancelEditButton.classList.add("hidden");
}

function handleFormSubmit(event) {
  event.preventDefault();

  const material = {
    id: elements.id.value || createId(),
    name: elements.name.value.trim(),
    category: elements.category.value,
    status: elements.status.value,
    deadline: elements.deadline.value,
    note: elements.note.value.trim(),
  };

  if (!material.name) {
    elements.name.focus();
    return;
  }

  if (elements.id.value) {
    materials = materials.map((item) => (item.id === material.id ? material : item));
  } else {
    materials = [material, ...materials];
  }

  saveMaterials();
  resetForm();
  render();
}

function startEdit(id) {
  const material = materials.find((item) => item.id === id);
  if (!material) return;

  elements.id.value = material.id;
  elements.name.value = material.name;
  elements.category.value = material.category;
  elements.status.value = material.status;
  elements.deadline.value = material.deadline;
  elements.note.value = material.note;
  elements.formTitle.textContent = `编辑材料：${material.name}`;
  elements.submitButton.textContent = "保存修改";
  elements.cancelEditButton.classList.remove("hidden");
  elements.name.focus();
}

function deleteMaterial(id) {
  const material = materials.find((item) => item.id === id);
  if (!material) return;

  const confirmed = window.confirm(`确定要删除“${material.name}”吗？`);
  if (!confirmed) return;

  materials = materials.filter((item) => item.id !== id);
  saveMaterials();
  render();
}

function applyTemplate(templateName) {
  const template = templates.find((item) => item.name === templateName);
  if (!template) return;

  const existingNames = new Set(materials.map((material) => normalizeText(material.name)));
  const newItems = template.items.filter((item) => !existingNames.has(normalizeText(item.name)));

  if (newItems.length > 0) {
    materials = [
      ...materials,
      ...newItems.map((item) => ({
        id: createId(),
        name: item.name,
        category: item.category,
        status: "未开始",
        deadline: "",
        note: item.note || "",
      })),
    ];

    saveMaterials();
  }

  const skippedCount = template.items.length - newItems.length;
  showTemplateMessage(`已添加 ${newItems.length} 项，跳过 ${skippedCount} 项重复材料`);
  render();
}

function normalizeText(value) {
  return value.trim().toLowerCase();
}

function showTemplateMessage(message) {
  elements.templateMessage.textContent = message;
  window.clearTimeout(showTemplateMessage.timer);
  showTemplateMessage.timer = window.setTimeout(() => {
    elements.templateMessage.textContent = "";
  }, 3000);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

elements.form.addEventListener("submit", handleFormSubmit);

elements.cancelEditButton.addEventListener("click", resetForm);

elements.templateButtons.addEventListener("click", (event) => {
  const button = event.target.closest("[data-template]");
  if (!button) return;

  applyTemplate(button.dataset.template);
});

elements.search.addEventListener("input", (event) => {
  searchText = event.target.value.trim();
  renderMaterials();
});

elements.sort.addEventListener("change", (event) => {
  sortMode = event.target.value;
  renderMaterials();
});

elements.filterButtons.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;
  render();
});

elements.list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  if (button.dataset.action === "edit") {
    startEdit(button.dataset.id);
  }

  if (button.dataset.action === "delete") {
    deleteMaterial(button.dataset.id);
  }
});

fillSelectOptions();
resetForm();
render();
