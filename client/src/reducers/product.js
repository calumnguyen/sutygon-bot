import {
    GET_PRODUCTS,
    PRODUCTS_ERROR,
   PRODUCT_LOADING,
   PRODUCT_SAVED,
    GET_PRODUCT,
   PRODUCT_DELETED,
   PRODUCT_UPDATED,
  } from "../actions/types";
  const initialState = {
    product: null,
    products: null,
    loading: false,
    saved: false,
    generateReturnInvoice:false,
    error: {},
  };
  
  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case PRODUCT_LOADING:
        return {
          ...state,
          loading: true,
          saved: false,

        };
  
      case GET_PRODUCTS:
        return {
          ...state,
          products: payload,
          loading: false,
          saved: false,
          generateReturnInvoice:false,

        };
  
      case GET_PRODUCT:
        return {
          ...state,
          product: payload,
          loading: false,
          generateReturnInvoice:false,
          saved: false,


        };
  
      case PRODUCT_SAVED:
        return {
          ...state,
          saved: true,
          loading: false,
        };
        case PRODUCT_UPDATED:
          return {
            ...state,
            saved: true,
            loading: false,
            generateReturnInvoice:true,
          };
      case PRODUCTS_ERROR:
        return {
          ...state,
          error: payload,
          loading: false,
        };
  
      case PRODUCT_DELETED:
        return {
          ...state,
          loading: false,
        };
      default:
        return state;
    }
  }
  