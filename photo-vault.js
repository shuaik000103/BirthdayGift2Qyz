const PHOTO_VAULT_MANIFEST_URL = "encrypted/photos.manifest.json";
const PHOTO_PLACEHOLDER_SRC = "assets/photo-placeholder.svg";
const PHOTO_VAULT_CHECK_TEXT = "birthday-photo-vault";

const photoVaultState = {
  manifest: null,
  unlocked: false,
  urlsBySource: new Map()
};

function normalizePhotoPath(path) {
  return String(path || "").replace(/\\/g, "/").replace(/^\.\//, "");
}

function base64ToBytes(base64) {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`photo-vault-fetch-failed:${url}`);
  }

  return response.json();
}

async function loadPhotoManifest() {
  if (photoVaultState.manifest) {
    return photoVaultState.manifest;
  }

  photoVaultState.manifest = await fetchJson(PHOTO_VAULT_MANIFEST_URL);
  return photoVaultState.manifest;
}

async function derivePhotoVaultKey(password, manifest) {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: base64ToBytes(manifest.salt),
      iterations: manifest.iterations
    },
    passwordKey,
    {
      name: "AES-GCM",
      length: 256
    },
    false,
    ["decrypt"]
  );
}

async function decryptVaultPayload(key, payload) {
  return crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: base64ToBytes(payload.iv)
    },
    key,
    base64ToBytes(payload.data)
  );
}

async function verifyPhotoPassword(key, manifest) {
  const decrypted = await decryptVaultPayload(key, manifest.check);
  const text = new TextDecoder().decode(decrypted);

  if (text !== PHOTO_VAULT_CHECK_TEXT) {
    throw new Error("photo-vault-invalid-password");
  }
}

function revokePhotoObjectUrls() {
  photoVaultState.urlsBySource.forEach((url) => URL.revokeObjectURL(url));
  photoVaultState.urlsBySource.clear();
}

async function decryptPhotoFile(key, file) {
  const encryptedPayload = await fetchJson(file.encrypted);
  const decrypted = await decryptVaultPayload(key, encryptedPayload);
  const blob = new Blob([decrypted], {
    type: file.type || "application/octet-stream"
  });

  return URL.createObjectURL(blob);
}

function applyUnlockedPhotos() {
  document.querySelectorAll("[data-secure-photo]").forEach((image) => {
    const source = normalizePhotoPath(image.dataset.securePhoto);
    const unlockedUrl = photoVaultState.urlsBySource.get(source);

    if (unlockedUrl) {
      image.src = unlockedUrl;
      image.classList.add("is-photo-unlocked");
    }
  });

  document.querySelectorAll("[data-secure-bg]").forEach((element) => {
    const source = normalizePhotoPath(element.dataset.secureBg);
    const unlockedUrl = photoVaultState.urlsBySource.get(source);

    if (unlockedUrl) {
      element.style.setProperty("--card-image", `url("${unlockedUrl}")`);
      element.classList.add("is-photo-unlocked");
    }
  });

  window.dispatchEvent(
    new CustomEvent("birthday-photos-unlocked", {
      detail: {
        getPhotoUrl: getUnlockedPhotoUrl
      }
    })
  );
}

function getUnlockedPhotoUrl(source) {
  return photoVaultState.urlsBySource.get(normalizePhotoPath(source)) || PHOTO_PLACEHOLDER_SRC;
}

async function unlockBirthdayPhotos(password) {
  if (!window.crypto?.subtle) {
    throw new Error("photo-vault-crypto-unavailable");
  }

  const normalizedPassword = String(password || "");
  if (!normalizedPassword) {
    throw new Error("photo-vault-empty-password");
  }

  const manifest = await loadPhotoManifest();
  const key = await derivePhotoVaultKey(normalizedPassword, manifest);

  try {
    await verifyPhotoPassword(key, manifest);
  } catch (error) {
    throw new Error("photo-vault-invalid-password", { cause: error });
  }

  revokePhotoObjectUrls();

  for (const file of manifest.files) {
    const source = normalizePhotoPath(file.source);
    const objectUrl = await decryptPhotoFile(key, file);
    photoVaultState.urlsBySource.set(source, objectUrl);
  }

  photoVaultState.unlocked = true;
  applyUnlockedPhotos();

  return {
    count: photoVaultState.urlsBySource.size
  };
}

window.birthdayPhotoVault = {
  getPhotoUrl: getUnlockedPhotoUrl,
  isUnlocked: () => photoVaultState.unlocked,
  placeholder: PHOTO_PLACEHOLDER_SRC,
  unlock: unlockBirthdayPhotos
};
