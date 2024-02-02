// @ts-check
import { WorkerActionTypes as WorkerActions } from "./worker-action-types.js";
import { WindowManagerActionTypes as WindowActions } from "../manager/window-manager-action-types.js";
/**
 * @typedef {Object} WorkerActionParams
 * @property {import('./worker-action-types.js').WorkerActionType} type
 * @property {any} payload
 */

/**
 * What actions, if any, should be taken in response to a worker action
 */
const workerActionMap = {
  [WorkerActions.START]: WindowActions.UPDATE,
  [WorkerActions.INIT]: WindowActions.START,
  [WorkerActions.GET_WINDOWS]: WindowActions.LOG,
  [WorkerActions.SET_WINDOWS]: WindowActions.UPDATE,
  [WorkerActions.ADD_WINDOW]: WindowActions.UPDATE,
  [WorkerActions.REMOVE_WINDOW]: WindowActions.UPDATE,
  [WorkerActions.LOG]: WindowActions.LOG,
};

export class WorkerAction {
  /**
   * @type {import('./worker-action-types.js').WorkerActionType}
   */
  type;
  /**
   * @type {any}
   */
  payload;
  /**
   * @type {import('../manager/index.js').WindowManagerActionType|null}
   */
  response;
  /**
   * @param {WorkerActionParams} params
   */
  constructor({ type, payload }) {
    this.type = type;
    this.payload = payload;
    this.response = workerActionMap[type];
    return this;
  }

  /**
   *
   * * @param {{type: any, payload: any}} dto
   * @returns {WorkerAction}
   */
  static from({ type, payload }) {
    if (!WorkerActions[type]) {
      type = WorkerActions.LOG;
      payload = `Invalid action type: ${type}`;
    }

    return new WorkerAction({ type, payload });
  }
}
