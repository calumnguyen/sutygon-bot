import axios from "axios";
import {
  PRODUCT_LOADING,
  PRODUCT_SAVED,
  PRODUCT_ERROR,
  GET_PRODUCTS,
  GET_PRODUCT,
  PRODUCTS_ERROR,
  PRODUCTS_LOADING,
  PRODUCT_DELETED,
  PRODUCT_UPDATED,
} from "./types";
import { setAlert } from "./alert";

// Add new product
export const addNewProduct = (product) => async (dispatch) => {
  dispatch({ type: PRODUCT_LOADING });
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  try {
    const res = await axios.post("/api/products/add", product, config);

    dispatch({
      type: PRODUCT_SAVED,
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

// get All Users
export const getAllProducts = (page) => async (dispatch) => {
  dispatch({ type: PRODUCT_LOADING });
  try {
    const currentPage = page || 1;
    const res = await axios.get(`/api/products/${currentPage}`);
    dispatch({
      type: GET_PRODUCTS,
      payload: {
        products: res.data.products,
        total: res.data.total,
      },
    });
  } catch (err) {
    dispatch({
      type: PRODUCTS_ERROR,
      payload: err.response,
    });
  }
};

// Find products
export const findProducts = (search) => async (dispatch) => {
  dispatch({ type: PRODUCT_LOADING });
  try {
    const res = await axios.get(`/api/products/search/${search}`);

    dispatch({
      type: GET_PRODUCTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCTS_ERROR,
      payload: err.response,
    });
  }
};

// Find products
export const searchBarcode = (search) => async (dispatch) => {
  dispatch({ type: PRODUCT_LOADING });
  try {
    const res = await axios.get(`/api/products/searchBarcode/${search}`);

    dispatch({
      type: GET_PRODUCTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCTS_ERROR,
      payload: err.response,
    });
  }
};

export const getProduct = (name) => async (dispatch) => {
  dispatch({ type: PRODUCTS_LOADING });

  try {
    const res = await axios.get(`/api/products/${name}`);
    dispatch({
      type: GET_PRODUCT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCTS_ERROR,
      payload: err.response,
    });
  }
};

export const getProductById = (id) => async (dispatch) => {
  dispatch({ type: PRODUCTS_LOADING });

  try {
    const res = await axios.get(`/api/products/${id}`);
    dispatch({
      type: GET_PRODUCT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCTS_ERROR,
      payload: err.response,
    });
  }
};

// Update product

export const updateProduct = (product, id) => async (dispatch) => {
  dispatch({ type: PRODUCTS_LOADING });

  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  try {
    const res = await axios.post(`/api/products/${id}`, product, config);

    dispatch({
      type: PRODUCT_UPDATED,
      payload: res.data,
    });
    dispatch(setAlert(res.data.msg, "success"));
    dispatch(getAllProducts());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PRODUCTS_ERROR,
    });
  }
};
// changeStatus

export const changeStatus = (status, id) => async (dispatch) => {
  dispatch({ type: PRODUCTS_LOADING });

  try {
    const res = await axios.post(`/api/products/changeStatus/${id}/${status}`);

    dispatch({
      type: PRODUCT_UPDATED,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PRODUCTS_ERROR,
    });
  }
};

export const barcodeUpdateProduct = (product, id) => async (dispatch) => {
  dispatch({ type: PRODUCTS_LOADING });

  try {
    // const res = await axios.post(`/api/products/${id}`,product, config);
    const res = await axios.post(`/api/products/barcode_update/${id}`, product);

    dispatch({
      type: PRODUCT_UPDATED,
      payload: res.data,
    });
    dispatch(setAlert(res.data.msg, "success"));
    dispatch(getAllProducts());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PRODUCTS_ERROR,
    });
  }
};

export const deleteItem = (product, id) => async (dispatch) => {
  dispatch({ type: PRODUCTS_LOADING });

  try {
    const res = await axios.post(`/api/products/item_delete/${id}`, product);

    dispatch({
      type: PRODUCT_UPDATED,
      payload: res.data,
    });
    dispatch(setAlert(res.data.msg, "success"));
    dispatch(getAllProducts());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PRODUCTS_ERROR,
    });
  }
};

// Update User
export const updateProductIndex = (product, id) => async (dispatch) => {
  dispatch({ type: PRODUCTS_LOADING });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify(product);
  try {
    const res = await axios.post(
      `/api/products/index_update/${id}`,
      body,
      config
    );

    dispatch({
      type: PRODUCT_UPDATED,
      payload: res.data,
    });
    dispatch(setAlert(res.data.msg, "success"));
    dispatch(getAllProducts());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PRODUCTS_ERROR,
    });
  }
};

// Delete User
export const deleteProduct = (id) => async (dispatch) => {
  dispatch({ type: PRODUCTS_LOADING });

  try {
    const res = await axios.delete(`/api/products/${id}`);
    dispatch({
      type: PRODUCT_DELETED,
      payload: res.data,
    });
    dispatch(setAlert(res.data.msg, "success"));
    dispatch(getAllProducts());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PRODUCTS_ERROR,
    });
  }
};
