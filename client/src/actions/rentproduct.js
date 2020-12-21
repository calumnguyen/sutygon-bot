import axios from 'axios'
import {
  RENTPRODUCT_LOADING,
  RENTPRODUCT_SAVED,
  RENTPRODUCT_ERROR,
  GET_RENTPRODUCT,
  GET_RENTPRODUCTS,
  GET_LASTRECORD,
  RENTPRODUCTS_ERROR,
  RENTPRODUCTS_LOADING,
  RENTPRODUCT_DELETED,
  RENTPRODUCT_UPDATED,
  RENTPRODUCT_READY,
  RENTPRODUCT_ACTIVE,
  RENTPRODUCT_ITEMS,
  GET_CUSTOMER,
  CUSTOMER_LOADING,
  CUSTOMER_ERROR,
  RENTPRODUCT_STATUS_SEARCH,
} from './types'
import { setAlert } from './alert'

// Add new product
export const addNewRentProduct = (product) => async (dispatch) => {
  dispatch({ type: RENTPRODUCT_LOADING })

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const body = JSON.stringify(product)
  try {
    const res = await axios.post('/api/rentedproducts/add', body, config)

    dispatch({
      type: RENTPRODUCT_SAVED,
    })

    dispatch(setAlert(res.data.msg, 'success'))
  } catch (err) {
    const errors = err.response.data.errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }
    dispatch({
      type: RENTPRODUCT_ERROR,
    })
  }
}

// get All Products
export const getAllRentedProducts = () => async (dispatch) => {
  dispatch({ type: RENTPRODUCT_LOADING })
  try {
    const res = await axios.get(`/api/rentedproducts`)

    dispatch({
      type: GET_RENTPRODUCTS,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: RENTPRODUCTS_ERROR,
      payload: err.response,
    })
  }
}

// Get Order by id.
export const getOrderById = (id) => async (dispatch) => {
  dispatch({ type: RENTPRODUCTS_LOADING })
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const res = await axios.get(`/api/rentedproducts/${id}`, config)

    dispatch({
      type: GET_RENTPRODUCT,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: RENTPRODUCTS_ERROR,
      payload: err.response,
    })
  }
}

// Get User by Product
export const getLastRecord = () => async (dispatch) => {
  dispatch({ type: RENTPRODUCTS_LOADING })
  try {
    const res = await axios.get(`/api/rentedproducts/getLastRecord`)
    dispatch({
      type: GET_LASTRECORD,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: RENTPRODUCTS_ERROR,
      payload: err.response,
    })
  }
}

// Update User
export const updateRentedProduct = (product, id) => async (dispatch) => {
  dispatch({ type: RENTPRODUCTS_LOADING })
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const body = JSON.stringify(product)
  try {
    const res = await axios.post(`/api/rentedproducts/${id}`, body, config)

    dispatch({
      type: RENTPRODUCT_UPDATED,
      payload: res.data,
    })
    dispatch(setAlert(res.data.msg, 'success'))
    // dispatch(getAllProducts());
  } catch (err) {
    const errors = err.response.data.errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }
    dispatch({
      type: RENTPRODUCTS_ERROR,
    })
  }
}

// Delete User
export const deleteRentedProduct = (id) => async (dispatch) => {
  dispatch({ type: RENTPRODUCTS_LOADING })
  try {
    const res = await axios.delete(`/api/rentedproducts/${id}`)
    dispatch({
      type: RENTPRODUCT_DELETED,
      payload: res.data,
    })
    dispatch(setAlert(res.data.msg, 'success'))
    dispatch(getAllRentedProducts())
  } catch (err) {
    const errors = err.response.data.errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }
    dispatch({
      type: RENTPRODUCTS_ERROR,
    })
  }
}

// Get Customer
export const getCustomer = (number) => async (dispatch) => {
  dispatch({ type: CUSTOMER_LOADING })

  try {
    const res = await axios.get(`/api/rentedproducts/search`, {
      params: {
        number: number,
      },
    })

    dispatch({
      type: GET_CUSTOMER,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: CUSTOMER_ERROR,
      payload: err.response,
    })
  }
}

// Change order status to ready.
export const orderStatusReady = (id) => async (dispatch) => {
  dispatch({ type: RENTPRODUCTS_LOADING })
  try {
    const res = await axios.post(`/api/rentedproducts/${id}/status/ready`)

    dispatch({
      type: RENTPRODUCT_READY,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: RENTPRODUCTS_ERROR,
      payload: err.response,
    })
  }
}

// Change order status to active.
export const orderStatusActive = (id) => async (dispatch) => {
  dispatch({ type: RENTPRODUCTS_LOADING })
  try {
    const res = await axios.post(`/api/rentedproducts/${id}/status/active`)

    dispatch({
      type: RENTPRODUCT_ACTIVE,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: RENTPRODUCTS_ERROR,
      payload: err.response,
    })
  }
}

// get order items.
export const getOrderItems = (id) => async (dispatch) => {
  dispatch({ type: RENTPRODUCTS_LOADING })
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const res = await axios.get(`/api/rentedproducts/${id}/orderitems`, config)

    dispatch({
      type: RENTPRODUCT_ITEMS,
      payload: res.data,
    })
  } catch (err) {
    dispatch({
      type: RENTPRODUCTS_ERROR,
      payload: err.response,
    })
  }
}

// order search by status
//api/rentproducts/searchstatus
export const getOrderSearchStatus = (status) => async (dispatch) => {
  dispatch({ type: RENTPRODUCTS_LOADING })
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const body = JSON.stringify(status)

    const res = await axios.put(
      `/api/rentedproducts/searchstatus`,
      body,
      config
    )

    dispatch({
      type: RENTPRODUCT_STATUS_SEARCH,
      payload: res.data,
    })
  } catch (err) {
   const errors = err.response.data.errors
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'warning')))
    }
    dispatch({
      type: RENTPRODUCTS_ERROR,
    })
  }
}
