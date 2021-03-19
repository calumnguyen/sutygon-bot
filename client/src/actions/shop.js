import axios from "axios";
import {
  GET_STORES,
    GET_SHOPS,
    SHOPS_ERROR,
    SHOPS_LOADING,
    SHOPS_SAVED,
    GET_SHOP,
    SHOPS_DELETED,
    SHOPS_UPDATED,
} from "./types";
import { setAlert } from "./alert";

// Add new Shop
export const addNewShop = (store) => async (dispatch) => {
  dispatch({ type: SHOPS_LOADING });
  try {
    const res = await axios.post("/api/store/add", store);
    dispatch({
      type: SHOPS_SAVED,
    });
    dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    if (err.response.data.msg) {
      dispatch(setAlert(err.response.data.msg, "danger"))
    }
    // const errors = err.response.data;
    // if (errors) {
    //   errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    // }
    dispatch({
      type: SHOPS_ERROR,
    });
  }
};

// get All stores
export const getAllStores = (page) => async (dispatch) => {
  dispatch({ type: SHOPS_LOADING });
  try {
    let obj = {
      currentPage: page || 1,
    };
    const res = await axios.post(`/api/store`, obj);
    if(res.data.stores){
      dispatch({
        type: GET_STORES,
        payload: {
          stores: res.data.stores,
          // total: res.data.total,
        },
      });
    }
    
  } catch (err) {
    dispatch({
      type: SHOPS_ERROR,
      payload: err.response,
    });
  }
};

export const getShopById = (id) => async (dispatch) => {
  dispatch({ type: SHOPS_LOADING });

  try {
    const res = await axios.get(`/api/store/${id}`);
    dispatch({
      type: GET_SHOP,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SHOPS_ERROR,
      payload: err.response,
    });
  }
};

// Update Shops
export const updateStore = (storedata, id) => async (dispatch) => {
  dispatch({ type: SHOPS_LOADING });

  try {
    const res = await axios.post(`/api/store/${id}`, storedata);

    dispatch({
      type: SHOPS_UPDATED,
      payload: res.data,
    });
    dispatch(setAlert(res.data.msg, "success"));
    dispatch(getAllStores());
  } catch (err) {
    if (err.response.data.msg) {
      dispatch(setAlert(err.response.data.msg, "danger"))
    }
    // const errors = err.response.data.errors;
    // if (errors) {
    //   errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    // }
    dispatch({
      type: SHOPS_ERROR,
    });
  }
};



// changeStatus

// Delete Shops
export const deleteShop= (id) => async (dispatch) => {
  dispatch({ type: SHOPS_LOADING });

  try {
    const res = await axios.delete(`/api/store/${id}`);
    dispatch({
      type: SHOPS_DELETED,
      payload: res.data,
    });
    dispatch(setAlert(res.data.msg, "success"));
    dispatch(getAllStores());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: SHOPS_ERROR,
    });
  }
};


