import { getClassProperties } from "./window-manager-utils.js";
/**
 * @interface IManagedWindow
 * @property {string} id
 */

export class ManagedWindow {
  /**
   * @param {import('./window-manager-context.js').WindowManagerContext} context
   * @param {Window} _window
   */
  constructor(context, _window = window) {
    const { id } = _window.history.state ?? { id: crypto.randomUUID() };

    this.screen = this.buildScreenDto(context.details.currentScreen);
    this.window = this.buildWindowDto(_window);
    this.id = id;
    window.history.replaceState({ id: this.id }, "");
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
      isMaximized: window.screenTop === 0,
      isMinimized: window.screenTop === window.screen.height,
      isFocused: window.document.hasFocus(),
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      hasOpener: window.opener !== null,
    };
  }
}
