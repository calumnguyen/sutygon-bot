import {

  USER_LOADING,
  USER_DELETED,
  GET_USER,
  USER_ERROR,
  USER_UPDATED,
  USER_SAVED,
  GET_USERS

} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  profile: null,
  users: null,
  loading: false,
  error: {},
  saved: false,
  user:null,
  resetToken: null,
  passwordUpdated: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADING:
      return {
        ...state,
        loading: true,
        saved: false,


      };
     case GET_USERS:
      return {
        ...state,
        users: payload,
        loading: false,
        saved: false,

      };
    case GET_USER:
      return {
        ...state,
        profile: payload,
        loading: false,
        saved: false,

      };

      case USER_SAVED:
        return {
          ...state,
          user:payload,
          saved: true,
          loading: false,
         
        }

    case USER_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        saved: false,

      };

    
    case USER_UPDATED:
      return {
        ...state,
        // users: payload,
        loading: false,
        passwordUpdated: true,
      };
    case USER_DELETED:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}