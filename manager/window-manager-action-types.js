/**
 * @type {'WHOIS'}
 */
const WHOIS = "WHOIS";
/**
 * @type {'LOG'}
 */
const LOG = "LOG";
/**
 * @type {'OPEN'}
 */
const OPEN = "OPEN";
/**
 * @type {'CLOSE'}
 */
const CLOSE = "CLOSE";
/**
 * @type {'IDENTIFY'}
 */
const IDENTIFY = "IDENTIFY";
/**
 * @type {'UPDATE'}
 */
const UPDATE = "UPDATE";
/**
 * @type {'INIT'}
 */
const INIT = "INIT";
/**
 * @type {'START'}
 */
const START = "START";
/**
 * @type {'CLOSED'}
 */
const CLOSED = "CLOSED";

/**
 * @typedef {typeof CLOSED | typeof START | typeof INIT | typeof WHOIS | typeof LOG | typeof OPEN | typeof CLOSE | typeof IDENTIFY | typeof UPDATE} WindowManagerActionType
 */

export const WindowManagerActionTypes = {
  START,
  INIT,
  WHOIS,
  LOG,
  OPEN,
  CLOSE,
  IDENTIFY,
  UPDATE,
  CLOSED,
};
