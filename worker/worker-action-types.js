// @ts-check
/**
 * @type {'LOG'}
 */
const LOG = "LOG";
/**
 * @type {'GET_WINDOWS'}
 */
const GET_WINDOWS = "GET_WINDOWS";
/**
 * @type {'SET_WINDOWS'}
 */
const SET_WINDOWS = "SET_WINDOWS";
/**
 * @type {'ADD_WINDOW'}
 */
const ADD_WINDOW = "ADD_WINDOW";
/**
 * @type {'REMOVE_WINDOW'}
 */
const REMOVE_WINDOW = "REMOVE_WINDOW";
/**
 * @type {'INIT'}
 */
const INIT = "INIT";
/**
 * @type {'START'}
 */
const START = "START";
/**
 * @type {"SUBSCRIBE"}
 */
const SUBSCRIBE = "SUBSCRIBE";

/**
 * @typedef {(typeof SUBSCRIBE | typeof START | typeof INIT | typeof LOG | typeof GET_WINDOWS | typeof SET_WINDOWS | typeof ADD_WINDOW | typeof REMOVE_WINDOW)} WorkerActionType
 */

export const WorkerActionTypes = {
  GET_WINDOWS,
  SET_WINDOWS,
  ADD_WINDOW,
  REMOVE_WINDOW,
  LOG,
  INIT,
  START,
  SUBSCRIBE,
};
