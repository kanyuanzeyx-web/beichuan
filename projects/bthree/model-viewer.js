const host = document.getElementById("product-model");
const fallback = document.getElementById("product-model-fallback");

const startModelViewer = async () => {
  if (!host) {
    return;
  }

  let THREE;
  let GLTFLoader;
  let MeshoptDecoder;
  try {
    [THREE, { GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
      import("https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js"),
      import("https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/loaders/GLTFLoader.js"),
      import("https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/libs/meshopt_decoder.module.js"),
    ]);
  } catch (error) {
    host.classList.add("is-model-error");
    if (fallback) fallback.textContent = "三维模型加载失败，案例内容仍可正常阅读。";
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0.2, 2.35, 7.25);
  camera.lookAt(0, 0.55, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.prepend(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xaed0ff, 0x080d17, 2.5));
  const keyLight = new THREE.DirectionalLight(0xe9f3ff, 3.1);
  keyLight.position.set(4, 5, 5);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(0x438fff, 14, 12, 2);
  rimLight.position.set(-3, 1.5, -2.5);
  scene.add(rimLight);

  const stage = new THREE.Group();
  scene.add(stage);

  const pointerLightTarget = rimLight.position.clone();
  const stageTiltTarget = new THREE.Vector2();

  let model = null;
  let frameId = 0;

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  const updatePointerResponse = (event) => {
    const rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const pointerX = THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const pointerY = THREE.MathUtils.clamp((event.clientY - rect.top) / rect.height, 0, 1);
    const normalizedX = pointerX * 2 - 1;
    const normalizedY = pointerY * 2 - 1;

    host.classList.add("is-pointer-active");
    pointerLightTarget.set(normalizedX * 3.8, 2.6 - normalizedY * 2.2, 3.2);

    if (event.buttons === 0) {
      const horizontalIntent = Math.abs(normalizedX) < 0.1 ? 0 : normalizedX;
      stageTiltTarget.set(-normalizedY * 0.025, horizontalIntent * THREE.MathUtils.degToRad(30));
    }
  };

  host.addEventListener("pointermove", updatePointerResponse);
  host.addEventListener("pointerleave", () => {
    host.classList.remove("is-pointer-active");
    pointerLightTarget.set(-3, 1.5, -2.5);
    stageTiltTarget.set(0, 0);
  });

  const centerModel = (loadedModel) => {
    // Lock the asset in profile first, then measure it in its final orientation.
    loadedModel.rotation.y = -Math.PI / 2;
    loadedModel.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(loadedModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);
    const hostRect = host.getBoundingClientRect();
    const narrowTarget = hostRect.width / Math.max(hostRect.height, 1) < 1 ? 2.78 : 3.15;
    const scaleTarget = window.innerWidth >= 900 ? 3.15 : narrowTarget;
    const scale = scaleTarget / maxDimension;
    loadedModel.scale.setScalar(scale);
    const verticalOffset = window.innerWidth >= 900 ? 1.5 : 0.72;
    loadedModel.position.set(-center.x * scale - 0.06, -box.min.y * scale - verticalOffset, -center.z * scale);
  };

  const modelLoader = new GLTFLoader();
  modelLoader.setMeshoptDecoder(MeshoptDecoder);
  modelLoader.load(
    "../../assets/projects/bthree/content-scanner-arm-v2-optimized.glb",
    (gltf) => {
      model = gltf.scene;
      centerModel(model);
      stage.add(model);
      fallback?.remove();
    },
    undefined,
    () => {
      host.classList.add("is-model-error");
      if (fallback) fallback.textContent = "三维模型加载失败，请刷新页面重试。";
    },
  );

  const render = () => {
    stage.rotation.x = THREE.MathUtils.lerp(stage.rotation.x, stageTiltTarget.x, 0.08);
    stage.rotation.y = THREE.MathUtils.lerp(stage.rotation.y, stageTiltTarget.y, 0.1);
    rimLight.position.lerp(pointerLightTarget, 0.09);
    renderer.render(scene, camera);
    frameId = window.requestAnimationFrame(render);
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();
  render();

  window.addEventListener("pagehide", () => {
    window.cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    renderer.dispose();
  }, { once: true });
};

if (host) {
  let started = false;
  const scheduleStart = () => {
    if (started) {
      return;
    }
    started = true;
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(startModelViewer, { timeout: 1200 });
      return;
    }
    window.setTimeout(startModelViewer, 180);
  };
  const visibilityObserver = new IntersectionObserver(([entry], observer) => {
    if (!entry?.isIntersecting) {
      return;
    }
    observer.disconnect();
    scheduleStart();
  }, { rootMargin: "160px 0px", threshold: 0.01 });
  visibilityObserver.observe(host);
}
