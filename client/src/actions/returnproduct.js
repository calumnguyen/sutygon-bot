import axios from "axios";
import {
  RETURNPRODUCT_LOADING,
  RETURNPRODUCT_ERROR,
  GET_RETURNPRODUCT,
  GET_RETURNORDER,
 
} from "./types";
 // Get Order by Customer number
export const getOrderbyCustomerNumber = (number) => async (dispatch) => {
  dispatch({ type:RETURNPRODUCT_LOADING });

    try { 
 
    const res = await axios.get(`/api/returnproducts/searchbyContactNumber`, {
      params: {
        "number": number,
      } }
    )
 
      dispatch({
      type: GET_RETURNORDER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type:RETURNPRODUCT_ERROR,
      payload: err.response,
    });
  }
};


 // Get Customer
 export const getOrderbyOrder = (orderNumber) => async (dispatch) => {
  dispatch({ type:RETURNPRODUCT_LOADING });

    try { 
 
    const res = await axios.get(`/api/returnproducts/searchbyOrderNumber`, {
      params: {
        "orderNumber": orderNumber,
      } }
    )
 
      dispatch({
      type: GET_RETURNORDER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type:RETURNPRODUCT_ERROR,
      payload: err.response,
    });
  }
};


 // Get Customer
 export const getOrderbyOrderNumber = (orderNumber) => async (dispatch) => {
  dispatch({ type:RETURNPRODUCT_LOADING });

    try { 
 
    const res = await axios.get(`/api/returnproducts/searchbyOrderNumber`, {
      params: {
        "orderNumber": orderNumber,
      } }
    )
      dispatch({
      type: GET_RETURNORDER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type:RETURNPRODUCT_ERROR,
      payload: err.response,
    });
  }
};
// Get Order by ID
export const getOrderbyID = (id) => async (dispatch) => {
  dispatch({ type: RETURNPRODUCT_LOADING });
 
  try {
    const res = await axios.get(`/api/returnproducts/${id}`);
    dispatch({
      type: GET_RETURNPRODUCT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: RETURNPRODUCT_ERROR,
      payload: err.response,
    });
  }
};
