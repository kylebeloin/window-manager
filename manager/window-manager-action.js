// @ts-check
import { WindowManagerActionTypes as WindowActions } from "./window-manager-action-types.js";
import { WorkerActionTypes as WorkerActions } from "../worker/worker-action-types.js";

/**
 * What actions, if any, should be taken in response to a window action
 */
const windowActionMap = {
  [WindowActions.INIT]: WorkerActions.SET_WINDOWS,
  [WindowActions.START]: WorkerActions.START,
  [WindowActions.OPEN]: WorkerActions.ADD_WINDOW,
  [WindowActions.CLOSE]: WorkerActions.REMOVE_WINDOW,
  [WindowActions.IDENTIFY]: null,
  [WindowActions.UPDATE]: null,
  [WindowActions.LOG]: null,
};

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
    this.response = windowActionMap[type];
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
