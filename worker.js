// @ts-check
export const script =
  "data:text/javascript;base64," +
  btoa(`const WorkerActions = {
  INIT: "START",
  START: "UPDATE",
  GET_WINDOWS: "LOG",
  SET_WINDOWS: "UPDATE",
  ADD_WINDOW: "UPDATE",
  REMOVE_WINDOW: "UPDATE",
  LOG: "LOG",
};

let state = null;

let ports = [];

onconnect = function (event) {
  const [port] = event.ports;
  port.start();
  port.onmessage = async ({ data }) => {
    dispatch(toAction(data), port);
  };
};

function toAction(data) {
  let type = data.type;
  let payload = data.payload;
  if (!WorkerActions[type]) {
    type = WorkerActions.LOG;
    payload = "Invalid action type: " + type;
  }
  let response = WorkerActions[type];
  return {
    type,
    payload,
    response,
  };
}

function toResult(result) {
  return {
    type: result.response ?? "LOG",
    payload: result.payload,
  };
}

function dispatch(action, port) {
  let result = {
    type: action.response ?? "LOG",
    payload: "",
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
      sendMessage(result);
      return;
    case "GET_WINDOWS":
      result.payload = getWindows();
      break;
    case "SET_WINDOWS":
      result.payload = setWindows(action.payload);
      sendMessage(result);
      return;
    case "ADD_WINDOW":
      result.payload = addWindow(action.payload);
      this.sendMessage(result);
      return;
    case "REMOVE_WINDOW":
      result.payload = removeWindow(action.payload);
      const closedAction = {
        type: "CLOSED",
        payload: action.payload,
        response: "",
      };
      const portToClose = this.ports.find(
        (p) => p["id"] === action.payload.window.id
      );
      if (portToClose) {
        this.sendMessage(closedAction, portToClose);
      }
      this.sendMessage(result);
      return;
    case "LOG":
      result.payload = action.payload;
      console.log("WorkerActionHandler", result.payload);
      break;
    default:
      result.payload = "Unknown action: " + action.type;
      break;
  }
  sendMessage(result, port);
}

function sendMessage(result, port) {
  if (port) {
    port.postMessage(result);
  } else {
    ports.forEach((p) => {
      p.postMessage(result);
    });
  }
}

function addWindow({ screen, window }) {
  console.log("addWindow", screen, window);
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
  console.log("adding", state)
  return state;
}

function removeWindow({ screen, window }) {
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
}

function setWindows(newState) {
  state = {
    ...state,
    ...newState,
  };
  console.log("setWindows", state);
  return state;
}

const getWindows = () => state;`);
