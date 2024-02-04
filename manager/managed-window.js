// @ts-check
import * as T from "./types.js";

/**
 * @implements {T.IManagedWindow}
 */
export class ManagedWindow {
  /**
   * @type {T.IWindow}
   */
  window;
  /**
   * @type {T.IScreen}
   */
  screen;
  /**
   * @type {string}
   */
  id;
  /**
   * @param {ScreenDetailed} _screen
   * @param {Window} _window
   */
  constructor(_screen, _window = window) {
    this.id = _window.history.state?.id ?? crypto.randomUUID();
    console.log("ManagedWindow", this.id);
    this.window = this.buildWindowDto(_window);
    this.screen = this.buildScreenDto(_screen);
    _window.history.replaceState({ id: this.id }, "");
  }

  /**
   * Build screen dto
   * @param {ScreenDetailed} screen
   */
  buildScreenDto(screen) {
    return {
      label: screen.label,
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      top: screen.top,
      left: screen.left,
      isExtended: screen.isExtended,
      isPrimary: screen.isPrimary,
      isInternal: screen.isInternal,
    };
  }
  /**
   * Build window dto
   * @param {Window} window
   */
  buildWindowDto(window) {
    return {
      isFullscreen: window.document.fullscreenElement !== null,
      isFocused: window.document.hasFocus(),
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      hasOpener: window?.opener !== null,
    };
  }
}
