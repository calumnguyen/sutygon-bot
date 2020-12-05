import {
    GET_CUSTOMERS,
    CUSTOMERS_ERROR,
   CUSTOMER_LOADING,
   CUSTOMER_SAVED,
    GET_CUSTOMER,
   CUSTOMER_DELETED,
   SEARCHED_CUSTOMER,
  } from "../actions/types";
  const initialState = {
    customer: null,
    customers: null,
    loading: false,
    saved: false,
    searchedCustomer:null,
    error: {},
  };
  
  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case CUSTOMER_LOADING:
        return {
          ...state,
          loading: true,
        };
  
      case GET_CUSTOMERS:
        return {
          ...state,
          customers: payload,
          loading: false,
          saved: false,
        };
        case SEARCHED_CUSTOMER:
          return {
            ...state,
            searchedCustomer: payload,
            loading: false,
            saved: false,
          };
  
      case GET_CUSTOMER:
        return {
          ...state,
          customer: payload,
          loading: false,
        };
  
      case CUSTOMER_SAVED:
        return {
          ...state,
          saved: true,
          loading: false,
        };
      case CUSTOMERS_ERROR:
        return {
          ...state,
          error: payload,
          loading: false,
        };
  
      case CUSTOMER_DELETED:
        return {
          ...state,
          loading: false,
        };
      default:
        return state;
    }
  }
  