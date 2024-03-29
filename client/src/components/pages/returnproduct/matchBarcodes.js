import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import {
  getAllProductsAll,
  getProductById,
  updateProductIndex,
} from "../../../actions/product";
import { getCustomer } from "../../../actions/customer";
import { addNewInvoice } from "../../../actions/invoices";
import { updateRentedProduct } from "../../../actions/rentproduct";
import Loader from "../../layout/Loader";
import * as moment from "moment";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "../../../custom.css";
import ChargeModal from "./ChargeModal";
import axios from "axios";
import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";
var JsBarcode = require("jsbarcode");

class MatchBarcodes extends Component {
  state = {
    customer: "",
    barcodesArray: "",
    taxAmt: "",
    customer: "",
    order: "",
    missingItmCharges: "",
    customerOwe: "",
    insuranceAmt: "",
    orderNumber: "",
    leaveID: "",
    returnAmt: "",
    totalPaid: "",
    orderBarcode: "",
    product_Array: "",
    m_product: "",
    m_productarray: "",
    m_total: "",

    generateInvoice: true,
    discount_data: [],
    charge_data: [],
    name: "",
    category: "",
    amount: "",
    d_name: "",
    d_category: "",
    d_amount: "",
    openModal: false,
    modal_type: "",
    allCategoryList: [],
    sum_of_all_items: "",
  };
  async componentDidMount() {
    await this.props.getAllProductsAll();
    const { state } = this.props.location;
    if (state) {
      this.setState({
        customer: state.customer,
        order: state.order,
        insuranceAmt: state.order[0].insuranceAmt,
        barcodesArray: state.barcodesArray,
        taxAmt: state.order[0].taxAmt,
        totalPaid: state.order[0].total,
        leaveID: state.order[0].leaveID,
      });
    }
  }

  handleChange = (e, id = "") => {
    this.setState({ [e.target.name]: e.target.value });
    this.customerOwe();
    this.returnAmt();
  };
  // return sorted products for barcodes
  getSortedData = (products) => {
    // looping through prducts
    let rows = [];
    products.forEach((product, p_index) => {
      let product_name = product.name;
      let product_id = product._id;

      // looping through each color of current product
      if (product.color) {
        product.color.forEach((color, c_index) => {
          let color_name = color.colorname;
          let color_id = color._id;

          // looping through sizes of current color
          if (color.sizes) {
            color.sizes.forEach((size, s_index) => {
              let size_name = size.size;
              let size_id = size.id;
              let price = size.price;
              let length;
              // show sizes with barcode
              if (size.barcodes) {
                length = size.barcodes.length;
              } else {
                length = 0;
              }

              let i;
              for (i = 0; i < length; i++) {
                let row = {
                  product_id: product_id,
                  color_id: color_id,
                  size_id: size_id,
                  barcodeIndex: i, // will be used to identify index of barcode when changeBarcode is called
                  title: product_name,
                  barcode: size.barcodes[i].barcode,
                  color: color_name,
                  size: size_name,
                  price: price,
                };
                rows.push(row);
              }
            });
          }
        });
      }
    }); // products foreach ends here
    return rows;
  };
  getMissingItemTotal = () => {
    let m_total = "";
    const { m_productarray } = this.state;
    m_productarray.forEach((element, element_i) => {
      m_total = Number(m_total) + Number(element[0].price);
    });
    this.state.m_total = m_total;
    return m_total;
  };
  customerOwe = () => {
    const { insuranceAmt, m_total } = this.state;
    let customerOwe;
    if (m_total > insuranceAmt) {
      customerOwe = Number(m_total) - Number(insuranceAmt);
    } else if (insuranceAmt >= m_total) {
      customerOwe = Number(insuranceAmt) - Number(m_total);
    }
    return customerOwe;
  };

  returnAmt = () => {
    const { insuranceAmt, m_total } = this.state;
    let returnAmt;
    if (m_total > insuranceAmt) {
      returnAmt = Number(m_total) - Number(insuranceAmt);
    } else if (insuranceAmt >= m_total) {
      returnAmt = Number(insuranceAmt) - Number(m_total);
    }
    return returnAmt;
  };

  finalInVoiceTotal = () => {
    const { totalPaid, insuranceAmt, missingItmCharges } = this.state;
    const finalInVoiceTotal = Number(
      Number(totalPaid) - Number(insuranceAmt) + Number(missingItmCharges)
    );
    return finalInVoiceTotal;
  };

  parseReturnedOrderItemsArray = (orderItemsArray) => {
    // const { product_Array: orderItemsArray } = this.state;
    const result = [];

    if (orderItemsArray)
      orderItemsArray.forEach((item) => {
        const orderItem = item[0] || item;

        const returnedBarcode = this.state.barcodesArray?.filter(
          (bItem) => bItem.barcode == orderItem.barcode
        )[0];
        const qty = returnedBarcode ? returnedBarcode.qty : 1;
        result.push({
          ...orderItem,
          qty: qty,
          price: orderItem.price * qty,
        });
      });
    return result;
  };

  getParsedOrderItemsArray = () => {
    const parsedOrderItems = [];
    const orderBarcodeItems = this.state.order[0]?.orderItems;
    const { products } = this.props;

    if (products && orderBarcodeItems) {
      const sortedItems = this.getSortedData(products);

      orderBarcodeItems.forEach((item) => {
        const orderItem = sortedItems.filter(
          (product) => product.barcode == item.barcode
        )[0];
        if (orderItem) {
          const qty = item.orderQty || 1;
          parsedOrderItems.push({
            ...orderItem,
            qty: qty,
            price: orderItem.price * qty,
          });
        }
      });
    }
    return parsedOrderItems;
  };

  getMissingProductsList = () => {
    const { orderItems } = this.props.location.state.order[0];
    const { barcodesArray } = this.state;
    const { orderedBarcode } = this.props.location?.state;
    const { products } = this.props;
    const itemsList = [];
    const missingItemsArray = [];

    if (products && barcodesArray) {
      const sortedArray = this.getSortedData(products);

      orderItems.forEach((item) => {
        barcodesArray.forEach((barcode) => {
          if (barcode.barcode == item.barcode) item.returnedQty = barcode.qty;
        });
      });

      orderItems.forEach((orderItem) => {
        const productItem = sortedArray.filter(
          (item) => item.barcode == orderItem.barcode
        )[0];
        if (!orderItem.returnedQty) {
          missingItemsArray.push({
            ...productItem,
            qty: orderItem.orderQty,
            price: productItem.price * orderItem.orderQty,
          });
        } else if (orderItem.returnedQty < orderItem.orderQty) {
          const missingQty = orderItem.orderQty - orderItem.returnedQty;
          missingItemsArray.push({
            ...productItem,
            qty: missingQty,
            price: productItem.price * missingQty,
          });
        }
      });
    }
    return missingItemsArray;
  };

  productBox = () => {
    let productarray = [];
    let { barcodesArray } = this.state;
    const { products } = this.props;
    if (products && barcodesArray) {
      let sortedAray = this.getSortedData(products);
      if (sortedAray) {
        barcodesArray.forEach((element) => {
          productarray.push(
            sortedAray.filter((f) => f.barcode.toString() === element.barcode)
          );
        });
      }
    }
    if (productarray.length) {
      let sum_of_all_items = productarray
        .map((p) => Number(p[0].price))
        .reduce((a2, b2) => a2 + b2);
      this.state.sum_of_all_items = sum_of_all_items;
    }
    productarray = this.parseReturnedOrderItemsArray(productarray);
    this.state.product_Array = productarray;

    const getProductQuantity = (product) => {
      const { barcodesArray } = this.state;
      let selectedItem;
      barcodesArray.forEach((item) => {
        if (item.barcode == product.barcode) {
          selectedItem = item;
        }
      });
      return selectedItem.qty;
    };

    return productarray.map((b, b_index) => (
      <>
        <div id="sizes_box" key={b_index}>
          <div className="row">
            <div style={{ float: "left", width: "90%" }}>
              <div className="overflow-x-scroll">
                <table
                  className="table table-bordered table-light"
                  style={{
                    borderWidth: "1px",
                    borderColor: "#aaaaaa",
                    borderStyle: "solid",
                  }}
                >
                  <thead></thead>
                  <tbody>
                    <tr key={b_index} style={{ margin: "3px" }}>
                      <td className="text-center">{b.barcode}</td>
                      <td className="text-center">{b.title}</td>
                      <td className="text-center">{b.color}</td>
                      <td className="text-center">{b.size}</td>
                      <td className="text-center">{b.qty}</td>
                      <td className="text-center">{b.price}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="right ml-2">
              <button
                type="button"
                className="btn btn-raised btn-sm btn-icon mt-1"
              >
                <i className="fa fa-check fa-2x text-success"></i>
              </button>
            </div>
          </div>
        </div>
      </>
    ));
  };

  missingProducts = () => {
    const m_productarray = this.getMissingProductsList();

    if (m_productarray.length)
      return m_productarray.map((m_product, m_product_index) => (
        <>
          <div id="sizes_box" key={m_product_index}>
            <div className="row">
              <div style={{ float: "left", width: "90%" }}>
                <div className="overflow-x-scroll">
                  <table
                    className="table table-bordered table-light"
                    style={{
                      borderWidth: "1px",
                      borderColor: "#aaaaaa",
                      borderStyle: "solid",
                    }}
                  >
                    <thead></thead>
                    <tbody>
                      <tr key={m_product_index} style={{ margin: "3px" }}>
                        <td className="text-center">{m_product.barcode}</td>
                        <td className="text-center">{m_product.title}</td>
                        <td className="text-center">{m_product.color}</td>
                        <td className="text-center">{m_product.size}</td>
                        <td className="text-center">{m_product.qty}</td>
                        <td className="text-center">{m_product.price}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <br />
              </div>

              <div className="right ml-3">
                <button
                  type="button"
                  className="btn btn-raised btn-sm btn-icon btn-danger mt-2"
                >
                  <i className="fa fa-minus text-white"></i>
                </button>
              </div>
              <br />
            </div>
          </div>
        </>
      ));
  };

  invoiceproductBox = () => {
    const { product_Array } = this.state;
    return product_Array.map((b, b_index) => (
      <>
        <tr key={b_index}>
          <td className="text-center">{b.barcode} </td>
          <td className="text-center">{b.title}</td>
          <td className="text-center">{b.color} </td>
          <td className="text-center">{b.price} </td>
        </tr>
      </>
    ));
  };

  m_invoiceproductBox = () => {
    const { m_productarray } = this.state;
    return m_productarray.map((b, b_index) => (
      <>
        <tr key={b_index}>
          <td className="text-center">{b.barcode} </td>
          <td className="text-center">{b.title}</td>
          <td className="text-center">{b.color} </td>
          <td className="text-center">{b.price} </td>
        </tr>
      </>
    ));
  };

  onSubmit = async (e) => {
    e.preventDefault();
    // alert("hi")

    const state = { ...this.state };
    let sum_discount = 0;
    let sum_charges = 0;
    if (state.discount_data.length) {
      sum_discount = state.discount_data
        .map((c) => Number(c.amount))
        .reduce((a1, b1) => a1 + b1);
    }
    if (state.charge_data.length) {
      sum_charges = state.charge_data
        .map((d) => Number(d.amount))
        .reduce((a2, b2) => a2 + b2);
    }
    const { order } = this.props.location.state;
    const { user } = this.props.auth;
    this.props.history.push("returnSummary", {
      sum_discount,
      sum_charges,
      charge_data: state.charge_data,
      discount_data: state.discount_data,
      orderNumber: order[0].orderNumber,
      user_id: user._id,
      order: order[0],
      customer: order[0].customer,
      barcodesArray: this.state.barcodesArray,
      product_Array: this.getParsedOrderItemsArray(),
      sum_of_all_items: this.state.sum_of_all_items,
    });
  };

  getChargeDataRow = () => {
    let { charge_data } = this.state; // get all barcode
    if (charge_data) {
      return charge_data.map((charge, b_index) => (
        <tr key={b_index}>
          <th scope="row">{b_index + 1}</th>
          <td>{charge.name ? charge.name : ""}</td>
          <td>{charge.category ? charge.category : ""}</td>
          <td>{charge.amount ? charge.amount : ""}</td>
          <td>
            <button
              onClick={() => this.onRemoveRow(b_index, "charge")}
              type="button"
              className="btn btn-raised btn-sm btn-icon btn-default mt-1"
            >
              <i
                style={{ fontSize: "20px" }}
                className="fa fa-times  text-danger"
              ></i>
            </button>
          </td>
        </tr>
      ));
    }
  };

  getDiscountDataRow = () => {
    let { discount_data } = this.state; // get all barcode
    if (discount_data) {
      return discount_data.map((discount, b_index) => (
        <tr key={b_index}>
          <th scope="row">{b_index + 1}</th>
          <td>{discount.name ? discount.name : ""}</td>
          <td>{discount.category ? discount.category : ""}</td>
          <td>{discount.amount ? discount.amount : ""}</td>
          <td>
            <button
              onClick={() => this.onRemoveRow(b_index, "discount")}
              type="button"
              className="btn btn-raised btn-sm btn-icon btn-default mt-1"
            >
              <i
                style={{ fontSize: "20px" }}
                className="fa fa-times text-danger"
              ></i>
            </button>
          </td>
        </tr>
      ));
    }
  };
  onRemoveRow = (valueIndex, type) => {
    let { discount_data, charge_data } = this.state;
    if (type == "discount") {
      this.setState({
        discount_data: discount_data.filter((_, index) => index !== valueIndex),
      });
    }
    if (type == "charge") {
      this.setState({
        charge_data: charge_data.filter((_, index) => index !== valueIndex),
      });
    }
  };

  onAddCharge = async (type) => {
    let { name, category, amount } = this.state;
    var title = this.state.category;

    if (name == "") {
      OCAlert.alertError(`Cần điền tên`, { timeOut: 3000 });
      return;
    }
    if (category == "") {
      OCAlert.alertError(`Cần điền loại`, { timeOut: 3000 });
      return;
    }
    if (amount == "") {
      OCAlert.alertError(`Cần điền số tiền`, { timeOut: 3000 });
      return;
    }
    if (type == "charge") {
      this.setState({
        charge_data: [...this.state.charge_data, { name, category, amount }],
        name: "",
        category: "",
        amount: "",

        modal_type: "",
        openModal: false,
      });
    }
    if (type == "discount") {
      this.setState({
        discount_data: [
          ...this.state.discount_data,
          { name, category, amount },
        ],
        name: "",
        category: "",
        amount: "",
        openModal: false,
        modal_type: "",
      });
    }
    await axios.post(`/api/categories/add`, {
      title: title,
      type: type,
    });
  };
  handleClose = () => {
    this.setState({
      openModal: false,
      name: "",
      category: "",
      amount: "",
      modal_type: "",
    });
  };

  handleOpen = async (type) => {
    this.setState({ openModal: true, modal_type: type });
    const res = await axios.get(`/api/categories/${type}`);
    this.setState({ allCategoryList: res.data.catagories });
  };
  onHandleModalFields = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };

  onChangeCategory = (value, type) => {
    this.setState({ category: value });
  };
  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/login" />;
    }

    const { customer } = this.props;
    const { state } = this.props.location;
    const { user } = this.props.auth;
    if (this.props.saved === true) {
      return <Redirect to="/returnproduct" />;
    }

    const { order } = state;

    const { barcodesArray } = state;
    const { customerOwe, insuranceAmt, m_total } = this.state;

    const { orderItems } = order[0];

    let totalOrderQty = 0;
    orderItems.forEach((item) => {
      totalOrderQty += item.orderQty;
    });

    let returnedOrderQty = 0;
    barcodesArray.forEach((item) => (returnedOrderQty += parseInt(item.qty)));

    return (
      <React.Fragment>
        <Loader />
        <div className="wrapper menu-collapsed">
          <Sidebar location={this.props.location}></Sidebar>
          <Header></Header>
          <div className="main-panel">
            <div className="main-content">
              <div className="content-wrapper">
                <section id="form-action-layouts">
                  <div className="form-body">
                    <div className="card">
                      <div className="card-header">
                        <h4 className="form-section">Trả Đồ</h4>
                      </div>

                      <div className="card-body table-responsive">
                        <div id="colors_box">
                          <div className="row color-row">
                            <div className="col-md-12">
                              <div className="text-center">
                                <h2>Danh Sách Sản Phẩm Hoàn Trả</h2>
                                <br />
                              </div>
                              <div className="form-group">
                                <div style={{ float: "left" }}>
                                  <h3>
                                    {customer
                                      ? `${customer.name}${"#"}${
                                          customer.contactnumber
                                        }`
                                      : ""}
                                  </h3>
                                  <br />
                                </div>
                                <div className="text-center mb-4">
                                  <h3>
                                    {state
                                      ? `${"Đơn Hàng "} ${order[0].orderNumber}`
                                      : ""}
                                  </h3>
                                </div>
                              </div>
                            </div>

                            <form onSubmit={(e) => this.onSubmit(e)}>
                              <div className="text-left ml-5">
                                <p>
                                  Khách hàng đang hoàn trả{" "}
                                  <span style={{ color: "red" }}>
                                    {order && order.length > 0
                                      ? `${returnedOrderQty}${"/"}${totalOrderQty}`
                                      : `0`}{" "}
                                  </span>
                                  sản phẩm trong đơn hàng này.{" "}
                                </p>
                                <br />
                              </div>
                              <div className="col-md-12">
                                <div id="sizes_box">
                                  {this.productBox()}
                                  <br />
                                  {barcodesArray.length !==
                                  order[0].barcodes.length ? (
                                    <h3 className="ml-4">
                                      Khách Hàng Trả Thiếu
                                    </h3>
                                  ) : (
                                    ""
                                  )}
                                  {this.missingProducts()}

                                  <div className="row">
                                    <div className="col-md-11 ">
                                      <button
                                        type={"button"}
                                        className={"btn btn-info"}
                                        onClick={() =>
                                          this.handleOpen("charge")
                                        }
                                      >
                                        Thêm Kinh Phí
                                      </button>
                                    </div>
                                  </div>
                                  {this.state.charge_data.length > 0 && (
                                    <div className="row">
                                      <div className="col-md-11 ">
                                        <h4>
                                          <strong>Thêm Kinh Phí</strong>
                                        </h4>
                                        {/* zohaib */}
                                        <table className="table table-sm table-bordered table-striped">
                                          <thead>
                                            <tr>
                                              <th scope="col">#</th>
                                              <th scope="col">Tên Phí</th>
                                              <th scope="col">Loại</th>
                                              <th scope="col">Phí VNĐ</th>
                                              <th scope="col">Hành Động</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {this.getChargeDataRow()}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                  <br />
                                  <div className="row">
                                    <div className="col-md-11 ">
                                      <button
                                        type={"button"}
                                        className={"btn btn-info"}
                                        onClick={() =>
                                          this.handleOpen("discount")
                                        }
                                      >
                                        Thêm Giảm Giá
                                      </button>
                                    </div>
                                  </div>
                                  <ChargeModal
                                    openModal={this.state.openModal}
                                    modal_type={this.state.modal_type}
                                    handleClose={this.handleClose}
                                    name={this.state.name}
                                    category={this.state.category}
                                    amount={this.state.amount}
                                    onHandleModalFields={
                                      this.onHandleModalFields
                                    }
                                    allCategoryList={this.state.allCategoryList}
                                    onChangeCategory={this.onChangeCategory}
                                    onAddCharge={this.onAddCharge}
                                  />

                                  {this.state.discount_data.length > 0 && (
                                    <div className="row">
                                      <div className="col-md-11 ">
                                        <h4>
                                          <strong>Additional Discount</strong>
                                        </h4>
                                        {/* zohaib */}
                                        <table className="table table-sm table-bordered table-striped">
                                          <thead>
                                            <tr>
                                              <th scope="col">#</th>
                                              <th scope="col">Tên Phí</th>
                                              <th scope="col">Loại</th>
                                              <th scope="col">Giảm VNĐ</th>
                                              <th scope="col">Hành Động</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {this.getDiscountDataRow()}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                  <br />
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="form-group">
                                        {/* <div style={{ float: "left" }}>
                                          <h4 id="padLeft">
                                            Insurance return to customer
                                          </h4>
                                        </div> */}
                                        <div style={{ paddingLeft: "900px" }}>
                                          {/* <input
                                            name="insuranceAmt"
                                            style={{
                                              width: "85%",
                                              color: "black",
                                            }}
                                            type="text"
                                            className="form-control mm-input s-input text-center"
                                            placeholder="Total"
                                            id="setSizeFloat"
                                            readOnly
                                            value={
                                              this.state.order[0]
                                                ? this.state.order[0]
                                                    .insuranceAmt
                                                : ""
                                            }
                                            onChange={(e) =>
                                              this.handleChange(e)
                                            }
                                          /> */}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <br />

                                  {/* <div className="row">
                                    <div className="col-md-12">
                                      <div className="form-group">
                                        <div style={{ float: "left" }}>
                                          <h4 id="padLeft">Customer owe</h4>
                                        </div>
                                        <div style={{ paddingLeft: "700px" }}>
                                          <input
                                            name="customerOwe"
                                            style={{
                                              width: "85%",
                                              color: "black",
                                            }}
                                            type="text"
                                            className="form-control mm-input s-input text-center"
                                            placeholder="Total"
                                            id="setSizeFloat"
                                            required
                                            value={
                                              insuranceAmt
                                                ? `${this.customerOwe()}`
                                                : "0"
                                            }
                                            onChange={(e) =>
                                              this.handleChange(e)
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <br /> */}
                                  {/* 
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="form-group">
                                        <div style={{ float: "left" }}>
                                          <h4 id="padLeft"> Return customer</h4>
                                        </div>
                                        <div style={{ paddingLeft: "700px" }}>
                                          <input
                                            name="returnCustomer"
                                            style={{
                                              width: "85%",
                                              color: "black",
                                            }}
                                            type="text"
                                            className="form-control mm-input s-input text-center"
                                            placeholder=""
                                            id="setSizeFloat"
                                            value={
                                              insuranceAmt
                                                ? `${this.returnAmt()}`
                                                : "0"
                                            }
                                            onChange={(e) =>
                                              this.handleChange(e)
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div> */}
                                  <br />

                                  {/* <div className="row">
                                    <div className="col-md-12">
                                      <div className="form-group">
                                        <div className="text-center">
                                          <div style={{ float: "left" }}></div>
                                          <div
                                            style={{
                                              float: "center",
                                              paddingRight: "170px",
                                            }}
                                          >
                                            <h4>
                                              {order[0].leaveID &&
                                              order[0].leaveID === true
                                                ? `${"Customer left ID. Please return ID to customer."}`
                                                : `${"No ID"}`}
                                            </h4>{" "}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div> */}
                                  {/* <br /> */}
                                  <div className="col-md-12">
                                    <div id="sizes_box">
                                      <div className="row text-center">
                                        <div className="col-md-12 btn-cont">
                                          <div className="form-group">
                                            <button
                                              type="submit"
                                              className="btn btn-raised btn-primary round btn-min-width mr-1 mb-1"
                                              id="btnSize2"
                                            >
                                              <i className="ft-check"></i>Thanh
                                              Toán Tiền
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <footer className="footer footer-static footer-light">
              <p className="clearfix text-muted text-sm-center px-2">
                <span>
                  Quyền sở hữu của &nbsp;{" "}
                  <a
                    href="https://www.sutygon.com"
                    rel="noopener noreferrer"
                    id="pixinventLink"
                    target="_blank"
                    className="text-bold-800 primary darken-2"
                  >
                    SUTYGON-BOT{" "}
                  </a>
                  , All rights reserved.{" "}
                </span>
              </p>
            </footer>
          </div>
          {/* Invoice Modal */}
          <div
            className="modal fade text-left"
            id="primary"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="myModalLabel8"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header bg-primary white">
                  <h4 className="modal-title text-center" id="myModalLabel8">
                    Invoice
                  </h4>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div id="colors_box">
                    <div className="row color-row">
                      <div className="col-md-12">
                        <div className="text-center">
                          <h4>
                            {customer
                              ? `${customer.name}${"#"}${
                                  customer.contactnumber
                                }`
                              : ""}
                          </h4>
                        </div>
                        <div className="text-center">
                          <h4>
                            {state
                              ? `${"Order"}${"#"} ${order[0].orderNumber}`
                              : ""}
                          </h4>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div>
                          <table>
                            <thead></thead>
                            <tbody>{this.invoiceproductBox()}</tbody>
                          </table>
                          {!!this.state.m_productarray.length ? (
                            <h5>Missing Products</h5>
                          ) : (
                            ""
                          )}
                          {!!this.state.m_productarray.length ? (
                            <table>
                              <thead></thead>
                              <tbody>{this.m_invoiceproductBox()}</tbody>
                            </table>
                          ) : (
                            ""
                          )}

                          <div className="row">
                            <div
                              className="col-md-6"
                              style={{ float: "left", color: "black" }}
                            >
                              <h6 id="padLeft">Insurance amount</h6>
                            </div>
                            <div
                              className="col-md-6"
                              style={{ float: "right", color: "black" }}
                            >
                              <h6>{this.state.insuranceAmt}</h6>
                            </div>
                          </div>

                          <div className="row justify-content-center">
                            <div className="form-group">
                              <div
                                className="text-center"
                                style={{ width: "300%" }}
                              >
                                <input
                                  type="text"
                                  className="form-control mm-input s-input text-center"
                                  placeholder="Total"
                                  style={{ color: "black" }}
                                  id="setSizeFloat"
                                  readOnly
                                  value={`${"PAID TOTAL: $"}${
                                    this.state.totalPaid
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div
                              className="col-md-6"
                              style={{ float: "left", color: "black" }}
                            >
                              <h6>Lost Items Charge</h6>
                            </div>

                            <div
                              className="col-md-6"
                              style={{ float: "right", color: "black" }}
                            >
                              <h6>
                                {this.state.missingItmCharges &&
                                  this.state.missingItmCharges}
                              </h6>
                            </div>
                          </div>

                          <div className="row">
                            <div
                              className="col-md-6"
                              style={{ float: "left", color: "black" }}
                            >
                              <h6 id="padLeft">Amount Return to customer</h6>
                            </div>
                            <div
                              className="col-md-6"
                              style={{ float: "right", color: "black" }}
                            >
                              <h6>
                                {customerOwe && insuranceAmt && m_total
                                  ? `${this.returnAmt()}`
                                  : "0"}
                              </h6>
                            </div>
                          </div>

                          <br />

                          <div className="row">
                            <div
                              className="col-md-6"
                              style={{ float: "left", color: "black" }}
                            >
                              <h6 id="padLeft">Leave ID</h6>
                            </div>
                            <div
                              className="col-md-6"
                              style={{ float: "right", color: "black" }}
                            >
                              <h6>
                                {this.state.leaveID === "true"
                                  ? `${"Yes"}`
                                  : `${"No"}`}
                              </h6>
                            </div>
                          </div>

                          <div className="row">
                            <div
                              className="col-md-6"
                              style={{ float: "left", color: "black" }}
                            >
                              <h6 id="padLeft">Rent From</h6>
                            </div>
                            <div
                              style={{
                                float: "right",
                                color: "black",
                                marginLeft: "25px",
                              }}
                            >
                              <h6>
                                {moment(this.state.rentDate).format(
                                  "DD-MM-YYYY"
                                )}
                              </h6>
                            </div>
                          </div>

                          <div className="row">
                            <div
                              className="col-md-6"
                              style={{ float: "left", color: "black" }}
                            >
                              <h6>Return Date</h6>
                            </div>

                            <div
                              style={{
                                float: "right",
                                color: "black",
                                marginLeft: "25px",
                              }}
                            >
                              <h6>
                                {moment(this.state.returnDate).format(
                                  "DD-MM-YYYY"
                                )}
                              </h6>
                            </div>
                          </div>
                          <br />

                          <div className="container">
                            <div className="row justify-content-md-center">
                              <div className="col-md-12">
                                <input
                                  style={{ color: "black", width: "90%" }}
                                  type="text"
                                  className="form-control mm-input s-input text-center"
                                  placeholder="Total"
                                  id="setSizeFloat"
                                  value={`${"FINAL INVOICE TOTAL: $"}${this.finalInVoiceTotal()}`}
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                          <br />

                          <div className="col-md-12">
                            <table>
                              <thead></thead>
                              <tbody>
                                <tr>
                                  <td
                                    style={{
                                      backgroundColor: "white",
                                      textAlign: "center",
                                      padding: "8px",
                                      width: "50%",
                                    }}
                                  >
                                    <svg id="barcode"></svg>
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      padding: "8px",
                                      width: "50%",
                                    }}
                                  >
                                    {" "}
                                    Authorized by <br />
                                    {user && user.username}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <br />
                          <div className="container">
                            <div className="row justify-content-md-center">
                              <div className="col-lg-auto">
                                <input
                                  style={{
                                    color: "black",
                                    width: "-webkit-fill-available",
                                  }}
                                  type="text"
                                  className="form-control mm-input s-input text-center"
                                  placeholder="Total"
                                  id="setSizeFloat"
                                  readOnly
                                  value={`${"Order Completed"}`}
                                />
                              </div>
                            </div>
                          </div>
                          <br />
                          <div className="row">
                            <p>
                              For questions and contact information please check
                              out
                              <a
                                href="https://www.sutygon.com"
                                rel="noopener noreferrer"
                                id="pixinventLink"
                                target="_blank"
                                className="text-bold-800 primary darken-2"
                              >
                                www.sutygon-bot.com
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* pdf invoice  */}

          <div id="invoiceDiv" style={{ width: "100%", display: "none" }}>
            <h1 style={{ textAlign: "center" }}>
              {customer
                ? `${customer.name}${"#"}${customer.contactnumber}`
                : ""}{" "}
            </h1>
            <h1 style={{ textAlign: "center" }}>
              {state ? `${"Order"}${"#"} ${order[0].orderNumber}` : ""}{" "}
            </h1>

            <table style={{ width: "100%" }} cellPadding="10">
              <thead></thead>
              <tbody>{this.invoiceproductBox()}</tbody>
            </table>
            <table style={{ width: "100%" }} cellPadding="10">
              <thead></thead>
              <tbody>
                {!!this.state.m_productarray.length ? (
                  <h5>Missing Products</h5>
                ) : (
                  ""
                )}
                {!!this.state.m_productarray.length
                  ? this.m_invoiceproductBox()
                  : ""}
              </tbody>
            </table>
            <hr />
            <table style={{ width: "100%" }} cellPadding="10">
              <thead></thead>
              <tbody>
                <tr>
                  <td style={{ width: "90%" }}>Insurance Amount</td>
                  <td>{this.state.insuranceAmt}</td>
                </tr>
                <tr style={{ textAlign: "center" }}>
                  <td>
                    <h4 style={{ textAlign: "center" }}>{`${"PAID TOTAL: "}${
                      this.state.totalPaid
                    }`}</h4>
                  </td>
                </tr>
                <tr>
                  <td>Lost Items Charge</td>
                  <td>
                    {this.state.m_total === ""
                      ? this.state.missingItmCharges
                      : this.state.m_total}{" "}
                  </td>
                </tr>
                <tr>
                  <td>Amount Return to customer</td>
                  <td>{insuranceAmt ? this.returnAmt() : "0"}</td>
                </tr>
              </tbody>
            </table>
            <br />

            <table style={{ width: "100%" }} cellPadding="10">
              <thead></thead>
              <tbody>
                <tr style={{ textAlign: "center" }}>
                  <td style={{ textAlign: "center" }}>
                    {this.state.leaveID === true
                      ? `${"Customer left ID. Please return ID to customer"}`
                      : `${"No ID"}`}
                  </td>
                </tr>
                <tr>
                  <td>Rent From</td>
                  <td>{moment(this.state.rentDate).format("DD/MMM/YYYY")}</td>
                </tr>
                <tr>
                  <td>Return Date</td>
                  <td>{moment(this.state.returnDate).format("DD/MMM/YYYY")}</td>
                </tr>
                <tr style={{ textAlign: "center" }}>
                  <td>
                    <h4
                      style={{ textAlign: "center" }}
                    >{`${"FINAL INVOICE TOTAL: "}${this.finalInVoiceTotal()}`}</h4>
                  </td>{" "}
                </tr>
              </tbody>
            </table>

            <table style={{ width: "100%" }}>
              <thead></thead>
              <tbody>
                <tr>
                  <td
                    className="col-md-6"
                    style={{
                      backgroundColor: "white",
                      textAlign: "center",
                      padding: "8px",
                      width: "50%",
                    }}
                  >
                    <svg id="barcode"></svg>
                  </td>
                  <td
                    className="col-md-6"
                    style={{
                      textAlign: "center",
                      padding: "8px",
                      width: "50%",
                    }}
                  >
                    Authorized by <br />
                    Sutygon-Bot
                  </td>
                </tr>
                <tr>
                  <td>
                    <h4
                      style={{ textAlign: "center" }}
                    >{`${"ORDER COMPLETED"}`}</h4>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <br />
            <br />
            <br />

            <table style={{ width: "100%" }}>
              <thead></thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: "center" }}>
                    For questions and information please contact out
                    www.sutygon-bot.com
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <br />
          </div>
        </div>
        <OCAlertsProvider />
      </React.Fragment>
    );
  }
}

MatchBarcodes.propTypes = {
  getCustomer: PropTypes.func.isRequired,
  getAllProductsAll: PropTypes.func.isRequired,
  getProductById: PropTypes.func.isRequired,
  updateProductIndex: PropTypes.func.isRequired,
  updateRentedProduct: PropTypes.func.isRequired,
  saved: PropTypes.bool,
  order: PropTypes.array,
  customer: PropTypes.object,
  addNewInvoice: PropTypes.func.isRequired,
  auth: PropTypes.object,
  generateInvoice: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  products: state.product.products,
  product: state.product,
  customer: state.customer.customer,
  auth: state.auth,
  saved: state.product.saved,
  generateInvoice: state.product.generateReturnInvoice,
});
export default connect(mapStateToProps, {
  getCustomer,
  getAllProductsAll,
  getProductById,
  updateProductIndex,
  updateRentedProduct,
  addNewInvoice,
})(MatchBarcodes);
