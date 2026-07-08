const STORAGE_KEY = "study-abroad-checklist-materials";

const categories = ["全部", "申请材料", "学术材料", "语言材料", "签证材料", "住宿材料", "付款材料", "其他"];
const statuses = ["未开始", "准备中", "已完成", "已上传", "已确认"];

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

let materials = loadMaterials();
let activeCategory = "全部";

const elements = {
  filterButtons: document.querySelector("#filter-buttons"),
  list: document.querySelector("#material-list"),
  visibleCount: document.querySelector("#visible-count"),
  progressCount: document.querySelector("#progress-count"),
  progressPercent: document.querySelector("#progress-percent"),
  progressBar: document.querySelector("#progress-bar"),
  form: document.querySelector("#material-form"),
  formTitle: document.querySelector("#form-title"),
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
  const confirmed = materials.filter((material) => material.status === "已确认").length;
  const percent = total === 0 ? 0 : Math.round((confirmed / total) * 100);

  elements.progressCount.textContent = `${confirmed} / ${total} 已确认`;
  elements.progressPercent.textContent = `${percent}%`;
  elements.progressBar.style.width = `${percent}%`;
}

function getVisibleMaterials() {
  if (activeCategory === "全部") {
    return materials;
  }

  return materials.filter((material) => material.category === activeCategory);
}

function renderMaterials() {
  const visibleMaterials = getVisibleMaterials();
  elements.visibleCount.textContent = `${visibleMaterials.length} 项`;

  if (visibleMaterials.length === 0) {
    elements.list.innerHTML = '<div class="empty-state">这个分类下暂时没有材料。</div>';
    return;
  }

  elements.list.innerHTML = visibleMaterials
    .map((material) => {
      const deadlineText = material.deadline ? `截止：${material.deadline}` : "未设置截止日期";
      const noteText = material.note ? material.note : "暂无备注";

      return `
        <article class="material-card">
          <div class="card-top">
            <h3 class="material-name">${escapeHtml(material.name)}</h3>
            <span class="pill status status-${material.status}">${material.status}</span>
          </div>
          <div class="meta">
            <span class="pill">${material.category}</span>
            <span class="pill">${deadlineText}</span>
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
  renderFilters();
  renderProgress();
  renderMaterials();
}

function resetForm() {
  elements.form.reset();
  elements.id.value = "";
  elements.status.value = "未开始";
  elements.formTitle.textContent = "添加材料";
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
  elements.formTitle.textContent = "编辑材料";
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
