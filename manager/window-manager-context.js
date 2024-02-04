// @ts-check
import { ManagedWindow } from "./managed-window.js";
import { WindowManager } from "./window-manager.js";
import { WindowManagerActionTypes as WindowActions } from "./window-manager-action-types.js";
import * as T from "./types.js";

/**
 * This holds information about the screen details across open windows, and communicates changes
 * in its manager.
 */
export class WindowManagerContext {
  /**
   * @param {function(WindowManagerContext):void} callback - callback to be called after the context is initialized
   * @returns {Promise<WindowManagerContext|null>}
   */
  static async init(callback) {
    /**
     * @type {WindowManagerContext|null}
     */
    let context = Reflect.get(window, "manager");
    if (!context) {
      try {
        context = await window.getScreenDetails().then((details) => {
          return new WindowManagerContext(details, callback);
        });
        Reflect.set(window, "manager", context);
      } catch (e) {
        console.error("Failed to initialize WindowManagerContext", e);
      }
    }
    return context;
  }

  /**
   * @type {function(WindowManagerContext):void} callback - callback to be called after the context is initialized
   */
  callback;

  /**
   * A map made of unique screen labels and the windows on them.
   * @type {T.IManagedWindows}
   */
  #windows = {};

  /**
   * Tracks windows across screens
   */
  get windows() {
    return this.#windows;
  }

  set windows(value) {
    this.#windows = value;
    this.callback(this);
    Reflect.set(window, "manager", this);
  }

  /**
   * @type {Map<string, string>}
   */
  get screens() {
    const screenLabels = this.details.screens.reduce((acc, screen) => {
      acc.set(screen.label, []);
      return acc;
    }, new Map());

    return Object.entries(this.windows).reduce((acc, [key, value]) => {
      if (acc.has(value.screen.label)) {
        acc.get(value.screen.label).push(key);
      } else {
        acc.set(value.screen.label, [key]);
      }
      return acc;
    }, screenLabels);
  }

  /**
   * @type {ScreenDetails}
   */
  details;

  /**
   * @param {ScreenDetails} details - initial details of the window manager
   * @param {function(WindowManagerContext):void} callback - callback to be called after the context is initialized
   */
  constructor(details, callback) {
    if (Reflect.get(window, "manager")) {
      throw new Error("WindowManagerContext is already initialized");
    }
    this.callback = callback;
    Object.defineProperty(this, "#windows", { enumerable: true });
    this.details = details;
    this.manager = new WindowManager(details, this);
  }

  /**
   * @param {string} [screenLabel]
   */
  newWindow(screenLabel) {
    let screen = this.details.screens.find(
      (screen) => screen.label === screenLabel
    );
    if (!screen) {
      screen = this.details.currentScreen;
    }
    const { availTop, availLeft, width, height } = screen;
    const newWindow = window.open(
      "/",
      "_blank",
      `top=${availTop}, left=${availLeft}, width=${width}, height=${height}`
    );

    newWindow?.addEventListener("beforeunload", () => {
      this.removeWindow(this.manager.managed);
    });
  }

  /**
   *
   * @param {string} id
   */
  closeWindow(id) {
    if (this.manager.managed.id === id) {
      window.close();
    } else {
      this.manager.sendMessage(WindowActions.CLOSE, {
        id,
      });
    }
  }

  getWindows() {
    return this.windows;
  }

  /**
   * @param {T.IManagedWindows} value
   */
  setWindows(value) {
    this.windows = value;
  }

  /**
   * @param {T.IManagedWindow} newWindow
   * @returns {T.IManagedWindows}
   */
  addWindow(newWindow) {
    this.windows = {
      ...this.windows,
      [newWindow.id]: {
        ...newWindow,
      },
    };
    return this.windows;
  }

  /**
   * @param {ManagedWindow} oldWindow
   */
  removeWindow(oldWindow) {
    const { [oldWindow.id]: _, ...rest } = this.windows;
    this.windows = rest;
    return this.windows;
  }

  refreshWindows() {
    this.manager.sendMessage(WindowActions.REFRESH, {});
    window.history.go(0);
  }

  moveWindow(windowId, screenLabel) {
    console.log("moveWindow", windowId, screenLabel);
    if (windowId === this.manager.managed.id) {
      const screen = this.details.screens.find(
        (screen) => screen.label === screenLabel
      );
      if (screen) {
        window.moveTo(screen.availLeft, screen.availTop);
        window.resizeTo(screen.width, screen.height);
      }
    } else {
      this.manager.sendMessage(WindowActions.MOVE, {
        id: windowId,
        screenLabel,
      });
    }
  }
}

export default WindowManagerContext;
