const CASES = {
  bos: {
    title: "BOS 中台系统",
    headerTitle: "BOS / BACK OFFICE SYSTEM",
    eyebrow: "B-SIDE SYSTEM / 2021",
    summary: "围绕跨平台数据查看、检索与运营协作，重新组织中台信息结构、任务路径和数据反馈。",
    year: "2021",
    role: "设计组长 / 项目子 PM",
    scope: "信息架构 / 后台界面 / 数据体验",
    folder: "bos",
    pages: 16,
    chapters: [
      { label: "项目概览", page: 1 },
      { label: "业务梳理", page: 4 },
      { label: "系统方案", page: 8 },
      { label: "界面与交付", page: 13 },
    ],
  },
  "c4d-illustration": {
    title: "三维视觉与插画探索",
    headerTitle: "C4D / ILLUSTRATION",
    eyebrow: "VISUAL EXPLORATION / 2018—2021",
    summary: "汇集运营插画、活动页面、三维视觉与个人练习，呈现早期视觉表达和风格探索。",
    year: "2018—2021",
    role: "视觉设计 / 插画 / C4D",
    scope: "运营插画 / 活动视觉 / 三维练习",
    folder: "c4d-illustration",
    startPage: 2,
    pages: 28,
    chapters: [
      { label: "视觉概览", page: 1 },
      { label: "三维练习", page: 6 },
      { label: "插画与活动", page: 14 },
      { label: "视觉延展", page: 22 },
    ],
    notice: "为保护个人信息，当前展示已隐藏原始封面页，其余作品内容保持不变。",
  },
  "fancy-card": {
    title: "Fancy 电商数据监控小程序",
    headerTitle: "FANCY / WECHAT MINI PROGRAM",
    eyebrow: "UI/UX DESIGN / 2021",
    summary: "面向电商运营的数据产品，从行业与用户研究出发，建立跨类目、多维度的数据查看与监控体验。",
    year: "2021",
    role: "UI/UX 设计",
    scope: "产品分析 / 用户研究 / 交互流程 / 视觉设计",
    folder: "fancy-card",
    pages: 13,
    chapters: [
      { label: "项目背景", page: 1 },
      { label: "用户与需求", page: 4 },
      { label: "交互流程", page: 7 },
      { label: "界面方案", page: 10 },
    ],
  },
  "data-screen": {
    title: "工业与环保数据可视化",
    headerTitle: "DATA VISUALIZATION",
    eyebrow: "VISUAL SYSTEM / 2021—2024",
    summary: "围绕环保回收和工业管理场景，将复杂业务数据转化为可监控、可分析、可展示的可视化大屏。",
    year: "2021—2024",
    role: "UI/UX / 数据可视化",
    scope: "业务梳理 / 视觉规范 / 大屏界面",
    folder: "data-screen",
    pages: 10,
    chapters: [
      { label: "项目概览", page: 1 },
      { label: "数据体系", page: 3 },
      { label: "大屏方案", page: 6 },
      { label: "场景展示", page: 9 },
    ],
  },
  "clothes-recycling": {
    title: "旧衣回收项目",
    headerTitle: "OLD CLOTHES RECYCLING",
    eyebrow: "APP EXPERIENCE / 2023",
    summary: "在虎哥回收服务基础上扩展全国旧衣回收链路，以预约取件、透明进度和回收反馈降低参与门槛。",
    year: "2023.12",
    role: "UI/UX 设计",
    scope: "用户调研 / 体验地图 / 交互与视觉设计",
    folder: "clothes-recycling",
    pages: 6,
    chapters: [
      { label: "项目背景", page: 1 },
      { label: "用户旅程", page: 3 },
      { label: "方案与界面", page: 5 },
    ],
  },
  "alien-mini-program": {
    title: "Alienware 微信小程序商城",
    headerTitle: "ALIENWARE / MINI PROGRAM",
    eyebrow: "WECHAT MINI PROGRAM / 2021",
    summary: "围绕品牌商城的获客、激活、留存与转化目标，梳理小程序商品浏览、购买和营销链路。",
    year: "2021",
    role: "设计组长 / 项目子 PM",
    scope: "目标拆解 / 用户流程 / 界面与规范",
    folder: "alien-mini-program",
    pages: 13,
    chapters: [
      { label: "目标拆解", page: 1 },
      { label: "用户流程", page: 4 },
      { label: "界面方案", page: 7 },
      { label: "规范与交付", page: 11 },
    ],
  },
};

const params = new URLSearchParams(window.location.search);
const caseKey = params.get("case") || "bos";
const caseData = CASES[caseKey] || CASES.bos;

const title = document.getElementById("case-title");
const headerTitle = document.getElementById("header-case-title");
const eyebrow = document.getElementById("case-eyebrow");
const summary = document.getElementById("case-summary");
const year = document.getElementById("case-year");
const role = document.getElementById("case-role");
const scope = document.getElementById("case-scope");
const notice = document.getElementById("case-notice");
const pagesContainer = document.getElementById("case-pages");
const currentPageLabel = document.getElementById("current-page");
const totalPagesLabel = document.getElementById("total-pages");
const previousPageButton = document.getElementById("previous-page");
const nextPageButton = document.getElementById("next-page");
const controlCurrentPage = document.getElementById("control-current-page");
const controlTotalPages = document.getElementById("control-total-pages");
const chapterLinks = document.getElementById("chapter-links");

let currentPage = 1;

const formatPage = (page) => String(page).padStart(2, "0");

document.title = `${caseData.title} / BEI CHUAN`;
title.textContent = caseData.title;
headerTitle.textContent = caseData.headerTitle;
eyebrow.textContent = caseData.eyebrow;
summary.textContent = caseData.summary;
year.textContent = caseData.year;
role.textContent = caseData.role;
scope.textContent = caseData.scope;
totalPagesLabel.textContent = formatPage(caseData.pages);
controlTotalPages.textContent = formatPage(caseData.pages);
if (caseData.notice) {
  notice.hidden = false;
  notice.textContent = caseData.notice;
}

const fragment = document.createDocumentFragment();

const getActiveChapterPage = (page) => [...caseData.chapters]
  .reverse()
  .find((chapter) => page >= chapter.page)?.page || 1;

caseData.chapters.forEach((chapter, index) => {
  const link = document.createElement("a");
  link.href = `#case-page-${chapter.page}`;
  link.dataset.chapterPage = String(chapter.page);
  link.innerHTML = `<span>${formatPage(index + 1)}</span>${chapter.label}`;
  link.addEventListener("click", (event) => {
    event.preventDefault();
    goToPage(chapter.page);
  });
  chapterLinks.append(link);
});

for (let page = 1; page <= caseData.pages; page += 1) {
  const sourcePage = (caseData.startPage || 1) + page - 1;
  const figure = document.createElement("figure");
  figure.className = "case-page";
  figure.dataset.page = String(page);
  figure.id = `case-page-${page}`;

  const picture = document.createElement("picture");
  const mobileSource = document.createElement("source");
  mobileSource.media = "(max-width: 760px)";
  mobileSource.srcset = `../../assets/projects/archive-mobile/${caseData.folder}/page-${formatPage(sourcePage)}.jpg`;
  const image = document.createElement("img");
  image.src = `../../assets/projects/archive/${caseData.folder}/page-${formatPage(sourcePage)}.jpg`;
  image.alt = `${caseData.title}案例第 ${page} 页`;
  image.loading = page <= 2 ? "eager" : "lazy";
  image.decoding = "async";
  image.fetchPriority = page === 1 ? "high" : "auto";

  const caption = document.createElement("figcaption");
  caption.textContent = formatPage(page);

  picture.append(mobileSource, image);
  figure.append(picture, caption);
  fragment.append(figure);
}

pagesContainer.append(fragment);

const pageElements = [...document.querySelectorAll(".case-page")];

const updateControls = (page) => {
  currentPage = Math.min(Math.max(page, 1), caseData.pages);
  currentPageLabel.textContent = formatPage(currentPage);
  controlCurrentPage.textContent = formatPage(currentPage);
  previousPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === caseData.pages;
  const activeChapterPage = getActiveChapterPage(currentPage);
  chapterLinks.querySelectorAll("a").forEach((link) => {
    const active = Number(link.dataset.chapterPage) === activeChapterPage;
    link.classList.toggle("is-active", active);
    link.setAttribute("aria-current", active ? "location" : "false");
  });
};

const goToPage = (page) => {
  const targetPage = Math.min(Math.max(page, 1), caseData.pages);
  pageElements[targetPage - 1]?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
  updateControls(targetPage);
};

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) {
      updateControls(Number(visible.target.dataset.page));
    }
  },
  { rootMargin: "-18% 0px -48%", threshold: [0.05, 0.35, 0.65] },
);

pageElements.forEach((page) => observer.observe(page));

previousPageButton.addEventListener("click", () => goToPage(currentPage - 1));
nextPageButton.addEventListener("click", () => goToPage(currentPage + 1));

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    goToPage(currentPage - 1);
  }

  if (event.key === "ArrowRight") {
    goToPage(currentPage + 1);
  }
});

updateControls(1);
