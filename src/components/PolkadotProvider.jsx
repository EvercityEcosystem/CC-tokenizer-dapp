import React, { createContext, useReducer } from "react";

const initialState = {};
const store = createContext(initialState);
const { Provider } = store;

const reducer = (state, action) => {
  switch (action.type) {
    case "setAPI":
      return {
        ...state,
        api: action?.payload,
      };
    case "setInjector":
      return {
        ...state,
        injector: action?.payload,
      };
    case "setTimeStep":
      return {
        ...state,
        timeStep: action?.payload,
      };
    default:
      throw new Error("Action not found");
  }
};
const PolkadotProvider = ({ children }) => {
  const [polkadotState, dispatch] = useReducer(reducer, initialState);

  return <Provider value={{ polkadotState, dispatch }}>{children}</Provider>;
};

export { store, PolkadotProvider };
