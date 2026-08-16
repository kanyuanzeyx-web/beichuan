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
const heroButtons = [...document.querySelectorAll(".hero-bottom .button")];
const heroMouseLight = document.getElementById("hero-mouse-light");
const heroParticleCanvas = document.getElementById("hero-particle-canvas");
const navLinks = [...document.querySelectorAll(".nav-link")];
const panels = [...document.querySelectorAll(".panel")];
const workBoxes = [...document.querySelectorAll(".work-box")];
const workListing = document.getElementById("work-listing");
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
const casePreviewImage = document.getElementById("case-preview-image");
const casePreviewDocument = casePreviewDialog?.querySelector(".case-preview-dialog__document") || null;
const casePreviewNavItems = [...document.querySelectorAll(".case-preview-dialog__nav [data-preview-progress]")];

let focusIndex = 0;
let maxHorizontal = 0;
let maxScrollTop = 0;
let experiencePinDistance = 0;
let experiencePinStartY = 0;
let experiencePinEndY = 0;
let currentX = 0;
let targetX = 0;
let currentExperienceProgress = 0;
let targetExperienceProgress = 0;
let rafId = null;
let activePanelId = panels[0]?.id || "home";
let heroTitleTransitionId = 0;
let navigationSettleTimer = 0;
let navigationBoostUntil = 0;
let activeWorkBox = null;
let casePreviewScrollY = 0;
const scrollLerp = 0.18;
const motionTiming = {
  heroSwitchOut: 340,
  heroSwitchClear: 1900,
  heroVideoHold: 1280,
  detailSwapClear: 1160,
};

const isDesktopHorizontal = () => window.matchMedia("(min-width: 861px)").matches;
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const hasFinePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isLowEndDevice = () => {
  const cores = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8;
  return cores <= 4 || memory <= 4;
};
const shouldSimplifyMotion = () => prefersReducedMotion() || isLowEndDevice();
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
      "UI/UX · AI PRODUCT · DESIGN SYSTEMS",
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

    heroPanel.style.setProperty(
      "--mouse-x",
      `${((event.clientX - rect.left) / Math.max(1, rect.width)) * 100}%`
    );
    heroPanel.style.setProperty(
      "--mouse-y",
      `${((event.clientY - rect.top) / Math.max(1, rect.height)) * 100}%`
    );
    if (heroMouseLight) {
      heroMouseLight.style.opacity = "0.38";
    }
    tick();
  }, { passive: true });

  heroPanel.addEventListener("pointerleave", () => {
    tx = 0;
    ty = 0;
    if (heroMouseLight) {
      heroMouseLight.style.opacity = "0.2";
    }
    tick();
  });

  window.addEventListener("resize", readRect, { passive: true });

  window.addEventListener("blur", () => {
    tx = 0;
    ty = 0;
    if (heroMouseLight) {
      heroMouseLight.style.opacity = "0.2";
    }
    tick();
  });
};

const bindHeroIllustrationStates = () => {
  if (!heroPanel || !heroIllustration) {
    return;
  }

  let currentState = heroIllustration.dataset.state || "working";
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
    const pdfLink = normalizeCaseLink(box.dataset.pdf || "");
    const detailLink = normalizeCaseLink(box.dataset.link || "");
    const enterLabel = detailEnterLink.querySelector("span");

    if (pdfLink) {
      detailEnterLink.href = "#case-preview-dialog";
      detailEnterLink.dataset.mode = "pdf";
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

  const pdfLink = normalizeCaseLink(box.dataset.pdf || "");
  const previewImage = (box.dataset.previewImage || "").trim();
  if (!pdfLink) {
    return;
  }

  if (casePreviewTitle) {
    casePreviewTitle.textContent = box.dataset.title || "项目案例";
  }
  if (casePreviewSubtitle) {
    const clientName = (box.dataset.client || "项目").split("/")[0].trim();
    casePreviewSubtitle.textContent = `${clientName} Case Study`;
  }
  if (casePreviewImage) {
    casePreviewImage.src = previewImage;
    casePreviewImage.alt = `${box.dataset.title || "项目案例"}案例预览`;
  }
  casePreviewDocument?.scrollTo({ top: 0, behavior: "auto" });
};

const lockCasePreviewScroll = () => {
  casePreviewScrollY = window.scrollY;
  document.documentElement.classList.add("case-preview-open");
  document.body.classList.add("case-preview-open");
  document.body.style.setProperty("--case-preview-scroll-y", `-${casePreviewScrollY}px`);
};

const unlockCasePreviewScroll = () => {
  document.documentElement.classList.remove("case-preview-open");
  document.body.classList.remove("case-preview-open");
  document.body.style.removeProperty("--case-preview-scroll-y");
  window.scrollTo({ top: casePreviewScrollY, behavior: "auto" });
};

if (detailEnterLink) {
  detailEnterLink.addEventListener("click", (event) => {
    if (detailEnterLink.dataset.mode === "pdf" && casePreviewDialog) {
      event.preventDefault();
      setCasePreview(activeWorkBox || initialActive);
      lockCasePreviewScroll();
      casePreviewDialog.showModal();
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

    const progress = clamp(Number(item.dataset.previewProgress || 0), 0, 1);
    const maxScroll = Math.max(0, casePreviewDocument.scrollHeight - casePreviewDocument.clientHeight);
    const headerHeight = casePreviewDialog?.querySelector(".case-preview-dialog__header")?.offsetHeight || 0;
    casePreviewDocument.scrollTo({
      top: Math.min(maxScroll, maxScroll * progress + headerHeight * 0.35),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  });
});

const updateCasePreviewNavigation = () => {
  if (!casePreviewDocument || !casePreviewNavItems.length) {
    return;
  }

  const maxScroll = Math.max(1, casePreviewDocument.scrollHeight - casePreviewDocument.clientHeight);
  const currentProgress = casePreviewDocument.scrollTop / maxScroll;
  let currentItem = casePreviewNavItems[0];

  casePreviewNavItems.forEach((item) => {
    if (Number(item.dataset.previewProgress || 0) <= currentProgress + 0.035) {
      currentItem = item;
    }
  });

  casePreviewNavItems.forEach((item) => {
    const isCurrent = item === currentItem;
    item.classList.toggle("is-current", isCurrent);
    item.setAttribute("aria-current", isCurrent ? "location" : "false");
  });
};

casePreviewDocument?.addEventListener("scroll", updateCasePreviewNavigation, { passive: true });
updateCasePreviewNavigation();

  casePreviewClose.addEventListener("click", () => casePreviewDialog.close());
  casePreviewDialog.addEventListener("close", () => {
    if (casePreviewImage) {
      casePreviewImage.removeAttribute("src");
    }
    unlockCasePreviewScroll();
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
  smoothContent.style.transform = `translate3d(${-xPos}px, 0, 0)`;
};

const syncScrollBoundary = (top) => {
  if (!isDesktopHorizontal()) {
    return;
  }

  const boundedTop = clamp(top, 0, maxScrollTop);
  if (Math.abs(window.scrollY - boundedTop) > 0.5) {
    window.scrollTo({ top: boundedTop, behavior: "auto" });
  }

  const mapped = mapScrollToState(boundedTop);
  targetX = mapped.x;
  currentX = mapped.x;
  targetExperienceProgress = mapped.experienceProgress;
  currentExperienceProgress = mapped.experienceProgress;
  applyHorizontalPosition(currentX);
  updateExperienceMotion(currentX, currentExperienceProgress);
  updateActiveByPosition(currentX);
};

const mapScrollToState = (scrollTop) => {
  if (!experiencePanel || !isDesktopHorizontal()) {
    return {
      x: clamp(scrollTop, 0, maxHorizontal),
      experienceProgress: 0,
    };
  }

  if (scrollTop <= experiencePinStartY) {
    return {
      x: clamp(scrollTop, 0, maxHorizontal),
      experienceProgress: 0,
    };
  }

  if (scrollTop < experiencePinEndY) {
    return {
      x: clamp(experiencePanel.offsetLeft, 0, maxHorizontal),
      experienceProgress: clamp(
        (scrollTop - experiencePinStartY) / Math.max(1, experiencePinDistance),
        0,
        1
      ),
    };
  }

  return {
    x: clamp(scrollTop - experiencePinDistance, 0, maxHorizontal),
    experienceProgress: 1,
  };
};

const mapHorizontalToScroll = (xPos) => {
  if (!experiencePanel || !isDesktopHorizontal()) {
    return clamp(xPos, 0, maxScrollTop);
  }

  if (xPos <= experiencePanel.offsetLeft) {
    return clamp(xPos, 0, maxScrollTop);
  }

  return clamp(xPos + experiencePinDistance, 0, maxScrollTop);
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
    updateExperienceTimeline(0);
    updateExperienceFocus(0);
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

const animateHorizontal = () => {
  rafId = null;

  const distance = targetX - currentX;
  const activeLerp = Date.now() < navigationBoostUntil ? 0.32 : scrollLerp;
  currentX += distance * activeLerp;
  const progressDistance = targetExperienceProgress - currentExperienceProgress;
  currentExperienceProgress += progressDistance * activeLerp;

  if (Math.abs(distance) < 0.2) {
    currentX = targetX;
  }
  if (Math.abs(progressDistance) < 0.002) {
    currentExperienceProgress = targetExperienceProgress;
  }

  applyHorizontalPosition(currentX);
  updateExperienceMotion(currentX, currentExperienceProgress);
  updateActiveByPosition(currentX);

  if (Math.abs(targetX - currentX) >= 0.2 || Math.abs(targetExperienceProgress - currentExperienceProgress) >= 0.002) {
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
    experiencePinDistance = 0;
    maxScrollTop = 0;
    applyHorizontalPosition(0);
    updateExperienceMotion(0, 0);
    return;
  }

  const lastPanel = panels[panels.length - 1] || null;
  maxHorizontal = lastPanel
    ? Math.max(0, lastPanel.offsetLeft)
    : Math.max(0, smoothContent.scrollWidth - window.innerWidth);
  const experiencePageCount = experienceSlider
    ? Math.max(1, experienceSlider.querySelectorAll(".experience-page").length)
    : 1;
  experiencePinDistance = experiencePanel
    ? Math.max(2200, window.innerWidth * (0.6 + experiencePageCount * 0.48))
    : 0;
  experiencePinStartY = experiencePanel ? experiencePanel.offsetLeft : 0;
  experiencePinEndY = experiencePinStartY + experiencePinDistance;
  maxScrollTop = maxHorizontal + experiencePinDistance;
  const verticalTravel = maxScrollTop + window.innerHeight;
  document.body.style.height = `${verticalTravel}px`;

  const mapped = mapScrollToState(window.scrollY);
  targetX = mapped.x;
  currentX = mapped.x;
  targetExperienceProgress = mapped.experienceProgress;
  currentExperienceProgress = mapped.experienceProgress;
  applyHorizontalPosition(currentX);
  updateExperienceMotion(currentX, currentExperienceProgress);
  updateActiveByPosition(currentX);
};

const onWindowScroll = () => {
  if (!isDesktopHorizontal()) {
    updateActiveMobile();
    return;
  }

  const mapped = mapScrollToState(window.scrollY);
  targetX = mapped.x;
  targetExperienceProgress = mapped.experienceProgress;
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
      applyHorizontalPosition(currentX);
      updateExperienceMotion(currentX, currentExperienceProgress);
      window.scrollTo({ top: nextTop, behavior: "auto" });
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
    navigationBoostUntil = Date.now() + 920;
    window.clearTimeout(navigationSettleTimer);
    window.scrollTo({
      top: nextTop,
      behavior: "smooth",
    });
    navigationSettleTimer = window.setTimeout(() => {
      syncScrollBoundary(nextTop);
    }, 980);
  } else {
    scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (target !== scrollTarget) {
    window.setTimeout(() => {
      if (typeof target.focus === "function") {
        target.focus({ preventScroll: true });
      }
      if (window.history?.replaceState) {
        window.history.replaceState(null, "", selector);
      }
    }, isDesktopHorizontal() ? 650 : 420);
  }
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

setupHorizontalScroll();
onWindowScroll();
bindHeroButtonMagnet();
bindHeroParallax();
bindHeroIllustrationStates();
bindNavHoverMotion();
initHeroAtmosphere();
