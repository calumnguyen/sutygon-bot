import axios from "axios";
import {
  EVENT_SAVED,
  EVENT_ERROR,
  GET_EVENTS,GET_EVENT,
  EVENTS_LOADING,
  EVENT_UPDATED,
} from "./types";
import { setAlert } from "./alert";

// Add new product
export const addEvent = (event) => async (dispatch) => {
  dispatch({ type: EVENTS_LOADING });
  const config = {
    headers: {
      // "content-type": "multipart/form-data",
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify(event);

  try {
    const res = await axios.post("/api/events/add", body, config);

    dispatch({
      type: EVENT_SAVED,
    });

    dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: EVENT_ERROR,
    });
  }
};

// get All Users
export const getAllEventts = () => async (dispatch) => {
  dispatch({ type: EVENTS_LOADING });
  try {
    const res = await axios.get(`/api/events`);
    dispatch({
      type: GET_EVENTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: err.response,
    });
  }
};

export const getEventbyID = (id) => async (dispatch) => {
  dispatch({ type: EVENTS_LOADING });

  try {
    const res = await axios.get(`/api/events/${id}`);
    dispatch({
      type: GET_EVENT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: err.response,
    });
  }
};

// Update product

export const updateEvent = (event, id) => async (dispatch) => {
  dispatch({ type: EVENTS_LOADING });

  const config = {
    headers: {
      // "content-type": "multipart/form-data",
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify(event);

  try {
    const res = await axios.post(`/api/events/${id}`, body, config);

    dispatch({
      type: EVENT_UPDATED,
      payload: res.data,
    });
    dispatch(setAlert(res.data.msg, "success"));
    dispatch(getAllEventts());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: EVENT_ERROR,
    });
  }
};
// changeStatus
