const stageData = {
  template: {
    index: "01 / 05",
    title: "任务入口与商品模型来源在第一步完成确认",
    copy: "用户可以从内容模板开始任务；进入商品生产前仍需关联已有 3D 模型，没有模型时则预约扫描服务。",
    label: "开始方式",
    items: ["添加内容模板", "上传已有模型", "预约扫描服务"],
    decision: "将内容入口与模型准备放在同一工作台，但始终以可用的商品模型作为稳定生成的前提。",
    image: "../../assets/projects/bthree/workflow-01-start-method.png",
    alt: "B.THREE 选择开始方式页面，包含添加内容模板、上传模型和预约扫描服务入口",
  },
  asset: {
    index: "02 / 05",
    title: "模型库成为内容生产的商品主体入口",
    copy: "用户可选择已经上传或扫描完成的商品模型，也可以在此补充本地上传；确认后，后续模板与生成任务都围绕同一模型展开。",
    label: "商品模型",
    items: ["模型库选择", "本地上传", "确认商品主体"],
    decision: "先固定商品主体，再进入模板和内容配置，避免不同步骤重复选择，也降低前后生成结果不一致。",
    image: "../../assets/projects/bthree/workflow-02-model-selection.png",
    alt: "B.THREE 商品模型选择弹窗，展示已上传模型与本地上传入口",
  },
  edit: {
    index: "03 / 05",
    title: "专属模板承接图片与视频的表达方向",
    copy: "模板按品类、画面比例和视觉方向筛选；生成的关键帧图片同时成为项目资产，服务后续视频内容制作。",
    label: "模板中心",
    items: ["图片或视频", "行业与比例", "专属内容模板"],
    decision: "模板不是装饰素材库，而是把品牌画面、比例与产出形式预先组织好的内容生产规则。",
    image: "../../assets/projects/bthree/workflow-03-template-selection.png",
    alt: "B.THREE 模板中心页面，展示模板筛选、专属模板和最近项目",
  },
  generate: {
    index: "04 / 05",
    title: "模型、输出规格与 AI 适配集中完成配置",
    copy: "用户确认商品模型后，选择图片或视频、输出分辨率，并决定是否启用 AI 背景颜色适配；关键设置在生成前即可检查。",
    label: "内容生成",
    items: ["导入商品模型", "图片或视频", "分辨率与颜色适配"],
    decision: "把影响输出质量的关键配置集中在生成前，并将技术参数翻译成用户能够直接判断的内容选项。",
    image: "../../assets/projects/bthree/workflow-04-generation-config.png",
    alt: "B.THREE 场景配置面板，展示模型导入、输出类型、分辨率和背景颜色适配",
  },
  result: {
    index: "05 / 05",
    title: "生成任务与交付版本沉淀为项目资产",
    copy: "把文件夹、生成结果、使用模型、任务状态与交付操作汇集到同一处，让团队能够持续追踪、管理和复用内容。",
    label: "项目结果",
    items: ["项目文件夹", "生成任务状态", "批量管理交付"],
    decision: "将生成过程和结果统一沉淀到项目中，既保留失败与进行中的任务，也让已完成内容可以继续管理和交付。",
    image: "../../assets/projects/bthree/workflow-05-delivery.png",
    alt: "B.THREE 项目交付页面，展示文件夹、生成结果、使用模型和任务状态",
  },
};

const stageButtons = [...document.querySelectorAll("[data-stage]")];
const demo = document.getElementById("workflow-demo");
const title = document.getElementById("demo-title");
const copy = document.getElementById("demo-copy");
const label = document.getElementById("demo-screen-label");
const list = document.getElementById("demo-list");
const crumbLabel = document.getElementById("demo-crumb-label");
const demoIndex = document.getElementById("demo-index");
const demoDecision = document.getElementById("demo-decision");
const demoImage = document.getElementById("demo-image");
const heroPreview = document.querySelector(".product-preview");
const heroStepButtons = [...document.querySelectorAll("[data-hero-step]")];
const heroStepKicker = document.getElementById("hero-step-kicker");
const heroStepTitle = document.getElementById("hero-step-title");
const heroStepCopy = document.getElementById("hero-step-copy");
const heroStepAdvance = document.getElementById("hero-step-advance");
const heroPreviewCaption = document.getElementById("hero-preview-caption");
const heroStepData = {
  asset: {
    kicker: "01 / 04 真实产品界面",
    title: "先用商品资产确定内容生产的起点",
    copy: "上传已有 3D 模型；没有模型时预约扫描服务，让不同基础条件的客户都能进入同一条生产路径。",
  },
  model: {
    kicker: "02 / 04 商品一致性的基础",
    title: "让商品模型成为每一次生成的稳定基底",
    copy: "模型与商品资料进入同一项目管理，确保后续图片、关键帧和视频都围绕同一个商品主体持续生产。",
  },
  template: {
    kicker: "03 / 04 可控的表达规则",
    title: "用专属模板预先组织场景、光影与比例",
    copy: "模板把品牌表达、输出形式和画面结构变成可选择的内容规则，减少结果不可控与重复沟通。",
  },
  output: {
    kicker: "04 / 04 可复用的项目结果",
    title: "让图片、关键帧与视频回到项目资产",
    copy: "生成结果以版本和项目维度沉淀，让图片与视频不止完成一次交付，也能支持后续持续创作。",
  },
};

function setActiveTab(buttons, activeButton) {
  buttons.forEach((item) => {
    const active = item === activeButton;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-selected", String(active));
    item.setAttribute("tabindex", active ? "0" : "-1");
  });
}

function activateStage(button, focus = false) {
  const stage = button.dataset.stage;
  const content = stageData[stage];
  if (!content || !demo || !title || !copy || !label || !list || !crumbLabel || !demoIndex || !demoDecision) return;

  setActiveTab(stageButtons, button);
  demo.dataset.stage = stage;
  demo.setAttribute("aria-labelledby", button.id);
  demo.classList.remove("is-updating");
  void demo.offsetWidth;
  demo.classList.add("is-updating");
  title.textContent = content.title;
  copy.textContent = content.copy;
  label.textContent = content.label;
  crumbLabel.textContent = content.label;
  demoIndex.textContent = content.index;
  demoDecision.textContent = content.decision;
  if (demoImage) {
    demoImage.src = content.image;
    demoImage.alt = content.alt;
  }
  list.replaceChildren(...content.items.map((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    return li;
  }));
  if (focus) button.focus();
}

function activateHeroStep(button, focus = false) {
  const step = button.dataset.heroStep;
  const content = heroStepData[step];
  if (!content || !heroPreview) return;

  heroPreview.dataset.heroStep = step;
  heroPreviewCaption?.setAttribute("aria-labelledby", button.id);
  setActiveTab(heroStepButtons, button);
  if (heroStepKicker) heroStepKicker.textContent = content.kicker;
  if (heroStepTitle) heroStepTitle.textContent = content.title;
  if (heroStepCopy) heroStepCopy.textContent = content.copy;
  if (focus) button.focus();
}

function enableArrowTabNavigation(buttons, activate) {
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activate(button));
    button.addEventListener("keydown", (event) => {
      const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
      if (!keys.includes(event.key)) return;

      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % buttons.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = buttons.length - 1;
      activate(buttons[nextIndex], true);
    });
  });
}

enableArrowTabNavigation(stageButtons, activateStage);
enableArrowTabNavigation(heroStepButtons, activateHeroStep);

heroStepAdvance?.addEventListener("click", () => {
  const currentIndex = heroStepButtons.findIndex((button) => button.classList.contains("is-active"));
  const nextIndex = (currentIndex + 1) % heroStepButtons.length;
  activateHeroStep(heroStepButtons[nextIndex]);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", link.getAttribute("href"));
  });
});

const alignInitialHash = () => {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  target?.scrollIntoView({ behavior: "instant", block: "start" });
};

window.addEventListener("load", () => window.setTimeout(alignInitialHash, 180), { once: true });
document.fonts?.ready.then(alignInitialHash);

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealElements = [...document.querySelectorAll("[data-reveal], [data-reveal-group]")];

if (!motionPreference.matches && "IntersectionObserver" in window) {
  document.body.classList.add("has-motion");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -5%" });
  revealElements.forEach((element) => revealObserver.observe(element));

  if (heroPreview) {
    const heroPreviewObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      heroPreview.classList.add("is-in-view");
      observer.disconnect();
    }, { threshold: 0.35 });
    heroPreviewObserver.observe(heroPreview);
  }
}

const navLinks = [...document.querySelectorAll('.topbar__nav a[href^="#"]')];
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && navSections.length) {
  const navObserver = new IntersectionObserver((entries) => {
    const activeEntry = entries.find((entry) => entry.isIntersecting);
    if (!activeEntry) return;

    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${activeEntry.target.id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-34% 0px -54%", threshold: 0.01 });
  navSections.forEach((section) => navObserver.observe(section));
}
