import {
  GET_SHOPS,
  SHOPS_ERROR,
  SHOPS_LOADING,
  SHOPS_SAVED,
  GET_SHOP,
  SHOPS_DELETED,
  SHOPS_UPDATED,
  STORE_LOADED,
  GET_STORES
} from "../actions/types";
const initialState = {
  shop: null,
  shops: null,
  shops_total: null,
  loading: false,
  saved: false,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SHOPS_LOADING:
      return {
        ...state,
        loading: true,
        saved: false,
      };

    case GET_STORES:
      return {
        ...state,
        shops: payload.stores,
        // shops_total: payload.total,
        loading: false,
        saved: false,
      };

    case GET_SHOP:
      return {
        ...state,
        shop: payload,
        loading: false,
        saved: false,
      };
      case STORE_LOADED:
        return {
          ...state,
          loading: false,
          shop: payload,
        };
    case SHOPS_SAVED:
      return {
        ...state,
        saved: true,
        loading: false,
      };
    case SHOPS_UPDATED:
      return {
        ...state,
        saved: true,
        loading: false,
        generateReturnInvoice: true,
      };
    case SHOPS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    case SHOPS_DELETED:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
