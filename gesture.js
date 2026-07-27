const TASKS_VISION_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35";
const TASKS_WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const HAND_MODEL_URL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

const HAND_CONNECTIONS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [0, 17]
];

const GESTURE_LABELS = {
  fist: "拳头",
  hand: "手势过渡",
  none: "未检测到手",
  open: "张开手掌",
  pinch: "捏合比心"
};

const gestureStage = document.querySelector("#gestureStage");
const gestureCamera = document.querySelector(".gesture-camera");
const gestureVideo = document.querySelector("#gestureVideo");
const gestureCanvas = document.querySelector("#gestureCanvas");
const gestureStatus = document.querySelector("#gestureStatus");
const gestureStartButton = document.querySelector("#gestureStartButton");
const gestureStopButton = document.querySelector("#gestureStopButton");
const particleCakeCanvas = document.querySelector("#particleCakeCanvas");
const photoCards = Array.from(document.querySelectorAll("[data-gesture-photo]"));
const canvasContext = gestureCanvas?.getContext("2d");
const particleCakeContext = particleCakeCanvas?.getContext("2d");

const gestureState = {
  animationFrameId: null,
  cakeAnimationFrameId: null,
  cakeIsVisible: false,
  cakeResizeTimer: null,
  cakeStageObserver: null,
  lastCakeFrameAt: 0,
  cakeMode: "cake",
  cakeParticles: [],
  cakeUnfoldStartedAt: 0,
  handLandmarker: null,
  isUnfolded: false,
  isGesturePhotoOpen: false,
  lastPinchAt: 0,
  lastStatusAt: 0,
  lastSwipeAt: 0,
  lastVideoTime: -1,
  mediaPipeModule: null,
  mediaStream: null,
  openPalmHistory: [],
  orbitRotation: 0,
  particleSpinBoost: 0,
  photoOpenTimer: null,
  rawGesture: "none",
  rawGestureSince: 0,
  running: false,
  selectedIndex: 0,
  stableGesture: "none",
  visionTasks: null
};

if (gestureStage && gestureVideo && gestureCanvas && canvasContext && particleCakeCanvas && particleCakeContext) {
  initializeGestureStage();
}

function initializeGestureStage() {
  photoCards.forEach((photoCard, photoIndex) => {
    photoCard.addEventListener("click", () => {
      selectPhoto(photoIndex);
      magnifySelectedPhoto("点击照片");
    });
  });

  gestureStartButton.addEventListener("click", startGestureCamera);
  gestureStopButton.addEventListener("click", stopGestureCamera);

  window.addEventListener("resize", renderPhotoOrbit);
  window.addEventListener("resize", scheduleParticleCakeReset);
  window.addEventListener("beforeunload", stopGestureCamera);
  document.addEventListener("visibilitychange", handleDocumentVisibilityChange);

  resetParticleCake();
  observeParticleCakeVisibility();
  renderPhotoOrbit();
}

async function startGestureCamera() {
  if (gestureState.running) {
    return;
  }

  if (!window.isSecureContext) {
    setGestureStatus("摄像头需要 HTTPS。请使用 GitHub Pages 网址或自定义域名访问。", true);
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    setGestureStatus("当前浏览器不支持摄像头 API。请换 Chrome、Edge 或 Safari 新版本。", true);
    return;
  }

  try {
    gestureStartButton.disabled = true;
    setGestureStatus("正在加载手势识别模型，请稍等…");
    await loadHandLandmarker();

    setGestureStatus("正在请求摄像头权限…");
    gestureState.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        height: { ideal: 480 },
        width: { ideal: 640 }
      }
    });

    gestureVideo.srcObject = gestureState.mediaStream;
    await gestureVideo.play();

    gestureState.running = true;
    gestureState.lastVideoTime = -1;
    gestureCamera.classList.add("is-active");
    gestureStopButton.disabled = false;
    setGestureStatus("摄像头已启动。先握拳，再张开手掌来展开蛋糕。");
    window.birthdayMuseum?.showToast("手势控制已启动。");
    runGestureLoop();
  } catch (error) {
    gestureStartButton.disabled = false;
    stopGestureCamera();
    setGestureStatus(`手势启动失败：${getReadableCameraError(error)}`, true);
  }
}

function stopGestureCamera() {
  if (gestureState.animationFrameId) {
    cancelAnimationFrame(gestureState.animationFrameId);
    gestureState.animationFrameId = null;
  }

  if (gestureState.mediaStream) {
    gestureState.mediaStream.getTracks().forEach((track) => track.stop());
    gestureState.mediaStream = null;
  }

  gestureVideo.srcObject = null;
  gestureState.running = false;
  gestureState.openPalmHistory = [];
  gestureState.rawGesture = "none";
  gestureState.stableGesture = "none";
  gestureCamera.classList.remove("is-active");
  gestureStartButton.disabled = false;
  gestureStopButton.disabled = true;
  clearGestureCanvas();
  setGestureStatus("摄像头已停止。需要时可重新启动。");
}

async function loadHandLandmarker() {
  if (gestureState.handLandmarker) {
    return;
  }

  if (!gestureState.mediaPipeModule) {
    gestureState.mediaPipeModule = await import(TASKS_VISION_URL);
  }

  const { FilesetResolver, HandLandmarker } = gestureState.mediaPipeModule;

  if (!gestureState.visionTasks) {
    gestureState.visionTasks = await FilesetResolver.forVisionTasks(TASKS_WASM_URL);
  }

  try {
    gestureState.handLandmarker = await createHandLandmarker(HandLandmarker, "GPU");
  } catch (gpuError) {
    gestureState.handLandmarker = await createHandLandmarker(HandLandmarker, "CPU");
  }
}

function createHandLandmarker(HandLandmarker, delegateName) {
  return HandLandmarker.createFromOptions(gestureState.visionTasks, {
    baseOptions: {
      delegate: delegateName,
      modelAssetPath: HAND_MODEL_URL
    },
    minHandDetectionConfidence: 0.62,
    minHandPresenceConfidence: 0.62,
    minTrackingConfidence: 0.58,
    numHands: 1,
    runningMode: "VIDEO"
  });
}

function runGestureLoop() {
  if (!gestureState.running || !gestureState.handLandmarker) {
    return;
  }

  const performanceNow = performance.now();

  if (gestureVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && gestureVideo.currentTime !== gestureState.lastVideoTime) {
    gestureState.lastVideoTime = gestureVideo.currentTime;
    const results = gestureState.handLandmarker.detectForVideo(gestureVideo, performanceNow);
    handleHandResults(results, performanceNow);
  }

  gestureState.animationFrameId = requestAnimationFrame(runGestureLoop);
}

function handleHandResults(results, performanceNow) {
  const handLandmarks = results.landmarks?.[0];

  if (!handLandmarks) {
    clearGestureCanvas();
    updateStableGesture("none", null, performanceNow);
    gestureState.openPalmHistory = [];
    return;
  }

  drawHandLandmarks(handLandmarks);

  const classifiedGesture = classifyHandGesture(handLandmarks);
  updateStableGesture(classifiedGesture, handLandmarks, performanceNow);

  if (gestureState.stableGesture === "open") {
    trackOpenPalmSwipe(handLandmarks, performanceNow);
  } else {
    gestureState.openPalmHistory = [];
  }
}

function updateStableGesture(classifiedGesture, handLandmarks, performanceNow) {
  if (classifiedGesture !== gestureState.rawGesture) {
    gestureState.rawGesture = classifiedGesture;
    gestureState.rawGestureSince = performanceNow;
  }

  if (performanceNow - gestureState.rawGestureSince < 150 || classifiedGesture === gestureState.stableGesture) {
    return;
  }

  const previousGesture = gestureState.stableGesture;
  gestureState.stableGesture = classifiedGesture;
  handleStableGestureChange(previousGesture, classifiedGesture, handLandmarks, performanceNow);
}

function handleStableGestureChange(previousGesture, nextGesture, handLandmarks, performanceNow) {
  if (previousGesture === "pinch" && nextGesture !== "pinch" && gestureState.isGesturePhotoOpen) {
    closeGesturePhoto(nextGesture === "none" ? "手势离开" : "手指分开");
  }

  if (nextGesture === "none") {
    setGestureStatus("没有检测到手。把手放到摄像头画面中央。", false, performanceNow);
    return;
  }

  setGestureStatus(`识别到：${GESTURE_LABELS[nextGesture]}。`, false, performanceNow);

  if (nextGesture === "fist" && gestureState.isUnfolded) {
    foldCake("张开手掌变拳头");
    return;
  }

  if (previousGesture === "fist" && nextGesture === "open") {
    unfoldCake("拳头张开");
    return;
  }

  if (nextGesture === "pinch" && gestureState.isUnfolded && performanceNow - gestureState.lastPinchAt > 900) {
    gestureState.lastPinchAt = performanceNow;
    magnifySelectedPhoto("捏合比心");
  }
}

function classifyHandGesture(handLandmarks) {
  const wrist = handLandmarks[0];
  const palmScale = Math.max(getLandmarkDistance(wrist, handLandmarks[9]), 0.001);
  const extendedFingerCount = countExtendedFingers(handLandmarks);
  const pinchDistance = getLandmarkDistance(handLandmarks[4], handLandmarks[8]) / palmScale;
  const indexReach = getLandmarkDistance(wrist, handLandmarks[8]) / palmScale;

  if (pinchDistance < 0.42 && indexReach > 1.28) {
    return "pinch";
  }

  if (extendedFingerCount >= 3) {
    return "open";
  }

  if (extendedFingerCount <= 1) {
    return "fist";
  }

  return "hand";
}

function countExtendedFingers(handLandmarks) {
  const wrist = handLandmarks[0];
  const fingerPairs = [
    [8, 6],
    [12, 10],
    [16, 14],
    [20, 18]
  ];

  return fingerPairs.reduce((extendedCount, [tipIndex, jointIndex]) => {
    const tipDistance = getLandmarkDistance(wrist, handLandmarks[tipIndex]);
    const jointDistance = getLandmarkDistance(wrist, handLandmarks[jointIndex]);
    return tipDistance > jointDistance * 1.16 ? extendedCount + 1 : extendedCount;
  }, 0);
}

function trackOpenPalmSwipe(handLandmarks, performanceNow) {
  if (!gestureState.isUnfolded) {
    return;
  }

  const palmCenter = getPalmCenter(handLandmarks);
  gestureState.openPalmHistory.push({
    horizontalPosition: palmCenter.horizontalPosition,
    timestamp: performanceNow
  });

  gestureState.openPalmHistory = gestureState.openPalmHistory.filter((entry) => performanceNow - entry.timestamp < 620);

  const oldestEntry = gestureState.openPalmHistory[0];
  if (!oldestEntry || performanceNow - gestureState.lastSwipeAt < 650) {
    return;
  }

  const horizontalDelta = palmCenter.horizontalPosition - oldestEntry.horizontalPosition;
  if (Math.abs(horizontalDelta) < 0.18) {
    return;
  }

  const swipeDirection = horizontalDelta > 0 ? 1 : -1;
  gestureState.lastSwipeAt = performanceNow;
  gestureState.openPalmHistory = [];
  rotatePhotoOrbit(swipeDirection, swipeDirection > 0 ? "右滑" : "左滑");
}

function unfoldCake(sourceLabel) {
  if (gestureState.isUnfolded) {
    return;
  }

  gestureState.isUnfolded = true;
  gestureStage.classList.add("is-unfolded");
  setGestureStatus(`${sourceLabel}：蛋糕已展开。现在用手掌左右滑动照片球。`);
  triggerParticleCakeUnfold();
  renderPhotoOrbit();
  window.birthdayMuseum?.burst(window.innerWidth * 0.54, window.innerHeight * 0.48);
}

function foldCake(sourceLabel) {
  if (!gestureState.isUnfolded) {
    return;
  }

  closeGesturePhoto(sourceLabel);
  gestureState.isUnfolded = false;
  gestureState.particleSpinBoost = 0;
  gestureState.cakeMode = "cake";
  gestureStage.classList.remove("is-unfolded");
  photoCards.forEach((photoCard) => photoCard.classList.remove("is-magnified"));
  setGestureStatus(`${sourceLabel}：粒子正在重新聚成蛋糕。`);
  startParticleCakeRender();
}

function rotatePhotoOrbit(direction, sourceLabel) {
  if (!gestureState.isUnfolded) {
    unfoldCake(sourceLabel);
  }

  gestureState.selectedIndex = normalizeIndex(gestureState.selectedIndex + direction, photoCards.length);
  gestureState.orbitRotation += direction * 38;
  gestureState.particleSpinBoost = direction * 0.18;
  gestureStage.style.setProperty("--orbit-shift", `${direction * 34}px`);
  window.setTimeout(() => gestureStage.style.setProperty("--orbit-shift", "0px"), 180);
  renderPhotoOrbit();
  setGestureStatus(`${sourceLabel}：照片球已转动，当前照片可捏合放大。`);
}

function selectPhoto(photoIndex) {
  gestureState.selectedIndex = normalizeIndex(photoIndex, photoCards.length);
  renderPhotoOrbit();
}

function magnifySelectedPhoto(sourceLabel) {
  if (!gestureState.isUnfolded || document.body.classList.contains("modal-open")) {
    return;
  }

  const selectedCard = photoCards[gestureState.selectedIndex];
  if (!selectedCard) {
    return;
  }

  selectedCard.classList.add("is-magnified");
  renderPhotoOrbit();
  setGestureStatus(`${sourceLabel}：当前照片已放大。`);
  window.birthdayMuseum?.burst(window.innerWidth * 0.5, window.innerHeight * 0.5);

  window.clearTimeout(gestureState.photoOpenTimer);
  gestureState.photoOpenTimer = window.setTimeout(() => {
    gestureState.photoOpenTimer = null;
    gestureState.isGesturePhotoOpen = true;
    window.birthdayMuseum?.openPhotoModal(Number(selectedCard.dataset.gesturePhoto));
  }, 180);

  window.setTimeout(() => {
    selectedCard.classList.remove("is-magnified");
    renderPhotoOrbit();
  }, 900);
}

function closeGesturePhoto(sourceLabel) {
  window.clearTimeout(gestureState.photoOpenTimer);
  gestureState.photoOpenTimer = null;

  if (!gestureState.isGesturePhotoOpen && !document.body.classList.contains("modal-open")) {
    return;
  }

  gestureState.isGesturePhotoOpen = false;
  window.birthdayMuseum?.closeModal();

  if (gestureState.isUnfolded) {
    setGestureStatus(`${sourceLabel}：照片已收回，可以继续左右滑动照片球。`);
  }
}

function observeParticleCakeVisibility() {
  if (!("IntersectionObserver" in window)) {
    gestureState.cakeIsVisible = true;
    startParticleCakeRender();
    return;
  }

  gestureState.cakeStageObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      gestureState.cakeIsVisible = Boolean(entry?.isIntersecting);

      if (gestureState.cakeIsVisible && document.visibilityState !== "hidden") {
        startParticleCakeRender();
      } else {
        stopParticleCakeRender();
      }
    },
    {
      root: null,
      rootMargin: "180px 0px",
      threshold: 0.01
    }
  );

  gestureState.cakeStageObserver.observe(gestureStage);
}

function startParticleCakeRender() {
  if (gestureState.cakeAnimationFrameId) {
    return;
  }

  gestureState.lastCakeFrameAt = 0;
  gestureState.cakeAnimationFrameId = requestAnimationFrame(renderParticleCake);
}

function stopParticleCakeRender() {
  if (!gestureState.cakeAnimationFrameId) {
    return;
  }

  cancelAnimationFrame(gestureState.cakeAnimationFrameId);
  gestureState.cakeAnimationFrameId = null;
}

function handleDocumentVisibilityChange() {
  if (document.visibilityState === "hidden") {
    stopParticleCakeRender();
    return;
  }

  if (gestureState.cakeIsVisible) {
    startParticleCakeRender();
  }
}

function scheduleParticleCakeReset() {
  window.clearTimeout(gestureState.cakeResizeTimer);
  gestureState.cakeResizeTimer = window.setTimeout(() => {
    resetParticleCake();

    if (gestureState.cakeIsVisible) {
      startParticleCakeRender();
    }
  }, 140);
}

function resetParticleCake() {
  synchronizeParticleCakeCanvas();
  const width = particleCakeCanvas.clientWidth || 640;
  const height = particleCakeCanvas.clientHeight || 590;
  const isCompactStage = width < 560;
  const particleCount = Math.min(
    isCompactStage ? 720 : 1180,
    Math.max(isCompactStage ? 560 : 820, Math.round((width * height) / 460))
  );
  const targets = createCakeTargets(width, height, particleCount);

  gestureState.cakeParticles = targets.map((target, particleIndex) => {
    const centerX = width / 2;
    const centerY = height * 0.53;
    const ambientAngle = (particleIndex / particleCount) * Math.PI * 2 + Math.random() * 0.8;
    const ambientRadius = 80 + Math.random() * Math.min(width, height) * 0.34;
    const particle = {
      alphaSeed: 0.52 + Math.random() * 0.42,
      color: target.color,
      life: 1,
      orbitAngle: ambientAngle,
      orbitRadiusX: ambientRadius,
      orbitRadiusY: ambientRadius * (0.38 + Math.random() * 0.24),
      orbitSpeed: 0.55 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      photoAnchorIndex: Math.random() < 0.48 ? particleIndex % Math.max(photoCards.length, 1) : -1,
      photoOffsetAngle: Math.random() * Math.PI * 2,
      photoOffsetRadius: 12 + Math.random() * 36,
      size: target.size,
      targetX: target.x,
      targetY: target.y,
      velocityX: (Math.random() - 0.5) * 10,
      velocityY: (Math.random() - 0.5) * 10,
      x: centerX + (Math.random() - 0.5) * width * 0.9,
      y: centerY + (Math.random() - 0.5) * height * 0.72
    };

    if (gestureState.isUnfolded) {
      particle.x = centerX + Math.cos(ambientAngle) * particle.orbitRadiusX;
      particle.y = centerY + Math.sin(ambientAngle) * particle.orbitRadiusY;
      particle.life = 0.72;
    }

    return particle;
  });

  gestureState.cakeMode = gestureState.isUnfolded ? "ambient" : "cake";
}

function createCakeTargets(width, height, particleCount) {
  const centerX = width / 2;
  const baseY = height * 0.66;
  const cakeWidth = Math.min(width * 0.46, height * 0.52, 330);
  const topHeight = cakeWidth * 0.17;
  const middleHeight = cakeWidth * 0.22;
  const bottomHeight = cakeWidth * 0.26;
  const fillColors = ["#bafefd", "#6ff7ff", "#f5d69a", "#ec8da2", "#b8a7ff"];
  const targets = [];

  for (let index = 0; index < particleCount; index += 1) {
    const randomShape = Math.random();
    let point;
    let color;
    let size;

    if (randomShape < 0.09) {
      point = createStarTarget(centerX, baseY - bottomHeight - middleHeight - topHeight - cakeWidth * 0.15, cakeWidth * 0.09);
      color = Math.random() < 0.68 ? "#ffffff" : "#f5d69a";
      size = 2.1 + Math.random() * 2.4;
    } else if (randomShape < 0.3) {
      point = createTierTarget(centerX, baseY - bottomHeight - middleHeight - topHeight * 0.5, cakeWidth * 0.34, topHeight);
      color = point.edge ? "#ffffff" : fillColors[Math.floor(Math.random() * fillColors.length)];
      size = point.edge ? 2.1 + Math.random() * 2.2 : 1.75 + Math.random() * 2.35;
    } else if (randomShape < 0.58) {
      point = createTierTarget(centerX, baseY - bottomHeight - middleHeight * 0.5, cakeWidth * 0.6, middleHeight);
      color = point.edge ? "#ffffff" : fillColors[Math.floor(Math.random() * fillColors.length)];
      size = point.edge ? 2.1 + Math.random() * 2.2 : 1.75 + Math.random() * 2.45;
    } else if (randomShape < 0.9) {
      point = createTierTarget(centerX, baseY - bottomHeight * 0.5, cakeWidth * 0.86, bottomHeight);
      color = point.edge ? "#ffffff" : fillColors[Math.floor(Math.random() * fillColors.length)];
      size = point.edge ? 2.1 + Math.random() * 2.4 : 1.8 + Math.random() * 2.55;
    } else {
      point = createRingTarget(centerX, baseY + bottomHeight * 0.12, cakeWidth * 0.58, cakeWidth * 0.12);
      color = Math.random() < 0.72 ? "#ffffff" : "#bafefd";
      size = 1.7 + Math.random() * 2.2;
    }

    targets.push({
      color,
      size,
      x: point.x,
      y: point.y
    });
  }

  return targets;
}

function createTierTarget(centerX, centerY, width, height) {
  const edgeBias = Math.random() < 0.46;
  const x = centerX + (Math.random() - 0.5) * width;
  const y = centerY + (Math.random() - 0.5) * height;

  if (!edgeBias) {
    return { edge: false, x, y };
  }

  return Math.random() < 0.5
    ? { edge: true, x: centerX + (Math.random() < 0.5 ? -width / 2 : width / 2) + (Math.random() - 0.5) * 8, y }
    : { edge: true, x, y: centerY + (Math.random() < 0.5 ? -height / 2 : height / 2) + (Math.random() - 0.5) * 8 };
}

function createStarTarget(centerX, centerY, radius) {
  const angle = Math.random() * Math.PI * 2;
  const starPulse = 0.72 + 0.28 * Math.cos(angle * 5);
  const distance = Math.sqrt(Math.random()) * radius * starPulse;

  return {
    x: centerX + Math.cos(angle) * distance,
    y: centerY + Math.sin(angle) * distance
  };
}

function createRingTarget(centerX, centerY, radiusX, radiusY) {
  const angle = Math.random() * Math.PI * 2;
  const jitter = 0.88 + Math.random() * 0.22;

  return {
    x: centerX + Math.cos(angle) * radiusX * jitter,
    y: centerY + Math.sin(angle) * radiusY * jitter
  };
}

function renderParticleCake(timestamp = performance.now()) {
  if (!gestureState.cakeIsVisible || document.visibilityState === "hidden") {
    gestureState.cakeAnimationFrameId = null;
    return;
  }

  if (timestamp - gestureState.lastCakeFrameAt < 32) {
    gestureState.cakeAnimationFrameId = requestAnimationFrame(renderParticleCake);
    return;
  }

  gestureState.lastCakeFrameAt = timestamp;
  synchronizeParticleCakeCanvas();
  const width = particleCakeCanvas.clientWidth || 640;
  const height = particleCakeCanvas.clientHeight || 590;

  if (!gestureState.cakeParticles.length) {
    resetParticleCake();
  }

  particleCakeContext.clearRect(0, 0, width, height);
  drawParticleAura(width, height, timestamp);
  particleCakeContext.globalCompositeOperation = "lighter";

  if (gestureState.isUnfolded) {
    drawPhotoParticleLinks(width, height, timestamp);
  }

  if (gestureState.cakeMode === "burst" && timestamp - gestureState.cakeUnfoldStartedAt > 1650) {
    gestureState.cakeMode = "ambient";
  }

  gestureState.cakeParticles.forEach((particle) => {
    if (gestureState.cakeMode === "cake") {
      updateCakeParticle(particle, timestamp);
      drawCakeParticle(particle, getCakeParticleAlpha(particle, timestamp));
      return;
    }

    if (gestureState.cakeMode === "burst") {
      updateBurstParticle(particle);
      drawCakeParticle(particle, particle.life);
      return;
    }

    updateAmbientParticle(particle, width, height, timestamp);
    drawCakeParticle(particle, 0.18 + particle.life * 0.42);
  });

  particleCakeContext.globalAlpha = 1;
  particleCakeContext.globalCompositeOperation = "source-over";
  gestureState.particleSpinBoost *= 0.92;
  gestureState.cakeAnimationFrameId = requestAnimationFrame(renderParticleCake);
}

function updateCakeParticle(particle, timestamp) {
  const shimmerX = Math.cos(timestamp * 0.002 + particle.phase) * 1.9;
  const shimmerY = Math.sin(timestamp * 0.0023 + particle.phase) * 1.7;
  const attractionX = particle.targetX + shimmerX - particle.x;
  const attractionY = particle.targetY + shimmerY - particle.y;

  particle.velocityX = (particle.velocityX + attractionX * 0.045) * 0.82;
  particle.velocityY = (particle.velocityY + attractionY * 0.045) * 0.82;
  particle.x += particle.velocityX;
  particle.y += particle.velocityY;
}

function updateBurstParticle(particle) {
  particle.x += particle.velocityX;
  particle.y += particle.velocityY;
  particle.velocityX *= 0.985;
  particle.velocityY = particle.velocityY * 0.985 + 0.012;
  particle.life = Math.max(0.22, particle.life - 0.012);
}

function updateAmbientParticle(particle, width, height, timestamp) {
  const centerX = width / 2;
  const centerY = height * 0.51;
  const orbitOffset = degreesToRadians(gestureState.orbitRotation * 0.82);
  const angle = particle.orbitAngle + timestamp * 0.0002 * particle.orbitSpeed + orbitOffset + gestureState.particleSpinBoost;
  let targetX = centerX + Math.cos(angle) * particle.orbitRadiusX;
  let targetY = centerY + Math.sin(angle) * particle.orbitRadiusY;

  if (particle.photoAnchorIndex >= 0 && photoCards.length) {
    const point = getPhotoOrbitPoint(particle.photoAnchorIndex, width, height);
    const photoX = (point.horizontalPosition / 100) * width;
    const photoY = (point.verticalPosition / 100) * height;
    const localAngle = particle.photoOffsetAngle + timestamp * 0.0007 * particle.orbitSpeed;
    targetX = photoX + Math.cos(localAngle) * particle.photoOffsetRadius;
    targetY = photoY + Math.sin(localAngle) * particle.photoOffsetRadius * 0.58;
  }

  particle.x += (targetX - particle.x) * 0.035;
  particle.y += (targetY - particle.y) * 0.035;
  particle.life = Math.min(0.9, particle.life + 0.008);
}

function drawParticleAura(width, height, timestamp) {
  const gradient = particleCakeContext.createRadialGradient(width / 2, height * 0.52, 20, width / 2, height * 0.52, Math.min(width, height) * 0.55);
  const pulse = 0.24 + Math.sin(timestamp * 0.002) * 0.06;

  gradient.addColorStop(0, `rgba(186, 254, 253, ${pulse})`);
  gradient.addColorStop(0.34, "rgba(236, 141, 162, 0.08)");
  gradient.addColorStop(1, "rgba(9, 8, 18, 0)");

  particleCakeContext.globalCompositeOperation = "screen";
  particleCakeContext.fillStyle = gradient;
  particleCakeContext.fillRect(0, 0, width, height);
  particleCakeContext.globalCompositeOperation = "source-over";
}

function drawPhotoParticleLinks(width, height, timestamp) {
  const centerX = width / 2;
  const centerY = height * 0.51;

  particleCakeContext.save();
  particleCakeContext.globalCompositeOperation = "lighter";

  photoCards.forEach((photoCard, photoIndex) => {
    const point = getPhotoOrbitPoint(photoIndex, width, height);
    const targetX = (point.horizontalPosition / 100) * width;
    const targetY = (point.verticalPosition / 100) * height;
    const selected = photoIndex === gestureState.selectedIndex;
    const lineAlpha = selected ? 0.32 : 0.16 + point.depthRatio * 0.08;

    particleCakeContext.strokeStyle = `rgba(186, 254, 253, ${lineAlpha})`;
    particleCakeContext.lineWidth = selected ? 1.4 : 0.8;
    particleCakeContext.beginPath();
    particleCakeContext.moveTo(centerX, centerY);
    particleCakeContext.quadraticCurveTo(
      (centerX + targetX) / 2 + Math.cos(timestamp * 0.0014 + photoIndex) * 26,
      (centerY + targetY) / 2 + Math.sin(timestamp * 0.0012 + photoIndex) * 18,
      targetX,
      targetY
    );
    particleCakeContext.stroke();

    for (let beadIndex = 0; beadIndex < 9; beadIndex += 1) {
      const progress = (beadIndex + 1) / 10;
      const wave = Math.sin(timestamp * 0.003 + beadIndex + photoIndex) * 0.018;
      const beadX = centerX + (targetX - centerX) * progress + Math.cos(point.radians) * wave * width;
      const beadY = centerY + (targetY - centerY) * progress + Math.sin(point.radians) * wave * height;
      const beadSize = selected ? 2.2 : 1.45;

      particleCakeContext.globalAlpha = selected ? 0.66 : 0.34;
      particleCakeContext.fillStyle = beadIndex % 3 === 0 ? "#f5d69a" : "#bafefd";
      particleCakeContext.fillRect(beadX, beadY, beadSize, beadSize);
    }
  });

  particleCakeContext.restore();
  particleCakeContext.globalAlpha = 1;
}

function drawCakeParticle(particle, alpha) {
  const finalAlpha = Math.max(0, Math.min(alpha, 1));
  if (finalAlpha <= 0.01) {
    return;
  }

  particleCakeContext.globalAlpha = finalAlpha;
  particleCakeContext.fillStyle = particle.color;
  particleCakeContext.fillRect(particle.x, particle.y, particle.size, particle.size);
}

function getCakeParticleAlpha(particle, timestamp) {
  return Math.max(0.42, Math.min(1, particle.alphaSeed + Math.sin(timestamp * 0.004 + particle.phase) * 0.26));
}

function triggerParticleCakeUnfold() {
  synchronizeParticleCakeCanvas();
  const width = particleCakeCanvas.clientWidth || 640;
  const height = particleCakeCanvas.clientHeight || 590;
  const centerX = width / 2;
  const centerY = height * 0.53;

  gestureState.cakeMode = "burst";
  gestureState.cakeUnfoldStartedAt = performance.now();

  gestureState.cakeParticles.forEach((particle, particleIndex) => {
    const deltaX = particle.x - centerX;
    const deltaY = particle.y - centerY;
    const distance = Math.max(Math.hypot(deltaX, deltaY), 1);
    const radialX = deltaX / distance;
    const radialY = deltaY / distance;
    const tangent = particleIndex % 2 === 0 ? 1 : -1;
    const speed = 4.8 + Math.random() * 8.8;

    particle.velocityX = radialX * speed + -radialY * tangent * (1.8 + Math.random() * 3.2);
    particle.velocityY = radialY * speed + radialX * tangent * (1.8 + Math.random() * 3.2) - 1.8;
    particle.life = 1;
    particle.orbitAngle = Math.atan2(deltaY, deltaX) + Math.random() * 1.4;
    particle.orbitRadiusX = Math.min(width * 0.38, 260) * (0.55 + Math.random() * 0.65);
    particle.orbitRadiusY = Math.min(height * 0.26, 170) * (0.55 + Math.random() * 0.72);
  });
}

function synchronizeParticleCakeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.2);
  const width = Math.max(320, Math.round(gestureStage.clientWidth || 640));
  const height = Math.max(420, Math.round(gestureStage.clientHeight || 590));
  const pixelWidth = Math.floor(width * ratio);
  const pixelHeight = Math.floor(height * ratio);

  if (particleCakeCanvas.width !== pixelWidth || particleCakeCanvas.height !== pixelHeight) {
    particleCakeCanvas.width = pixelWidth;
    particleCakeCanvas.height = pixelHeight;
    particleCakeCanvas.style.width = `${width}px`;
    particleCakeCanvas.style.height = `${height}px`;
    particleCakeContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
}

function renderPhotoOrbit() {
  if (!photoCards.length || !gestureStage) {
    return;
  }

  const stageWidth = gestureStage.clientWidth || 620;
  const stageHeight = gestureStage.clientHeight || 590;

  photoCards.forEach((photoCard, photoIndex) => {
    const orbitPoint = getPhotoOrbitPoint(photoIndex, stageWidth, stageHeight);
    const selectedScale = photoIndex === gestureState.selectedIndex ? 0.24 : 0;
    const magnifiedScale = photoCard.classList.contains("is-magnified") ? 0.52 : 0;
    const photoScale = 0.76 + orbitPoint.depthRatio * 0.28 + selectedScale + magnifiedScale;
    const photoRotation = Math.cos(orbitPoint.radians) * 8;

    photoCard.classList.toggle("is-selected", photoIndex === gestureState.selectedIndex);
    photoCard.style.left = `${orbitPoint.horizontalPosition}%`;
    photoCard.style.top = `${orbitPoint.verticalPosition}%`;
    photoCard.style.zIndex = String(Math.round(10 + orbitPoint.depthRatio * 20 + (photoIndex === gestureState.selectedIndex ? 30 : 0)));
    photoCard.style.transform = `translate(-50%, -50%) rotate(${photoRotation}deg) scale(${photoScale})`;
  });
}

function getPhotoOrbitPoint(photoIndex, stageWidth, stageHeight) {
  const radiusHorizontal = Math.min(stageWidth * 0.36, 255);
  const radiusVertical = Math.min(stageHeight * 0.25, 165);
  const angleStep = 360 / photoCards.length;
  const orbitAngle = photoIndex * angleStep - 90 + gestureState.orbitRotation;
  const radians = degreesToRadians(orbitAngle);
  const horizontalPosition = 50 + (Math.cos(radians) * radiusHorizontal * 100) / stageWidth;
  const verticalPosition = 50 + (Math.sin(radians) * radiusVertical * 100) / stageHeight;
  const depthRatio = (Math.sin(radians) + 1) / 2;

  return {
    depthRatio,
    horizontalPosition,
    radians,
    verticalPosition
  };
}

function drawHandLandmarks(handLandmarks) {
  synchronizeCanvasSize();
  canvasContext.clearRect(0, 0, gestureCanvas.width, gestureCanvas.height);
  canvasContext.lineCap = "round";
  canvasContext.lineJoin = "round";
  canvasContext.lineWidth = 4;
  canvasContext.strokeStyle = "rgba(186, 254, 253, 0.72)";

  HAND_CONNECTIONS.forEach(([startIndex, endIndex]) => {
    const startLandmark = handLandmarks[startIndex];
    const endLandmark = handLandmarks[endIndex];
    canvasContext.beginPath();
    canvasContext.moveTo(startLandmark.x * gestureCanvas.width, startLandmark.y * gestureCanvas.height);
    canvasContext.lineTo(endLandmark.x * gestureCanvas.width, endLandmark.y * gestureCanvas.height);
    canvasContext.stroke();
  });

  handLandmarks.forEach((landmark) => {
    canvasContext.beginPath();
    canvasContext.fillStyle = "rgba(245, 214, 154, 0.92)";
    canvasContext.arc(landmark.x * gestureCanvas.width, landmark.y * gestureCanvas.height, 5, 0, Math.PI * 2);
    canvasContext.fill();
  });
}

function clearGestureCanvas() {
  synchronizeCanvasSize();
  canvasContext.clearRect(0, 0, gestureCanvas.width, gestureCanvas.height);
}

function synchronizeCanvasSize() {
  const videoWidth = gestureVideo.videoWidth || gestureVideo.clientWidth || 640;
  const videoHeight = gestureVideo.videoHeight || gestureVideo.clientHeight || 480;

  if (gestureCanvas.width !== videoWidth || gestureCanvas.height !== videoHeight) {
    gestureCanvas.width = videoWidth;
    gestureCanvas.height = videoHeight;
  }
}

function setGestureStatus(message, forceMessage = false, performanceNow = performance.now()) {
  if (!gestureStatus) {
    return;
  }

  if (!forceMessage && performanceNow - gestureState.lastStatusAt < 260) {
    return;
  }

  gestureState.lastStatusAt = performanceNow;
  gestureStatus.textContent = message;
}

function getPalmCenter(handLandmarks) {
  const palmIndexes = [0, 5, 9, 13, 17];
  const totalPosition = palmIndexes.reduce(
    (position, landmarkIndex) => ({
      horizontalPosition: position.horizontalPosition + handLandmarks[landmarkIndex].x,
      verticalPosition: position.verticalPosition + handLandmarks[landmarkIndex].y
    }),
    { horizontalPosition: 0, verticalPosition: 0 }
  );

  return {
    horizontalPosition: 1 - totalPosition.horizontalPosition / palmIndexes.length,
    verticalPosition: totalPosition.verticalPosition / palmIndexes.length
  };
}

function getLandmarkDistance(firstLandmark, secondLandmark) {
  return Math.hypot(firstLandmark.x - secondLandmark.x, firstLandmark.y - secondLandmark.y);
}

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function normalizeIndex(index, length) {
  return ((index % length) + length) % length;
}

function getReadableCameraError(error) {
  if (error?.name === "NotAllowedError") {
    return "摄像头权限被拒绝。请在浏览器地址栏允许摄像头。";
  }

  if (error?.name === "NotFoundError") {
    return "没有找到可用摄像头。";
  }

  if (error?.name === "NotReadableError") {
    return "摄像头正被其他程序占用。";
  }

  return error?.message || "请检查网络、摄像头权限和浏览器兼容性。";
}
