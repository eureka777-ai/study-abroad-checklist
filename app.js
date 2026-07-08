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

let materials = loadMaterials();
let activeCategory = "全部";
let searchText = "";
let sortMode = "default";

const elements = {
  filterButtons: document.querySelector("#filter-buttons"),
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
