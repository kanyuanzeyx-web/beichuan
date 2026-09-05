const stageData = {
  template: {
    index: "01 / 05",
    title: "先通过模板理解可以获得什么结果",
    copy: "用户从图片或视频模板开始，按行业、比例与内容方向筛选，先确认目标画面，再进入具体任务。",
    label: "内容模板",
    items: ["图片或视频", "行业与画面比例", "专属内容模板"],
    decision: "让模板成为任务入口，先帮助用户判断内容方向，再逐步暴露模型与生成配置。",
    image: "../../assets/projects/bthree/workflow-03-template-selection.png",
    alt: "B.THREE 内容模板库，展示图片视频类型与模板筛选",
  },
  asset: {
    index: "02 / 05",
    title: "在模板内选择系统示例或自己的商品模型",
    copy: "系统示例模型让新用户无需准备资产即可体验；真实生产时，可选择模型库、本地上传，或通过扫描服务补齐商品模型。",
    label: "商品模型",
    items: ["系统示例模型", "模型库或本地上传", "扫描建模服务"],
    decision: "不同模型来源只改变资产准备方式，不改变后续调整、生成和交付路径。",
    image: "../../assets/projects/bthree/workflow-02-model-selection.png",
    alt: "B.THREE 商品模型选择弹窗，展示系统模型、用户模型与上传入口",
  },
  edit: {
    index: "03 / 05",
    title: "用直接操作和实时预览替代抽象参数",
    copy: "用户在真实画面中移动、旋转和缩放商品，立即检查模型与场景的关系，再决定是否进入生成。",
    label: "实时预览",
    items: ["移动商品位置", "旋转与缩放", "检查场景关系"],
    decision: "保留专业控制能力，但把它转译成看得见结果的视觉操作，降低非专业用户的理解成本。",
    image: "../../assets/projects/bthree/upload-materials-home.png",
    alt: "B.THREE 模板编辑界面，用户可在场景中调整商品模型并实时预览",
  },
  generate: {
    index: "04 / 05",
    title: "把输出规格集中到一次生成行为中",
    copy: "用户确认模型后，集中选择图片或视频、输出分辨率和背景颜色适配；关键设置在生成前一次检查。",
    label: "内容生成",
    items: ["导入商品模型", "图片或视频", "分辨率与颜色适配"],
    decision: "用业务结果组织参数，减少多个页面之间的往返，同时保证至少选择一种有效输出。",
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

const decisionData = {
  template: {
    index: "DECISION 01 / ENTRY",
    title: "先选择内容模板，再补齐商品模型。",
    copy: "用户首先看见可以产出的画面与内容类型，在确认方向后进入模板编辑，再选择自己的商品模型。",
    problem: "避免用户在还看不到结果时，就先处理上传与建模成本。",
    outcome: "任务入口从“我有什么资产”转向“我想做什么内容”。",
    image: "../../assets/projects/bthree/workflow-03-template-selection.png",
    alt: "B.THREE 内容模板库，用户先浏览目标画面再开始任务",
  },
  trial: {
    index: "DECISION 02 / ONBOARDING",
    title: "用系统示例模型，让用户立即理解产品。",
    copy: "没有准备商品资产的用户也可以直接选择系统模型完成一次体验；进入真实任务时，再切换为模型库、本地上传或扫描建模。",
    problem: "首次体验不应该被模型文件、格式和建模周期挡住。",
    outcome: "试用与真实生产共用同一条流程，体验不会变成孤立 Demo。",
    image: "../../assets/projects/bthree/workflow-02-model-selection.png",
    alt: "B.THREE 模型选择弹窗，包含系统示例模型和用户上传入口",
  },
  control: {
    index: "DECISION 03 / CONTROL",
    title: "让专业参数变成可以直接操作的画面。",
    copy: "位置、旋转与缩放不再只是数值输入。用户在模板场景里调整商品，并通过实时预览判断构图和比例。",
    problem: "完全隐藏参数会失去控制，全部暴露参数又会提高使用门槛。",
    outcome: "用户保留必要控制，同时不必先学习 3D 软件。",
    image: "../../assets/projects/bthree/upload-materials-home.png",
    alt: "B.THREE 模板编辑界面中的商品模型直接操作与实时预览",
  },
  result: {
    index: "DECISION 04 / DELIVERY",
    title: "把不确定的生成过程，变成可追踪的结果闭环。",
    copy: "进行中、失败与已完成任务都保留在项目中，用户可以比较结果、重新生成、选择版本并完成下载交付。",
    problem: "AI 生成结果不稳定，点击生成并不等于任务完成。",
    outcome: "每一次生成都有状态、版本和明确的下一步动作。",
    image: "../../assets/projects/bthree/workflow-05-delivery.png",
    alt: "B.THREE 项目结果页面，展示生成状态、版本与交付操作",
  },
};

const stageButtons = [...document.querySelectorAll(".workflow__tabs [data-stage]")];
const decisionButtons = [...document.querySelectorAll(".decision-explorer__tabs [data-decision]")];
const demo = document.getElementById("workflow-demo");
const title = document.getElementById("demo-title");
const copy = document.getElementById("demo-copy");
const label = document.getElementById("demo-screen-label");
const list = document.getElementById("demo-list");
const crumbLabel = document.getElementById("demo-crumb-label");
const demoIndex = document.getElementById("demo-index");
const demoDecision = document.getElementById("demo-decision");
const demoImage = document.getElementById("demo-image");
const decisionPanel = document.getElementById("decision-panel");
const decisionImage = document.getElementById("decision-image");
const decisionIndex = document.getElementById("decision-index");
const decisionTitle = document.getElementById("decision-title");
const decisionCopy = document.getElementById("decision-copy");
const decisionProblem = document.getElementById("decision-problem");
const decisionOutcome = document.getElementById("decision-outcome");
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
  button.parentElement?.style.setProperty("--workflow-progress", `${((stageButtons.indexOf(button) + 1) / stageButtons.length) * 100}%`);
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

function activateDecision(button, focus = false) {
  const content = decisionData[button.dataset.decision];
  if (!content || !decisionPanel || !decisionImage || !decisionIndex || !decisionTitle || !decisionCopy || !decisionProblem || !decisionOutcome) return;

  setActiveTab(decisionButtons, button);
  button.parentElement?.style.setProperty("--decision-progress", `${((decisionButtons.indexOf(button) + 1) / decisionButtons.length) * 100}%`);
  decisionPanel.setAttribute("aria-labelledby", button.id);
  decisionPanel.classList.remove("is-updating");
  void decisionPanel.offsetWidth;
  decisionPanel.classList.add("is-updating");
  decisionImage.src = content.image;
  decisionImage.alt = content.alt;
  decisionIndex.textContent = content.index;
  decisionTitle.textContent = content.title;
  decisionCopy.textContent = content.copy;
  decisionProblem.textContent = content.problem;
  decisionOutcome.textContent = content.outcome;
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
enableArrowTabNavigation(decisionButtons, activateDecision);
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
const railLinks = [...document.querySelectorAll('.case-rail a[href^="#"]')];
const sectionLinks = [...navLinks, ...railLinks];
const navSections = [...new Set(sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean))];

if ("IntersectionObserver" in window && navSections.length) {
  const navObserver = new IntersectionObserver((entries) => {
    const activeEntry = entries.find((entry) => entry.isIntersecting);
    if (!activeEntry) return;

    sectionLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${activeEntry.target.id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-34% 0px -54%", threshold: 0.01 });
  navSections.forEach((section) => navObserver.observe(section));
}

const problemStory = document.querySelector("[data-problem-story]");
const problemSteps = [...document.querySelectorAll("[data-problem-step]")];
const desktopStory = window.matchMedia("(min-width: 901px)");
let problemFrame = 0;

function updateProblemStory() {
  problemFrame = 0;
  if (!problemStory || !problemSteps.length || !desktopStory.matches || motionPreference.matches) {
    problemSteps.forEach((step) => step.removeAttribute("aria-hidden"));
    return;
  }

  const rect = problemStory.getBoundingClientRect();
  const distance = Math.max(1, problemStory.offsetHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -rect.top / distance));
  const activeIndex = Math.min(problemSteps.length - 1, Math.floor(progress * problemSteps.length));

  problemStory.style.setProperty("--problem-progress", `${progress * 100}%`);
  problemSteps.forEach((step, index) => {
    const active = index === activeIndex;
    step.classList.toggle("is-active", active);
    step.setAttribute("aria-hidden", String(!active));
  });
}

function requestProblemUpdate() {
  if (problemFrame) return;
  problemFrame = window.requestAnimationFrame(updateProblemStory);
}

if (problemStory) {
  window.addEventListener("scroll", requestProblemUpdate, { passive: true });
  window.addEventListener("resize", requestProblemUpdate);
  desktopStory.addEventListener?.("change", requestProblemUpdate);
  updateProblemStory();
}

if (heroPreview && !motionPreference.matches && window.matchMedia("(pointer: fine)").matches) {
  heroPreview.addEventListener("pointermove", (event) => {
    const rect = heroPreview.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
    heroPreview.style.setProperty("--hero-x", `${x}px`);
    heroPreview.style.setProperty("--hero-y", `${y}px`);
  });
  heroPreview.addEventListener("pointerleave", () => {
    heroPreview.style.setProperty("--hero-x", "0px");
    heroPreview.style.setProperty("--hero-y", "0px");
  });
}
