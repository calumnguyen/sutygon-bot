import {
    GET_RENTPRODUCTS,
    RENTPRODUCTS_ERROR,
   RENTPRODUCT_LOADING,
   RENTPRODUCT_SAVED,
    GET_RENTPRODUCT,
    GET_LASTRECORD,
   RENTPRODUCT_DELETED,
  } from "../actions/types";
  const initialState = {
    rentproduct: null,
    lastrecord:null,
    rentproducts: null,
    loading: false,
    // saved: false,
    generateInvoice:false,
    error: {},
  };
  
  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case RENTPRODUCT_LOADING:
        return {
          ...state,
          loading: true,
          generateInvoice:false

        };
  
      case GET_RENTPRODUCTS:
        return {
          ...state,
          rentproducts: payload,
          loading: false,
          // saved: false,
        };
  
      case GET_RENTPRODUCT:
        return {
          ...state,
          rentproduct: payload,
          loading: false,
        };
        case GET_LASTRECORD:
          return {
            ...state,
            lastrecord: payload,
            loading: false,
          };

  
      case RENTPRODUCT_SAVED:
        return {
          ...state,
          // saved: true,
          loading: false,
          generateInvoice:true
        };
      case RENTPRODUCTS_ERROR:
        return {
          ...state,
          error: payload,
          loading: false,
        };
  
      case RENTPRODUCT_DELETED:
        return {
          ...state,
          loading: false,
          generateInvoice:false

        };
      default:
        return state;
    }
  }
  