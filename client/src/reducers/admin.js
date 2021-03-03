import {
  Admin_LOADING,
  Admin_SAVED,
  Admin_ERROR,
  GET_Admins,
  GET_Admin,
  admin_Update,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  profile: null,
  admins: null,
  loading: false,
  error: {},
  saved: false,
  user: null,
  resetToken: null,
  passwordUpdated: false,
  codeverified: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case Admin_LOADING:
      return {
        ...state,
        loading: true,
        saved: false,
        passwordUpdated: false,
      };
    case GET_Admins:
      return {
        ...state,
        admins: payload,
        loading: false,
        saved: false,
      };

    case admin_Update:
      return {
        ...state,
        loading: false,
        saved: true,
      };

    default:
      return state;
  }
}
