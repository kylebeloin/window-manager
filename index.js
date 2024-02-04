// @ts-check
import {
  WindowManagerContext,
  WindowManagerActionTypes as WindowActions,
  ManagedWindow,
} from "./manager/index.js";
import * as T from "./manager/types.js";

const startBtn = document.querySelector("#start");
const context = await WindowManagerContext.init(callback);

// @ts-ignore
startBtn.onclick = async () => {
  context?.newWindow();
};
/**
 * @param {import("./manager/index.js").WindowManagerContext} context
 */
function callback(context) {
  console.log("callback", context);
  const screens = context.screens;
  const windows = context.windows;

  createScreenUI(context);
}

/**
 *
 * @param {WindowManagerContext} context
 */
function createScreenUI(context) {
  const screens = context.screens;
  const windows = context.windows;
  const body = document.getElementById("screens");
  const refreshButton = document.getElementById("refresh");
  body.innerHTML = "";
  const screensEl = document.createElement("div");
  if (refreshButton) {
    refreshButton.textContent = "Refresh";
    refreshButton.onclick = () => {
      context.refreshWindows();
    };
  }

  screensEl.classList.add("screens");

  body?.appendChild(screensEl);

  for (const [label, windowIds] of screens) {
    const screenEl = document.createElement("div");
    const toolbarEl = document.createElement("div");
    toolbarEl.classList.add("toolbar");
    const addBtn = document.createElement("button");
    addBtn.textContent = "Add Window to Screen";
    addBtn.onclick = () => {
      context.newWindow(label);
    };
    screenEl.classList.add("screen");

    const labelEl = document.createElement("p");
    labelEl.classList.add("title");
    labelEl.textContent = label;

    toolbarEl.appendChild(labelEl);
    toolbarEl.appendChild(addBtn);

    screenEl.appendChild(toolbarEl);
    const windowsEl = document.createElement("div");
    windowsEl.classList.add("windows");
    for (const windowId of windowIds) {
      const windowEl = createWindowUI(windows[windowId], windowsEl);
      let dropdown = createDropdown(screens, label);
      dropdown.onchange = () => {
        context.moveWindow(windowId, dropdown.value);
      };
      windowEl.appendChild(dropdown);
    }
    screenEl.appendChild(windowsEl);

    screensEl.appendChild(screenEl);
  }
}

/**
 *
 * @param {T.IManagedWindow} managedWindow
 * @param {HTMLDivElement} screenEl
 */
function createWindowUI(managedWindow, screenEl) {
  const windowEl = document.createElement("div");
  const idEl = document.createElement("p");

  idEl.textContent = managedWindow.id;

  windowEl.appendChild(idEl);
  windowEl.classList.add("window");
  // Create window buttons
  if (managedWindow.window.hasOpener) {
    const closeBtn = document.createElement("button");
    closeBtn.onclick = () => {
      context?.closeWindow(managedWindow.id);
    };
    closeBtn.textContent = "X";
    windowEl.appendChild(closeBtn);
  }
  screenEl.appendChild(windowEl);
  return windowEl;
}

/**
 *
 * @param {Map<string, string>} screens
 * @param {string} _label
 * @returns
 */
function createDropdown(screens, _label) {
  const select = document.createElement("select");

  for (const [label] of screens) {
    const option = document.createElement("option");
    if (label === _label) {
      option.selected = true;
    }
    option.value = label;
    option.textContent = label;
    select.appendChild(option);
  }
  return select;
}
