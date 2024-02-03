// @ts-check
import { WorkerAction, WorkerActionTypes as WorkerActions } from "./index.js";
import {
  WindowManagerActionTypes as WindowActions,
  WindowManagerAction as WindowAction,
} from "../manager/index.js";
import {
  getWindows,
  setWindows,
  addWindow,
  removeWindow,
} from "./worker-state.js";

/**
 * @typedef {Object} WorkerActionResult
 * @property {import('../manager/index.js').WindowManagerActionType} type
 * @property {any} payload
 */

/**
 *
 * @param {WorkerAction} action
 * @returns
 */
export class WorkerActionHandler {
  /**
   * @type {MessagePort[]} ports
   */
  ports = [];

  constructor() {}

  /**
   *
   * @param {WorkerAction} action
   * @param {MessagePort} port
   * @returns {void}
   */
  dispatch(action, port) {
    /** @type {WorkerActionResult} */
    let result = {
      type: action.response ?? WindowActions.LOG,
      payload: null,
    };

    switch (action.type) {
      case "INIT":
        if (getWindows() === null) {
          result.type = "START";
          result.payload = setWindows(action.payload);
        } else {
          result.payload = getWindows();
        }
        break;

      case "START":
        port["id"] = action.payload.window.id;
        result.payload = addWindow(action.payload);
        this.sendMessage(result);
        return;
      case "GET_WINDOWS":
        result.payload = getWindows();
        break;
      case "SET_WINDOWS":
        result.payload = setWindows(action.payload);
        this.sendMessage(result);
        return;
      case "ADD_WINDOW":
        result.payload = addWindow(action.payload);
        this.sendMessage(result);
        return;
      case "REMOVE_WINDOW":
        result.payload = removeWindow(action.payload);
        const closedAction = WindowAction.from({
          type: WindowActions.CLOSED,
          payload: action.payload,
        });
        const portToClose = this.ports.find(
          (p) => p["id"] === action.payload.window.id
        );
        if (portToClose) {
          this.sendMessage(closedAction, portToClose);
        }
        this.sendMessage(result);
        return;
      case WorkerActions.LOG:
        result.payload = action.payload;
        console.log("WorkerActionHandler", result.payload);
        break;
      default:
        result.payload = `Unknown action: ${action.type}`;
        break;
    }
    this.sendMessage(result, port);
  }
  /**
   *
   * @param {{type: import("../manager/index.js").WindowManagerActionType, payload: any}} result
   * @param {MessagePort|null} [port]
   */
  sendMessage(result, port) {
    const action = WindowAction.from(result);
    // If no port is specified, broadcast to all ports
    if (!port) {
      for (const port of this.ports) {
        port.postMessage(action);
      }
    } else {
      port.postMessage(action);
    }
  }

  /**
   * @param {MessagePort} port
   */
  addPort(port) {
    port.onmessage = ({ data }) => {
      // Convert data to worker action, and dispatch it
      this.dispatch(WorkerAction.from(data), port);
    };
    port.start();
    this.ports.push(port);
  }

  /**
   * @param {MessagePort} port
   */
  removePort(port) {
    this.ports = this.ports.filter((p) => p !== port);
    port.close();
  }
}
