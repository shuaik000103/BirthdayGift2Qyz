import { writeFile } from "node:fs/promises";

const port = process.env.CDP_PORT ?? "9444";
const outPrefix = process.env.QA_PREFIX ?? "qa";
const tabs = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json());
const tab = tabs.find((item) => item.type === "page") ?? tabs[0];
const ws = new WebSocket(tab.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();

ws.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
  }
});

await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));

function send(method, params = {}) {
  const messageId = ++id;
  ws.send(JSON.stringify({ id: messageId, method, params }));
  return new Promise((resolve, reject) => {
    pending.set(messageId, (message) => {
      if (message.error) {
        reject(new Error(JSON.stringify(message.error)));
      } else {
        resolve(message.result);
      }
    });
  });
}

async function evalJs(expression) {
  return send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
}

async function screenshot(name) {
  const shot = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
  await writeFile(`${outPrefix}/${name}.png`, Buffer.from(shot.data, "base64"));
}

async function settle(ms = 450) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 1400,
  deviceScaleFactor: 1,
  mobile: false
});

await settle(800);
await screenshot("login");

await evalJs(`
  document.querySelector("#username").value = "birthday";
  document.querySelector("#password").value = "happy";
  document.querySelector("#loginForm").requestSubmit();
`);
await settle(1200);
await screenshot("hero-after-login");

await evalJs(`document.querySelector("#timeline").scrollIntoView({ block: "start" });`);
await settle(700);
await evalJs(`document.querySelector('[data-story="2"]').click();`);
await settle(500);
await screenshot("timeline");

await evalJs(`document.querySelector("#collection").scrollIntoView({ block: "start" });`);
await settle(700);
await evalJs(`document.querySelector('[data-exhibit="1"]').click();`);
await settle(500);
await screenshot("exhibit-modal");
await evalJs(`document.querySelector("#exhibitModal [data-close]").click();`);
await settle(300);

await evalJs(`document.querySelector("#stars").scrollIntoView({ block: "start" });`);
await settle(700);
await evalJs(`
  document.querySelector("#starInput").value = "新的一岁要一直闪闪发光";
  document.querySelector("#starForm").requestSubmit();
`);
await settle(700);
await screenshot("stars");

await evalJs(`document.querySelector("#gifts").scrollIntoView({ block: "start" });`);
await settle(700);
await evalJs(`
  document.querySelector('[data-gift="0"]').click();
  document.querySelector('[data-gift="1"]').click();
  document.querySelector('[data-gift="2"]').click();
`);
await settle(700);
await screenshot("gifts");

await evalJs(`document.querySelector("#letter").scrollIntoView({ block: "start" });`);
await settle(700);
await evalJs(`document.querySelector("#letterButton").click();`);
await settle(700);
await screenshot("letter");

await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 900,
  deviceScaleFactor: 1,
  mobile: true
});
await evalJs(`document.querySelector("#collection").scrollIntoView({ block: "start" });`);
await settle(700);
await screenshot("mobile-collection");

const result = await evalJs(`
  JSON.stringify({
    loggedIn: document.body.classList.contains("is-locked") === false,
    modalOpens: Boolean(document.querySelector("#exhibitModal")),
    starMessage: document.querySelector("#starMessage").textContent.trim(),
    giftCount: document.querySelector("#giftCount").textContent.trim(),
    letterVisible: document.querySelector("#letterHidden").hidden === false,
    sections: [...document.querySelectorAll("main > section")].length
  })
`);

console.log(result.result.value);
ws.close();
