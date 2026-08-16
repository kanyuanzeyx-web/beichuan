const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const storedTheme = localStorage.getItem("robam-portfolio-theme");

if (storedTheme) {
  root.dataset.theme = storedTheme;
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "light" ? "" : "light";
  if (nextTheme) {
    root.dataset.theme = nextTheme;
    localStorage.setItem("robam-portfolio-theme", nextTheme);
  } else {
    delete root.dataset.theme;
    localStorage.removeItem("robam-portfolio-theme");
  }
});

const screenData = {
  home: {
    className: "mock-page mock-page--home",
    kicker: "Official Website Home",
    title: "官网首页：建立品牌第一印象",
    body: "首页首屏负责建立高端厨电品牌感，下方通过品类、套系、活动和服务入口承接不同用户意图。",
    heroSmall: "全新数字化厨房体验",
    heroTitle: "用专业科技重塑烹饪日常",
    categories: ["油烟机", "蒸烤箱", "洗碗机", "集成灶"],
    cards: ["新品首发", "套系推荐", "服务保障"],
    points: ["深色主视觉强化科技感和专业感", "品类入口前置，减少用户寻找成本", "活动与商城入口保持一致的转化路径"],
  },
  campaign: {
    className: "mock-page mock-page--campaign",
    kicker: "Campaign Landing",
    title: "活动承接：让投放流量快速理解利益点",
    body: "活动页需要在短时间内说明优惠、套系、权益和购买入口，避免用户从广告进入后还要重新寻找信息。",
    heroSmall: "618 官方商城专享",
    heroTitle: "厨电焕新至高立减 1800 元",
    categories: ["满减券", "套系购", "以旧换新", "安装服务"],
    cards: ["爆款组合", "限时权益", "咨询导购"],
    points: ["促销利益点首屏清晰可见", "权益卡片统一语言，方便运营复用", "商品模块直接连接购买动作"],
  },
  detail: {
    className: "mock-page mock-page--detail",
    kicker: "Product Detail",
    title: "商品详情：把参数转化为购买理由",
    body: "详情页用主图、价格、规格、权益和场景卖点解释产品价值，让复杂厨电决策变得更确定。",
    heroSmall: "37X5H 大吸力油烟机",
    heroTitle: "24m3/min 大风量，厨房少油烟",
    categories: ["核心卖点", "规格参数", "安装服务", "用户评价"],
    cards: ["到手价 ¥4299", "官方质保", "免费设计"],
    points: ["重要卖点围绕用户痛点表达", "价格、权益和购买按钮同屏判断", "服务信息强化官方可信度"],
  },
  checkout: {
    className: "mock-page mock-page--checkout",
    kicker: "Checkout And Order",
    title: "支付订单：让交易反馈更稳定",
    body: "订单页重点解决商品核对、优惠确认、支付方式和状态反馈，降低高客单价商品的支付焦虑。",
    heroSmall: "订单待支付",
    heroTitle: "请在 14:59 内完成支付",
    categories: ["商品明细", "优惠抵扣", "支付方式", "售后保障"],
    cards: ["订单金额 ¥7,996", "微信扫码", "官方售后"],
    points: ["关键金额和状态突出展示", "支付方式减少选择干扰", "订单节点反馈清楚可追踪"],
  },
};

const tabs = document.querySelectorAll("[data-screen]");
const kicker = document.querySelector("[data-screen-kicker]");
const title = document.querySelector("[data-screen-title]");
const body = document.querySelector("[data-screen-body]");
const points = document.querySelector("[data-screen-points]");
const device = document.querySelector("[data-screen-device]");

function renderScreen(key) {
  const data = screenData[key];
  if (!data || !kicker || !title || !body || !points || !device) return;

  tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.screen === key);
  });

  kicker.textContent = data.kicker;
  title.textContent = data.title;
  body.textContent = data.body;
  points.innerHTML = data.points.map((item) => `<li>${item}</li>`).join("");
  device.innerHTML = `
    <div class="${data.className}">
      <div class="mock-topline">
        <strong>ROBAM 老板</strong>
        <span>产品</span><span>商城</span><span>服务</span>
      </div>
      <div class="mock-hero">
        <small>${data.heroSmall}</small>
        <strong>${data.heroTitle}</strong>
      </div>
      <div class="mock-category-row">
        ${data.categories.map((item) => `<span>${item}</span>`).join("")}
      </div>
      <div class="mock-card-row">
        ${data.cards.map((item) => `<span>${item}</span>`).join("")}
      </div>
    </div>
  `;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => renderScreen(tab.dataset.screen));
});
