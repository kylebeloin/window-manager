//@ts-check
/**
 * @typedef {{[key: string]: Object<string, import('../manager/index.js').ManagedWindow>|null}} ManagedWindows
 */

/**
 * @type {ManagedWindows|null}
 */
let state = null;

export const getWindows = () => state;

/**
 *
 * @param {ManagedWindows} newState
 * @returns
 */
export const setWindows = (newState) => {
  state = {
    ...state,
    ...newState,
  };
  return state;
};
/**
 * @param {{ screen: string, window: import('../manager/index.js').ManagedWindow}} param
 * @returns {ManagedWindows}
 */
export const addWindow = ({ screen, window }) => {
  if (!state) {
    state = {};

    state[screen] = {
      [window.id]: window,
    };
    return state;
  }
  if (state[screen]) {
    state[screen] = {
      ...state[screen],
      [window.id]: window,
    };
  } else {
    state[screen] = {
      [window.id]: window,
    };
  }
  return state;
};
/**
 * @param {{ screen: string, window: import('../manager/index.js').ManagedWindow}} param
 * @returns {ManagedWindows}
 */
export const removeWindow = ({ screen, window }) => {
  if (!state) {
    return {};
  }
  if (state !== null) {
    const filtered = Object.entries(state[screen] ?? []).filter(
      ([key, _]) => key !== window.id
    );
    state[screen] = Object.fromEntries(filtered);
  }

  return state;
};
