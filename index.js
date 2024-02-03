// @ts-check
import {
  WindowManagerActionHandler,
  WindowManagerContext,
} from "./manager/index.js";

const startBtn = document.querySelector("#start");
const manager = await WindowManagerContext.init();
import { script } from "./worker.js";

const worker = new SharedWorker(script);

const handler = new WindowManagerActionHandler(worker.port, callback);
if (manager) {
  await handler.start(manager);
}
window.onbeforeunload = async () => {
  await handler.dispatch(
    {
      type: "CLOSE",
      payload: manager?.activeWindow,
      response: "REMOVE_WINDOW",
    },
    null
  );
};
// @ts-ignore
startBtn.onclick = async () => {
  await handler.dispatch(
    {
      type: "OPEN",
      payload: null,
      response: "ADD_WINDOW",
    },
    manager
  );
  await window.document.documentElement.requestFullscreen();
};
/**
 * @param {import("./manager/index.js").WindowManagerContext} context
 */
function callback(context) {
  console.log("callback", context);
  const windows = context.windows;
  for (const screen in windows) {
    createScreenUI(windows[screen]);
  }
}

/**
 *
 * @param {Object<string,import("./manager/index.js").ManagedWindow>} screen
 */
function createScreenUI(screen) {
  const body = document.getElementById("screens");
  body.innerHTML = "";
  const screenEl = document.createElement("div");
  screenEl.classList.add("screen");
  body?.appendChild(screenEl);

  for (const id in screen) {
    console.log("createWindowUI", screen[id]);
    if (!screen[id].window.hasOpener) {
      continue;
    }
    createWindowUI(screen[id], screenEl);
  }
}

/**
 *
 * @param {import("./manager/index.js").ManagedWindow} managedWindow
 * @param {HTMLDivElement} screenEl
 */
function createWindowUI(managedWindow, screenEl) {
  const windowEl = document.createElement("div");
  const paraEl = document.createElement("p");
  paraEl.textContent = managedWindow.id;
  windowEl.appendChild(paraEl);
  windowEl.classList.add("window");
  // Create window buttons
  const closeBtn = document.createElement("button");
  closeBtn.onclick = async () => {
    await handler.dispatch(
      {
        type: "CLOSE",
        payload: managedWindow,
        response: "REMOVE_WINDOW",
      },
      null
    );
  };
  closeBtn.textContent = "X";
  windowEl.appendChild(closeBtn);
  screenEl.appendChild(windowEl);
  return window;
}
