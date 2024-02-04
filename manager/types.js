/**
 * @typedef {Object} IWindow
 * @property {boolean} isFullscreen
 * @property {boolean} isFocused
 * @property {number} innerHeight
 * @property {number} innerWidth
 * @property {boolean} hasOpener
 */

/**
 * @typedef {Object} IScreen
 * @property {string} label
 * @property {number} width
 * @property {number} height
 * @property {number} availWidth
 * @property {number} availHeight
 * @property {number} top
 * @property {number} left
 * @property {boolean} isExtended
 * @property {boolean} isPrimary
 * @property {boolean} isInternal
 */

/**
 * @typedef {Object} IManagedWindow
 * @property {IScreen} screen
 * @property {IWindow} window
 * @property {string} id
 */

/**
 * @typedef {{[key: string]: IManagedWindow}} IManagedWindows
 */

/**
 * This holds information about the screen details across open windows, and communicates changes
 * in its managed window to other manager contexts across a broadcast channel.
 * @typedef {Object} IWindowManager
 * @property {IManagedWindow} managed - Active window; use this to get current screen and window details
 * @property {BroadcastChannel} channel
 */

/**
 * @typedef {Object} IWindowManagerContext
 * @property {IManagedWindows} windows - A map made of unique screen labels and the windows on them
 * @property {IWindowManager} manager - Tracks windows across screens
 */

export {};
