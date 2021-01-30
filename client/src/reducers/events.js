import {
  GET_EVENTS,
  EVENTS_ERROR,
  EVENT_LOADING,
  EVENT_SAVED,
  GET_EVENT,
  EVENT_UPDATED,
} from "../actions/types";
const initialState = {
  event: null,
  events: null,
  loading: false,
  saved: false,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case EVENT_LOADING:
      return {
        ...state,
        loading: true,
      };

    case GET_EVENTS:
      return {
        ...state,
        events: payload,
        loading: false,
        saved: false,
      };
    case GET_EVENT:
      return {
        ...state,
        event: payload,
        loading: false,
      };
    case EVENT_SAVED:
      return {
        ...state,
        saved: true,
        loading: false,

      };
    case EVENT_UPDATED:
      return {
        ...state,
        saved: true,
        loading: false,
      };
    case EVENTS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    default:
      return state;
  }
}
