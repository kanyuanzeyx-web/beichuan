const smoothWrapper = document.getElementById("smooth-wrapper");
const smoothContent = document.getElementById("smooth-content");
const heroFocus = document.getElementById("hero-focus");
const focusWords = ["LOUD STORIES", "VISUAL IMPACT", "BRAND ATTITUDE", "MEMORY TRIGGER"];
const heroPanel = document.querySelector(".hero");
const heroBackground = document.querySelector(".hero-background");
const heroTitle = document.querySelector(".hero-title");
const heroSub = document.querySelector(".hero-sub");
const heroIllustration = document.getElementById("hero-illustration");
const heroWorkingVideo = heroIllustration?.querySelector(".hero-state-working") || null;
const heroThinkingVideo = heroIllustration?.querySelector(".hero-state-thinking") || null;
const heroMobileMode = document.getElementById("hero-mobile-mode");
const siteLoader = document.getElementById("site-loader");
const siteLoaderLogo = document.getElementById("site-loader-logo");
const siteLoaderLogoFill = document.getElementById("site-loader-logo-fill");
const siteLoaderLogoPath = document.getElementById("site-loader-logo-path");
const siteLoaderStatus = document.getElementById("site-loader-status");
const heroButtons = [...document.querySelectorAll(".hero-bottom .button")];
const heroParticleCanvas = document.getElementById("hero-particle-canvas");
const navLinks = [...document.querySelectorAll(".nav-link")];
const panels = [...document.querySelectorAll(".panel")];
const hiddenWorkStatuses = new Set([
  "VISUAL ASSETS PENDING",
  "SELECTED WORK HISTORY",
]);
const hiddenWorkIndices = new Set(["02"]);
const workBoxes = [...document.querySelectorAll(".work-box")].filter(
  (box) => !hiddenWorkStatuses.has(box.dataset.status || "")
    && !hiddenWorkIndices.has(box.dataset.index || "")
);
const featuredWorkIndices = new Set(["01", "03", "06", "07", "10"]);
const workTitleOverrides = new Map([
  ["07", "Fancy 电商数据监控小程序"],
  ["08", "工业与环保数据可视化"],
  ["11", "3维视觉与插画"],
]);
workBoxes.forEach((box) => {
  const nextTitle = workTitleOverrides.get(box.dataset.index || "");
  if (!nextTitle) {
    return;
  }
  box.dataset.title = nextTitle;
  const title = box.querySelector(".work-title");
  if (title) {
    title.textContent = nextTitle;
  }
});
const featuredWorkBoxes = workBoxes.filter((box) => featuredWorkIndices.has(box.dataset.index || ""));
const additionalWorkBoxes = workBoxes.filter((box) => !featuredWorkIndices.has(box.dataset.index || ""));
const workListing = document.getElementById("work-listing");
const workPanel = document.getElementById("projects");
const workLayout = workPanel?.querySelector(".work-layout") || null;
const experiencePanel = document.getElementById("experience");
const experienceLayout = experiencePanel?.querySelector(".experience-layout") || null;
const experienceSlider = document.getElementById("experience-slider");
const experienceTrackFill = experiencePanel?.querySelector(".experience-track-fill") || null;
const experienceNodes = [...document.querySelectorAll(".experience-node")];
const experienceItems = [...document.querySelectorAll(".experience-item")];

const detailCover = document.getElementById("detail-cover");
const workDetail = document.getElementById("work-detail");
const detailEnterLink = document.getElementById("detail-enter-link");
const storyDialog = document.getElementById("project-story-dialog");
const storyDialogClose = document.getElementById("story-dialog-close");
const storyIndex = document.getElementById("story-index");
const storyClient = document.getElementById("story-client");
const storyTitle = document.getElementById("story-title");
const storyDescription = document.getElementById("story-description");
const storyBackground = document.getElementById("story-background");
const storyRole = document.getElementById("story-role");
const storyProcess = document.getElementById("story-process");
const storySolution = document.getElementById("story-solution");
const storyResult = document.getElementById("story-result");
const casePreviewDialog = document.getElementById("case-preview-dialog");
const casePreviewClose = document.getElementById("case-preview-close");
const casePreviewTitle = document.getElementById("case-preview-title");
const casePreviewSubtitle = document.getElementById("case-preview-subtitle");
const casePreviewPages = document.getElementById("case-preview-pages");
const casePreviewDocument = document.getElementById("case-preview-document");
const casePreviewNavItems = [...document.querySelectorAll(".case-preview-dialog__nav [data-preview-page]")];

let focusIndex = 0;
let maxHorizontal = 0;
let maxScrollTop = 0;
let experiencePinDistance = 0;
let experiencePinStartY = 0;
let experiencePinEndY = 0;
let workPinDistance = 0;
let workPinStartY = 0;
let workPinEndY = 0;
let currentX = 0;
let targetX = 0;
let currentExperienceProgress = 0;
let targetExperienceProgress = 0;
let currentWorkProgress = 0;
let targetWorkProgress = 0;
let rafId = null;
let activePanelId = panels[0]?.id || "home";
let heroTitleTransitionId = 0;
let navigationSettleTimer = 0;
let navigationBoostUntil = 0;
let activeWorkBox = null;
let casePreviewScrollY = 0;
let workShowcase = null;
let workCaseTrack = null;
let workCaseSlides = [];
let workCaseRail = null;
let activeWorkSlideIndex = -1;
let lastRenderedWorkProgress = 0;
let workScrollDirection = 1;
const scrollLerp = 0.2;
const motionTiming = {
  heroSwitchOut: 190,
  heroSwitchClear: 1080,
  heroVideoHold: 720,
  detailSwapClear: 1160,
};

const isDesktopHorizontal = () => window.matchMedia("(min-width: 861px)").matches
  && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const hasFinePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const rememberPortfolioReturn = (box = activeWorkBox) => {
  try {
    window.sessionStorage.setItem("portfolio:return-state", JSON.stringify({
      href: window.location.href,
      hash: window.location.hash,
      scrollY: window.scrollY,
      projectIndex: box?.dataset?.index || "",
      savedAt: Date.now(),
    }));
  } catch (error) {
    // History navigation remains the primary return path when storage is unavailable.
  }
};
const isLowEndDevice = () => {
  const cores = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8;
  return cores <= 4 || memory <= 4;
};
const shouldSimplifyMotion = () => prefersReducedMotion() || isLowEndDevice();

const initSiteLoader = () => {
  if (!siteLoader || !document.documentElement.classList.contains("is-preloading")) {
    if (siteLoader) {
      siteLoader.hidden = true;
    }
    return;
  }

  let logoReady = false;
  let triggerRequested = false;
  let transitionStarted = false;
  let touchStartY = null;
  const useClassicIntro = new URLSearchParams(window.location.search).get("introStyle") === "classic";

  const completeIntro = () => {
    siteLoader.classList.add("is-covered");
    document.documentElement.classList.remove("is-preloading");
    document.documentElement.classList.add("has-entered");

    requestAnimationFrame(() => {
      siteLoader.hidden = true;
      try {
        window.sessionStorage.setItem("portfolio:intro-seen", "1");
      } catch (error) {
        // The intro simply runs again when storage is unavailable.
      }
    });
  };

  const startLogoZoom = () => {
    if (!logoReady) {
      triggerRequested = true;
      return;
    }
    if (transitionStarted || !siteLoaderLogo) {
      return;
    }

    transitionStarted = true;
    siteLoader.classList.add("is-zooming");
    siteLoaderStatus.textContent = "正在进入北川作品集";

    const rect = siteLoaderLogo.getBoundingClientRect();
    // Zoom through the broad lower-left stroke of the C, which sits closer to
    // the viewport center and leaves more solid fill around the focal point.
    const focusX = 845 / 1881;
    const focusY = 510 / 835;
    const focusScreenX = rect.left + rect.width * focusX;
    const focusScreenY = rect.top + rect.height * focusY;
    const shiftX = window.innerWidth * 0.5 - focusScreenX;
    const shiftY = window.innerHeight * 0.5 - focusScreenY;
    const focusRadius = Math.max(7, rect.width * (16 / 1881));
    const viewportRadius = Math.hypot(window.innerWidth, window.innerHeight) * 0.5;
    const coverScale = clamp((viewportRadius / focusRadius) * 1.9, 52, 280);
    const duration = prefersReducedMotion() ? 420 : 1180;

    siteLoaderLogo.style.transformOrigin = `${focusX * 100}% ${focusY * 100}%`;
    const zoom = siteLoaderLogo.animate([
      { transform: "translate3d(0, 0, 0) scale(1)", offset: 0 },
      { transform: `translate3d(${shiftX * 0.08}px, ${shiftY * 0.08}px, 0) scale(2)`, offset: 0.32 },
      { transform: `translate3d(${shiftX * 0.34}px, ${shiftY * 0.34}px, 0) scale(5.5)`, offset: 0.58 },
      { transform: `translate3d(${shiftX * 0.72}px, ${shiftY * 0.72}px, 0) scale(${Math.max(12, coverScale * 0.3)})`, offset: 0.82 },
      { transform: `translate3d(${shiftX}px, ${shiftY}px, 0) scale(${coverScale})`, offset: 1 },
    ], {
      duration,
      easing: "cubic-bezier(0.76, 0, 0.24, 1)",
      fill: "forwards",
    });

    zoom.finished.then(completeIntro).catch(completeIntro);
  };

  const setLogoReady = () => {
    logoReady = true;
    siteLoader.classList.add("is-ready");
    siteLoaderStatus.textContent = "BeiChuan 标志书写完成，点击、滚动或上滑进入作品集";
    if (triggerRequested) {
      startLogoZoom();
    }
  };

  const revealFilledLogo = () => {
    if (!siteLoaderLogoFill) {
      setLogoReady();
      return Promise.resolve();
    }
    const fillReveal = siteLoaderLogoFill.animate([
      { opacity: 0 },
      { opacity: 1 },
    ], {
      duration: prefersReducedMotion() ? 80 : 220,
      easing: "ease-out",
      fill: "forwards",
    });
    const pathRetire = siteLoaderLogoPath?.animate([
      { opacity: 1 },
      { opacity: 0 },
    ], {
      duration: prefersReducedMotion() ? 80 : 220,
      easing: "ease-out",
      fill: "forwards",
    });
    return Promise.all([
      fillReveal.finished.catch(() => {}),
      pathRetire?.finished.catch(() => {}) || Promise.resolve(),
    ]).then(setLogoReady);
  };

  const drawLogo = async () => {
    if (!siteLoaderLogoPath) {
      await revealFilledLogo();
      return;
    }

    try {
      let paths = [...siteLoaderLogoPath.querySelectorAll("path")];
      if (!paths.length) {
        throw new Error("Logo path unavailable");
      }

      if (!useClassicIntro) {
        const svg = siteLoaderLogoPath.querySelector("svg");
        const svgNamespace = "http://www.w3.org/2000/svg";
        const maskId = "beichuan-logo-write-mask";
        const defs = document.createElementNS(svgNamespace, "defs");
        const mask = document.createElementNS(svgNamespace, "mask");
        const maskGroup = document.createElementNS(svgNamespace, "g");
        const logoImage = document.createElementNS(svgNamespace, "image");
        const maskPaths = paths.map((path) => path.cloneNode());

        mask.id = maskId;
        mask.setAttribute("maskUnits", "userSpaceOnUse");
        mask.setAttribute("x", "0");
        mask.setAttribute("y", "0");
        mask.setAttribute("width", "1881");
        mask.setAttribute("height", "835");
        maskPaths.forEach((path) => maskGroup.appendChild(path));
        mask.appendChild(maskGroup);
        defs.appendChild(mask);

        logoImage.setAttribute("href", "./assets/intro/beichuan-logo.svg");
        logoImage.setAttribute("x", "0");
        logoImage.setAttribute("y", "0");
        logoImage.setAttribute("width", "1881");
        logoImage.setAttribute("height", "835");
        logoImage.setAttribute("preserveAspectRatio", "xMidYMid meet");
        logoImage.setAttribute("mask", `url(#${maskId})`);

        paths.forEach((path) => path.remove());
        svg.prepend(defs);
        svg.appendChild(logoImage);
        siteLoaderLogoPath.classList.add("is-mask-mode");
        paths = maskPaths;
      }

      const timing = [
        [0, 720],
        [390, 560],
        [760, 760],
        [1250, 150],
        [1320, 440],
      ];
      const maskStrokeWidths = [180, 156, 196, 92, 132];
      const animations = paths.map((path, index) => {
        const length = path.getTotalLength();
        path.style.stroke = useClassicIntro ? "#272b30" : "#ffffff";
        path.style.strokeWidth = useClassicIntro ? "28" : String(maskStrokeWidths[index] || 180);
        path.style.strokeLinecap = "round";
        path.style.strokeLinejoin = "round";
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.style.opacity = "1";
        const [delay, duration] = timing[index] || [index * 300, 620];
        return path.animate([
          { strokeDashoffset: length },
          { strokeDashoffset: 0 },
        ], {
          delay: prefersReducedMotion() ? 0 : delay,
          duration: prefersReducedMotion() ? 120 : duration,
          easing: "cubic-bezier(0.33, 1, 0.68, 1)",
          fill: "forwards",
        }).finished.catch(() => {});
      });

      await Promise.all(animations);
      await revealFilledLogo();
    } catch (error) {
      await revealFilledLogo();
    }
  };

  siteLoader.addEventListener("click", startLogoZoom);
  siteLoader.addEventListener("wheel", (event) => {
    if (event.deltaY > 0) {
      event.preventDefault();
      startLogoZoom();
    }
  }, { passive: false });
  siteLoader.addEventListener("touchstart", (event) => {
    touchStartY = event.touches[0]?.clientY ?? null;
  }, { passive: true });
  siteLoader.addEventListener("touchend", (event) => {
    const touchEndY = event.changedTouches[0]?.clientY ?? null;
    if (touchStartY !== null && touchEndY !== null && touchStartY - touchEndY > 24) {
      startLogoZoom();
    }
    touchStartY = null;
  }, { passive: true });
  siteLoader.addEventListener("keydown", (event) => {
    if (["Enter", " ", "ArrowDown", "PageDown"].includes(event.key)) {
      event.preventDefault();
      startLogoZoom();
    }
  });

  drawLogo();
};
const normalizeCaseLink = (link) => {
  const value = (link || "").trim();

  if (!value || /^(https?:|mailto:|tel:|#)/i.test(value)) {
    return value;
  }

  const [, path = value, suffix = ""] = value.match(/^([^?#]*)([?#].*)?$/) || [];

  if (!/\/?projects\//.test(path) || /\.[a-z0-9]+$/i.test(path)) {
    return value;
  }

  return `${path.replace(/\/?$/, "/")}index.html${suffix}`;
};

const heroTitleContent = {
  working: {
    label: "Building products after midnight",
    lines: [
      { text: "BUILDING" },
      { text: "PRODUCTS", accent: true },
      { text: "AFTER" },
      { text: "MIDNIGHT" },
    ],
    subLines: [
      "SENIOR UI / PRODUCT DESIGNER",
      "AI PRODUCTS · B2B SYSTEMS · AIGC EXPERIENCE",
      "Turning complex technology into clear, usable products.",
    ],
  },
  thinking: {
    label: "Thinking in frames before they move",
    lines: [
      { text: "THINKING" },
      { text: "IN FRAMES", accent: true },
      { text: "BEFORE" },
      { text: "THEY MOVE" },
    ],
    subLines: [
      "SENIOR UI / PRODUCT DESIGNER",
      "STORY · FRAME · VISUAL DIRECTION",
      "Shaping the story before the frame begins to move.",
    ],
  },
};

const renderHeroTitle = (state, shouldAnimate = false) => {
  if (!heroTitle) {
    return;
  }

  const copy = heroTitleContent[state] || heroTitleContent.working;

  const applyTitle = () => {
    heroTitle.setAttribute("aria-label", copy.label);

    const titleFragment = document.createDocumentFragment();
    copy.lines.forEach((line, index) => {
      const span = document.createElement("span");
      span.className = line.accent ? "hero-line hero-line-accent" : "hero-line";
      span.style.setProperty("--line-index", String(index));
      span.textContent = line.text;
      titleFragment.appendChild(span);
    });

    heroTitle.replaceChildren(titleFragment);
    heroTitle.dataset.state = state;
  };

  const applySub = () => {
    if (!heroSub || !copy.subLines) {
      return;
    }

    const subFragment = document.createDocumentFragment();
    copy.subLines.forEach((line, index) => {
      const span = document.createElement("span");
      span.style.setProperty("--sub-line-index", String(index));
      span.textContent = line;
      subFragment.appendChild(span);
    });

    heroSub.replaceChildren(subFragment);
    heroSub.dataset.state = state;
  };

  if (!shouldAnimate) {
    window.clearTimeout(heroTitle.__switchOutTimer);
    window.clearTimeout(heroTitle.__switchTimer);
    heroTitle.classList.remove("is-leaving", "is-switching");
    heroSub?.classList.remove("is-leaving", "is-switching");
    applyTitle();
    applySub();
    return;
  }

  const transitionId = ++heroTitleTransitionId;
  window.clearTimeout(heroTitle.__switchOutTimer);
  window.clearTimeout(heroTitle.__switchTimer);
  heroTitle.classList.remove("is-switching");
  heroSub?.classList.remove("is-switching");
  heroTitle.classList.add("is-leaving");
  heroSub?.classList.add("is-leaving");

  heroTitle.__switchOutTimer = window.setTimeout(() => {
    if (transitionId !== heroTitleTransitionId) {
      return;
    }

    applyTitle();
    applySub();
    heroTitle.classList.remove("is-leaving");
    heroSub?.classList.remove("is-leaving");
    void heroTitle.offsetWidth;
    if (heroSub) {
      void heroSub.offsetWidth;
    }
    heroTitle.classList.add("is-switching");
    heroSub?.classList.add("is-switching");

    heroTitle.__switchTimer = window.setTimeout(() => {
      if (transitionId === heroTitleTransitionId) {
        heroTitle.classList.remove("is-switching");
        heroSub?.classList.remove("is-switching");
      }
    }, motionTiming.heroSwitchClear);
  }, motionTiming.heroSwitchOut);
};

const splitNavText = (link) => {
  if (!link || link.dataset.navSplit === "true") {
    return;
  }

  const raw = (link.textContent || "").trim();
  if (!raw) {
    return;
  }

  link.dataset.navSplit = "true";
  link.setAttribute("aria-label", raw);
  link.textContent = "";

  [...raw].forEach((char, index) => {
    const span = document.createElement("span");
    span.className = "nav-char";
    span.setAttribute("aria-hidden", "true");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.setProperty("--char-index", String(index));
    link.appendChild(span);
  });
};

const playNavHover = (link) => {
  if (!link || link.classList.contains("selected")) {
    return;
  }

  link.classList.remove("nav-hover-play");
  void link.offsetWidth;
  link.classList.add("nav-hover-play");

  const charCount = link.querySelectorAll(".nav-char").length || 1;
  const duration = 420 + charCount * 22;
  window.clearTimeout(link.__navHoverTimer);
  link.__navHoverTimer = window.setTimeout(() => {
    link.classList.remove("nav-hover-play");
  }, duration);
};

const bindNavHoverMotion = () => {
  if (!navLinks.length) {
    return;
  }

  navLinks.forEach((link) => splitNavText(link));

  if (!hasFinePointer()) {
    return;
  }

  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => playNavHover(link));
  });
};

if (heroFocus) {
  setInterval(() => {
    heroFocus.style.opacity = "0";
    heroFocus.style.transform = "translateY(12px)";

    setTimeout(() => {
      focusIndex = (focusIndex + 1) % focusWords.length;
      heroFocus.textContent = focusWords[focusIndex];
      heroFocus.style.opacity = "1";
      heroFocus.style.transform = "translateY(0)";
    }, 200);
  }, 2200);
}

const bindHeroButtonMagnet = () => {
  if (!heroButtons.length || !hasFinePointer() || shouldSimplifyMotion()) {
    return;
  }

  heroButtons.forEach((button) => {
    let rect = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frameId = 0;

    const animate = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      button.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

      if (Math.abs(targetX - currentX) > 0.08 || Math.abs(targetY - currentY) > 0.08) {
        frameId = requestAnimationFrame(animate);
        return;
      }

      currentX = targetX;
      currentY = targetY;
      button.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      frameId = 0;
    };

    const requestFrame = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate);
      }
    };

    button.addEventListener("pointerenter", () => {
      rect = button.getBoundingClientRect();
      button.classList.add("is-magnetic");
    });

    button.addEventListener("pointermove", (event) => {
      rect = rect || button.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      targetX = nx * 8;
      targetY = ny * 5;
      requestFrame();
    }, { passive: true });

    const reset = () => {
      rect = null;
      targetX = 0;
      targetY = 0;
      button.classList.remove("is-magnetic");
      requestFrame();
    };

    button.addEventListener("pointerleave", reset);
    button.addEventListener("blur", reset);
  });
};

const bindHeroParallax = () => {
  if (!heroPanel || shouldSimplifyMotion()) {
    return;
  }

  let tx = 0;
  let ty = 0;
  let cx = 0;
  let cy = 0;
  let running = false;
  let rect = heroPanel.getBoundingClientRect();

  const readRect = () => {
    rect = heroPanel.getBoundingClientRect();
  };

  const animate = () => {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;

    heroPanel.style.setProperty("--parallax-x", `${cx.toFixed(2)}px`);
    heroPanel.style.setProperty("--parallax-y", `${cy.toFixed(2)}px`);
    if (heroBackground) {
      heroBackground.style.transform = `translate3d(${(cx * -0.22).toFixed(2)}px, ${(cy * -0.18).toFixed(2)}px, 0)`;
    }
    if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
      requestAnimationFrame(animate);
      return;
    }

    running = false;
  };

  const tick = () => {
    if (!running) {
      running = true;
      requestAnimationFrame(animate);
    }
  };

  heroPanel.addEventListener("pointerenter", readRect);
  heroPanel.addEventListener("pointermove", (event) => {
    const nx = (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const ny = (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    tx = nx * 14;
    ty = ny * 10;

    tick();
  }, { passive: true });

  heroPanel.addEventListener("pointerleave", () => {
    tx = 0;
    ty = 0;
    tick();
  });

  window.addEventListener("resize", readRect, { passive: true });

  window.addEventListener("blur", () => {
    tx = 0;
    ty = 0;
    tick();
  });
};

const bindHeroIllustrationStates = () => {
  if (!heroPanel || !heroIllustration) {
    return;
  }

  let currentState = heroIllustration.dataset.state || "working";
  heroPanel.dataset.heroState = currentState;
  let heroIsVisible = true;
  const stateVideos = {
    working: heroWorkingVideo,
    thinking: heroThinkingVideo,
  };

  const playVideo = (video) => {
    if (!video || typeof video.play !== "function") {
      return;
    }
    video.play().catch(() => {});
  };

  if (prefersReducedMotion()) {
    heroIllustration.classList.add("is-reduced-motion");
    Object.values(stateVideos).forEach((video) => {
      if (!video) {
        return;
      }
      video.removeAttribute("autoplay");
      if (typeof video.pause === "function") {
        video.pause();
      }
    });
    renderHeroTitle(currentState);
    return;
  }

  playVideo(stateVideos[currentState]);
  renderHeroTitle(currentState);

  const setState = (nextState) => {
    if (nextState === currentState) {
      return;
    }

    const previousState = currentState;
    currentState = nextState;
    heroPanel.dataset.heroState = nextState;
    if (heroMobileMode) {
      heroMobileMode.textContent = `TAP TO SWITCH · ${nextState === "working" ? "BUILD" : "THINK"} MODE`;
    }
    heroIllustration.dataset.state = nextState;
    heroIllustration.classList.toggle("is-working", nextState === "working");
    heroIllustration.classList.toggle("is-thinking", nextState === "thinking");
    renderHeroTitle(nextState, true);
    if (heroIsVisible) {
      playVideo(stateVideos[nextState]);
    }

    window.setTimeout(() => {
      if (currentState !== nextState) {
        return;
      }
      const previousVideo = stateVideos[previousState];
      if (!previousVideo || typeof previousVideo.pause !== "function") {
        return;
      }
      previousVideo.pause();
      previousVideo.currentTime = 0;
    }, motionTiming.heroVideoHold);
  };

  if (hasFinePointer()) {
    heroPanel.addEventListener("pointermove", (event) => {
      if (!isDesktopHorizontal()) {
        return;
      }

      const rect = heroPanel.getBoundingClientRect();
      const pointerRatio = (event.clientX - rect.left) / Math.max(1, rect.width);

      if (currentState === "working" && pointerRatio > 0.54) {
        setState("thinking");
      } else if (currentState === "thinking" && pointerRatio < 0.46) {
        setState("working");
      }
    }, { passive: true });
  }

  heroPanel.addEventListener("pointerdown", (event) => {
    if (event.target.closest("a, button") || (hasFinePointer() && isDesktopHorizontal())) {
      return;
    }

    setState(currentState === "working" ? "thinking" : "working");
  }, { passive: true });

  const mediaObserver = new IntersectionObserver(([entry]) => {
    heroIsVisible = Boolean(entry?.isIntersecting);
    if (heroIsVisible) {
      playVideo(stateVideos[currentState]);
      return;
    }

    Object.values(stateVideos).forEach((video) => {
      if (video && typeof video.pause === "function") {
        video.pause();
      }
    });
  }, { threshold: 0.08 });

  mediaObserver.observe(heroPanel);
};

const initHeroAtmosphere = () => {
  if (!heroPanel || !heroParticleCanvas) {
    return;
  }

  if (prefersReducedMotion()) {
    heroParticleCanvas.hidden = true;
    return;
  }

  const ctx = heroParticleCanvas.getContext("2d");
  if (!ctx) {
    return;
  }

  let dpr = Math.min(2, window.devicePixelRatio || 1);
  let width = 0;
  let height = 0;
  let frameId = 0;
  let particles = [];
  let heroIsVisible = true;

  const resetParticles = () => {
    const lowEnd = isLowEndDevice();
    const count = lowEnd
      ? clamp(Math.round((width * height) / 98000), 10, 32)
      : clamp(Math.round((width * height) / 52000), 18, 66);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.5,
      vx: (Math.random() - 0.5) * 0.035,
      vy: -(Math.random() * 0.16 + 0.08),
      alpha: Math.random() * 0.28 + 0.06,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.015 + 0.004,
    }));
  };

  const resize = () => {
    const rect = heroPanel.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    dpr = Math.min(2, window.devicePixelRatio || 1);
    heroParticleCanvas.width = Math.floor(width * dpr);
    heroParticleCanvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    resetParticles();
  };

  const render = () => {
    if (!heroIsVisible || document.hidden) {
      frameId = 0;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.twinkle += particle.twinkleSpeed;

      if (particle.y < -8) {
        particle.y = height + 8;
        particle.x = Math.random() * width;
      }
      if (particle.x < -8) {
        particle.x = width + 8;
      }
      if (particle.x > width + 8) {
        particle.x = -8;
      }

      const alpha = particle.alpha * (0.7 + Math.sin(particle.twinkle) * 0.3);
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 237, 226, ${alpha})`;
      ctx.fill();
    });

    frameId = requestAnimationFrame(render);
  };

  resize();
  render();

  window.addEventListener("resize", resize, { passive: true });
  const atmosphereObserver = new IntersectionObserver(([entry]) => {
    heroIsVisible = Boolean(entry?.isIntersecting);
    if (!heroIsVisible && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
      return;
    }
    if (heroIsVisible && !frameId && !document.hidden) {
      render();
    }
  }, { threshold: 0.08 });
  atmosphereObserver.observe(heroPanel);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
      return;
    }

    if (!document.hidden && heroIsVisible && !frameId) {
      render();
    }
  });
};

const revealTargets = document.querySelectorAll(".reveal");
const revealGroups = new Map();
revealTargets.forEach((el) => {
  const group = el.closest(".panel") || document.body;
  const index = revealGroups.get(group) || 0;
  revealGroups.set(group, index + 1);
  el.style.setProperty("--reveal-delay", `${Math.min(index * 76, 304)}ms`);
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealTargets.forEach((el) => revealObserver.observe(el));

const initHeroCharacterVideo = () => {
  const character = document.querySelector(".hero-character");
  const video = character?.querySelector(".hero-character-video");
  const source = video?.querySelector("source[data-src]");
  const sourceUrl = source?.dataset.src;

  if (!character || !video || !source || !sourceUrl) {
    return;
  }

  fetch(sourceUrl, { method: "HEAD", cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        return;
      }

      source.src = sourceUrl;
      source.removeAttribute("data-src");
      video.addEventListener("canplay", () => {
        character.classList.add("has-video");
        video.play().catch(() => {});
      }, { once: true });
      video.load();
    })
    .catch(() => {});
};

initHeroCharacterVideo();

const progressObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      const inner = entry.target.querySelector(".progress-inner");
      if (inner) {
        inner.style.width = `${entry.target.dataset.progress || 90}%`;
      }
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.4,
  }
);

workBoxes.forEach((box) => {
  progressObserver.observe(box);
});

const setWorkDetail = (box) => {
  if (!box) {
    return;
  }

  workBoxes.forEach((item) => item.classList.remove("is-active"));
  box.classList.add("is-active");
  activeWorkBox = box;
  const nextProject = box.dataset.index || "01";

  if (detailCover) {
    detailCover.src = box.dataset.cover || "./assets/project-material-cover.svg";
  }
  if (detailEnterLink) {
    const hasCasePreview = Boolean((box.dataset.previewImage || "").trim());
    const detailLink = normalizeCaseLink(box.dataset.link || "");
    const enterLabel = detailEnterLink.querySelector("span");

    if (hasCasePreview) {
      detailEnterLink.href = "#case-preview-dialog";
      detailEnterLink.dataset.mode = "preview";
      detailEnterLink.setAttribute("aria-haspopup", "dialog");
      detailEnterLink.setAttribute("aria-label", `预览${box.dataset.title || "项目"}案例 PDF`);
      if (enterLabel) {
        enterLabel.textContent = "预览案例";
      }
    } else if (detailLink) {
      detailEnterLink.href = detailLink;
      detailEnterLink.dataset.mode = "case";
      detailEnterLink.removeAttribute("aria-haspopup");
      detailEnterLink.setAttribute("aria-label", `进入${box.dataset.title || "项目"}完整案例`);
      if (enterLabel) {
        enterLabel.textContent = "进入案例";
      }
    } else {
      detailEnterLink.href = "#project-story-dialog";
      detailEnterLink.dataset.mode = "story";
      detailEnterLink.setAttribute("aria-haspopup", "dialog");
      detailEnterLink.setAttribute("aria-label", `查看${box.dataset.title || "项目"}项目详情`);
      if (enterLabel) {
        enterLabel.textContent = "查看项目详情";
      }
    }
  }
  if (workDetail) {
    const shouldAnimate = workDetail.dataset.project !== nextProject;
    workDetail.dataset.project = nextProject;

    if (shouldAnimate) {
      workDetail.classList.remove("is-swapping");
      void workDetail.offsetWidth;
      workDetail.classList.add("is-swapping");
      window.clearTimeout(workDetail.__swapTimer);
      workDetail.__swapTimer = window.setTimeout(() => {
        workDetail.classList.remove("is-swapping");
      }, motionTiming.detailSwapClear);
    }
  }
};

const setStoryDialog = (box) => {
  if (!box) {
    return;
  }

  if (storyIndex) {
    storyIndex.textContent = `PROJECT STORY / ${box.dataset.index || "01"}`;
  }
  if (storyClient) {
    storyClient.textContent = box.dataset.client || "项目名称";
  }
  if (storyTitle) {
    storyTitle.textContent = box.dataset.title || "项目案例";
  }
  if (storyDescription) {
    storyDescription.textContent = box.dataset.description || "";
  }
  if (storyBackground) {
    storyBackground.textContent = box.dataset.background || "待补充";
  }
  if (storyRole) {
    storyRole.textContent = box.dataset.roleDetail || box.dataset.projectRole || "待补充";
  }
  if (storyProcess) {
    storyProcess.textContent = box.dataset.process || "待补充";
  }
  if (storySolution) {
    storySolution.textContent = box.dataset.solution || "待补充";
  }
  if (storyResult) {
    const result = box.dataset.result || "待补充";
    const assets = box.dataset.assets ? ` 当前素材：${box.dataset.assets}` : "";
    storyResult.textContent = `${result}${assets}`;
  }
};

const setCasePreview = (box) => {
  if (!box || !casePreviewDialog) {
    return;
  }

  const hasCasePreview = Boolean((box.dataset.previewImage || "").trim());
  if (!hasCasePreview) {
    return;
  }

  if (casePreviewTitle) {
    casePreviewTitle.textContent = box.dataset.title || "项目案例";
  }
  if (casePreviewSubtitle) {
    const clientName = (box.dataset.client || "项目").split("/")[0].trim();
    casePreviewSubtitle.textContent = `${clientName} Case Study`;
  }
  if (casePreviewPages) {
    const previewFolder = (box.dataset.previewFolder || "./assets/projects/ausman/pages").replace(/\/$/, "");
    const previewPageCount = Math.max(1, Number(box.dataset.previewPages || 7));
    const fragment = document.createDocumentFragment();
    casePreviewPages.replaceChildren();

    for (let page = 1; page <= previewPageCount; page += 1) {
      const figure = document.createElement("figure");
      figure.className = "case-preview-dialog__page";
      figure.dataset.previewPage = String(page);

      const image = document.createElement("img");
      image.src = `${previewFolder}/page-${String(page).padStart(2, "0")}.jpg`;
      image.alt = `${box.dataset.title || "项目案例"}第 ${page} 页`;
      image.loading = page <= 2 ? "eager" : "lazy";
      image.decoding = "async";

      figure.append(image);
      fragment.append(figure);
    }

    casePreviewPages.append(fragment);
  }
  casePreviewDocument?.scrollTo({ top: 0, behavior: "auto" });
  casePreviewNavItems.forEach((item, index) => {
    item.classList.toggle("is-current", index === 0);
    item.setAttribute("aria-current", index === 0 ? "location" : "false");
  });
};

const lockCasePreviewScroll = () => {
  casePreviewScrollY = window.scrollY;
  document.documentElement.classList.add("case-preview-open");
  document.body.classList.add("case-preview-open");
  document.body.style.setProperty("--case-preview-scroll-y", `-${casePreviewScrollY}px`);
};

const unlockCasePreviewScroll = () => {
  const restoreY = casePreviewScrollY;
  document.documentElement.classList.remove("case-preview-open");
  document.body.classList.remove("case-preview-open");
  document.body.style.removeProperty("--case-preview-scroll-y");

  if (isDesktopHorizontal()) {
    setupHorizontalScroll();
    syncScrollBoundary(restoreY);
  } else {
    window.scrollTo({ left: 0, top: restoreY, behavior: "auto" });
    onWindowScroll();
  }
};

const closeCasePreview = () => {
  if (!casePreviewDialog?.open) {
    return;
  }

  // Restore the portfolio while the full-screen dialog still covers it, so
  // closing the Ausman case never exposes the home panel for a frame.
  unlockCasePreviewScroll();
  casePreviewDialog.close();
};

if (detailEnterLink) {
  detailEnterLink.addEventListener("click", (event) => {
    if (detailEnterLink.dataset.mode === "preview" && casePreviewDialog) {
      event.preventDefault();
      setCasePreview(activeWorkBox || initialActive);
      lockCasePreviewScroll();
      casePreviewDialog.showModal();
      return;
    }

    if (detailEnterLink.dataset.mode === "case") {
      rememberPortfolioReturn(activeWorkBox);
      return;
    }

    if (detailEnterLink.dataset.mode !== "story" || !storyDialog) {
      return;
    }

    event.preventDefault();
    setStoryDialog(activeWorkBox || initialActive);
    storyDialog.showModal();
  });
}

if (casePreviewClose && casePreviewDialog) {
  casePreviewDialog.addEventListener("wheel", (event) => {
    if (!casePreviewDialog.open || !casePreviewDocument?.contains(event.target)) {
      return;
    }

    casePreviewDocument.scrollTop += event.deltaY;
    event.preventDefault();
  }, { passive: false });

casePreviewNavItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (!casePreviewDocument) {
      return;
    }

    const targetPage = Math.max(1, Number(item.dataset.previewPage || 1));
    const target = casePreviewPages?.querySelector(`[data-preview-page="${targetPage}"]`);
    if (!target) {
      return;
    }
    const headerHeight = casePreviewDialog?.querySelector(".case-preview-dialog__header")?.offsetHeight || 0;
    casePreviewDocument.scrollTo({
      top: Math.max(0, target.offsetTop - headerHeight),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  });
});

const updateCasePreviewNavigation = () => {
  if (!casePreviewDocument || !casePreviewNavItems.length) {
    return;
  }

  const headerHeight = casePreviewDialog?.querySelector(".case-preview-dialog__header")?.offsetHeight || 0;
  const marker = casePreviewDocument.scrollTop + headerHeight + casePreviewDocument.clientHeight * 0.22;
  const pages = [...(casePreviewPages?.querySelectorAll(".case-preview-dialog__page") || [])];
  const currentPage = pages.reduce((selected, page) => (
    page.offsetTop <= marker ? Number(page.dataset.previewPage || 1) : selected
  ), 1);
  const currentItem = casePreviewNavItems.find(
    (item) => Number(item.dataset.previewPage || 1) === currentPage
  ) || casePreviewNavItems[0];

  casePreviewNavItems.forEach((item) => {
    const isCurrent = item === currentItem;
    item.classList.toggle("is-current", isCurrent);
    item.setAttribute("aria-current", isCurrent ? "location" : "false");
  });
};

casePreviewDocument?.addEventListener("scroll", updateCasePreviewNavigation, { passive: true });
updateCasePreviewNavigation();

  casePreviewClose.addEventListener("click", closeCasePreview);
  casePreviewDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeCasePreview();
  });
  casePreviewDialog.addEventListener("close", () => {
    if (document.documentElement.classList.contains("case-preview-open")) {
      unlockCasePreviewScroll();
    }
    casePreviewPages?.replaceChildren();
    window.setTimeout(() => detailEnterLink?.focus(), 0);
  });
}

if (storyDialogClose && storyDialog) {
  storyDialogClose.addEventListener("click", () => storyDialog.close());
  storyDialog.addEventListener("click", (event) => {
    if (event.target === storyDialog) {
      storyDialog.close();
    }
  });
}

const buildWorkShowcase = () => {
  if (!workPanel || !workLayout || !workBoxes.length || workShowcase) {
    return;
  }

  workShowcase = document.createElement("div");
  workShowcase.className = "work-showcase";
  workShowcase.setAttribute("aria-label", "精选案例浏览");

  workCaseTrack = document.createElement("div");
  workCaseTrack.className = "work-case-track";

  const createWorkAction = (box, caseTitle, compact = false) => {
    const caseLink = normalizeCaseLink(box.dataset.link || "");
    const hasCasePreview = Boolean((box.dataset.previewImage || "").trim());
    let action;

    if (caseLink) {
      action = document.createElement("a");
      const caseUrl = new URL(caseLink, window.location.href);
      caseUrl.searchParams.set("from", box.dataset.index || "");
      action.href = caseUrl.href;
      action.setAttribute("aria-label", `进入${caseTitle}完整案例`);
      action.addEventListener("click", () => rememberPortfolioReturn(box));
    } else {
      action = document.createElement("button");
      action.type = "button";
      action.setAttribute("aria-haspopup", "dialog");
      action.setAttribute("aria-label", hasCasePreview ? `预览${caseTitle}完整案例` : `查看${caseTitle}项目详情`);
      action.addEventListener("click", () => {
        setWorkDetail(box);
        if (hasCasePreview && casePreviewDialog) {
          setCasePreview(box);
          lockCasePreviewScroll();
          casePreviewDialog.showModal();
          return;
        }
        if (storyDialog) {
          setStoryDialog(box);
          storyDialog.showModal();
        }
      });
    }

    action.className = compact ? "work-more-card" : "work-case-action";
    return action;
  };

  const setCaseTitleLines = (element, title) => {
    const firstChineseIndex = title.search(/[\u3400-\u9fff]/);
    const prefixCandidate = firstChineseIndex > 0 ? title.slice(0, firstChineseIndex).trim() : "";
    const englishPrefix = /[a-z]/i.test(prefixCandidate) ? prefixCandidate : "";
    const chineseTitle = englishPrefix ? title.slice(firstChineseIndex).trim() : title;

    element.setAttribute("aria-label", title);
    if (!englishPrefix) {
      element.textContent = title;
      return;
    }

    const englishLine = document.createElement("span");
    englishLine.className = "case-title-line case-title-line--english";
    englishLine.textContent = englishPrefix;
    const chineseLine = document.createElement("span");
    chineseLine.className = "case-title-line case-title-line--chinese";
    chineseLine.textContent = chineseTitle;
    element.append(englishLine, chineseLine);
  };

  featuredWorkBoxes.forEach((box, index) => {
    const caseIndex = box.dataset.index || String(index + 1).padStart(2, "0");
    const caseTitle = box.dataset.title || box.querySelector(".work-title")?.textContent?.trim() || "案例项目";
    const caseDescription = box.dataset.description || "";
    const caseClient = box.dataset.client || "SELECTED PROJECT";
    const caseTime = box.dataset.time || "";
    const caseRole = box.dataset.projectRole || "";
    const caseStatus = box.dataset.status || "";
    const coverSource = normalizeCaseLink(box.dataset.cover || "");
    const typeSource = box.querySelector(".work-type")?.textContent || "CASE STUDY";

    const slide = document.createElement("article");
    slide.className = "work-case-slide";
    slide.classList.toggle("is-current", index === 0);
    slide.dataset.index = caseIndex;
    slide.setAttribute("aria-labelledby", `work-case-title-${caseIndex}`);

    const media = document.createElement("div");
    media.className = "work-case-media";

    if (coverSource && !/PENDING/i.test(caseStatus)) {
      const image = document.createElement("img");
      image.src = coverSource;
      image.alt = `${caseTitle}案例预览`;
      image.loading = index < 2 ? "eager" : "lazy";
      image.decoding = "async";
      media.append(image);
    } else {
      media.classList.add("is-placeholder");
      const placeholder = document.createElement("span");
      placeholder.textContent = `CASE IMAGE / ${caseIndex}`;
      media.append(placeholder);
    }

    const copy = document.createElement("div");
    copy.className = "work-case-copy";

    const eyebrow = document.createElement("p");
    eyebrow.className = "work-case-eyebrow";
    eyebrow.textContent = `${caseIndex} / ${caseClient.split("/")[0].trim()}`;

    const heading = document.createElement("h3");
    heading.id = `work-case-title-${caseIndex}`;
    setCaseTitleLines(heading, caseTitle);

    const tags = document.createElement("div");
    tags.className = "work-case-tags";
    typeSource.split("·").map((tag) => tag.trim()).filter(Boolean).slice(0, 3).forEach((tag) => {
      const item = document.createElement("span");
      item.textContent = tag;
      tags.append(item);
    });

    const description = document.createElement("p");
    description.className = "work-case-description";
    description.textContent = caseDescription;

    const meta = document.createElement("dl");
    meta.className = "work-case-meta";
    [
      ["项目时间", caseTime],
      ["我的角色", caseRole],
    ].forEach(([label, value]) => {
      if (!value) {
        return;
      }
      const group = document.createElement("div");
      const term = document.createElement("dt");
      const detail = document.createElement("dd");
      term.textContent = label;
      detail.textContent = value;
      group.append(term, detail);
      meta.append(group);
    });

    const action = createWorkAction(box, caseTitle);
    action.innerHTML = "<span class=\"work-case-action__label\">进入案例</span><img class=\"work-case-action__arrow\" src=\"./assets/group-3-arrow.svg\" alt=\"\" aria-hidden=\"true\">";

    copy.append(eyebrow, heading, tags, description, meta, action);
    slide.append(media, copy);
    workCaseTrack.append(slide);

    slide.addEventListener("mouseenter", () => setWorkDetail(box));
  });

  if (additionalWorkBoxes.length) {
    const moreSlide = document.createElement("article");
    moreSlide.className = "work-case-slide work-case-slide--more";
    moreSlide.dataset.index = "MORE";
    moreSlide.setAttribute("aria-labelledby", "work-case-title-more");

    const heading = document.createElement("header");
    heading.className = "work-more-heading";
    heading.innerHTML = `
      <p class="work-case-eyebrow">MORE / SELECTED ARCHIVE</p>
      <h3 id="work-case-title-more">更多案例</h3>
      <p>完整案例保留在归档中，用更紧凑的方式呈现不同业务类型与早期视觉能力。</p>
    `;

    const emblem = document.createElement("figure");
    emblem.className = "work-more-emblem";
    emblem.setAttribute("aria-hidden", "true");
    emblem.innerHTML = `
      <svg class="work-more-emblem__ring" viewBox="0 0 160 160">
        <defs>
          <path id="work-more-emblem-path" d="M 80 80 m -61 0 a 61 61 0 1 1 122 0 a 61 61 0 1 1 -122 0"></path>
        </defs>
        <text textLength="365" lengthAdjust="spacing">
          <textPath href="#work-more-emblem-path" startOffset="1%">COMEDY GOLD <tspan>*</tspan> COMEDY GOLD <tspan>*</tspan> COMEDY GOLD <tspan>*</tspan></textPath>
        </text>
      </svg>
      <span class="work-more-emblem__eyes">
        <i><b></b></i>
        <i><b></b></i>
      </span>
    `;
    heading.prepend(emblem);
    const emblemObserver = new IntersectionObserver(
      ([entry]) => emblem.classList.toggle("is-in-view", entry.isIntersecting),
      { threshold: 0.24 }
    );
    emblemObserver.observe(emblem);

    const grid = document.createElement("div");
    grid.className = "work-more-grid";

    additionalWorkBoxes.forEach((box) => {
      const caseIndex = box.dataset.index || "";
      const caseTitle = box.dataset.title || "案例项目";
      const card = createWorkAction(box, caseTitle, true);

      const media = document.createElement("span");
      media.className = "work-more-card__media";
      const image = document.createElement("img");
      image.src = normalizeCaseLink(box.dataset.cover || "");
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      media.append(image);

      const copy = document.createElement("span");
      copy.className = "work-more-card__copy";
      const meta = document.createElement("span");
      meta.className = "work-more-card__meta";
      meta.textContent = `${caseIndex} / ${box.dataset.time || "SELECTED WORK"}`;
      const title = document.createElement("strong");
      setCaseTitleLines(title, caseTitle);
      const description = document.createElement("span");
      description.textContent = box.dataset.description || "";
      copy.append(meta, title, description);

      card.append(media, copy);
      grid.append(card);
    });

    moreSlide.append(heading, grid);
    workCaseTrack.append(moreSlide);
  }

  workShowcase.append(workCaseTrack);
  workLayout.hidden = true;
  workPanel.append(workShowcase);
  workCaseSlides = [...workCaseTrack.querySelectorAll(".work-case-slide")];

  workCaseRail = document.createElement("nav");
  workCaseRail.className = "work-case-rail";
  workCaseRail.setAttribute("aria-label", "案例快速定位");
  workCaseSlides.forEach((slide, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.slideIndex = String(index);
    button.setAttribute("aria-label", `查看案例 ${index + 1}，共 ${workCaseSlides.length} 个`);

    const bar = document.createElement("span");
    bar.setAttribute("aria-hidden", "true");
    button.append(bar);

    button.addEventListener("click", () => {
      if (isDesktopHorizontal()) {
        const step = workPinDistance / Math.max(1, workCaseSlides.length - 1);
        syncScrollBoundary(workPinStartY + index * step);
        return;
      }
      slide.scrollIntoView({ behavior: "auto", block: "start" });
    });
    workCaseRail.append(button);
  });
  workShowcase.append(workCaseRail);
};

buildWorkShowcase();

const initialActive = document.querySelector(".work-box.is-active") || workBoxes[0];
setWorkDetail(initialActive);

workBoxes.forEach((box) => {
  box.addEventListener("mouseenter", () => setWorkDetail(box));

  const hit = box.querySelector(".work-hit");
  if (!hit) {
    return;
  }

  hit.addEventListener("focus", () => setWorkDetail(box));
  hit.addEventListener("click", () => setWorkDetail(box));
});

if (workListing) {
  const workFocusObserver = new IntersectionObserver(
    (entries) => {
      if (isDesktopHorizontal()) {
        return;
      }

      let strongest = null;

      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        if (!strongest || entry.intersectionRatio > strongest.intersectionRatio) {
          strongest = entry;
        }
      });

      if (strongest && strongest.target instanceof HTMLElement) {
        setWorkDetail(strongest.target);
      }
    },
    {
      root: workListing,
      threshold: [0.45, 0.65, 0.85],
    }
  );

  workBoxes.forEach((box) => workFocusObserver.observe(box));
}

const setActiveNav = (id) => {
  navLinks.forEach((link) => {
    const current = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("selected", current);
    if (current) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const mobileSectionObserver = new IntersectionObserver(
  (entries) => {
    if (isDesktopHorizontal()) {
      return;
    }

    let strongest = null;
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      if (!strongest || entry.intersectionRatio > strongest.intersectionRatio) {
        strongest = entry;
      }
    });

    if (strongest?.target?.id) {
      activePanelId = strongest.target.id;
      setActiveNav(activePanelId);
    }
  },
  {
    threshold: [0.2, 0.45, 0.7],
    rootMargin: "-18% 0px -45% 0px",
  }
);

panels.forEach((panel) => mobileSectionObserver.observe(panel));

const updateActiveByPosition = (xPos) => {
  if (!panels.length) {
    return;
  }

  const viewCenter = xPos + window.innerWidth * 0.5;
  let closest = panels[0];
  let smallestDist = Infinity;

  panels.forEach((panel) => {
    const center = panel.offsetLeft + panel.offsetWidth * 0.5;
    const dist = Math.abs(center - viewCenter);
    if (dist < smallestDist) {
      smallestDist = dist;
      closest = panel;
    }
  });

  if (closest && closest.id) {
    activePanelId = closest.id;
    setActiveNav(closest.id);
  }
};

const updateActiveMobile = () => {
  if (isDesktopHorizontal() || !panels.length) {
    return;
  }

  const marker = window.innerHeight * 0.34;
  let closest = panels[0];
  let smallestDist = Infinity;

  panels.forEach((panel) => {
    const rect = panel.getBoundingClientRect();
    const dist = Math.abs(rect.top - marker);
    if (rect.top <= marker && rect.bottom >= marker) {
      closest = panel;
      smallestDist = 0;
      return;
    }
    if (dist < smallestDist) {
      smallestDist = dist;
      closest = panel;
    }
  });

  if (closest?.id) {
    activePanelId = closest.id;
    setActiveNav(activePanelId);
  }
};

const applyHorizontalPosition = (xPos) => {
  if (!smoothContent) {
    return;
  }
  if (smoothWrapper && (smoothWrapper.scrollLeft !== 0 || smoothWrapper.scrollTop !== 0)) {
    smoothWrapper.scrollLeft = 0;
    smoothWrapper.scrollTop = 0;
  }
  smoothContent.style.transform = `translate3d(${-xPos}px, 0, 0)`;
};

const syncScrollBoundary = (top) => {
  if (!isDesktopHorizontal()) {
    return;
  }

  const boundedTop = clamp(top, 0, maxScrollTop);
  if (Math.abs(window.scrollY - boundedTop) > 0.5 || Math.abs(window.scrollX) > 0.5) {
    window.scrollTo({ left: 0, top: boundedTop, behavior: "instant" });
  }

  const mapped = mapScrollToState(boundedTop);
  targetX = mapped.x;
  currentX = mapped.x;
  targetExperienceProgress = mapped.experienceProgress;
  currentExperienceProgress = mapped.experienceProgress;
  targetWorkProgress = mapped.workProgress;
  currentWorkProgress = mapped.workProgress;
  applyHorizontalPosition(currentX);
  updateExperienceMotion(currentX, currentExperienceProgress);
  updateWorkMotion(currentWorkProgress);
  updateActiveByPosition(currentX);
};

const mapScrollToState = (scrollTop) => {
  if (!isDesktopHorizontal()) {
    return {
      x: clamp(scrollTop, 0, maxHorizontal),
      experienceProgress: 0,
      workProgress: 0,
    };
  }

  if (experiencePanel && scrollTop <= experiencePinStartY) {
    return {
      x: clamp(scrollTop, 0, maxHorizontal),
      experienceProgress: 0,
      workProgress: 0,
    };
  }

  if (experiencePanel && scrollTop < experiencePinEndY) {
    return {
      x: clamp(experiencePanel.offsetLeft, 0, maxHorizontal),
      experienceProgress: clamp(
        (scrollTop - experiencePinStartY) / Math.max(1, experiencePinDistance),
        0,
        1
      ),
      workProgress: 0,
    };
  }

  const afterExperienceTop = scrollTop - experiencePinDistance;

  if (workPanel && workPinDistance > 0 && scrollTop <= workPinStartY) {
    return {
      x: clamp(afterExperienceTop, 0, maxHorizontal),
      experienceProgress: experiencePanel ? 1 : 0,
      workProgress: 0,
    };
  }

  if (workPanel && workPinDistance > 0 && scrollTop < workPinEndY) {
    return {
      x: clamp(workPanel.offsetLeft, 0, maxHorizontal),
      experienceProgress: experiencePanel ? 1 : 0,
      workProgress: clamp(
        (scrollTop - workPinStartY) / Math.max(1, workPinDistance),
        0,
        1
      ),
    };
  }

  return {
    x: clamp(scrollTop - experiencePinDistance - workPinDistance, 0, maxHorizontal),
    experienceProgress: experiencePanel ? 1 : 0,
    workProgress: workPanel ? 1 : 0,
  };
};

const mapHorizontalToScroll = (xPos) => {
  if (!isDesktopHorizontal()) {
    return clamp(xPos, 0, maxScrollTop);
  }

  if (experiencePanel && xPos <= experiencePanel.offsetLeft) {
    return clamp(xPos, 0, maxScrollTop);
  }

  const afterExperienceTop = xPos + experiencePinDistance;
  if (workPanel && xPos <= workPanel.offsetLeft) {
    return clamp(afterExperienceTop, 0, maxScrollTop);
  }

  return clamp(afterExperienceTop + workPinDistance, 0, maxScrollTop);
};

const updateExperienceTimeline = (progress) => {
  const clamped = Math.max(0, Math.min(1, progress));
  if (experienceTrackFill) {
    experienceTrackFill.style.width = `${clamped * 100}%`;
  }

  if (!experienceNodes.length) {
    return;
  }

  experienceNodes.forEach((node, index) => {
    const threshold = experienceNodes.length > 1
      ? 0.02 + (index / (experienceNodes.length - 1)) * 0.9
      : 0.04;
    node.classList.toggle("active", clamped >= threshold);
  });
};

const updateExperienceFocus = (progress) => {
  if (!experienceItems.length) {
    return;
  }

  const easedProgress = clamp((progress - 0.05) / 0.9, 0, 1);
  const activeIndex = clamp(
    Math.floor(easedProgress * experienceItems.length),
    0,
    experienceItems.length - 1
  );
  experienceItems.forEach((item, index) => {
    item.classList.toggle("is-current", index === activeIndex);
  });
};

const updateMobileExperienceFocus = () => {
  if (!experienceItems.length) {
    return;
  }

  const viewportAnchor = window.innerHeight * 0.5;
  let activeIndex = 0;
  let closestDistance = Infinity;

  experienceItems.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height * 0.5;
    const distance = Math.abs(itemCenter - viewportAnchor);
    if (distance < closestDistance) {
      closestDistance = distance;
      activeIndex = index;
    }
  });

  experienceItems.forEach((item, index) => {
    item.classList.toggle("is-current", index === activeIndex);
  });
  updateExperienceTimeline(
    experienceItems.length > 1 ? activeIndex / (experienceItems.length - 1) : 0
  );
};

const updateExperienceMotion = (xPos, forcedProgress = null) => {
  if (!experiencePanel) {
    return;
  }

  if (!isDesktopHorizontal()) {
    if (experienceLayout) {
      experienceLayout.style.transform = "translate3d(0, 0, 0)";
    }
    if (experienceSlider) {
      experienceSlider.style.transform = "translate3d(0, 0, 0)";
    }
    updateMobileExperienceFocus();
    return;
  }

  const start = experiencePanel.offsetLeft - window.innerWidth * 0.55;
  const end = experiencePanel.offsetLeft + experiencePanel.offsetWidth * 0.65;
  const raw = (xPos - start) / (end - start);
  const progress = forcedProgress === null ? Math.max(0, Math.min(1, raw)) : clamp(forcedProgress, 0, 1);
  updateExperienceTimeline(progress);
  updateExperienceFocus(progress);

  if (experienceLayout) {
    experienceLayout.style.transform = "translate3d(0, 0, 0)";
  }

  if (!experienceSlider) {
    return;
  }

  // Keep the first and final experience pages readable before the section releases.
  const slideStart = 0.18;
  const slideEnd = 0.78;
  const slideProgress = Math.max(0, Math.min(1, (progress - slideStart) / (slideEnd - slideStart)));
  const cardCount = Math.max(1, experienceSlider.querySelectorAll(".experience-item").length);
  const visibleCardCount = Math.min(2, cardCount);
  const slidePercent = slideProgress * ((cardCount - visibleCardCount) / cardCount) * 100;
  experienceSlider.style.transform = `translate3d(-${slidePercent}%, 0, 0)`;
};

const updateWorkMotion = (progress) => {
  if (!workShowcase || !workCaseTrack || !workCaseSlides.length) {
    return;
  }

  if (!isDesktopHorizontal()) {
    workCaseTrack.style.transform = "translate3d(0, 0, 0)";
    workCaseSlides.forEach((slide) => {
      slide.classList.add("is-current");
      slide.removeAttribute("aria-hidden");
      slide.inert = false;
      slide.style.removeProperty("z-index");
      slide.style.removeProperty("--case-slide-opacity");
      slide.style.removeProperty("--case-content-opacity");
      slide.style.removeProperty("--case-tilt");
      slide.style.removeProperty("--case-scale");
      slide.style.removeProperty("--case-media-x");
      slide.style.removeProperty("--case-media-y");
    });
    activeWorkSlideIndex = -1;
    lastRenderedWorkProgress = clamp(progress, 0, 1);
    workCaseRail?.querySelectorAll("button").forEach((button) => {
      button.classList.remove("is-active");
      button.removeAttribute("aria-current");
    });
    return;
  }

  const clamped = clamp(progress, 0, 1);
  const progressDelta = clamped - lastRenderedWorkProgress;
  if (Math.abs(progressDelta) > 0.0005) {
    workScrollDirection = progressDelta > 0 ? 1 : -1;
  }
  lastRenderedWorkProgress = clamped;
  const lastIndex = Math.max(0, workCaseSlides.length - 1);
  const continuousIndex = clamped * lastIndex;
  const baseIndex = Math.min(lastIndex, Math.floor(continuousIndex));
  const localProgress = baseIndex === lastIndex ? 0 : continuousIndex - baseIndex;
  const downwardProgress = 1 - Math.pow(1 - localProgress, 2);
  const upwardProgress = 1 - Math.pow(localProgress, 2);
  const travel = Math.max(0, workShowcase.clientHeight * lastIndex);

  workCaseTrack.style.transform = `translate3d(0, ${-travel * clamped}px, 0)`;

  workCaseSlides.forEach((slide, index) => {
    // Keep every case on one shared path: tilt right, then settle flat.
    const direction = 1;
    let tilt = "0deg";
    let scale = 1;

    if (workScrollDirection > 0) {
      if (index === baseIndex + 1) {
        tilt = `${direction * (1 - downwardProgress) * 35}deg`;
        scale = 0.72 + downwardProgress * 0.28;
      } else if (index > baseIndex + 1) {
        tilt = `${direction * 35}deg`;
        scale = 0.72;
      }
    } else if (index === baseIndex) {
      tilt = `${direction * (1 - upwardProgress) * 35}deg`;
      scale = 0.72 + upwardProgress * 0.28;
    } else if (index < baseIndex) {
      tilt = `${direction * 35}deg`;
      scale = 0.72;
    }

    slide.style.removeProperty("z-index");
    slide.style.setProperty("--case-slide-opacity", "1");
    slide.style.setProperty("--case-content-opacity", "1");
    slide.style.setProperty("--case-tilt", tilt);
    slide.style.setProperty("--case-scale", String(scale));
    slide.style.setProperty("--case-media-x", "0rem");
    slide.style.setProperty("--case-media-y", "0%");
  });

  const nextIndex = baseIndex === lastIndex
    ? lastIndex
    : workScrollDirection > 0
      ? localProgress < 0.78 ? baseIndex : baseIndex + 1
      : localProgress > 0.22 ? baseIndex + 1 : baseIndex;
  if (nextIndex === activeWorkSlideIndex) {
    return;
  }

  activeWorkSlideIndex = nextIndex;
  workCaseSlides.forEach((slide, index) => {
    const isCurrent = index === nextIndex;
    slide.classList.toggle("is-current", isCurrent);
    slide.setAttribute("aria-hidden", isCurrent ? "false" : "true");
    slide.inert = !isCurrent;
  });
  workCaseRail?.querySelectorAll("button").forEach((button, index) => {
    const isCurrent = index === nextIndex;
    button.classList.toggle("is-active", isCurrent);
    if (isCurrent) {
      button.setAttribute("aria-current", "true");
    } else {
      button.removeAttribute("aria-current");
    }
  });
};

const animateHorizontal = () => {
  rafId = null;

  const distance = targetX - currentX;
  const activeLerp = Date.now() < navigationBoostUntil ? 0.32 : scrollLerp;
  currentX += distance * activeLerp;
  const progressDistance = targetExperienceProgress - currentExperienceProgress;
  currentExperienceProgress += progressDistance * activeLerp;
  const workProgressDistance = targetWorkProgress - currentWorkProgress;
  currentWorkProgress += workProgressDistance * activeLerp;

  if (Math.abs(distance) < 0.2) {
    currentX = targetX;
  }
  if (Math.abs(progressDistance) < 0.002) {
    currentExperienceProgress = targetExperienceProgress;
  }
  if (Math.abs(workProgressDistance) < 0.002) {
    currentWorkProgress = targetWorkProgress;
  }

  applyHorizontalPosition(currentX);
  updateExperienceMotion(currentX, currentExperienceProgress);
  updateWorkMotion(currentWorkProgress);
  updateActiveByPosition(currentX);

  if (
    Math.abs(targetX - currentX) >= 0.2
    || Math.abs(targetExperienceProgress - currentExperienceProgress) >= 0.002
    || Math.abs(targetWorkProgress - currentWorkProgress) >= 0.002
  ) {
    rafId = requestAnimationFrame(animateHorizontal);
  }
};

const requestHorizontalFrame = () => {
  if (rafId === null) {
    rafId = requestAnimationFrame(animateHorizontal);
  }
};

const setupHorizontalScroll = () => {
  if (!smoothWrapper || !smoothContent) {
    return;
  }

  if (!isDesktopHorizontal()) {
    document.body.style.height = "auto";
    targetX = 0;
    currentX = 0;
    targetExperienceProgress = 0;
    currentExperienceProgress = 0;
    targetWorkProgress = 0;
    currentWorkProgress = 0;
    experiencePinDistance = 0;
    workPinDistance = 0;
    maxScrollTop = 0;
    applyHorizontalPosition(0);
    updateExperienceMotion(0, 0);
    updateWorkMotion(0);
    return;
  }

  const lastPanel = panels[panels.length - 1] || null;
  maxHorizontal = lastPanel
    ? Math.max(0, lastPanel.offsetLeft)
    : Math.max(0, smoothContent.scrollWidth - window.innerWidth);
  const experiencePageCount = experienceSlider
    ? Math.max(1, experienceSlider.querySelectorAll(".experience-page").length)
    : 1;
  const reduceMotion = prefersReducedMotion();
  experiencePinDistance = experiencePanel && !reduceMotion
    ? Math.max(2200, window.innerWidth * (0.6 + experiencePageCount * 0.48))
    : 0;
  experiencePinStartY = experiencePanel ? experiencePanel.offsetLeft : 0;
  experiencePinEndY = experiencePinStartY + experiencePinDistance;
  const workSlideTravel = Math.max(0, workCaseSlides.length - 1);
  workPinDistance = workPanel && workShowcase && !reduceMotion
    ? Math.max(0, workShowcase.clientHeight * workSlideTravel * 0.86)
    : 0;
  workPinStartY = workPanel ? workPanel.offsetLeft + experiencePinDistance : 0;
  workPinEndY = workPinStartY + workPinDistance;
  maxScrollTop = maxHorizontal + experiencePinDistance + workPinDistance;
  const verticalTravel = maxScrollTop + window.innerHeight;
  document.body.style.height = `${verticalTravel}px`;

  const mapped = mapScrollToState(window.scrollY);
  targetX = mapped.x;
  currentX = mapped.x;
  targetExperienceProgress = mapped.experienceProgress;
  currentExperienceProgress = mapped.experienceProgress;
  targetWorkProgress = mapped.workProgress;
  currentWorkProgress = mapped.workProgress;
  applyHorizontalPosition(currentX);
  updateExperienceMotion(currentX, currentExperienceProgress);
  updateWorkMotion(currentWorkProgress);
  updateActiveByPosition(currentX);
};

const onWindowScroll = () => {
  if (!isDesktopHorizontal()) {
    updateActiveMobile();
    updateMobileExperienceFocus();
    return;
  }

  const mapped = mapScrollToState(window.scrollY);
  targetX = mapped.x;
  targetExperienceProgress = mapped.experienceProgress;
  targetWorkProgress = mapped.workProgress;
  requestHorizontalFrame();
};

window.addEventListener("scroll", onWindowScroll, { passive: true });

window.addEventListener("wheel", (event) => {
  if (!isDesktopHorizontal() || maxScrollTop <= 0) {
    return;
  }

  const atStart = window.scrollY <= 1;
  const atEnd = window.scrollY >= maxScrollTop - 1;
  const forward = event.deltaY > 0 || (Math.abs(event.deltaX) > Math.abs(event.deltaY) && event.deltaX > 0);
  const backward = event.deltaY < 0 || (Math.abs(event.deltaX) > Math.abs(event.deltaY) && event.deltaX < 0);

  if ((atEnd && forward) || (atStart && backward)) {
    event.preventDefault();
    syncScrollBoundary(atEnd ? maxScrollTop : 0);
  }
}, { passive: false });

let resizeFrameId = 0;
window.addEventListener("resize", () => {
  if (resizeFrameId) {
    cancelAnimationFrame(resizeFrameId);
  }

  resizeFrameId = requestAnimationFrame(() => {
    resizeFrameId = 0;
    const prevRatio = maxScrollTop > 0 ? window.scrollY / maxScrollTop : 0;
    setupHorizontalScroll();

    if (isDesktopHorizontal()) {
      const nextTop = maxScrollTop * prevRatio;
      const mapped = mapScrollToState(nextTop);
      targetX = mapped.x;
      currentX = mapped.x;
      targetExperienceProgress = mapped.experienceProgress;
      currentExperienceProgress = mapped.experienceProgress;
      targetWorkProgress = mapped.workProgress;
      currentWorkProgress = mapped.workProgress;
      applyHorizontalPosition(currentX);
      updateExperienceMotion(currentX, currentExperienceProgress);
      updateWorkMotion(currentWorkProgress);
      window.scrollTo({ left: 0, top: nextTop, behavior: "instant" });
    }
  });
}, { passive: true });

const hamburger = document.querySelector(".hamburger");
if (hamburger) {
  hamburger.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });
}

const closeMobileMenu = () => {
  document.body.classList.remove("menu-open");
  if (hamburger) {
    hamburger.setAttribute("aria-expanded", "false");
  }
};

const goToSection = (selector) => {
  const target = document.querySelector(selector);
  if (!target) {
    return;
  }

  const panelTarget = target.classList.contains("panel") ? target : target.closest(".panel");
  const scrollTarget = isDesktopHorizontal() ? (panelTarget || target) : target;

  if (isDesktopHorizontal()) {
    const nextTop = mapHorizontalToScroll(scrollTarget.offsetLeft);
    window.clearTimeout(navigationSettleTimer);
    navigationBoostUntil = 0;
    syncScrollBoundary(nextTop);
  } else {
    scrollTarget.scrollIntoView({ behavior: "auto", block: "start" });
  }

  if (window.history?.replaceState) {
    window.history.replaceState(null, "", selector);
  }

  if (target !== scrollTarget) {
    if (typeof target.focus === "function") {
      target.focus({ preventScroll: true });
    }
  }
};

const restoreSectionFromHash = () => {
  const selector = window.location.hash;
  if (!selector || selector === "#") {
    return false;
  }

  let target = null;
  try {
    target = document.querySelector(selector);
  } catch (error) {
    return false;
  }

  if (!target) {
    return false;
  }

  const panelTarget = target.classList.contains("panel") ? target : target.closest(".panel");
  const scrollTarget = isDesktopHorizontal() ? (panelTarget || target) : target;

  if (isDesktopHorizontal()) {
    window.scrollTo({ left: 0, top: window.scrollY, behavior: "instant" });
    setupHorizontalScroll();
    syncScrollBoundary(mapHorizontalToScroll(scrollTarget.offsetLeft));
    if (panelTarget?.id || target.id) {
      activePanelId = panelTarget?.id || target.id;
      setActiveNav(activePanelId);
    }
  } else {
    scrollTarget.scrollIntoView({ behavior: "auto", block: "start" });
    if (panelTarget?.id || target.id) {
      activePanelId = panelTarget?.id || target.id;
      setActiveNav(activePanelId);
    }
  }

  return true;
};

const restorePortfolioReturnState = () => {
  let isPending = false;
  let savedState = null;

  try {
    isPending = window.sessionStorage.getItem("portfolio:return-pending") === "1";
    if (!isPending) {
      return false;
    }
    window.sessionStorage.removeItem("portfolio:return-pending");
    savedState = JSON.parse(window.sessionStorage.getItem("portfolio:return-state") || "null");
  } catch (error) {
    return false;
  }

  if (!savedState || Date.now() - Number(savedState.savedAt || 0) > 12 * 60 * 60 * 1000) {
    return false;
  }

  let savedScrollY = Math.max(0, Number(savedState.scrollY || 0));
  if (isDesktopHorizontal()) {
    setupHorizontalScroll();
    const requestedIndex = new URLSearchParams(window.location.search).get("project")
      || String(savedState.projectIndex || "");
    let slideIndex = workCaseSlides.findIndex((slide) => slide.dataset.index === requestedIndex);
    if (slideIndex < 0 && requestedIndex && additionalWorkBoxes.some((box) => box.dataset.index === requestedIndex)) {
      slideIndex = workCaseSlides.findIndex((slide) => slide.dataset.index === "MORE");
    }
    if (slideIndex >= 0 && workPinDistance > 0) {
      const step = workPinDistance / Math.max(1, workCaseSlides.length - 1);
      savedScrollY = workPinStartY + slideIndex * step;
    }
    syncScrollBoundary(savedScrollY);
  } else {
    window.scrollTo({ left: 0, top: savedScrollY, behavior: "auto" });
    onWindowScroll();
  }

  return true;
};

const clearPortfolioReturnHint = () => {
  document.documentElement.classList.remove("is-returning-to-portfolio");
  const url = new URL(window.location.href);
  if (url.searchParams.get("return") !== "projects") {
    return;
  }
  url.searchParams.delete("return");
  url.searchParams.delete("project");
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
};

let hashRestoreTimer = 0;
const scheduleHashRestore = () => {
  window.clearTimeout(hashRestoreTimer);
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      restoreSectionFromHash();
    });
  });
  hashRestoreTimer = window.setTimeout(restoreSectionFromHash, 160);
};

const samePageLinks = [...document.querySelectorAll('a[href^="#"]')].filter(
  (link) => (link.getAttribute("href") || "").length > 1
);

samePageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const selector = link.getAttribute("href");
    if (!document.querySelector(selector)) {
      return;
    }
    event.preventDefault();
    goToSection(selector);
    closeMobileMenu();
  });
});

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

initSiteLoader();
setupHorizontalScroll();
let hasRestoredExactPortfolioState = restorePortfolioReturnState();
if (!hasRestoredExactPortfolioState && !restoreSectionFromHash()) {
  onWindowScroll();
}
clearPortfolioReturnHint();
if (!hasRestoredExactPortfolioState) {
  scheduleHashRestore();
}
window.addEventListener("pageshow", () => {
  const didRestoreExactState = restorePortfolioReturnState();
  if (didRestoreExactState) {
    hasRestoredExactPortfolioState = true;
  }
  if (!didRestoreExactState && !hasRestoredExactPortfolioState) {
    scheduleHashRestore();
  }
  clearPortfolioReturnHint();
});
window.addEventListener("load", () => {
  if (!hasRestoredExactPortfolioState) {
    scheduleHashRestore();
  }
});
window.addEventListener("hashchange", scheduleHashRestore);
bindHeroButtonMagnet();
bindHeroParallax();
bindHeroIllustrationStates();
bindNavHoverMotion();
initHeroAtmosphere();
