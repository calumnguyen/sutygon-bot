import axios from "axios";
import {
    Admin_LOADING,
    Admin_SAVED,
    Admin_ERROR,
    GET_Admins,
    GET_Admin,
    admin_Update
} from "./types";
import { setAlert } from "./alert";

// get All Users
export const getAllAdminList = () => async (dispatch) => {
    dispatch({ type: Admin_LOADING });
    try {
        const res = await axios.get(`/api/admins/get_all_admins`);
        if (res.data) {
            console.log("step", res.data)
            dispatch({
                type: GET_Admins,
                payload: res.data,
            });
        }
    } catch (err) {
        dispatch({
            type: Admin_ERROR,
            payload: err.response,
        });
    }

    
};

export const onStatusUpdate = (id,status) => async (dispatch) => {
  dispatch({ type: Admin_LOADING });

  try {
    const res = await axios.post(`/api/admins/update_account_status`,  {userId:id,status:status});

    dispatch({
      type: admin_Update,
      payload: res.data,
    });
    dispatch(setAlert(res.data.msg, "success"));
    dispatch(getAllAdminList());

  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: Admin_ERROR,
    });
  }
};