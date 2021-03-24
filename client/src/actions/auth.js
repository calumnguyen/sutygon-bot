// @access  Private
import axios from "axios";
import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  AUTH_LOADING,
  SHOPS_ERROR,
  SHOPS_LOADING,
  STORE_LOADED,
} from "./types";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";

// Login
export const loginAdmin = (username, password) => async (dispatch) => {
  dispatch({
    type: AUTH_LOADING,
  });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({
    username,
    password,
  });

  try {
    const res = await axios.post("/api/auth/admin", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    localStorage.setItem("shopowner", "true");
    dispatch(loadUser());
  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
    }
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response.data,
    });
  }
};

// Load user
export const loadUser = () => async (dispatch) => {
  dispatch({
    type: AUTH_LOADING,
  });
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const loadStore = () => async (dispatch) => {
  dispatch({
    type: SHOPS_LOADING,
  });
  const storeId = localStorage.getItem("storeId");
  try {
    const res = await axios.get(`/api/shop/${storeId}`);
    dispatch({
      type: STORE_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SHOPS_ERROR,
    });
  }
};

// Login
export const login = (username, password, slug) => async (dispatch) => {
  dispatch({
    type: AUTH_LOADING,
  });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({
    username,
    password,
    slug,
  });

  try {
    const res = await axios.post("/api/auth", body, config);
    localStorage.setItem("storeId", res.data.slugres._id);
    localStorage.setItem("slug", res.data.slugres.slug);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
    if (localStorage.storeId) {
      dispatch(loadStore());
    }
  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
    }
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response.data,
    });
  }
};

// Logout / clear profile
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
