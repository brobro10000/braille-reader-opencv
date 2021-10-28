import { useReducer } from "react";
import {
  UPDATE_LOGIN,
} from "./actions";

export const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_LOGIN:
      return {
        ...state,
        currentForm: action.currentForm,
      };

    default:
      return state;
  }
};

export function useCurrentReducer(initialState) {
  return useReducer(reducer, initialState);
}
