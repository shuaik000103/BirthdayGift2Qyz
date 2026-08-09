const LOGIN_SESSION_KEY = "birthdayMuseumLoggedIn";

const cuteMoments = [
  {
    code: "瞬间 01",
    title: "突然认真",
    image: "pics/portrait.jpg",
    alt: "可爱瞬间照片",
    text: "适合放一张很乖、很专注的照片，像是世界突然安静地偏向她。"
  },
  {
    code: "瞬间 02",
    title: "笑到失控",
    image: "pics/party.jpg",
    alt: "开心大笑的可爱瞬间照片",
    text: "把那种藏不住的开心收进来，以后每次点开都能重新被逗笑。"
  },
  {
    code: "瞬间 03",
    title: "今日限定",
    image: "pics/birthday-person.jpg",
    alt: "生日当天的可爱瞬间照片",
    text: "今天她拥有最高优先级，连普通画面都要被认真收藏。"
  },
  {
    code: "瞬间 04",
    title: "可爱存档",
    image: "pics/coffee-cups.jpg",
    alt: "日常可爱瞬间照片",
    text: "不需要很隆重，只要她出现在画面里，这一格就已经值得保存。"
  }
];

const stories = [
  {
    year: "2021",
    title: "第一次被记住的瞬间",
    image: "pics/party.jpg",
    text: "有些人出现得很自然，却会在后来变成生活里很重要的注脚。"
  },
  {
    year: "2022",
    title: "一起笑到停不下来",
    image: "pics/coffee-friends.jpg",
    text: "普通的一天，因为有人一起分享，就突然变成了很值得回看的片段。"
  },
  {
    year: "2023",
    title: "把普通日子过成纪念日",
    image: "pics/coffee-cups.jpg",
    text: "不是每个纪念日都需要隆重，有时候一杯热饮、一句玩笑，就足够被记很久。"
  },
  {
    year: "2026",
    title: "今天，把祝福郑重送达",
    image: "pics/cake.jpg",
    text: "新的一岁已经开始，愿她继续拥有明亮、具体、不会迟到的快乐。"
  }
];

const photos = [
  {
    image: "pics/birthday-person.jpg",
    alt: "生日人像占位图",
    caption: "今天是她的主场。"
  },
  {
    image: "pics/cake.jpg",
    alt: "生日蛋糕占位图",
    caption: "愿望藏在烛光里。"
  },
  {
    image: "pics/party.jpg",
    alt: "生日派对占位图",
    caption: "每次热闹都值得留下。"
  },
  {
    image: "pics/coffee-friends.jpg",
    alt: "朋友聚会占位图",
    caption: "下次见面继续补给快乐。"
  },
  {
    image: "pics/portrait.jpg",
    alt: "微笑人像占位图",
    caption: "每个认真发光的瞬间都值得被看见。"
  },
  {
    image: "pics/coffee-cups.jpg",
    alt: "咖啡约定占位图",
    caption: "把下一次见面提前写进愿望里。"
  }
];

const wishTextFallbacks = [
  "愿你新的一岁，继续被喜欢的事情围绕，也被温柔的人认真对待。",
  "愿今天所有的小确幸，都排着队走向你。",
  "愿你保持可爱，也保持锋利，想要的东西都能慢慢靠近。",
  "愿这一岁，快乐不用等，幸运不用找，你一直在自己的光里。",
  "愿你吃到喜欢的蛋糕，遇到好天气，也收到很多真心。",
  "愿你疲惫时有地方休息，开心时有人认真听你分享。"
];

const WISH_MANIFEST_URL = "wishes/manifest.json";
const DEFAULT_WISH_BASE_PATH = "wishes/friends/";
const WISH_GALLERY_SHAPES = new Set(["grid", "heart", "river"]);

const gifts = [
  "快乐补给券已打开：凭此券可以兑换一次认真陪聊，不限时长。",
  "奶茶兑换券已打开：下次见面，第一杯甜的由送礼人负责。",
  "陪伴通行证已打开：想出门、想吐槽、想发呆，都可以随时呼叫。"
];

const loginScreen = document.querySelector("#loginScreen");
const loginForm = document.querySelector("#loginForm");
const loginError = document.querySelector("#loginError");
const loginSubmit = loginForm.querySelector(".login-submit");
const siteShell = document.querySelector("#siteShell");
const photoModal = document.querySelector("#photoModal");
const photoModalImage = document.querySelector("#photoModalImage");
const photoCaption = document.querySelector("#photoCaption");
const toast = document.querySelector("#toast");
const header = document.querySelector(".site-header");
const wishCard = document.querySelector("#wishCard");
const wishButton = document.querySelector("#wishButton");
const wishGalleryButton = document.querySelector("#wishGalleryButton");
const wishGalleryPanel = document.querySelector("#wishGalleryPanel");
const wishGalleryBoard = document.querySelector("#wishGalleryBoard");
const wishGalleryCount = document.querySelector("#wishGalleryCount");
const wishGalleryCloseButtons = document.querySelectorAll("[data-wish-gallery-close]");
const wishImage = document.querySelector("#wishImage");
const wishLoadState = document.querySelector("#wishLoadState");
const wishPlaceholder = document.querySelector("#wishPlaceholder");
const wishStage = document.querySelector("#wishStage");
const canvas = document.querySelector("#sparkles");
const ctx = canvas.getContext("2d");
const timelinePreviewImage = document.querySelector("#timelinePreview img");
const timelineYear = document.querySelector("#timelineYear");
const timelineStoryTitle = document.querySelector("#timelineStoryTitle");
const timelineStoryText = document.querySelector("#timelineStoryText");
const cuteScreen = document.querySelector("#cuteScreen");
const cutePlaceholder = document.querySelector("#cutePlaceholder");
const cuteMomentImage = document.querySelector("#cuteMomentImage");
const cuteCaption = document.querySelector("#cuteCaption");
const cuteMomentCode = document.querySelector("#cuteMomentCode");
const cuteMomentTitle = document.querySelector("#cuteMomentTitle");
const cuteMomentText = document.querySelector("#cuteMomentText");
const starSky = document.querySelector("#starSky");
const starForm = document.querySelector("#starForm");
const starInput = document.querySelector("#starInput");
const starMessage = document.querySelector("#starMessage");
const giftCount = document.querySelector("#giftCount");
const giftResult = document.querySelector("#giftResult");
const letterHidden = document.querySelector("#letterHidden");
const certificateButton = document.querySelector("#certificateButton");
const birthdayCertificate = document.querySelector("#birthdayCertificate");

let toastTimer;
let particles = [];
let fireworkShells = [];
let lastParticleFrameAt = performance.now();
const openedGifts = new Set();
const wishTextEntries = wishTextFallbacks.map((text, index) => ({
  key: `text-${index}`,
  text,
  type: "text"
}));
let wishImageEntries = [];
let currentWishEntry = null;
let currentWishShape = "grid";
const FIREWORK_PALETTES = [
  ["#fff7cf", "#ffd166", "#ff9f1c"],
  ["#fff0f5", "#ff5f8f", "#b84cff"],
  ["#eaffff", "#66e6ff", "#2ec4b6"],
  ["#fff9f1", "#ffffff", "#f7b267"],
  ["#f8ecff", "#c77dff", "#7b2cbf"]
];
const MAX_FIREWORK_SHELLS = 10;
const MAX_FIREWORK_PARTICLES = 680;
const FIREWORK_FRAME_INTERVAL = 1000 / 45;

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function enterMuseum(options = {}) {
  const shouldAnimate = options.animate !== false;
  sessionStorage.setItem(LOGIN_SESSION_KEY, "1");
  loginScreen.classList.add("is-hidden");
  siteShell.classList.add("is-ready");
  siteShell.setAttribute("aria-hidden", "false");
  document.body.classList.remove("is-locked");

  if (!shouldAnimate) {
    return;
  }

  window.setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    burst(window.innerWidth * 0.5, window.innerHeight * 0.36);
  }, 260);
}

function validateLoginInput(username, password) {
  return Boolean(username && password);
}

function resolvePhotoUrl(source) {
  return source;
}

function clearSavedLogin() {
  sessionStorage.removeItem(LOGIN_SESSION_KEY);
}

function closeModal() {
  photoModal.classList.remove("is-open");
  photoModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function openPhotoModal(index) {
  const photo = photos[index];
  photoModalImage.src = resolvePhotoUrl(photo.image);
  photoModalImage.alt = photo.alt;
  photoCaption.textContent = photo.caption;
  photoModal.classList.add("is-open");
  photoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function randomBetween(minimum, maximum) {
  return minimum + Math.random() * (maximum - minimum);
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function normalizeBasePath(basePath) {
  const safeBasePath = String(basePath || DEFAULT_WISH_BASE_PATH).replace(/^\/+/, "");
  return safeBasePath.endsWith("/") ? safeBasePath : `${safeBasePath}/`;
}

function encodeRelativePath(path) {
  return String(path)
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function normalizeWishImageEntry(entry, index, basePath) {
  const fileName = typeof entry === "string" ? entry : entry.file || entry.src;

  if (!fileName) {
    return null;
  }

  const isAbsoluteSource = /^(https?:|data:|blob:)/i.test(fileName);
  const image = isAbsoluteSource ? fileName : `${basePath}${encodeRelativePath(fileName)}`;
  const displayIndex = String(index + 1).padStart(2, "0");

  return {
    alt: entry.alt || `好友生日祝福截图 ${displayIndex}`,
    caption: entry.caption || `第 ${displayIndex} 张好友生日祝福`,
    image,
    key: `image-${fileName}`,
    type: "image"
  };
}

function updateWishLoadState(message) {
  wishLoadState.textContent = message;
}

function applyImageFrameState(container, imageElement, aspectProperty) {
  const width = imageElement.naturalWidth;
  const height = imageElement.naturalHeight;

  container.classList.remove("is-portrait-image", "is-wide-image", "is-long-image");

  if (!width || !height) {
    return;
  }

  const aspect = width / height;
  container.style.setProperty(aspectProperty, aspect.toFixed(4));
  container.classList.toggle("is-portrait-image", aspect < 0.82);
  container.classList.toggle("is-wide-image", aspect > 1.28);
  container.classList.toggle("is-long-image", height / width > 2.1);
}

function syncImageFrameWhenReady(container, imageElement, aspectProperty) {
  if (imageElement.complete && imageElement.naturalWidth) {
    applyImageFrameState(container, imageElement, aspectProperty);
  }
}

function getWishEntries() {
  return wishImageEntries.length ? wishImageEntries : wishTextEntries;
}

function showWishEntry(entry) {
  currentWishEntry = entry;

  if (entry.type === "image") {
    wishStage.classList.add("has-image");
    wishPlaceholder.hidden = true;
    wishImage.hidden = false;
    wishImage.src = resolvePhotoUrl(entry.image);
    wishImage.alt = entry.alt;
    syncImageFrameWhenReady(wishStage, wishImage, "--wish-aspect");
    wishCard.classList.add("is-compact");
    wishCard.textContent = entry.caption;
    return;
  }

  wishStage.classList.remove("has-image");
  wishStage.classList.remove("is-portrait-image", "is-wide-image", "is-long-image");
  wishStage.style.removeProperty("--wish-aspect");
  wishImage.hidden = true;
  wishImage.removeAttribute("src");
  wishImage.alt = "";
  wishPlaceholder.hidden = false;
  wishCard.classList.remove("is-compact");
  wishCard.textContent = entry.text;
}

function drawWishEntry() {
  const entries = getWishEntries();
  const candidates =
    entries.length > 1 && currentWishEntry
      ? entries.filter((entry) => entry.key !== currentWishEntry.key)
      : entries;
  const nextWishEntry = pickRandom(candidates);

  showWishEntry(nextWishEntry);

  if (nextWishEntry.type === "image") {
    showElementFireworks(wishStage, { duration: 1100, shells: 8 });
  } else {
    burst(window.innerWidth * 0.72, window.innerHeight * 0.5);
  }
}

function computeHeartPositions(count) {
  if (count <= 1) {
    return [{ x: 50, y: 52 }];
  }

  const rawPositions = Array.from({ length: count }, (_, index) => {
    const angleValue = (index / count) * Math.PI * 2;
    const sinValue = Math.sin(angleValue);
    const rawX = 16 * Math.pow(sinValue, 3);
    const rawY = -(
      13 * Math.cos(angleValue) -
      5 * Math.cos(2 * angleValue) -
      2 * Math.cos(3 * angleValue) -
      Math.cos(4 * angleValue)
    );

    return { x: rawX, y: rawY };
  });
  const xValues = rawPositions.map((position) => position.x);
  const yValues = rawPositions.map((position) => position.y);
  const minimumX = Math.min(...xValues);
  const maximumX = Math.max(...xValues);
  const minimumY = Math.min(...yValues);
  const maximumY = Math.max(...yValues);

  return rawPositions.map((position) => ({
    x: 10 + ((position.x - minimumX) / (maximumX - minimumX)) * 80,
    y: 10 + ((position.y - minimumY) / (maximumY - minimumY)) * 78
  }));
}

function renderWishGallery() {
  wishGalleryBoard.className = `wish-gallery-board is-${currentWishShape}`;
  wishGalleryBoard.innerHTML = "";
  wishGalleryBoard.style.setProperty(
    "--heart-item-size",
    `${Math.max(46, Math.min(86, 420 / Math.sqrt(Math.max(wishImageEntries.length, 1))))}px`
  );
  wishGalleryCount.textContent = wishImageEntries.length
    ? `${wishImageEntries.length} 张截图 · 可切换形状`
    : "还没有读取到截图";

  if (!wishImageEntries.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "wish-gallery-empty";
    emptyState.textContent = "把好友祝福截图放进 wishes/friends/，再更新 wishes/manifest.json，这里会自动展示。";
    wishGalleryBoard.appendChild(emptyState);
    return;
  }

  const heartPositions = computeHeartPositions(wishImageEntries.length);

  wishImageEntries.forEach((entry, index) => {
    const galleryItem = document.createElement("button");
    galleryItem.className = "wish-gallery-item";
    galleryItem.type = "button";
    galleryItem.style.setProperty("--heart-x", `${heartPositions[index].x}%`);
    galleryItem.style.setProperty("--heart-y", `${heartPositions[index].y}%`);
    galleryItem.style.setProperty("--tilt", `${((index % 7) - 3) * 1.4}deg`);
    galleryItem.style.setProperty("--river-offset", `${(index % 5) * 16}px`);
    galleryItem.setAttribute("aria-label", entry.caption);

    const image = document.createElement("img");
    image.src = resolvePhotoUrl(entry.image);
    image.alt = entry.alt;
    galleryItem.appendChild(image);

    galleryItem.addEventListener("click", () => {
      showWishEntry(entry);
      closeWishGallery();
      wishStage.scrollIntoView({ behavior: "smooth", block: "center" });
      showElementFireworks(wishStage, { duration: 900, shells: 6 });
    });

    wishGalleryBoard.appendChild(galleryItem);
  });
}

function setWishGalleryShape(shape) {
  if (!WISH_GALLERY_SHAPES.has(shape)) {
    return;
  }

  currentWishShape = shape;
  document.querySelectorAll("[data-wish-shape]").forEach((button) => {
    const isSelected = button.dataset.wishShape === shape;
    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
  renderWishGallery();
}

function openWishGallery() {
  wishGalleryPanel.hidden = false;
  wishGalleryPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-wish-showcase-open");
  wishGalleryButton.textContent = "收起全部祝福";
  renderWishGallery();
  requestAnimationFrame(() => {
    wishGalleryPanel.classList.add("is-open");
  });
}

function closeWishGallery() {
  wishGalleryPanel.classList.remove("is-open");
  wishGalleryPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-wish-showcase-open");
  wishGalleryButton.textContent = "展示全部祝福";

  window.setTimeout(() => {
    if (!wishGalleryPanel.classList.contains("is-open")) {
      wishGalleryPanel.hidden = true;
    }
  }, 180);
}

function toggleWishGallery() {
  if (wishGalleryPanel.hidden) {
    openWishGallery();
  } else {
    closeWishGallery();
  }
}

async function loadWishImageManifest() {
  try {
    const response = await fetch(WISH_MANIFEST_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`manifest status ${response.status}`);
    }

    const manifest = await response.json();
    const basePath = normalizeBasePath(manifest.basePath);
    const images = Array.isArray(manifest.images) ? manifest.images : [];
    wishImageEntries = images
      .map((entry, index) => normalizeWishImageEntry(entry, index, basePath))
      .filter(Boolean);

    updateWishLoadState(
      wishImageEntries.length
        ? `已加载 ${wishImageEntries.length} 张好友祝福截图。`
        : "还没有读取到祝福截图，复制图片后更新图册清单。"
    );
  } catch (error) {
    wishImageEntries = [];
    updateWishLoadState("未读取到祝福截图清单，当前使用文字祝福备用。");
  }

  renderWishGallery();
}

function easeOutCubic(progress) {
  return 1 - Math.pow(1 - progress, 3);
}

function blendHexColors(leftColor, rightColor, ratio) {
  const normalizedRatio = Math.max(0, Math.min(1, ratio));
  const left = leftColor.replace("#", "");
  const right = rightColor.replace("#", "");
  const channels = [0, 2, 4].map((offset) => {
    const leftValue = Number.parseInt(left.slice(offset, offset + 2), 16);
    const rightValue = Number.parseInt(right.slice(offset, offset + 2), 16);
    return Math.round(leftValue + (rightValue - leftValue) * normalizedRatio)
      .toString(16)
      .padStart(2, "0");
  });

  return `#${channels.join("")}`;
}

function trimFireworkLoad() {
  if (fireworkShells.length > MAX_FIREWORK_SHELLS) {
    fireworkShells.splice(0, fireworkShells.length - MAX_FIREWORK_SHELLS);
  }

  if (particles.length > MAX_FIREWORK_PARTICLES) {
    particles.splice(0, particles.length - MAX_FIREWORK_PARTICLES);
  }
}

function launchFireworkShell(targetX, targetY, options = {}) {
  const palette = pickRandom(FIREWORK_PALETTES);
  const shellSpread = options.spread ?? 0;
  const safeTargetX = Math.max(48, Math.min(window.innerWidth - 48, targetX + randomBetween(-shellSpread / 2, shellSpread / 2)));
  const safeTargetY = Math.max(80, Math.min(window.innerHeight - 70, targetY + randomBetween(-42, 42)));
  const shell = {
    age: 0,
    arc: randomBetween(18, 48),
    color: pickRandom(palette),
    duration: randomBetween(360, 560),
    palette,
    startX: safeTargetX + randomBetween(-120, 120),
    startY: window.innerHeight + 30,
    targetX: safeTargetX,
    targetY: safeTargetY,
    trail: [],
    wobble: randomBetween(8, 22),
    wobblePhase: randomBetween(1.8, 3.8),
    x: safeTargetX,
    y: window.innerHeight + 30
  };

  fireworkShells.push(shell);
  trimFireworkLoad();
}

function createFireworkParticle(x, y, velocityX, velocityY, color, options = {}) {
  const particleLife = options.life ?? randomBetween(62, 106);

  particles.push({
    air: options.air ?? randomBetween(0.972, 0.988),
    color,
    crackleAt: options.crackleAt ?? 0,
    gravity: options.gravity ?? randomBetween(0.045, 0.08),
    life: particleLife,
    maxLife: particleLife,
    shimmer: Math.random() > 0.55,
    shimmerPhase: randomBetween(0, Math.PI * 2),
    size: options.size ?? randomBetween(1.3, 2.8),
    trail: [],
    trailLength: options.trailLength ?? 7,
    vx: velocityX,
    vy: velocityY,
    x,
    y
  });
}

function explodeFirework(shell) {
  const burstSize = 52 + Math.floor(Math.random() * 26);
  const ringOffset = Math.random() * Math.PI * 2;

  for (let index = 0; index < burstSize; index += 1) {
    const angle = (index / burstSize) * Math.PI * 2 + ringOffset + randomBetween(-0.035, 0.035);
    const speed = randomBetween(2.4, 6.4) * (index % 3 === 0 ? 1.08 : 1);
    const color = index % 5 === 0 ? "#fffdf4" : pickRandom(shell.palette);
    createFireworkParticle(shell.targetX, shell.targetY, Math.cos(angle) * speed, Math.sin(angle) * speed, color, {
      crackleAt: Math.random() > 0.9 ? randomBetween(18, 34) : 0,
      life: randomBetween(54, 90),
      size: randomBetween(1.1, 2),
      trailLength: 5
    });
  }

  for (let index = 0; index < 10; index += 1) {
    const angle = (index / 10) * Math.PI * 2 + ringOffset;
    const speed = randomBetween(2.4, 4.4);
    createFireworkParticle(shell.targetX, shell.targetY, Math.cos(angle) * speed, Math.sin(angle) * speed - randomBetween(0.2, 1.1), blendHexColors("#ffffff", shell.color, 0.42), {
      air: 0.986,
      gravity: 0.105,
      life: randomBetween(82, 116),
      size: randomBetween(1, 1.6),
      trailLength: 7
    });
  }

  particles.push({
    color: "#ffffff",
    flash: true,
    life: 12,
    maxLife: 12,
    size: randomBetween(24, 34),
    x: shell.targetX,
    y: shell.targetY
  });
  trimFireworkLoad();
}

function burst(x = window.innerWidth / 2, y = window.innerHeight / 2, options = {}) {
  const shellCount = options.shells ?? 1;
  const spread = options.spread ?? 120;

  for (let index = 0; index < shellCount; index += 1) {
    window.setTimeout(() => {
      launchFireworkShell(x, y, { spread });
    }, index * randomBetween(90, 150));
  }
}

function getVisibleFireworkRect(element) {
  if (!element) {
    return {
      height: window.innerHeight,
      left: 0,
      top: 0,
      width: window.innerWidth
    };
  }

  const rect = element.getBoundingClientRect();
  const left = Math.max(0, rect.left);
  const top = Math.max(0, rect.top);
  const right = Math.min(window.innerWidth, rect.right);
  const bottom = Math.min(window.innerHeight, rect.bottom);

  if (right <= left || bottom <= top) {
    return {
      height: window.innerHeight,
      left: 0,
      top: 0,
      width: window.innerWidth
    };
  }

  return {
    height: bottom - top,
    left,
    top,
    width: right - left
  };
}

function showFireworkShow(rect, options = {}) {
  const shellCount = options.shells ?? 10;
  const duration = options.duration ?? 1300;
  const insetX = rect.width * 0.1;
  const insetY = rect.height * 0.1;
  const showWidth = rect.width * 0.8;
  const showHeight = rect.height * 0.8;
  const columns = Math.max(3, Math.ceil(Math.sqrt(shellCount * 1.25)));
  const rows = Math.ceil(shellCount / columns);

  for (let index = 0; index < shellCount; index += 1) {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const targetX = rect.left + insetX + ((column + randomBetween(0.18, 0.82)) / columns) * showWidth;
    const targetY = rect.top + insetY + ((row + randomBetween(0.18, 0.82)) / rows) * showHeight;
    const delay = (duration / Math.max(shellCount - 1, 1)) * index + randomBetween(0, 80);

    window.setTimeout(() => {
      launchFireworkShell(targetX, targetY);
    }, delay);
  }
}

function showScreenFireworks(options = {}) {
  showFireworkShow(getVisibleFireworkRect(null), options);
}

function showElementFireworks(element, options = {}) {
  showFireworkShow(getVisibleFireworkRect(element), options);
}

function drawFireworkShell(shell) {
  ctx.strokeStyle = shell.color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  for (let index = 1; index < shell.trail.length; index += 1) {
    const current = shell.trail[index - 1];
    const previous = shell.trail[index];
    ctx.globalAlpha = (1 - index / shell.trail.length) * 0.8;
    ctx.beginPath();
    ctx.moveTo(previous.x, previous.y);
    ctx.lineTo(current.x, current.y);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = "#fffdf4";
  ctx.shadowColor = shell.color;
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(shell.x, shell.y, 2.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawFireworkParticle(particle) {
  if (particle.flash) {
    const alpha = Math.max(particle.life / particle.maxLife, 0);
    const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.75})`);
    gradient.addColorStop(0.38, `rgba(255, 214, 102, ${alpha * 0.28})`);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  const lifeRatio = Math.max(particle.life / particle.maxLife, 0);
  const flicker = particle.shimmer ? 0.76 + Math.sin(particle.life * 0.7 + particle.shimmerPhase) * 0.18 : 1;
  ctx.strokeStyle = particle.color;
  ctx.lineWidth = Math.max(1, particle.size * 0.75);
  ctx.lineCap = "round";

  for (let index = 1; index < particle.trail.length; index += 1) {
    const current = particle.trail[index - 1];
    const previous = particle.trail[index];
    ctx.globalAlpha = lifeRatio * (1 - index / particle.trail.length) * 0.72;
    ctx.beginPath();
    ctx.moveTo(previous.x, previous.y);
    ctx.lineTo(current.x, current.y);
    ctx.stroke();
  }

  ctx.globalAlpha = Math.min(1, lifeRatio * 1.2) * flicker;
  ctx.fillStyle = particle.color;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, Math.max(0.7, particle.size * lifeRatio), 0, Math.PI * 2);
  ctx.fill();
}

function updateFireworkShell(shell, frameScale) {
  shell.age += frameScale * 16.67;
  const progress = Math.min(shell.age / shell.duration, 1);
  const easedProgress = easeOutCubic(progress);
  shell.x = shell.startX + (shell.targetX - shell.startX) * easedProgress + Math.sin(progress * Math.PI * shell.wobblePhase) * shell.wobble;
  shell.y = shell.startY + (shell.targetY - shell.startY) * easedProgress - Math.sin(progress * Math.PI) * shell.arc;
  shell.trail.unshift({ x: shell.x, y: shell.y });

  if (shell.trail.length > 10) {
    shell.trail.pop();
  }

  if (progress >= 1) {
    explodeFirework(shell);
    return false;
  }

  return true;
}

function updateFireworkParticle(particle, frameScale) {
  if (particle.flash) {
    particle.life -= frameScale;
    return particle.life > 0;
  }

  particle.trail.unshift({ x: particle.x, y: particle.y });

  if (particle.trail.length > particle.trailLength) {
    particle.trail.pop();
  }

  particle.x += particle.vx * frameScale;
  particle.y += particle.vy * frameScale;
  particle.vx *= Math.pow(particle.air, frameScale);
  particle.vy = particle.vy * Math.pow(particle.air, frameScale) + particle.gravity * frameScale;
  particle.life -= frameScale;

  if (particle.crackleAt && particle.maxLife - particle.life > particle.crackleAt) {
    particle.crackleAt = 0;

    for (let index = 0; index < 3; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = randomBetween(0.8, 2.3);
      createFireworkParticle(particle.x, particle.y, Math.cos(angle) * speed, Math.sin(angle) * speed, blendHexColors("#ffffff", particle.color, 0.35), {
        gravity: 0.055,
        life: randomBetween(24, 44),
        size: randomBetween(0.8, 1.5),
        trailLength: 5
      });
    }
  }

  return particle.life > 0;
}

function animateParticles(timestamp = performance.now()) {
  if (timestamp - lastParticleFrameAt < FIREWORK_FRAME_INTERVAL) {
    requestAnimationFrame(animateParticles);
    return;
  }

  const frameScale = Math.min(Math.max((timestamp - lastParticleFrameAt) / 16.67, 0.75), 2.4);
  lastParticleFrameAt = timestamp;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.globalCompositeOperation = "lighter";
  fireworkShells = fireworkShells.filter((shell) => {
    const isAlive = updateFireworkShell(shell, frameScale);
    drawFireworkShell(shell);
    return isAlive;
  });
  particles = particles.filter((particle) => {
    const isAlive = updateFireworkParticle(particle, frameScale);
    drawFireworkParticle(particle);
    return isAlive;
  });

  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  requestAnimationFrame(animateParticles);
}

function updateTimeline(index) {
  const story = stories[index];
  timelinePreviewImage.src = resolvePhotoUrl(story.image);
  timelinePreviewImage.alt = `${story.year} 回忆图片`;
  timelineYear.textContent = story.year;
  timelineStoryTitle.textContent = story.title;
  timelineStoryText.textContent = story.text;
}

function updateCuteMoment(index) {
  const moment = cuteMoments[index];
  cuteMomentImage.dataset.securePhoto = moment.image;
  cuteMomentImage.src = resolvePhotoUrl(moment.image);
  cuteMomentImage.alt = moment.alt;
  cuteMomentCode.textContent = moment.code;
  cuteMomentTitle.textContent = moment.title;
  cuteMomentText.textContent = moment.text;
  cutePlaceholder.hidden = true;
  cuteMomentImage.hidden = false;
  syncImageFrameWhenReady(cuteScreen, cuteMomentImage, "--cute-aspect");
  cuteCaption.hidden = false;
  cuteScreen.classList.remove("is-empty");
}

function addUserStar(x, y) {
  const star = document.createElement("span");
  star.className = "user-star";
  star.style.left = `${x}px`;
  star.style.top = `${y}px`;
  starSky.appendChild(star);
}

window.birthdayMuseum = {
  burst,
  closeModal,
  getPhotoUrl: resolvePhotoUrl,
  openPhotoModal,
  showToast
};

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  const username = String(data.get("username") || "").trim();
  const password = String(data.get("password") || "");

  if (!validateLoginInput(username, password)) {
    loginError.textContent = "账号或密码不正确。";
    return;
  }

  loginError.textContent = "";
  enterMuseum();
});
document.querySelectorAll("[data-close], [data-photo-close]").forEach((element) => {
  element.addEventListener("click", closeModal);
});

document.querySelectorAll("[data-photo]").forEach((photo) => {
  photo.addEventListener("click", () => {
    openPhotoModal(Number(photo.dataset.photo));
  });
});

document.querySelectorAll("[data-story]").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll("[data-story]").forEach((node) => {
      node.classList.remove("is-active");
      node.setAttribute("aria-pressed", "false");
    });
    item.classList.add("is-active");
    item.setAttribute("aria-pressed", "true");
    updateTimeline(Number(item.dataset.story));
    burst(window.innerWidth * 0.66, window.innerHeight * 0.46);
  });
});

document.querySelectorAll("[data-cute-moment]").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll("[data-cute-moment]").forEach((node) => {
      node.classList.remove("is-active");
      node.setAttribute("aria-pressed", "false");
    });
    item.classList.add("is-active");
    item.setAttribute("aria-pressed", "true");
    updateCuteMoment(Number(item.dataset.cuteMoment));
    showElementFireworks(cuteScreen, { duration: 950, shells: 7 });
  });
});

wishButton.addEventListener("click", drawWishEntry);

wishGalleryButton.addEventListener("click", toggleWishGallery);

wishGalleryCloseButtons.forEach((button) => {
  button.addEventListener("click", closeWishGallery);
});

document.querySelectorAll("[data-wish-shape]").forEach((button) => {
  button.addEventListener("click", () => {
    setWishGalleryShape(button.dataset.wishShape);
  });
});

wishImage.addEventListener("load", () => {
  applyImageFrameState(wishStage, wishImage, "--wish-aspect");
});

wishImage.addEventListener("error", () => {
  wishStage.classList.remove("has-image");
  wishStage.classList.remove("is-portrait-image", "is-wide-image", "is-long-image");
  wishStage.style.removeProperty("--wish-aspect");
  wishImage.hidden = true;
  wishPlaceholder.hidden = false;
  wishCard.classList.remove("is-compact");
  wishCard.textContent = "这张祝福截图暂时没有加载成功，请检查图册清单里的文件名。";
});

cuteMomentImage.addEventListener("load", () => {
  applyImageFrameState(cuteScreen, cuteMomentImage, "--cute-aspect");
});

document.querySelector("#surpriseButton").addEventListener("click", () => {
  showScreenFireworks({ duration: 1400, shells: 12 });
  showToast("开场灯光已点亮：今天所有好事都优先派送给她。");
});

starSky.addEventListener("click", (event) => {
  const rect = starSky.getBoundingClientRect();
  const target = event.target.closest(".star-dot");
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (target) {
    starMessage.textContent = target.dataset.wish;
  } else {
    addUserStar(x, y);
    starMessage.textContent = "一颗新的星星被放进去了。";
  }

  burst(event.clientX, event.clientY);
});

starForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = starInput.value.trim();
  if (!value) {
    starMessage.textContent = "先写一句愿望，再送进星空。";
    return;
  }

  starMessage.textContent = value;
  addUserStar(90 + Math.random() * (starSky.clientWidth - 180), 90 + Math.random() * (starSky.clientHeight - 180));
  starInput.value = "";
  showElementFireworks(starSky, { duration: 1300, shells: 10 });
});

document.querySelectorAll("[data-gift]").forEach((gift) => {
  gift.addEventListener("click", () => {
    const index = Number(gift.dataset.gift);
    openedGifts.add(index);
    gift.classList.add("is-opened");
    gift.querySelector(".gift-action").textContent = "已打开";
    giftResult.textContent = gifts[index];
    giftCount.textContent = String(openedGifts.size);
    burst(window.innerWidth * 0.5, window.innerHeight * 0.5);

    if (openedGifts.size === gifts.length) {
      window.setTimeout(() => {
        showToast("三份小礼物已收集，结尾烟花可以打开了。");
      }, 400);
    }
  });
});

document.querySelector("#letterButton").addEventListener("click", () => {
  if (letterHidden.hidden) {
    letterHidden.hidden = false;
    document.querySelector("#letterButton").textContent = "这封信已经展开";
    showToast("信件的下一段已经打开。");
    burst(window.innerWidth * 0.48, window.innerHeight * 0.55);
  }
});

certificateButton.addEventListener("click", () => {
  birthdayCertificate.classList.add("is-lit");
  showScreenFireworks({ duration: 1900, shells: 18 });
  showToast("生日证书已点亮。愿她这一岁，被生活认真偏爱。");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeWishGallery();
    closeModal();
  }
});

window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
setHeaderState();
animateParticles();
loadWishImageManifest();

function restoreSavedLogin() {
  if (sessionStorage.getItem(LOGIN_SESSION_KEY) !== "1") {
    clearSavedLogin();
    return;
  }

  loginError.textContent = "";
  enterMuseum({ animate: false });
}

restoreSavedLogin();



