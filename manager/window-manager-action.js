// @ts-check
import { WindowManagerActionTypes as WindowActions } from "./window-manager-action-types.js";

export class WindowManagerAction {
  /**
   * @type {import('./index.js').WindowManagerActionType}
   */
  type;
  /**
   * @type {any}
   */
  payload;
  /**
   * @type {import('../worker/index.js').WorkerActionType|null}
   */
  response;
  /**
   * @param {import('./index.js').WindowManagerActionType} type
   * @param {*} payload
   */
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
  }

  /**
   *
   * @param {{type: any, payload: any}} dto
   * @returns
   */
  static from({ type, payload }) {
    if (!WindowActions[type]) {
      type = WindowActions.LOG;
      payload = `Invalid action type: ${type}`;
    }
    return new WindowManagerAction(type, payload);
  }
}
