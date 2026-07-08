const STORAGE_KEY = "study-abroad-checklist-materials";

const categories = ["全部", "申请材料", "学术材料", "语言材料", "签证材料", "住宿材料", "付款材料", "其他"];
const statuses = ["未开始", "准备中", "已完成", "已上传", "已确认", "不适用"];
const readyStatuses = ["已完成", "已上传", "已确认"];
const requirementLevels = ["必需", "视情况需要", "可选"];
const timelineStages = ["申请准备", "提交申请", "等待 Offer", "换 Unconditional", "CAS 与签证", "住宿与付款", "行前准备", "到校注册", "其他"];
const guideSources = {
  govUkStudent: {
    sourceName: "GOV.UK Student visa",
    sourceUrl: "https://www.gov.uk/student-visa/documents-you-must-provide",
  },
  govUkStudentApply: {
    sourceName: "GOV.UK Student visa apply",
    sourceUrl: "https://www.gov.uk/student-visa/apply",
  },
  govUkTb: {
    sourceName: "GOV.UK Approved TB clinics",
    sourceUrl: "https://www.gov.uk/tb-test-visa",
  },
  govUkAtas: {
    sourceName: "GOV.UK ATAS guidance",
    sourceUrl: "https://www.gov.uk/guidance/academic-technology-approval-scheme",
  },
  usDs160: {
    sourceName: "Travel.State.Gov DS-160",
    sourceUrl: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/forms/ds-160-online-nonimmigrant-visa-application.html",
  },
  usVisitor: {
    sourceName: "Travel.State.Gov Visitor visa",
    sourceUrl: "https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html",
  },
};

const defaultMaterials = [
  { name: "护照", category: "签证材料", stage: "申请准备", status: "未开始", deadline: "", note: "", howToGet: "向户籍地或居住地出入境管理部门申请或换发。", appliesTo: "几乎所有留学、签证和出入境场景都需要。" },
  { name: "毕业证", category: "学术材料", stage: "申请准备", status: "未开始", deadline: "", note: "" },
  { name: "学位证", category: "学术材料", stage: "申请准备", status: "未开始", deadline: "", note: "" },
  { name: "中英文成绩单", category: "学术材料", stage: "申请准备", status: "未开始", deadline: "", note: "" },
  { name: "雅思成绩单", category: "语言材料", stage: "申请准备", status: "未开始", deadline: "", note: "" },
  { name: "Conditional Offer", category: "申请材料", stage: "等待 Offer", status: "未开始", deadline: "", note: "" },
  { name: "Unconditional Offer", category: "申请材料", stage: "换 Unconditional", status: "未开始", deadline: "", note: "" },
  { name: "CAS", category: "签证材料", stage: "CAS 与签证", status: "未开始", deadline: "", note: "", sourceName: "学校 / GOV.UK", sourceUrl: guideSources.govUkStudent.sourceUrl, howToGet: "通常在换成 Unconditional Offer、满足学校要求并确认入读后由学校发放。", nextAction: "等待学校换成 Unconditional Offer 后发放 CAS。", appliesTo: "英国学生签证需要。CAS 信息需要和护照、课程、学费等信息一致。" },
  { name: "TB 肺结核检测证明", category: "签证材料", stage: "CAS 与签证", status: "未开始", deadline: "", note: "", ...guideSources.govUkTb, howToGet: "按 GOV.UK 要求预约 Home Office 认可诊所并完成检测。", nextAction: "确认自己是否需要 TB 检测；如需要，预约官方认可诊所。", appliesTo: "来自指定国家/地区、申请长期英国签证时通常需要；普通医院证明可能不被接受。" },
  { name: "签证申请表", category: "签证材料", stage: "CAS 与签证", status: "未开始", deadline: "", note: "", ...guideSources.govUkStudentApply, howToGet: "通过对应国家/地区的官方签证申请入口在线填写。", nextAction: "进入官方签证申请入口，确认签证类型后开始填写。", appliesTo: "不同国家和签证类型使用不同表格；美国非移民签证使用 DS-160，英国学生签证不使用 DS-160。" },
  { name: "IHS 付款证明", category: "付款材料", stage: "CAS 与签证", status: "未开始", deadline: "", note: "" },
  { name: "住宿合同", category: "住宿材料", stage: "住宿与付款", status: "未开始", deadline: "", note: "" },
  { name: "学费付款证明", category: "付款材料", stage: "住宿与付款", status: "未开始", deadline: "", note: "" },
];

const templates = [
  {
    id: "uk-study-application-student",
    country: "英国",
    type: "留学申请",
    audience: "学生",
    name: "英国留学申请",
    description: "学校申请常用材料，具体以院校要求为准",
    sourceName: "院校要求为准",
    sourceUrl: "",
    items: [
      item("护照", "签证材料", "确保护照有效期覆盖申请和入境时间"),
      item("个人陈述 Personal Statement", "申请材料"),
      item("推荐信", "申请材料", "多数院校需要 1-2 封"),
      item("CV / 简历", "申请材料"),
      item("Conditional Offer", "申请材料"),
      item("Unconditional Offer", "申请材料"),
      item("Offer 接受确认", "申请材料"),
      item("毕业证", "学术材料"),
      item("学位证", "学术材料"),
      item("中英文成绩单", "学术材料"),
      item("雅思 / 语言成绩单", "语言材料"),
      item("押金付款证明", "付款材料", "如学校要求缴纳押金", "按情况"),
    ],
  },
  {
    id: "uk-student-visa-student",
    country: "英国",
    type: "学生签证",
    audience: "学生",
    name: "英国学生签证",
    description: "CAS、资金证明、ATAS、TB 等",
    sourceName: "GOV.UK Student visa",
    sourceUrl: "https://www.gov.uk/student-visa/documents-you-must-provide",
    items: [
      item("有效护照", "签证材料", "", "必备", {
        howToGet: "向出入境管理部门申请或换发护照。",
        appliesTo: "GOV.UK 学生签证材料说明中列为申请所需身份证明文件。",
      }),
      item("CAS", "签证材料", "核对姓名、课程、学费、已付款金额等信息", "必备", {
        sourceName: "学校 / GOV.UK Student visa",
        sourceUrl: guideSources.govUkStudent.sourceUrl,
        howToGet: "换成 Unconditional Offer、满足学校要求并确认入读后，通常由学校发放。",
        appliesTo: "英国学生签证需要。CAS 信息需要和护照、课程、学费等信息一致。",
      }),
      item("签证申请表", "签证材料", "", "必备", {
        ...guideSources.govUkStudentApply,
        howToGet: "通过 GOV.UK 在线申请 Student visa。",
        appliesTo: "英国学生签证使用 GOV.UK 在线申请入口，不使用美国 DS-160。",
      }),
      item("IHS 付款证明", "付款材料"),
      item("签证费付款证明", "付款材料"),
      item("资金证明", "签证材料", "按 UKVI 资金要求准备"),
      item("ATAS 证明", "签证材料", "部分专业需要", "按情况", {
        ...guideSources.govUkAtas,
        howToGet: "在 GOV.UK ATAS 页面查看专业是否需要，并按要求在线申请。",
        appliesTo: "仅部分敏感技术相关专业需要，不是所有学生都需要。",
      }),
      item("TB 肺结核检测证明", "签证材料", "来自指定国家/地区时通常需要", "按情况", {
        ...guideSources.govUkTb,
        howToGet: "预约并前往 Home Office 认可的 TB 检测诊所。",
        appliesTo: "来自指定国家/地区、申请长期英国签证时通常需要。",
      }),
      item("父母同意书", "签证材料", "18 岁以下申请人需要", "按情况"),
      item("出生证明 / 亲属关系证明", "签证材料", "使用父母资金或未成年人申请时可能需要", "按情况"),
      item("英文翻译件", "其他", "非英文/威尔士语文件通常需要翻译", "按情况"),
    ],
  },
  {
    id: "uk-visitor-tourism-employed",
    country: "英国",
    type: "旅游签",
    audience: "在职",
    name: "英国旅游签 · 在职",
    description: "Standard Visitor 旅游探访常用材料",
    sourceName: "GOV.UK Standard Visitor",
    sourceUrl: "https://www.gov.uk/standard-visitor",
    items: [
      item("有效护照", "签证材料"),
      item("在线签证申请表", "签证材料"),
      item("签证费付款证明", "付款材料"),
      item("行程计划", "其他"),
      item("住宿信息", "住宿材料"),
      item("资金证明 / 银行流水", "签证材料"),
      item("在职证明", "签证材料"),
      item("准假证明", "签证材料"),
      item("收入证明 / 工资单", "签证材料", "用于证明旅行费用来源", "建议"),
      item("邀请信", "签证材料", "探亲访友时准备", "按情况"),
      item("英文翻译件", "其他", "非英文/威尔士语文件通常需要翻译", "按情况"),
    ],
  },
  {
    id: "uk-visitor-business-employed",
    country: "英国",
    type: "商务签",
    audience: "在职",
    name: "英国商务访问 · 在职",
    description: "会议、商务洽谈、短期访问",
    sourceName: "GOV.UK Business visitor",
    sourceUrl: "https://www.gov.uk/standard-visitor/visit-on-business",
    items: [
      item("有效护照", "签证材料"),
      item("在线签证申请表", "签证材料"),
      item("签证费付款证明", "付款材料"),
      item("商务邀请函", "签证材料", "说明访问目的、时间、邀请方信息"),
      item("派遣函 / 在职证明", "签证材料", "说明职位、薪资、准假和费用承担"),
      item("会议 / 展会 / 培训确认", "其他", "按实际访问目的准备"),
      item("行程计划", "其他"),
      item("住宿信息", "住宿材料"),
      item("资金证明 / 银行流水", "签证材料"),
      item("英文翻译件", "其他", "非英文/威尔士语文件通常需要翻译", "按情况"),
    ],
  },
  {
    id: "schengen-tourism-employed",
    country: "申根",
    type: "旅游签",
    audience: "在职",
    name: "申根旅游签 · 在职",
    description: "短期旅游，按主目的国使馆要求提交",
    sourceName: "European Commission Schengen visa",
    sourceUrl: "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy/applying-schengen-visa_en",
    items: [
      item("有效护照", "签证材料"),
      item("申根签证申请表", "签证材料"),
      item("证件照", "签证材料"),
      item("旅行医疗保险", "其他"),
      item("往返机票预订单", "其他"),
      item("酒店预订单 / 住宿证明", "住宿材料"),
      item("旅行行程单", "其他"),
      item("资金证明 / 银行流水", "签证材料"),
      item("在职证明", "签证材料"),
      item("准假证明", "签证材料"),
      item("户口本 / 身份证明", "签证材料", "按递签地要求准备", "按情况"),
    ],
  },
  {
    id: "schengen-tourism-student",
    country: "申根",
    type: "旅游签",
    audience: "学生",
    name: "申根旅游签 · 学生",
    description: "学生短期旅游材料",
    sourceName: "European Commission Schengen visa",
    sourceUrl: "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy/applying-schengen-visa_en",
    items: [
      item("有效护照", "签证材料"),
      item("申根签证申请表", "签证材料"),
      item("证件照", "签证材料"),
      item("旅行医疗保险", "其他"),
      item("往返机票预订单", "其他"),
      item("酒店预订单 / 住宿证明", "住宿材料"),
      item("旅行行程单", "其他"),
      item("资金证明 / 银行流水", "签证材料"),
      item("在读证明", "签证材料"),
      item("学生证", "签证材料", "按递签地要求准备", "建议"),
      item("父母资助声明", "签证材料", "使用父母资金时准备", "按情况"),
      item("亲属关系证明", "签证材料", "使用父母资金时准备", "按情况"),
    ],
  },
  {
    id: "schengen-business-employed",
    country: "申根",
    type: "商务签",
    audience: "在职",
    name: "申根商务签 · 在职",
    description: "会议、展会、商务访问",
    sourceName: "European Commission Schengen visa",
    sourceUrl: "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy/applying-schengen-visa_en",
    items: [
      item("有效护照", "签证材料"),
      item("申根签证申请表", "签证材料"),
      item("证件照", "签证材料"),
      item("旅行医疗保险", "其他"),
      item("商务邀请函", "签证材料"),
      item("会议 / 展会确认", "其他", "按访问目的准备"),
      item("派遣函 / 在职证明", "签证材料"),
      item("营业执照 / 公司证明", "签证材料", "按递签地要求准备", "按情况"),
      item("往返机票预订单", "其他"),
      item("酒店预订单 / 住宿证明", "住宿材料"),
      item("资金证明 / 银行流水", "签证材料"),
    ],
  },
  {
    id: "japan-tourism-employed",
    country: "日本",
    type: "旅游签",
    audience: "在职",
    name: "日本旅游签 · 在职",
    description: "旅游访问，材料以日本驻当地使领馆/代办机构为准",
    sourceName: "MOFA Japan visa",
    sourceUrl: "https://www.mofa.go.jp/j_info/visit/visa/index.html",
    items: [
      item("有效护照", "签证材料"),
      item("日本签证申请表", "签证材料"),
      item("证件照", "签证材料"),
      item("身份证明", "签证材料"),
      item("户口本 / 居住证明", "签证材料", "按递签地要求准备", "按情况"),
      item("赴日行程单", "其他"),
      item("酒店预订单", "住宿材料"),
      item("机票预订单", "其他"),
      item("银行流水 / 存款证明", "签证材料"),
      item("在职证明", "签证材料"),
      item("营业执照副本 / 公司证明", "签证材料", "部分递签地可能要求", "按情况"),
    ],
  },
  {
    id: "japan-tourism-student",
    country: "日本",
    type: "旅游签",
    audience: "学生",
    name: "日本旅游签 · 学生",
    description: "学生旅游访问材料",
    sourceName: "MOFA Japan visa",
    sourceUrl: "https://www.mofa.go.jp/j_info/visit/visa/index.html",
    items: [
      item("有效护照", "签证材料"),
      item("日本签证申请表", "签证材料"),
      item("证件照", "签证材料"),
      item("身份证明", "签证材料"),
      item("户口本 / 居住证明", "签证材料", "按递签地要求准备", "按情况"),
      item("赴日行程单", "其他"),
      item("酒店预订单", "住宿材料"),
      item("机票预订单", "其他"),
      item("在读证明", "签证材料"),
      item("父母资金证明", "签证材料", "使用父母资金时准备", "按情况"),
      item("亲属关系证明", "签证材料", "使用父母资金时准备", "按情况"),
    ],
  },
  {
    id: "japan-business-employed",
    country: "日本",
    type: "商务签",
    audience: "在职",
    name: "日本商务签 · 在职",
    description: "短期商务、会议、访问",
    sourceName: "MOFA Japan visa",
    sourceUrl: "https://www.mofa.go.jp/j_info/visit/visa/index.html",
    items: [
      item("有效护照", "签证材料"),
      item("日本签证申请表", "签证材料"),
      item("证件照", "签证材料"),
      item("商务邀请函", "签证材料"),
      item("身元保证书", "签证材料", "日本邀请方可能需要提供", "按情况"),
      item("滞在预定表", "其他"),
      item("派遣函 / 在职证明", "签证材料"),
      item("公司营业执照 / 公司证明", "签证材料"),
      item("机票预订单", "其他"),
      item("酒店预订单", "住宿材料"),
    ],
  },
  {
    id: "us-tourism-employed",
    country: "美国",
    type: "旅游签",
    audience: "在职",
    name: "美国 B2 旅游签 · 在职",
    description: "DS-160、面签预约、在职和资金证明",
    sourceName: "Travel.State.Gov Visitor visa",
    sourceUrl: "https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html",
    items: [
      item("有效护照", "签证材料"),
      item("DS-160 确认页", "签证材料", "", "必备", {
        ...guideSources.usDs160,
        howToGet: "通过美国非移民签证 DS-160 在线系统填写并保存确认页。",
        appliesTo: "美国 B1/B2 等非移民签证使用；不适用于英国学生签证。",
      }),
      item("签证预约确认页", "签证材料"),
      item("签证费付款证明", "付款材料"),
      item("证件照", "签证材料"),
      item("旅行计划", "其他"),
      item("资金证明 / 银行流水", "签证材料", "证明可承担旅行费用", "建议"),
      item("在职证明", "签证材料", "证明回国约束力", "建议"),
      item("房产 / 资产证明", "其他", "按个人情况准备", "按情况"),
      item("旧护照和过往签证", "签证材料", "如有", "按情况"),
    ],
  },
  {
    id: "us-tourism-student",
    country: "美国",
    type: "旅游签",
    audience: "学生",
    name: "美国 B2 旅游签 · 学生",
    description: "DS-160、面签预约、在读和资金证明",
    sourceName: "Travel.State.Gov Visitor visa",
    sourceUrl: "https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html",
    items: [
      item("有效护照", "签证材料"),
      item("DS-160 确认页", "签证材料", "", "必备", {
        ...guideSources.usDs160,
        howToGet: "通过美国非移民签证 DS-160 在线系统填写并保存确认页。",
        appliesTo: "美国 B1/B2 等非移民签证使用；不适用于英国学生签证。",
      }),
      item("签证预约确认页", "签证材料"),
      item("签证费付款证明", "付款材料"),
      item("证件照", "签证材料"),
      item("旅行计划", "其他"),
      item("在读证明", "签证材料", "证明学生身份和回国约束力", "建议"),
      item("父母资金证明", "签证材料", "使用父母资金时准备", "按情况"),
      item("亲属关系证明", "签证材料", "使用父母资金时准备", "按情况"),
      item("旧护照和过往签证", "签证材料", "如有", "按情况"),
    ],
  },
  {
    id: "us-business-employed",
    country: "美国",
    type: "商务签",
    audience: "在职",
    name: "美国 B1 商务签 · 在职",
    description: "会议、商务洽谈、短期商务访问",
    sourceName: "Travel.State.Gov Visitor visa",
    sourceUrl: "https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html",
    items: [
      item("有效护照", "签证材料"),
      item("DS-160 确认页", "签证材料", "", "必备", {
        ...guideSources.usDs160,
        howToGet: "通过美国非移民签证 DS-160 在线系统填写并保存确认页。",
        appliesTo: "美国 B1/B2 等非移民签证使用；不适用于英国学生签证。",
      }),
      item("签证预约确认页", "签证材料"),
      item("签证费付款证明", "付款材料"),
      item("商务邀请函", "签证材料"),
      item("派遣函 / 在职证明", "签证材料"),
      item("会议 / 展会确认", "其他", "按访问目的准备"),
      item("旅行计划", "其他"),
      item("资金证明 / 银行流水", "签证材料", "按个人情况准备", "建议"),
      item("旧护照和过往签证", "签证材料", "如有", "按情况"),
    ],
  },
  {
    id: "departure-general-student",
    country: "通用",
    type: "行前准备",
    audience: "学生",
    name: "行前准备 · 留学生",
    description: "机票、住宿、保险、到校注册",
    sourceName: "个人行前清单",
    sourceUrl: "",
    items: [
      item("机票订单", "其他"),
      item("住宿合同", "住宿材料"),
      item("住宿押金付款证明", "付款材料"),
      item("学费付款证明", "付款材料"),
      item("保险信息", "其他"),
      item("接机 / 到校注册信息", "其他"),
      item("学校注册邮件", "申请材料"),
      item("银行卡办理材料", "其他"),
      item("电话卡 / 网络准备", "其他"),
      item("重要文件电子备份", "其他", "护照、签证、Offer、住宿、付款证明等"),
    ],
  },
];

let materials = loadMaterials();
let activeCategory = "全部";
let searchText = "";
let sortMode = "timeline";
let selectedTemplateId = templates[0]?.id || "";
let templateCountryFilter = "全部";
let templateTypeFilter = "全部";
let templateAudienceFilter = "全部";

const elements = {
  filterButtons: document.querySelector("#filter-buttons"),
  templateButtons: document.querySelector("#template-buttons"),
  templateBody: document.querySelector("#template-body"),
  toggleTemplateButton: document.querySelector("#toggle-template-btn"),
  templateMessage: document.querySelector("#template-message"),
  templatePreview: document.querySelector("#template-preview"),
  templateCountry: document.querySelector("#template-country"),
  templateType: document.querySelector("#template-type"),
  templateAudience: document.querySelector("#template-audience"),
  list: document.querySelector("#material-list"),
  listTitle: document.querySelector("#list-title"),
  visibleCount: document.querySelector("#visible-count"),
  progressCount: document.querySelector("#progress-count"),
  progressPercent: document.querySelector("#progress-percent"),
  progressBar: document.querySelector("#progress-bar"),
  doneCount: document.querySelector("#done-count"),
  uploadedCount: document.querySelector("#uploaded-count"),
  confirmedCount: document.querySelector("#confirmed-count"),
  notApplicableCount: document.querySelector("#not-applicable-count"),
  search: document.querySelector("#material-search"),
  sort: document.querySelector("#material-sort"),
  form: document.querySelector("#material-form"),
  formTitle: document.querySelector("#form-title"),
  submitButton: document.querySelector("#submit-btn"),
  cancelEditButton: document.querySelector("#cancel-edit-btn"),
  id: document.querySelector("#material-id"),
  name: document.querySelector("#material-name"),
  category: document.querySelector("#material-category"),
  stage: document.querySelector("#material-stage"),
  status: document.querySelector("#material-status"),
  requirementLevel: document.querySelector("#material-requirement-level"),
  deadline: document.querySelector("#material-deadline"),
  note: document.querySelector("#material-note"),
  sourceName: document.querySelector("#material-source-name"),
  sourceUrl: document.querySelector("#material-source-url"),
  howToGet: document.querySelector("#material-how-to-get"),
  nextAction: document.querySelector("#material-next-action"),
  appliesTo: document.querySelector("#material-applies-to"),
  detailModal: document.querySelector("#detail-modal"),
  detailTitle: document.querySelector("#detail-title"),
  detailContent: document.querySelector("#detail-content"),
  closeDetailButton: document.querySelector("#close-detail-btn"),
};

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function item(name, category, note = "", level = "必备", guide = {}) {
  return { name, category, note, level, requirementLevel: normalizeRequirementLevel(level), ...guide };
}

function normalizeRequirementLevel(level) {
  if (level === "必备" || level === "必需") return "必需";
  if (level === "按情况" || level === "视情况需要") return "视情况需要";
  return "可选";
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

  elements.stage.innerHTML = timelineStages
    .map((stage) => `<option value="${stage}">${stage}</option>`)
    .join("");

  elements.status.innerHTML = statuses
    .map((status) => `<option value="${status}">${status}</option>`)
    .join("");
}

function renderTemplates() {
  const visibleTemplates = getVisibleTemplates();

  if (!visibleTemplates.some((template) => template.id === selectedTemplateId)) {
    selectedTemplateId = visibleTemplates[0]?.id || "";
  }

  elements.templateButtons.innerHTML = visibleTemplates
    .map(
      (template) => `
        <button class="template-button ${template.id === selectedTemplateId ? "active" : ""}" type="button" data-template-id="${template.id}">
          <strong>${escapeHtml(template.name)}</strong>
          <span>${escapeHtml(template.description)}</span>
          <small>${escapeHtml(template.country)} · ${escapeHtml(template.type)} · ${escapeHtml(template.audience)}</small>
        </button>
      `
    )
    .join("");

  if (visibleTemplates.length === 0) {
    elements.templateButtons.innerHTML = '<div class="empty-state">没有找到符合条件的模板。</div>';
  }

  renderTemplatePreview();
}

function fillTemplateFilters() {
  fillTemplateFilter(elements.templateCountry, ["全部", ...uniqueValues(templates, "country")]);
  fillTemplateFilter(elements.templateType, ["全部", ...uniqueValues(templates, "type")]);
  fillTemplateFilter(elements.templateAudience, ["全部", ...uniqueValues(templates, "audience")]);
}

function fillTemplateFilter(select, options) {
  select.innerHTML = options.map((option) => `<option value="${option}">${option}</option>`).join("");
}

function uniqueValues(items, key) {
  return [...new Set(items.map((item) => item[key]))];
}

function getVisibleTemplates() {
  return templates.filter((template) => {
    const countryMatched = templateCountryFilter === "全部" || template.country === templateCountryFilter;
    const typeMatched = templateTypeFilter === "全部" || template.type === templateTypeFilter;
    const audienceMatched = templateAudienceFilter === "全部" || template.audience === templateAudienceFilter;
    return countryMatched && typeMatched && audienceMatched;
  });
}

function renderTemplatePreview() {
  const template = templates.find((item) => item.id === selectedTemplateId);

  if (!template) {
    elements.templatePreview.innerHTML = "";
    return;
  }

  const requiredItems = template.items.filter((templateItem) => templateItem.requirementLevel === "必需").length;
  const conditionalItems = template.items.length - requiredItems;
  const sourceLink = template.sourceUrl
    ? `<a href="${template.sourceUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(template.sourceName)}</a>`
    : `<span>${escapeHtml(template.sourceName)}</span>`;

  elements.templatePreview.innerHTML = `
    <div class="preview-top">
      <div>
        <p class="eyebrow">${escapeHtml(template.country)} · ${escapeHtml(template.type)} · ${escapeHtml(template.audience)}</p>
        <h3>${escapeHtml(template.name)}</h3>
        <p class="preview-note">${escapeHtml(template.description)}</p>
      </div>
      <button id="apply-template-btn" class="primary" type="button" data-action="apply-template" data-template-id="${template.id}">添加选中的 ${template.items.length} 项</button>
    </div>
    <div class="preview-meta">
      <span>${template.items.length} 项材料</span>
      <span>${requiredItems} 项必备</span>
      <span>${conditionalItems} 项按情况/建议</span>
      <span>来源：${sourceLink}</span>
    </div>
    <ul class="template-materials">
      ${template.items
        .map(
          (templateItem) => `
            <li>
              <label class="template-check">
                <input type="checkbox" data-template-item="${escapeHtml(templateItem.name)}" checked />
                <span>
                  <strong>${escapeHtml(templateItem.name)}</strong>
                  <small>${escapeHtml(templateItem.category)}${templateItem.note ? ` · ${escapeHtml(templateItem.note)}` : ""}</small>
                </span>
              </label>
              <em class="${templateItem.requirementLevel === "必需" ? "required" : "conditional"}">${escapeHtml(templateItem.requirementLevel)}</em>
            </li>
          `
        )
        .join("")}
    </ul>
    <p class="source-warning">签证规则会随国籍、递签地和申请时间变化，这里是通用准备清单，提交前请以官方网站、签证中心或院校要求为准。</p>
  `;
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
  const applicableMaterials = materials.filter((material) => material.status !== "不适用");
  const requiredMaterials = applicableMaterials.filter((material) => getRequirementLevel(material) === "必需");
  const readyRequired = requiredMaterials.filter((material) => readyStatuses.includes(material.status)).length;
  const done = materials.filter((material) => material.status === "已完成").length;
  const uploaded = materials.filter((material) => material.status === "已上传").length;
  const confirmed = materials.filter((material) => material.status === "已确认").length;
  const notApplicable = materials.filter((material) => material.status === "不适用").length;
  const percent = requiredMaterials.length === 0 ? 0 : Math.round((readyRequired / requiredMaterials.length) * 100);

  elements.progressCount.textContent = `必需材料：${readyRequired} / ${requiredMaterials.length}`;
  elements.progressPercent.textContent = `${percent}%`;
  elements.progressBar.style.width = `${percent}%`;
  elements.doneCount.textContent = done;
  elements.uploadedCount.textContent = uploaded;
  elements.confirmedCount.textContent = confirmed;
  elements.notApplicableCount.textContent = notApplicable;
}

function getRequirementLevel(material) {
  return material.requirementLevel || normalizeRequirementLevel(material.level || "必需");
}

function getMaterialStage(material) {
  if (material.stage && timelineStages.includes(material.stage)) {
    return material.stage;
  }

  const name = material.name.toLowerCase();

  if (["个人陈述", "personal statement", "推荐信", "cv", "简历", "成绩单", "毕业证", "学位证", "雅思", "语言"].some((keyword) => name.includes(keyword))) {
    return "申请准备";
  }

  if (["申请表", "offer 接受"].some((keyword) => name.includes(keyword))) {
    return "提交申请";
  }

  if (name.includes("conditional offer")) {
    return "等待 Offer";
  }

  if (name.includes("unconditional offer")) {
    return "换 Unconditional";
  }

  if (["cas", "签证", "ihs", "tb", "atas", "ds-160", "资金证明", "肺结核"].some((keyword) => name.includes(keyword))) {
    return "CAS 与签证";
  }

  if (["住宿", "学费", "押金", "付款", "房租"].some((keyword) => name.includes(keyword))) {
    return "住宿与付款";
  }

  if (["机票", "保险", "接机", "电话卡", "行程", "酒店"].some((keyword) => name.includes(keyword))) {
    return "行前准备";
  }

  return "其他";
}

function getStageIndex(material) {
  return timelineStages.indexOf(getMaterialStage(material));
}

function inferTemplateStage(template, templateItem) {
  if (template.type === "留学申请") {
    return getMaterialStage(templateItem);
  }

  if (template.type.includes("学生签证") || template.type.includes("旅游签") || template.type.includes("商务签")) {
    return "CAS 与签证";
  }

  if (template.type.includes("行前")) {
    return "行前准备";
  }

  return getMaterialStage(templateItem);
}

function getVisibleMaterials() {
  let visibleMaterials = materials;

  if (activeCategory !== "全部") {
    visibleMaterials = visibleMaterials.filter((material) => material.category === activeCategory);
  }

  if (searchText) {
    visibleMaterials = visibleMaterials.filter((material) => {
      const searchTarget = `${material.name} ${material.note}`.toLowerCase();
      const guideTarget = `${material.sourceName || ""} ${material.howToGet || ""} ${material.appliesTo || ""}`.toLowerCase();
      return `${searchTarget} ${guideTarget}`.includes(searchText.toLowerCase());
    });
  }

  return sortMaterials(visibleMaterials);
}

function sortMaterials(items) {
  const clonedItems = [...items];

  if (sortMode === "timeline") {
    return clonedItems.sort((a, b) => getStageIndex(a) - getStageIndex(b));
  }

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

  if (sortMode === "timeline") {
    elements.list.innerHTML = timelineStages
      .map((stage) => {
        const stageMaterials = visibleMaterials.filter((material) => getMaterialStage(material) === stage);
        if (stageMaterials.length === 0) return "";

        return `
          <section class="timeline-group">
            <div class="timeline-heading">
              <span></span>
              <h3>${stage}</h3>
              <small>${stageMaterials.length} 项</small>
            </div>
            <div class="timeline-items">
              ${stageMaterials.map(renderMaterialCard).join("")}
            </div>
          </section>
        `;
      })
      .join("");
    return;
  }

  elements.list.innerHTML = visibleMaterials.map(renderMaterialCard).join("");
}

function renderMaterialCard(material) {
  const deadline = getDeadlineInfo(material.deadline);
  const requirementLevel = getRequirementLevel(material);
  const nextActionText = material.nextAction || material.howToGet || "暂未设置下一步";

  return `
    <article class="material-card">
      <div class="card-top">
        <h3 class="material-name">${escapeHtml(material.name)}</h3>
        <span class="pill status status-${material.status}">${material.status}</span>
      </div>
      <div class="meta">
        <span class="pill">${material.category}</span>
        <span class="pill requirement requirement-${requirementLevel}">${requirementLevel}</span>
        <span class="pill deadline deadline-${deadline.level}">${deadline.text}</span>
      </div>
      <p class="next-action"><strong>下一步</strong>${escapeHtml(nextActionText)}</p>
      <div class="card-actions">
        <button class="text-button" type="button" data-action="details" data-id="${material.id}">查看详情</button>
        <button class="text-button" type="button" data-action="edit" data-id="${material.id}">编辑</button>
        <button class="danger-button" type="button" data-action="delete" data-id="${material.id}">删除</button>
      </div>
    </article>
  `;
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
  elements.stage.value = "申请准备";
  elements.status.value = "未开始";
  elements.requirementLevel.value = "必需";
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
    stage: elements.stage.value,
    status: elements.status.value,
    requirementLevel: elements.requirementLevel.value,
    deadline: elements.deadline.value,
    note: elements.note.value.trim(),
    sourceName: elements.sourceName.value.trim(),
    sourceUrl: elements.sourceUrl.value.trim(),
    howToGet: elements.howToGet.value.trim(),
    nextAction: elements.nextAction.value.trim(),
    appliesTo: elements.appliesTo.value.trim(),
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
  elements.stage.value = getMaterialStage(material);
  elements.status.value = material.status;
  elements.requirementLevel.value = getRequirementLevel(material);
  elements.deadline.value = material.deadline;
  elements.note.value = material.note || "";
  elements.sourceName.value = material.sourceName || "";
  elements.sourceUrl.value = material.sourceUrl || "";
  elements.howToGet.value = material.howToGet || "";
  elements.nextAction.value = material.nextAction || "";
  elements.appliesTo.value = material.appliesTo || "";
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

function applyTemplate(templateId, selectedNames = null) {
  const template = templates.find((item) => item.id === templateId);
  if (!template) return;

  const existingNames = new Set(materials.map((material) => normalizeText(material.name)));
  const selectedSet = selectedNames ? new Set(selectedNames.map(normalizeText)) : null;
  const selectedItems = selectedSet ? template.items.filter((item) => selectedSet.has(normalizeText(item.name))) : template.items;
  const newItems = selectedItems.filter((item) => !existingNames.has(normalizeText(item.name)));
  const enrichedCount = enrichExistingMaterials(template, selectedItems);

  if (newItems.length > 0) {
    materials = [
      ...materials,
      ...newItems.map((item) => ({
        id: createId(),
        name: item.name,
        category: item.category,
        stage: item.stage || inferTemplateStage(template, item),
        status: "未开始",
        requirementLevel: item.requirementLevel || normalizeRequirementLevel(item.level),
        deadline: "",
        note: item.note ? `${item.note}（来自：${template.name}）` : `来自：${template.name}`,
        sourceName: item.sourceName || template.sourceName || "",
        sourceUrl: item.sourceUrl || template.sourceUrl || "",
        howToGet: item.howToGet || "",
        nextAction: item.nextAction || item.howToGet || "",
        appliesTo: item.appliesTo || "",
      })),
    ];

    saveMaterials();
  }

  const skippedCount = selectedItems.length - newItems.length;
  showTemplateMessage(`已添加 ${newItems.length} 项，跳过 ${skippedCount} 项重复材料，补全 ${enrichedCount} 项指南`);
  render();
}

function enrichExistingMaterials(template, selectedItems) {
  let updatedCount = 0;

  materials = materials.map((material) => {
    const templateItem = selectedItems.find((item) => normalizeText(item.name) === normalizeText(material.name));
    if (!templateItem) return material;

    const guide = {
      requirementLevel: material.requirementLevel || templateItem.requirementLevel || normalizeRequirementLevel(templateItem.level),
      stage: material.stage || templateItem.stage || inferTemplateStage(template, templateItem),
      sourceName: material.sourceName || templateItem.sourceName || template.sourceName || "",
      sourceUrl: material.sourceUrl || templateItem.sourceUrl || template.sourceUrl || "",
      howToGet: material.howToGet || templateItem.howToGet || "",
      nextAction: material.nextAction || templateItem.nextAction || templateItem.howToGet || "",
      appliesTo: material.appliesTo || templateItem.appliesTo || "",
    };

    const hasNewGuide = Object.keys(guide).some((key) => !material[key] && guide[key]);
    if (hasNewGuide) {
      updatedCount += 1;
      return { ...material, ...guide };
    }

    return material;
  });

  if (updatedCount > 0) {
    saveMaterials();
  }

  return updatedCount;
}

function getSelectedTemplateItemNames() {
  return [...elements.templatePreview.querySelectorAll("[data-template-item]:checked")].map((checkbox) => checkbox.dataset.templateItem);
}

function updateTemplateApplyCount() {
  const button = elements.templatePreview.querySelector("[data-action='apply-template']");
  if (!button) return;

  button.textContent = `添加选中的 ${getSelectedTemplateItemNames().length} 项`;
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

function showDetails(id) {
  const material = materials.find((item) => item.id === id);
  if (!material) return;

  const detailRows = [
    ["状态", material.status],
    ["重要程度", getRequirementLevel(material)],
    ["分类", material.category],
    ["阶段", getMaterialStage(material)],
    ["截止日期", material.deadline || "未设置"],
    ["下一步动作", material.nextAction || material.howToGet || "暂未填写"],
    ["来源", material.sourceName || "暂未填写"],
    ["如何获得", material.howToGet || "暂未填写"],
    ["适用情况", material.appliesTo || "暂未填写"],
    ["备注", material.note || "暂无备注"],
  ];

  const sourceButton = material.sourceUrl
    ? `<a class="source-button" href="${escapeHtml(material.sourceUrl)}" target="_blank" rel="noopener noreferrer">查看官方入口</a>`
    : "";

  elements.detailTitle.textContent = material.name;
  elements.detailContent.innerHTML = `
    <div class="detail-grid">
      ${detailRows
        .map(
          ([label, value]) => `
            <p>
              <strong>${escapeHtml(label)}</strong>
              <span>${escapeHtml(value)}</span>
            </p>
          `
        )
        .join("")}
    </div>
    ${sourceButton}
  `;
  elements.detailModal.classList.remove("hidden");
}

function closeDetails() {
  elements.detailModal.classList.add("hidden");
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

elements.toggleTemplateButton.addEventListener("click", () => {
  const isHidden = elements.templateBody.classList.toggle("hidden");
  elements.toggleTemplateButton.textContent = isHidden ? "从模板添加" : "收起模板";
});

elements.templateCountry.addEventListener("change", (event) => {
  templateCountryFilter = event.target.value;
  renderTemplates();
});

elements.templateType.addEventListener("change", (event) => {
  templateTypeFilter = event.target.value;
  renderTemplates();
});

elements.templateAudience.addEventListener("change", (event) => {
  templateAudienceFilter = event.target.value;
  renderTemplates();
});

elements.templateButtons.addEventListener("click", (event) => {
  const button = event.target.closest("[data-template-id]");
  if (!button) return;

  selectedTemplateId = button.dataset.templateId;
  renderTemplates();
});

elements.templatePreview.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action='apply-template']");
  if (!button) return;

  applyTemplate(button.dataset.templateId, getSelectedTemplateItemNames());
});

elements.templatePreview.addEventListener("change", (event) => {
  if (!event.target.matches("[data-template-item]")) return;

  updateTemplateApplyCount();
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

  if (button.dataset.action === "details") {
    showDetails(button.dataset.id);
  }

  if (button.dataset.action === "delete") {
    deleteMaterial(button.dataset.id);
  }
});

elements.closeDetailButton.addEventListener("click", closeDetails);

elements.detailModal.addEventListener("click", (event) => {
  if (event.target === elements.detailModal) {
    closeDetails();
  }
});

fillSelectOptions();
fillTemplateFilters();
resetForm();
render();
