// @ts-check
/**
 * @fileoverview The window manager "acts" - it should be able to add and remove windows, and set the active window.
 */
import * as T from "./types.js";
import { ManagedWindow } from "./managed-window.js";
import { WindowManagerAction } from "./window-manager-action.js";
import { WindowManagerActionTypes as WindowActions } from "./window-manager-action-types.js";
const CHANNEL = "window-manager";

export class WindowManager {
  /**
   * @type {import("./window-manager-context.js").WindowManagerContext}
   */
  context;
  /**
   * @type {BroadcastChannel}
   */
  channel;
  /**
   * @type {ManagedWindow}
   */
  #managed;

  get managed() {
    return this.#managed;
  }

  set managed(value) {
    this.#managed = value;
    this.context.addWindow(value);
  }
  /**
   * @param {ScreenDetails} details
   * @param {import("./window-manager-context.js").WindowManagerContext} context
   */
  constructor(details, context) {
    const { currentScreen } = details;
    this.context = context;
    this.managed = new ManagedWindow(currentScreen, window);
    this.channel = new BroadcastChannel(CHANNEL);
    this.channel.onmessage = ({ data }) => {
      const action = WindowManagerAction.from(data);
      this.handleWindowAction(action);
    };

    details.oncurrentscreenchange = () => {
      this.updateManagedWindow(details.currentScreen);
    };
    /**
     * If the current screen changes, update the window
     */
    currentScreen.addEventListener("change", () => {
      this.updateManagedWindow(currentScreen);
    });

    window.onbeforeunload = () => {
      this.context.removeWindow(this.managed);
      this.sendMessage(WindowActions.UPDATE, this.context.windows);
    };

    this.sendMessage(WindowActions.START, this.managed);
  }

  /**
   *
   * @param {WindowManagerAction} action
   */
  handleWindowAction({ type, payload }) {
    switch (type) {
      // Move message contains screen label and id to check.
      case WindowActions.MOVE:
        if (payload.id === this.managed.id) {
          console.log("WindowManager.handleWindowAction", payload);
          this.handleMove(payload);
        }
        break;
      case WindowActions.REFRESH:
        window.history.go(0);
        break;
      // I've just opened, give me the current state and add me to the list
      case WindowActions.START:
        this.context.addWindow(payload);
        this.sendMessage(WindowActions.UPDATE, this.context.windows);
      case WindowActions.CLOSE:
        const { id } = payload;
        if (id === this.managed.id) {
          window.close();
        }
        break;
      case WindowActions.UPDATE:
        /**
         * @type {T.IManagedWindows}
         */
        const newWindows = {
          [this.managed.id]: this.managed,
          ...payload,
        };
        this.context.setWindows(newWindows);
        console.log("WindowManager.handleWindowAction", this.context.windows);
        break;
      default:
        break;
    }
  }

  /**
   *
   * @param {ScreenDetailed} screen
   */
  updateManagedWindow(screen, _window = window) {
    this.managed = new ManagedWindow(screen, _window);
    this.sendMessage(WindowActions.UPDATE, this.context.windows);
  }

  /**
   * @param {import("./window-manager-action-types.js").WindowManagerActionType} type
   * @param {*} payload
   */
  sendMessage(type, payload) {
    console.log("WindowManager.sendMessage", this);
    this.channel.postMessage({ type, payload });
  }

  handleMove({ screenLabel }) {
    const screen = this.context.details.screens.find(
      (screen) => screen.label === screenLabel
    );
    console.log("handleMove", screen);
    if (screen) {
      window.moveTo(screen.availLeft, screen.availTop);
      window.resizeTo(screen.width, screen.height);
    }
  }
}
