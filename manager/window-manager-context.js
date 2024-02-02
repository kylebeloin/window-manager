// @ts-check
import { ManagedWindow } from "./managed-window.js";

/**
 * @typedef {{[key: string]: Object<string, ManagedWindow>}} ManagedWindows
 */

export class WindowManagerContext {
  static async init() {
    /**
     * @type {WindowManagerContext|null}
     */
    let context = Reflect.get(window, "manager");
    if (!context) {
      try {
        context = await window.getScreenDetails().then((details) => {
          return new WindowManagerContext(details);
        });
        Reflect.set(window, "manager", context);
      } catch (e) {
        console.error("Failed to initialize WindowManagerContext", e);
      }
    }
    return context;
  }
  /**
   * A map made of unique screen labels and the windows on them.
   * @type {ManagedWindows}
   */
  #windows = {};

  /**
   * @type {ManagedWindow}
   */
  #activeWindow;

  /**
   * Tracks windows across screens
   */
  get windows() {
    return this.#windows;
  }

  set windows(value) {
    this.#windows = value;

    Reflect.set(window, "manager", this);
  }

  get activeWindow() {
    return this.#activeWindow;
  }

  set activeWindow(_window) {
    this.#activeWindow = _window;
    Reflect.set(window, "manager", this);
  }

  /**
   * @type {ScreenDetails}
   */
  details;

  /**
   * @param {ScreenDetails} details - initial details of the window manager
   */
  constructor(details) {
    if (Reflect.get(window, "manager")) {
      throw new Error("WindowManagerContext is already initialized");
    }
    /**
     * @type {ManagedWindows}
     */
    const _windows = {};
    // Set initial window labels to empty arrays
    details.screens.forEach((screen) => {
      _windows[screen.label] = {};
    });
    details.oncurrentscreenchange = (screen) => {
      this.addWindow(this.activeWindow, screen.label);
    };
    this.details = details;
    this.windows = _windows;
    this.activeWindow = new ManagedWindow(this);
    this.addWindow(this.activeWindow, this.details.currentScreen.label);
  }

  newWindow() {
    const newWindow = window.open(
      "./",
      "",
      "fullscreen=yes,toolbar=no,location=no,menubar=no,scrollbars=no,resizable=no,status=no,titlebar=no,alwaysRaised=yes,dependent=yes"
    );
    if (newWindow) {
    } else {
      console.error("Failed to open new window");
    }
  }

  /**
   * @param {ManagedWindow} newWindow
   * @param {string} screenLabel
   */
  addWindow(newWindow, screenLabel) {
    if (newWindow.screen.label !== screenLabel) {
      this.removeWindow(newWindow, newWindow.screen.label);
    }
    this.windows = {
      ...this.windows,
      [screenLabel]: {
        ...this.windows[screenLabel],
        [newWindow.id]: newWindow,
      },
    };
  }

  /**
   * @param {ManagedWindow} newWindow
   * @param {string} screenLabel
   */
  removeWindow(newWindow, screenLabel) {
    this.windows = {
      ...this.windows,
      [screenLabel]: {
        ...this.windows[screenLabel],
        [newWindow.id]: null,
      },
    };
  }
}

export default WindowManagerContext;
