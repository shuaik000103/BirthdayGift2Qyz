import { promises as fs } from "node:fs";
import path from "node:path";
import { webcrypto } from "node:crypto";

const { subtle } = webcrypto;
const CHECK_TEXT = "birthday-photo-vault";
const DEFAULT_ITERATIONS = 150000;
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function readOption(name, fallback = "") {
  const optionIndex = process.argv.indexOf(`--${name}`);

  if (optionIndex >= 0 && process.argv[optionIndex + 1]) {
    return process.argv[optionIndex + 1];
  }

  return fallback;
}

function toBase64(buffer) {
  return Buffer.from(buffer).toString("base64");
}

function toBytes(text) {
  return new TextEncoder().encode(text);
}

function normalizePath(filePath) {
  return filePath.split(path.sep).join("/");
}

function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".jpg" || extension === ".jpeg") {
    return "image/jpeg";
  }

  if (extension === ".png") {
    return "image/png";
  }

  if (extension === ".webp") {
    return "image/webp";
  }

  if (extension === ".gif") {
    return "image/gif";
  }

  return "application/octet-stream";
}

async function deriveKey(password, salt, iterations) {
  const passwordKey = await subtle.importKey("raw", toBytes(password), "PBKDF2", false, ["deriveKey"]);

  return subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations
    },
    passwordKey,
    {
      name: "AES-GCM",
      length: 256
    },
    false,
    ["encrypt"]
  );
}

async function encryptPayload(key, bytes) {
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const encrypted = await subtle.encrypt(
    {
      name: "AES-GCM",
      iv
    },
    key,
    bytes
  );

  return {
    iv: toBase64(iv),
    data: toBase64(encrypted)
  };
}

async function listImageFiles(sourceDirectory) {
  const entries = await fs.readdir(sourceDirectory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(sourceDirectory, entry.name);

    if (entry.isDirectory()) {
      const nestedFiles = await listImageFiles(entryPath);
      nestedFiles.forEach((fileName) => files.push(path.join(entry.name, fileName)));
      continue;
    }

    if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(entry.name);
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

async function main() {
  const password = readOption("password", process.env.BIRTHDAY_PHOTO_PASSWORD || "");
  const username = readOption("username", process.env.BIRTHDAY_PHOTO_USERNAME || "");
  const sourceDirectory = readOption("source", "pics");
  const outputDirectory = readOption("out", "encrypted");
  const iterations = Number(readOption("iterations", String(DEFAULT_ITERATIONS)));

  if (!password) {
    throw new Error("Missing password. Use --password \"your-password\" or BIRTHDAY_PHOTO_PASSWORD.");
  }

  if (!Number.isInteger(iterations) || iterations < 100000) {
    throw new Error("Iterations must be an integer >= 100000.");
  }

  await fs.mkdir(outputDirectory, { recursive: true });

  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = username ? `${username}\n${password}` : password;
  const key = await deriveKey(keyMaterial, salt, iterations);
  const files = [];
  const imageFiles = await listImageFiles(sourceDirectory);

  for (const fileName of imageFiles) {
    const sourcePath = path.join(sourceDirectory, fileName);
    const encryptedFileName = `${fileName}.bin`;
    const encryptedPath = path.join(outputDirectory, encryptedFileName);
    const bytes = await fs.readFile(sourcePath);
    const encryptedPayload = await encryptPayload(key, bytes);

    await fs.mkdir(path.dirname(encryptedPath), { recursive: true });
    await fs.writeFile(encryptedPath, JSON.stringify(encryptedPayload));

    files.push({
      source: normalizePath(sourcePath),
      encrypted: normalizePath(encryptedPath),
      type: getContentType(sourcePath),
      bytes: bytes.byteLength
    });
  }

  const manifest = {
    version: 1,
    algorithm: "AES-GCM",
    kdf: "PBKDF2-SHA-256",
    iterations,
    salt: toBase64(salt),
    check: await encryptPayload(key, toBytes(CHECK_TEXT)),
    files
  };

  await fs.writeFile(path.join(outputDirectory, "photos.manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Encrypted ${files.length} photos into ${outputDirectory}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
