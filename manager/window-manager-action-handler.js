// @ts-check
import {
  WorkerAction,
  WorkerActionTypes as WorkerActions,
} from "../worker/index.js";
import {
  WindowManagerAction as WindowAction,
  WindowManagerActionTypes as WindowActions,
  WindowManagerContext,
} from "./index.js";

/**
 * @typedef {Object} WindowActionResult
 * @property {import('../worker/index.js').WorkerActionType} type
 * @property {any} payload
 */

export class WindowManagerActionHandler {
  /**
   * @type {MessagePort}
   */
  port;
  /**
   * @param {MessagePort} port
   * @param {Function|null} callback
   */
  constructor(port, callback = null) {
    port.start();
    port.onmessage = async ({ data }) => {
      await this.dispatch(data, null);
    };
    this.port = port;
    this.callback = callback;
  }

  /**
   *
   * @param {WindowAction} action
   * @param {WindowManagerContext|null} context
   */
  async dispatch(action, context) {
    if (context === null) {
      context = await WindowManagerContext.init();
    }
    /** @type {WindowActionResult} */
    let result = {
      type: action.response ?? WindowActions.LOG,
      payload: null,
    };
    switch (action.type) {
      case WindowActions.START:
        if (context) {
          result.payload = {
            screen: context.details.currentScreen.label,
            window: context.activeWindow,
          };
        }
        break;
      case WindowActions.OPEN:
        if (context) {
          context?.newWindow();
          result.payload = {
            screen: context.details.currentScreen.label,
            window: context.activeWindow,
          };
        }
        break;
      case WindowActions.CLOSE:
        if (context) {
          const { screen } = action.payload;

          result.payload = {
            screen: screen.label,
            window: action.payload,
          };
        }
        break;
      case WindowActions.INIT:
        if (context) {
          result.payload = context.windows;
        }
      case WindowActions.IDENTIFY:
        break;
      case WindowActions.UPDATE:
        if (context) {
          context.windows = action.payload;
          if (this.callback) {
            this.callback(context);
          }
        }
        break;
      case WindowActions.CLOSED:
        console.log(`Window closed: ${action.payload}`);
        window.close();
        break;
      case WindowActions.LOG:
        console.log(`Window: ${action.payload}`);
        return;
      default:
        break;
    }
    this.sendMessage(result);
  }

  /**
   * @param {WindowActionResult} result
   */
  sendMessage(result) {
    const action = WorkerAction.from(result);
    this.port.postMessage(action);
  }

  /**
   * @param {WindowManagerContext} context
   */
  async start(context) {
    this.sendMessage({
      type: WorkerActions.INIT,
      payload: context.windows,
    });
  }
}
