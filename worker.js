import { WorkerActionHandler } from "./worker/index.js";

/**
 * @typedef {{[key: string]: Array<import('./manager/managed-window.js').ManagedWindow>}} ManagedWindows
 */
let handler = new WorkerActionHandler();
onconnect = function (event) {
  const [port] = event.ports;
  handler.addPort(port);
};
