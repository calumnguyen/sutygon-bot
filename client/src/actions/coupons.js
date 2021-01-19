import axios from "axios";
import {
 GET_COUPONS,
  COUPON_ERROR,
  COUPON_LOADING,
  COUPON_SAVED,
  GET_COUPON,
  COUPON_DELETED,
  COUPON_UPDATED,
} from "./types";
import { setAlert } from "./alert";

// Add new Coupon
export const addNewCoupon = (product) => async (dispatch) => {
  dispatch({ type: COUPON_LOADING });
  try {
    const res = await axios.post("/api/coupons/add", product);
    dispatch({
      type: COUPON_SAVED,
    });

    dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PRODUCT_ERROR,
    });
  }
};

// get All Coupons
export const getAllCoupons = (page) => async (dispatch) => {
  dispatch({ type: COUPON_LOADING });
  try {
    const currentPage = page || 1;
    const res = await axios.post(`/api/coupons/`,{currentPage:currentPage});
    dispatch({
      type: GET_COUPONS,
      payload: {
        products: res.data.products,
        total: res.data.total,
      },
    });
  } catch (err) {
    dispatch({
      type: COUPON_ERROR,
      payload: err.response,
    });
  }
};


export const getCouponById = (id) => async (dispatch) => {
  dispatch({ type: PRODUCTS_LOADING });

  try {
    const res = await axios.get(`/api/coupons/${id}`);
    dispatch({
      type: GET_COUPON,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: COUPON_ERROR,
      payload: err.response,
    });
  }
};

// Update Coupon
export const updateCoupon = (product, id) => async (dispatch) => {
  dispatch({ type: PRODUCTS_LOADING });

  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  try {
    const res = await axios.post(`/api/coupons/${id}`, product, config);

    dispatch({
      type: COUPON_UPDATED,
      payload: res.data,
    });
    dispatch(setAlert(res.data.msg, "success"));
    dispatch(getAllCoupons());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: COUPON_ERROR,
    });
  }
};
// changeStatus




// Delete Coupon
export const deleteCoupon = (id) => async (dispatch) => {
  dispatch({ type: PRODUCTS_LOADING });

  try {
    const res = await axios.delete(`/api/coupons/${id}`);
    dispatch({
      type: COUPON_DELETED,
      payload: res.data,
    });
    dispatch(setAlert(res.data.msg, "success"));
    dispatch(getAllCoupons());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: COUPON_ERROR,
    });
  }
};
