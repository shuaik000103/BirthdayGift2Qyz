const LOGIN_SESSION_KEY = "birthdayMuseumLoggedIn";

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "avif"];
const resolvedPhotoSources = new Map();
const photoSourceLookups = new Map();
const LOGIN_USERNAME = "qyz0904";
const LOGIN_PASSWORD = "0904qyz";

let cuteMoments = [
  {
    code: "瞬间 1",
    title: "突然认真",
    photos: [
      "pics/cute/01-01",
      "pics/cute/01-02",
      "pics/cute/01-03",
      "pics/cute/01-04",
      "pics/cute/01-05",
      "pics/cute/01-06",
      "pics/cute/01-07",
      "pics/cute/01-08",
      "pics/cute/01-09",
      "pics/cute/01-10"
    ],
    alt: "可爱瞬间照片",
    text: "适合放一张很乖、很专注的照片，像是世界突然安静地偏向她。"
  },
  {
    code: "瞬间 2",
    title: "笑到失控",
    photos: ["pics/cute/02-01", "pics/cute/02-02"],
    alt: "开心大笑的可爱瞬间照片",
    text: "把那种藏不住的开心收进来，以后每次点开都能重新被逗笑。"
  },
  {
    code: "瞬间 3",
    title: "今日限定",
    photos: ["pics/cute/03-01", "pics/cute/03-02"],
    alt: "生日当天的可爱瞬间照片",
    text: "今天她拥有最高优先级，连普通画面都要被认真收藏。"
  }
];

let stories = [
  {
    year: "2021",
    title: "第一次被记住的瞬间",
    photos: ["pics/timeline/01"],
    text: "有些人出现得很自然，却会在后来变成生活里很重要的注脚。"
  },
  {
    year: "2022",
    title: "一起笑到停不下来",
    photos: ["pics/timeline/02"],
    text: "普通的一天，因为有人一起分享，就突然变成了很值得回看的片段。"
  },
  {
    year: "2023",
    title: "把普通日子过成纪念日",
    photos: ["pics/timeline/03"],
    text: "不是每个纪念日都需要隆重，有时候一杯热饮、一句玩笑，就足够被记很久。"
  },
  {
    year: "2026",
    title: "今天，把祝福郑重送达",
    photos: ["pics/timeline/04"],
    text: "新的一岁已经开始，愿她继续拥有明亮、具体、不会迟到的快乐。"
  }
];

const albumPhotos = [
  {
    image: "pics/album/01",
    alt: "生日人像占位图",
    caption: "今天是她的主场。"
  },
  {
    image: "pics/album/02",
    alt: "生日蛋糕占位图",
    caption: "愿望藏在烛光里。"
  },
  {
    image: "pics/album/03",
    alt: "生日派对占位图",
    caption: "每次热闹都值得留下。"
  },
  {
    image: "pics/album/04",
    alt: "朋友聚会占位图",
    caption: "下次见面继续补给快乐。"
  }
];

const gesturePhotos = [
  {
    image: "pics/gesture/01",
    alt: "手势舞台照片一",
    caption: "当前照片已被手势选中。"
  },
  {
    image: "pics/gesture/02",
    alt: "手势舞台照片二",
    caption: "照片球正在替她收藏发光瞬间。"
  },
  {
    image: "pics/gesture/03",
    alt: "手势舞台照片三",
    caption: "这一张已经被放到生日蛋糕旁边。"
  },
  {
    image: "pics/gesture/04",
    alt: "手势舞台照片四",
    caption: "左右滑动时，快乐也跟着转起来。"
  },
  {
    image: "pics/gesture/05",
    alt: "手势舞台照片五",
    caption: "每个认真发光的瞬间都值得被看见。"
  },
  {
    image: "pics/gesture/06",
    alt: "手势舞台照片六",
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
const TIMELINE_MANIFEST_URL = "pics/timeline/manifest.json";
const CUTE_MANIFEST_URL = "pics/cute/manifest.json";

const giftChallenges = [
  {
    answer: "0904",
    card: "CARD 01",
    prompt: "她的生日是几月几号？请输入 4 位数字。",
    punishment: "对着手机屏幕认真说一声：我是笨蛋。说完再继续答题。",
    rewardText: "凭这张截图，可以兑换一杯喜欢的奶茶，甜度和加料都由她决定。",
    rewardTitle: "一杯奶茶兑换券",
    title: "甜甜补给牌"
  },
  {
    answer: "曲艺珍",
    aliases: ["qyz"],
    card: "CARD 02",
    prompt: "今日主角的名字是什么？中文或首字母都可以。",
    punishment: "给自己比一个大大的爱心，然后说：我再想想。",
    rewardText: "凭这张截图，可以兑换一次不限时认真陪聊，吐槽、分享、发呆都算。",
    rewardTitle: "陪伴通行证",
    title: "陪伴通行牌"
  },
  {
    answer: "生日快乐",
    aliases: ["happy birthday"],
    card: "CARD 03",
    prompt: "今天最应该对她说的四个字是什么？",
    punishment: "对着屏幕夸她一句，夸完再回来继续答题。",
    rewardText: "凭这张截图，可以兑换一次快乐补给：想吃什么、想去哪，由她优先选择。",
    rewardTitle: "快乐补给券",
    title: "快乐召唤牌"
  },
  {
    answer: "喜欢",
    aliases: ["喜欢你", "love"],
    card: "CARD 04",
    prompt: "这份礼物最想表达的两个字是什么？",
    punishment: "对着手机屏幕说一声：我是笨蛋，但我还能答对。",
    rewardText: "凭这张截图，可以兑换一个小心愿。合理范围内，送礼人负责认真兑现。",
    rewardTitle: "心愿加成券",
    title: "心愿加成牌"
  }
];

const capsuleSurprises = [
  {
    title: "捕获异色粉耳星兔",
    text: "生日扭蛋开出粉耳星兔异色图鉴，今天的欧气先被它抢走了。",
    image: "pics/roco/shiny-01.jpg"
  },
  {
    title: "捕获异色小皮球",
    text: "蓝色闪耀的小皮球加入图鉴，愿这份稀有快乐也落在你手里。",
    image: "pics/roco/shiny-02.jpg"
  },
  {
    title: "捕获异色贝古斯",
    text: "机械感的异色贝古斯出现，今天的生日收藏册又多了一页。",
    image: "pics/roco/shiny-03.jpg"
  },
  {
    title: "捕获异色月牙雪熊",
    text: "红棕色的月牙雪熊闪耀登场，祝你今天所有愿望都能一击捕获。",
    image: "pics/roco/shiny-04.jpg"
  },
  {
    title: "捕获异色夜寐",
    text: "异色夜寐带着粉紫色光晕抵达，这只稀有精灵专门守护今晚的好梦。",
    image: "pics/roco/shiny-05.jpg"
  },
  {
    title: "捕获异色剃灯鱼",
    text: "金色异色剃灯鱼点亮扭蛋机，愿你这一岁也永远保持闪闪发光。",
    image: "pics/roco/shiny-06.jpg"
  },
  {
    title: "捕获异色精灵 · 曙光旅者",
    text: "这只异色精灵带着晨光抵达，稀有的好运也一起被收进生日图鉴。",
    image: "pics/roco/shiny-07.jpg"
  },
  {
    title: "捕获异色精灵 · 夜色信使",
    text: "夜色里闪出的特别配色，是今天扭蛋机送来的第八份小惊喜。",
    image: "pics/roco/shiny-08.jpg"
  },
  ...Array.from({ length: 32 }, (_, offset) => {
    const number = String(offset + 9).padStart(2, "0");

    return {
      title: `捕获异色图鉴卡 ${number}`,
      text: `第 ${number} 张异色图鉴卡加入收藏。今天的稀有好运，还在继续出现。`,
      image: `pics/roco/shiny-${number}.jpg`
    };
  })
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
const wishGalleryButtonLabel = document.querySelector("[data-wish-gallery-label]");
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
const timelineList = document.querySelector("#timelineList");
const timelinePreviewImage = document.querySelector("#timelinePreviewImage");
const timelineYear = document.querySelector("#timelineYear");
const timelineStoryTitle = document.querySelector("#timelineStoryTitle");
const timelineStoryText = document.querySelector("#timelineStoryText");
const timelinePhotoCount = document.querySelector("#timelinePhotoCount");
const timelinePreviousButton = document.querySelector("#timelinePreviousButton");
const timelineNextButton = document.querySelector("#timelineNextButton");
const cuteScreen = document.querySelector("#cuteScreen");
const cuteMomentList = document.querySelector("#cuteMomentList");
const cutePlaceholder = document.querySelector("#cutePlaceholder");
const cuteMomentImage = document.querySelector("#cuteMomentImage");
const cuteCaption = document.querySelector("#cuteCaption");
const cuteMomentCode = document.querySelector("#cuteMomentCode");
const cuteMomentTitle = document.querySelector("#cuteMomentTitle");
const cuteMomentText = document.querySelector("#cuteMomentText");
const cutePhotoCount = document.querySelector("#cutePhotoCount");
const cutePreviousButton = document.querySelector("#cutePreviousButton");
const cuteNextButton = document.querySelector("#cuteNextButton");
const giftCount = document.querySelector("#giftCount");
const giftResult = document.querySelector("#giftResult");
const giftSection = document.querySelector("#gifts");
const giftExperience = document.querySelector("#giftExperience");
const giftVaultTicket = document.querySelector("#giftVaultTicket");
const giftChallengeModal = document.querySelector("#giftChallengeModal");
const giftQuestionView = document.querySelector("#giftQuestionView");
const giftRewardView = document.querySelector("#giftRewardView");
const giftPunishmentView = document.querySelector("#giftPunishmentView");
const giftChallengeKicker = document.querySelector("#giftChallengeKicker");
const giftChallengeTitle = document.querySelector("#giftChallengeTitle");
const giftChallengePrompt = document.querySelector("#giftChallengePrompt");
const giftAnswerInput = document.querySelector("#giftAnswerInput");
const giftAnswerSubmit = document.querySelector("#giftAnswerSubmit");
const giftChallengeFeedback = document.querySelector("#giftChallengeFeedback");
const giftRewardKicker = document.querySelector("#giftRewardKicker");
const giftRewardTitle = document.querySelector("#giftRewardTitle");
const giftRewardText = document.querySelector("#giftRewardText");
const giftPunishmentText = document.querySelector("#giftPunishmentText");
const giftPunishmentDone = document.querySelector("#giftPunishmentDone");
const giftChallengeCloseButtons = document.querySelectorAll("[data-gift-challenge-close]");
const fortuneBoard = document.querySelector("#fortuneBoard");
const fortuneResult = document.querySelector("#fortuneResult");
const capsuleSpinButton = document.querySelector("#capsuleSpinButton");
const certificateButton = document.querySelector("#certificateButton");
const birthdayCertificate = document.querySelector("#birthdayCertificate");

let toastTimer;
let particles = [];
let fireworkShells = [];
let lastParticleFrameAt = performance.now();
const openedGifts = new Set();
const openedCapsules = new Set();
let activeTimelineIndex = 0;
let activeTimelinePhotoIndex = 0;
let activeCuteMomentIndex = 0;
let activeCutePhotoIndex = 0;
let activeGiftIndex = 0;
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
  return (
    String(username || "").trim().toLowerCase() === LOGIN_USERNAME.toLowerCase() &&
    String(password || "") === LOGIN_PASSWORD
  );
}

function hasSupportedImageExtension(source) {
  return new RegExp(`\\.(${IMAGE_EXTENSIONS.join("|")})(?:[?#].*)?$`, "i").test(String(source));
}

function getPhotoBase(source) {
  return String(source || "").replace(new RegExp(`\\.(${IMAGE_EXTENSIONS.join("|")})(?:[?#].*)?$`, "i"), "");
}

function resolvePhotoUrl(source) {
  return resolvedPhotoSources.get(getPhotoBase(source)) || source;
}

function probePhotoSource(source) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(source);
    image.onerror = () => resolve(null);
    image.src = source;
  });
}

function findPhotoSource(source) {
  if (!source || /^(https?:|data:|blob:)/i.test(source)) {
    return Promise.resolve(source);
  }

  const basePath = getPhotoBase(source);
  if (photoSourceLookups.has(basePath)) {
    return photoSourceLookups.get(basePath);
  }

  const lookup = (async () => {
    for (const extension of IMAGE_EXTENSIONS) {
      const candidate = `${basePath}.${extension}`;
      const loadedSource = await probePhotoSource(candidate);
      if (loadedSource) {
        resolvedPhotoSources.set(basePath, loadedSource);
        return loadedSource;
      }
    }

    return hasSupportedImageExtension(source) ? source : null;
  })();

  photoSourceLookups.set(basePath, lookup);
  return lookup;
}

function getGroupPhotos(group) {
  if (Array.isArray(group?.photos) && group.photos.length) {
    return group.photos;
  }

  return group?.image ? [group.image] : [];
}

function normalizeCollectionPhotoPath(source, directory) {
  const photoPath = String(source || "").trim();

  if (!photoPath || /^(https?:|data:|blob:|pics\/)/i.test(photoPath)) {
    return photoPath;
  }

  return `${directory}${photoPath.replace(/^\/+/, "")}`;
}

function normalizePhotoGroups(groups, directory, type) {
  if (!Array.isArray(groups)) {
    return [];
  }

  return groups
    .map((group, index) => {
      const photos = (Array.isArray(group?.photos) ? group.photos : [group?.image])
        .map((photo) => normalizeCollectionPhotoPath(photo, directory))
        .filter(Boolean);

      if (!photos.length) {
        return null;
      }

      if (type === "timeline") {
        const year = String(group.year || group.label || `回忆 ${index + 1}`);
        return {
          alt: group.alt || `${year} 回忆照片`,
          photos,
          text: group.text || "把这一段回忆收进胶片里，想起时随时翻出来看看。",
          title: group.title || `回忆 ${index + 1}`,
          year
        };
      }

      const code = String(group.code || `瞬间 ${index + 1}`);
      return {
        alt: group.alt || `${code} 可爱瞬间照片`,
        code,
        photos,
        text: group.text || "这一帧很值得慢慢看。",
        title: group.title || code
      };
    })
    .filter(Boolean);
}

function createTimelineButton(story, index) {
  const button = document.createElement("button");
  const year = document.createElement("span");
  const title = document.createElement("strong");

  button.className = "timeline-item";
  button.type = "button";
  button.dataset.story = String(index);
  button.setAttribute("aria-pressed", String(index === activeTimelineIndex));
  year.textContent = story.year;
  title.textContent = story.title;
  button.append(year, title);
  return button;
}

function createCuteMomentButton(moment, index) {
  const button = document.createElement("button");
  const filmIcon = document.createElement("span");
  const filmHole = document.createElement("i");
  const title = document.createElement("strong");

  button.className = "cute-moment-button";
  button.type = "button";
  button.dataset.cuteMoment = String(index);
  button.setAttribute("aria-pressed", String(index === activeCuteMomentIndex));
  filmIcon.className = "film-icon";
  filmIcon.setAttribute("aria-hidden", "true");
  filmIcon.appendChild(filmHole);
  title.textContent = moment.code;
  button.append(filmIcon, title);
  return button;
}

function renderPhotoGroupLists() {
  timelineList.replaceChildren(...stories.map(createTimelineButton));
  cuteMomentList.replaceChildren(...cuteMoments.map(createCuteMomentButton));
}

async function fetchPhotoManifest(url) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

async function loadPhotoGroupManifests() {
  const [timelineManifest, cuteManifest] = await Promise.all([
    fetchPhotoManifest(TIMELINE_MANIFEST_URL),
    fetchPhotoManifest(CUTE_MANIFEST_URL)
  ]);
  const timelineGroups = normalizePhotoGroups(timelineManifest?.groups, "pics/timeline/", "timeline");
  const cuteGroups = normalizePhotoGroups(cuteManifest?.groups, "pics/cute/", "cute");

  if (timelineGroups.length) {
    stories = timelineGroups;
    activeTimelineIndex = 0;
    activeTimelinePhotoIndex = 0;
  }

  if (cuteGroups.length) {
    cuteMoments = cuteGroups;
    activeCuteMomentIndex = 0;
    activeCutePhotoIndex = 0;
  }

  renderPhotoGroupLists();
  await loadAdaptivePhotoSources();
}

async function loadAdaptivePhotoSources() {
  const pageImages = [...document.querySelectorAll("[data-photo-base]")];
  const imageBases = [
    ...pageImages.map((image) => image.dataset.photoBase),
    ...stories.flatMap(getGroupPhotos),
    ...cuteMoments.flatMap(getGroupPhotos),
    ...albumPhotos.map((photo) => photo.image),
    ...gesturePhotos.map((photo) => photo.image)
  ];

  await Promise.all(imageBases.map((source) => findPhotoSource(source)));

  pageImages.forEach((image) => {
    const source = resolvePhotoUrl(image.dataset.photoBase);
    if (source !== image.dataset.photoBase) {
      image.src = source;
    }
  });

  updateTimeline(activeTimelineIndex);
  updateCuteMoment(activeCuteMomentIndex);
}

function clearSavedLogin() {
  sessionStorage.removeItem(LOGIN_SESSION_KEY);
}

function closeModal() {
  photoModal.classList.remove("is-open");
  photoModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function getPhotoCollection(collectionName) {
  if (collectionName === "gesture") {
    return gesturePhotos;
  }

  return albumPhotos;
}

function openPhotoModalSource(source, alt = "", caption = "") {
  photoModalImage.src = resolvePhotoUrl(source);
  photoModalImage.alt = alt;
  photoCaption.textContent = caption;
  photoModal.classList.add("is-open");
  photoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function openPhotoModal(index, collectionName = "album") {
  const photo = getPhotoCollection(collectionName)[index];
  if (!photo) {
    return;
  }

  openPhotoModalSource(photo.image, photo.alt, photo.caption);
}

function showToast(message) {
  if (!toast) {
    return;
  }

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
  if (wishLoadState) {
    wishLoadState.textContent = message;
  }
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

  if (aspectProperty === "--cute-aspect") {
    syncCuteFrameSize(container, aspect);
  }
}

function syncImageFrameWhenReady(container, imageElement, aspectProperty) {
  if (imageElement.complete && imageElement.naturalWidth) {
    applyImageFrameState(container, imageElement, aspectProperty);
  }
}

function syncCuteFrameSize(container, aspect) {
  const styles = window.getComputedStyle(container);
  const frameX = Number.parseFloat(styles.getPropertyValue("--cute-frame-x")) || 0;
  const frameTop = Number.parseFloat(styles.getPropertyValue("--cute-frame-top")) || 0;
  const frameBottom = Number.parseFloat(styles.getPropertyValue("--cute-frame-bottom")) || 0;
  const maxWidth = Math.max(160, container.clientWidth - frameX * 2);
  const maxHeight = Math.max(160, container.clientHeight - frameTop - frameBottom);
  const frameWidth = Math.min(maxWidth, maxHeight * aspect);
  const frameHeight = Math.min(maxHeight, frameWidth / aspect);

  container.style.setProperty("--cute-frame-width", `${Math.round(frameWidth)}px`);
  container.style.setProperty("--cute-frame-height", `${Math.round(frameHeight)}px`);
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

function renderWishGallery() {
  wishGalleryBoard.className = `wish-gallery-board is-${currentWishShape}`;
  wishGalleryBoard.innerHTML = "";
  if (wishGalleryCount) {
    wishGalleryCount.textContent = "";
  }

  if (!wishImageEntries.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "wish-gallery-empty";
    emptyState.textContent = "暂无祝福截图";
    wishGalleryBoard.appendChild(emptyState);
    return;
  }

  wishImageEntries.forEach((entry, index) => {
    const galleryItem = document.createElement("button");
    galleryItem.className = "wish-gallery-item";
    galleryItem.type = "button";
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

function openWishGallery() {
  wishGalleryPanel.hidden = false;
  wishGalleryPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-wish-showcase-open");
  if (wishGalleryButtonLabel) {
    wishGalleryButtonLabel.textContent = "收起祝福墙";
  }
  renderWishGallery();
  requestAnimationFrame(() => {
    wishGalleryPanel.classList.add("is-open");
  });
}

function closeWishGallery() {
  wishGalleryPanel.classList.remove("is-open");
  wishGalleryPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-wish-showcase-open");
  if (wishGalleryButtonLabel) {
    wishGalleryButtonLabel.textContent = "展开祝福墙";
  }

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

    updateWishLoadState("");
  } catch (error) {
    wishImageEntries = [];
    updateWishLoadState("");
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

function updateReelButtons(previousButton, nextButton, photoCount, groupLabel, photoIndex, photoTotal) {
  const isSinglePhoto = photoTotal < 2;
  previousButton.disabled = isSinglePhoto;
  nextButton.disabled = isSinglePhoto;
  previousButton.setAttribute("aria-label", `查看${groupLabel}的上一张照片`);
  nextButton.setAttribute("aria-label", `查看${groupLabel}的下一张照片`);
  photoCount.textContent = `${String(photoIndex + 1).padStart(2, "0")} / ${String(photoTotal).padStart(2, "0")}`;
}

function playReelTransition(container, direction) {
  if (!direction) {
    return;
  }

  container.dataset.reelDirection = direction > 0 ? "next" : "previous";
  container.classList.remove("is-reeling");
  void container.offsetWidth;
  container.classList.add("is-reeling");
  window.setTimeout(() => container.classList.remove("is-reeling"), 560);
}

function updateTimeline(index, photoIndex = 0, direction = 0) {
  const story = stories[index];
  if (!story) {
    return;
  }

  const photos = getGroupPhotos(story);
  if (!photos.length) {
    return;
  }

  activeTimelineIndex = index;
  activeTimelinePhotoIndex = ((photoIndex % photos.length) + photos.length) % photos.length;
  const source = photos[activeTimelinePhotoIndex];

  timelinePreviewImage.dataset.photoBase = source;
  timelinePreviewImage.src = resolvePhotoUrl(source);
  timelinePreviewImage.alt = `${story.alt} · 第 ${activeTimelinePhotoIndex + 1} 张`;
  timelineYear.textContent = story.year;
  timelineStoryTitle.textContent = story.title;
  timelineStoryText.textContent = story.text;
  updateReelButtons(
    timelinePreviousButton,
    timelineNextButton,
    timelinePhotoCount,
    story.year,
    activeTimelinePhotoIndex,
    photos.length
  );

  timelineList.querySelectorAll("[data-story]").forEach((item) => {
    const isActive = Number(item.dataset.story) === activeTimelineIndex;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  playReelTransition(document.querySelector("#timelineReel"), direction);
}

function updateCuteMoment(index, photoIndex = 0, direction = 0) {
  const moment = cuteMoments[index];
  if (!moment) {
    return;
  }

  const photos = getGroupPhotos(moment);
  if (!photos.length) {
    return;
  }

  activeCuteMomentIndex = index;
  activeCutePhotoIndex = ((photoIndex % photos.length) + photos.length) % photos.length;
  const source = photos[activeCutePhotoIndex];

  cuteMomentImage.dataset.securePhoto = source;
  cuteMomentImage.dataset.photoBase = source;
  cuteMomentImage.src = resolvePhotoUrl(source);
  cuteMomentImage.alt = `${moment.alt} · 第 ${activeCutePhotoIndex + 1} 张`;
  cuteMomentCode.textContent = moment.code;
  cuteMomentTitle.textContent = moment.title;
  cuteMomentText.textContent = moment.text;
  updateReelButtons(
    cutePreviousButton,
    cuteNextButton,
    cutePhotoCount,
    moment.code,
    activeCutePhotoIndex,
    photos.length
  );

  cuteMomentList.querySelectorAll("[data-cute-moment]").forEach((item) => {
    const isActive = Number(item.dataset.cuteMoment) === activeCuteMomentIndex;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  cutePlaceholder.hidden = true;
  cuteMomentImage.hidden = false;
  syncImageFrameWhenReady(cuteScreen, cuteMomentImage, "--cute-aspect");
  cuteCaption.hidden = false;
  cuteScreen.classList.remove("is-empty");
  playReelTransition(document.querySelector("#cuteReel"), direction);
  playCuteRevealEffect();
}

function moveTimelinePhoto(direction) {
  if (getGroupPhotos(stories[activeTimelineIndex]).length < 2) {
    return;
  }

  updateTimeline(activeTimelineIndex, activeTimelinePhotoIndex + direction, direction);
}

function moveCutePhoto(direction) {
  if (getGroupPhotos(cuteMoments[activeCuteMomentIndex]).length < 2) {
    return;
  }

  updateCuteMoment(activeCuteMomentIndex, activeCutePhotoIndex + direction, direction);
}

function enablePhotoSwipe(element, onSwipe) {
  let pointerStartX = null;

  element.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) {
      return;
    }

    pointerStartX = event.clientX;
  });

  element.addEventListener("pointerup", (event) => {
    if (pointerStartX === null) {
      return;
    }

    const distance = event.clientX - pointerStartX;
    pointerStartX = null;

    if (Math.abs(distance) >= 42) {
      onSwipe(distance < 0 ? 1 : -1);
    }
  });

  element.addEventListener("pointercancel", () => {
    pointerStartX = null;
  });
}

function playCuteRevealEffect() {
  cuteScreen.classList.remove("is-revealing");
  void cuteScreen.offsetWidth;
  cuteScreen.classList.add("is-revealing");
  window.setTimeout(() => cuteScreen.classList.remove("is-revealing"), 760);
}

function releaseGiftConfetti(gift) {
  const launchPad = giftExperience || gift;
  const streamerColors = ["#fff176", "#ff4f8b", "#8b7cf6", "#20c7bf", "#ffffff", "#ff9f1c", "#f72585"];
  launchPad.classList.remove("is-celebrating");
  void launchPad.offsetWidth;
  launchPad.classList.add("is-celebrating");

  for (let index = 0; index < 64; index += 1) {
    const streamer = document.createElement("span");
    streamer.className = index % 5 === 0 ? "gift-streamer is-star" : "gift-streamer";
    streamer.style.setProperty("--streamer-x", `${randomBetween(-360, 360)}px`);
    streamer.style.setProperty("--streamer-y", `${randomBetween(-320, -92)}px`);
    streamer.style.setProperty("--streamer-rotate", `${randomBetween(-420, 420)}deg`);
    streamer.style.setProperty("--streamer-delay", `${randomBetween(0, 190)}ms`);
    streamer.style.setProperty("--streamer-color", pickRandom(streamerColors));
    launchPad.appendChild(streamer);
    window.setTimeout(() => streamer.remove(), 1750);
  }

  window.setTimeout(() => launchPad.classList.remove("is-celebrating"), 1320);
}

function celebrateGift(gift) {
  const giftName = gift.querySelector("strong")?.textContent || "生日礼物";
  if (giftVaultTicket) {
    giftVaultTicket.textContent = giftName;
  }

  giftExperience?.classList.add("has-opened");
  releaseGiftConfetti(gift);

  giftResult.classList.remove("is-celebrating");
  void giftResult.offsetWidth;
  giftResult.classList.add("is-celebrating");
  window.setTimeout(() => giftResult.classList.remove("is-celebrating"), 900);
}

function getGiftChallenge(index) {
  return giftChallenges[index] || giftChallenges[0];
}

function setGiftModalView(viewName) {
  giftQuestionView.hidden = viewName !== "question";
  giftRewardView.hidden = viewName !== "reward";
  giftPunishmentView.hidden = viewName !== "punishment";
}

function openGiftChallenge(index) {
  const challenge = getGiftChallenge(index);
  activeGiftIndex = index;
  giftChallengeModal.hidden = false;
  giftChallengeModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  giftChallengeKicker.textContent = challenge.card;
  giftChallengeTitle.textContent = challenge.title;
  giftChallengePrompt.textContent = challenge.prompt;
  giftChallengeFeedback.textContent = "";
  giftAnswerInput.value = "";
  setGiftModalView("question");

  requestAnimationFrame(() => {
    giftChallengeModal.classList.add("is-open");
    giftAnswerInput.focus();
  });
}

function closeGiftChallenge() {
  giftChallengeModal.classList.remove("is-open");
  giftChallengeModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  window.setTimeout(() => {
    if (!giftChallengeModal.classList.contains("is-open")) {
      giftChallengeModal.hidden = true;
    }
  }, 180);
}

function normalizeGiftAnswer(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, "");
}

function isGiftAnswerCorrect(challenge, value) {
  const answer = normalizeGiftAnswer(value);
  const acceptedAnswers = [challenge.answer, ...(challenge.aliases || [])].map(normalizeGiftAnswer);
  return acceptedAnswers.includes(answer);
}

function showGiftReward() {
  const challenge = getGiftChallenge(activeGiftIndex);
  const gift = document.querySelector(`[data-gift="${activeGiftIndex}"]`);
  openedGifts.add(activeGiftIndex);
  gift?.classList.add("is-opened");
  gift?.querySelector(".gift-action") && (gift.querySelector(".gift-action").textContent = "已解锁");
  giftRewardKicker.textContent = challenge.card;
  giftRewardTitle.textContent = challenge.rewardTitle;
  giftRewardText.textContent = challenge.rewardText;
  giftResult.textContent = `${challenge.rewardTitle} 已解锁。`;

  if (giftCount) {
    giftCount.textContent = String(openedGifts.size);
  }

  celebrateGift(gift || giftSection);
  setGiftModalView("reward");
  showElementFireworks(giftChallengeModal, { duration: 900, shells: 6 });

  if (openedGifts.size === giftChallenges.length) {
    window.setTimeout(() => {
      releaseGiftConfetti(giftSection);
      showToast("四张礼物牌都解锁了，奖励可以慢慢兑现。");
    }, 400);
  }
}

function showGiftPunishment() {
  const challenge = getGiftChallenge(activeGiftIndex);
  giftPunishmentText.textContent = challenge.punishment;
  setGiftModalView("punishment");
}

function submitGiftAnswer() {
  const challenge = getGiftChallenge(activeGiftIndex);

  if (isGiftAnswerCorrect(challenge, giftAnswerInput.value)) {
    showGiftReward();
    return;
  }

  giftChallengeFeedback.textContent = "答案不对，先完成小处罚再继续。";
  showGiftPunishment();
}

function returnToGiftQuestion() {
  giftChallengeFeedback.textContent = "";
  giftAnswerInput.value = "";
  setGiftModalView("question");
  window.setTimeout(() => giftAnswerInput.focus(), 0);
}

function releaseCapsuleSparks() {
  const sparkSymbols = ["✦", "✧", "♡", "·"];

  for (let index = 0; index < 26; index += 1) {
    const spark = document.createElement("span");
    spark.className = "capsule-spark";
    spark.textContent = pickRandom(sparkSymbols);
    spark.style.setProperty("--spark-x", `${randomBetween(-220, 220)}px`);
    spark.style.setProperty("--spark-y", `${randomBetween(-230, -42)}px`);
    spark.style.setProperty("--spark-rotate", `${randomBetween(-180, 180)}deg`);
    spark.style.setProperty("--spark-delay", `${randomBetween(0, 120)}ms`);
    fortuneBoard.appendChild(spark);
    window.setTimeout(() => spark.remove(), 1200);
  }
}

function setCapsuleResult(surprise) {
  const rewardImage = new Image();
  const copy = document.createElement("div");
  const title = document.createElement("strong");
  const text = document.createElement("span");

  rewardImage.className = "capsule-reward-image";
  rewardImage.src = surprise.image;
  rewardImage.alt = surprise.title;
  rewardImage.tabIndex = 0;
  rewardImage.setAttribute("role", "button");
  rewardImage.setAttribute("aria-label", `双击放大查看：${surprise.title}`);
  rewardImage.addEventListener("dblclick", () => {
    openPhotoModalSource(surprise.image, surprise.title, surprise.title);
  });
  rewardImage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPhotoModalSource(surprise.image, surprise.title, surprise.title);
    }
  });
  title.textContent = surprise.title;
  text.textContent = surprise.text;
  copy.append(title, text);
  fortuneResult.classList.add("has-creature");
  fortuneResult.replaceChildren(rewardImage, copy);
}

function spinCapsuleMachine() {
  if (!capsuleSpinButton || capsuleSpinButton.disabled) {
    return;
  }

  if (openedCapsules.size === capsuleSurprises.length) {
    openedCapsules.clear();
    fortuneBoard.classList.remove("is-complete");
    fortuneBoard.querySelectorAll(".capsule.is-dispensed").forEach((capsule) => capsule.classList.remove("is-dispensed"));
  }

  const availableIndexes = capsuleSurprises
    .map((_, index) => index)
    .filter((index) => !openedCapsules.has(index));
  const surpriseIndex = pickRandom(availableIndexes);
  const surprise = capsuleSurprises[surpriseIndex];
  const capsules = [...fortuneBoard.querySelectorAll(".capsule")];
  const selectedCapsule = capsules[surpriseIndex % capsules.length];

  capsuleSpinButton.disabled = true;
  fortuneBoard.classList.remove("is-spinning", "is-dispensing");
  void fortuneBoard.offsetWidth;
  fortuneBoard.classList.add("is-spinning");

  window.setTimeout(() => {
    openedCapsules.add(surpriseIndex);
    selectedCapsule?.classList.add("is-dispensed");
    fortuneBoard.classList.remove("is-spinning");
    fortuneBoard.classList.add("is-dispensing");
    setCapsuleResult(surprise);
    releaseCapsuleSparks();
    showElementFireworks(fortuneBoard, { duration: 860, shells: 6 });

    if (openedCapsules.size === capsuleSurprises.length) {
      fortuneBoard.classList.add("is-complete");
    }
  }, 700);

  window.setTimeout(() => {
    fortuneBoard.classList.remove("is-dispensing");
    capsuleSpinButton.disabled = false;
    capsuleSpinButton.querySelector("span:last-child").textContent =
      openedCapsules.size === capsuleSurprises.length ? "重新装入心愿" : "再转一次";
  }, 1320);
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

timelineList.addEventListener("click", (event) => {
  const item = event.target.closest("[data-story]");
  if (!item) {
    return;
  }

  updateTimeline(Number(item.dataset.story));
});

cuteMomentList.addEventListener("click", (event) => {
  const item = event.target.closest("[data-cute-moment]");
  if (!item) {
    return;
  }

  updateCuteMoment(Number(item.dataset.cuteMoment));
});

timelinePreviousButton.addEventListener("click", () => moveTimelinePhoto(-1));
timelineNextButton.addEventListener("click", () => moveTimelinePhoto(1));
cutePreviousButton.addEventListener("click", () => moveCutePhoto(-1));
cuteNextButton.addEventListener("click", () => moveCutePhoto(1));
enablePhotoSwipe(document.querySelector("#timelineReel"), moveTimelinePhoto);
enablePhotoSwipe(document.querySelector("#cuteReel"), moveCutePhoto);

wishButton.addEventListener("click", drawWishEntry);

wishGalleryButton.addEventListener("click", toggleWishGallery);

wishGalleryCloseButtons.forEach((button) => {
  button.addEventListener("click", closeWishGallery);
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
  wishCard.textContent = "祝福截图未加载成功。";
});

cuteMomentImage.addEventListener("load", () => {
  applyImageFrameState(cuteScreen, cuteMomentImage, "--cute-aspect");
});

document.querySelector("#surpriseButton").addEventListener("click", () => {
  showScreenFireworks({ duration: 1400, shells: 12 });
  showToast("开场灯光已点亮：今天所有好事都优先派送给她。");
});

document.querySelectorAll("[data-gift]").forEach((gift) => {
  gift.addEventListener("click", () => {
    const index = Number(gift.dataset.gift);
    openGiftChallenge(index);
  });
});

giftAnswerSubmit?.addEventListener("click", submitGiftAnswer);
giftAnswerInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    submitGiftAnswer();
  }
});
giftPunishmentDone?.addEventListener("click", returnToGiftQuestion);
giftChallengeCloseButtons.forEach((button) => {
  button.addEventListener("click", closeGiftChallenge);
});

capsuleSpinButton?.addEventListener("click", spinCapsuleMachine);

certificateButton.addEventListener("click", () => {
  birthdayCertificate.classList.add("is-lit");
  showScreenFireworks({ duration: 1900, shells: 18 });
  showToast("生日证书已点亮，信封里的话也一起封存了。");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeWishGallery();
    closeGiftChallenge();
    closeModal();
  }
});

function handleWindowResize() {
  resizeCanvas();
  syncImageFrameWhenReady(cuteScreen, cuteMomentImage, "--cute-aspect");
  if (!wishImage.hidden) {
    syncImageFrameWhenReady(wishStage, wishImage, "--wish-aspect");
  }
}

window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", handleWindowResize);

handleWindowResize();
setHeaderState();
animateParticles();
loadWishImageManifest();
renderPhotoGroupLists();
loadPhotoGroupManifests();

function restoreSavedLogin() {
  if (sessionStorage.getItem(LOGIN_SESSION_KEY) !== "1") {
    clearSavedLogin();
    return;
  }

  loginError.textContent = "";
  enterMuseum({ animate: false });
}

restoreSavedLogin();



