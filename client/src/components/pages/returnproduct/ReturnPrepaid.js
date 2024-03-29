import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCustomer } from "../../../actions/customer";
import Loader from "../../layout/Loader";
import * as moment from "moment";
// import ShowPrices from "./small/ShowPrices";
import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { addNewInvoice } from "../../../actions/invoices";
import {
  getProductById,
  getAllProductsAll,
  updateProductIndex,
} from "../../../actions/product";
import { updateRentedProduct } from "../../../actions/rentproduct";
import { getOrderbyOrderNumber } from "../../../actions/returnproduct";
import { addNewRentProduct, getLastRecord } from "../../../actions/rentproduct";
import ReceiptUI from "../../ReceiptUI";

var JsBarcode = require("jsbarcode");

class ReturnPrepaid extends Component {
  state = {
    CustomerPay: false,
    rentedOrder: "",
    product_Array: [],
    barcode_Array: [],
    insuranceAmt: 0,
    total: 0,
    total_owe: 0,
    pay_amount: "",
    pdfData: "",
    redirect: false,
    customer_id: "",
    owe_from_customer: "",
    amount_remaing: "",
    m_product: "",
    m_productarray: "",
    m_total: "",
    totalPaid: "",
    charge_data: [],
    discount_data: [],
    order: "",
  };
  async componentDidMount() {
    await this.props.getAllProductsAll();
    const { state } = this.props.location;

    if (state) {
      this.setState({
        customer_id: state.customer_id,
        charge_data: state.charge_data,
        discount_data: state.discount_data,
        order: state.order,
        //   barcode_Array: state.barcode_Array,
        //   rentedOrder: state.rentedOrder,
        product_Array: state.product_Array,
        owe_from_customer: state.owe_from_customer,
        amount_remaing: state.amount_remaing,
        //   insuranceAmt: state.rentedOrder.insuranceAmt,
        //   total: state.rentedOrder.total,
      });
    }
    await this.props.getCustomer(state.customer_id);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const state = { ...this.state };
    const { user } = this.props.auth;
    const { order } = this.props.location.state;

    if (!order) return;

    this.setState({
      saving: true,
      generateInvoice: true,
      orderNumber: order.orderNumber,
    });
    if (true) {
      if (order && state.orderNumber) {
        const invoiceReturn = {
          order_id: order._id,
          customer: order.customer._id,
          user_id: user._id,
          type: "Return-Invoice",
          orderBarcode: state.orderNumber,
        };
        await this.props.addNewInvoice(invoiceReturn);
      }
      this.printBarcode(state.orderNumber);
    }

    let { product_Array } = this.state;

    if (product_Array) {
      let products = [];
      // let counter = 1;

      product_Array.forEach(async (pd, p_index) => {
        await this.props.getProductById(pd.product_id); // <-- Error is here this should give updated product in every loop

        let { product } = this.props;
        if (product) {
          product.color.forEach((color, c_index) => {
            // get right color obj
            if (color._id === pd.color_id) {
              // get right size obj
              if (color.sizes) {
                color.sizes.forEach((size, s_index) => {
                  if (size.id === pd.size_id) {
                    // check if current size obj contain barcodes or not
                    if (size.barcodes) {
                      // Add isRented
                      let bcode = {
                        barcode: size.barcodes[pd.barcodeIndex].barcode,
                      };
                      this.props.updateProductIndex(bcode, pd.product_id);
                    }
                  }
                });
              }
            }
          });
          products.push(product);
          product = null;
        }
      });
      const order = this.props.location?.state.order;

      const { amount_steps, authorization_logs } = order;

      const { owe_from_customer, amount_remaing } = this.state;

      amount_steps.push({
        date: new Date(),
        pay: owe_from_customer ? amount_remaing : 0,
        refundAmount: owe_from_customer ? 0 : amount_remaing,
        return: true,
        status: "Return items",
      });

      const { user } = this.props.auth;

      authorization_logs.push({
        date: new Date(),
        employee_id: user?._id,
        employee_name: user?.username || user.fullname || user.first_name,
        message: "Items returned - status is now completed",
        status: "Completed",
      });

      const rentedProduct = {
        status: "Completed",
        amount_steps,
        authorization_logs,
        chargesArray: this.props.location?.state?.charge_data,
        discountsArray: this.props.location?.state?.discount_data,
      };

      this.props.updateRentedProduct(rentedProduct, order._id);
    }
    this.printInvoice();
    this.setState({ saving: false, orderNumber: "" });
  };
  printInvoice = () => {
    var css =
      '<link rel="stylesheet"  href="%PUBLIC_URL%/assets/css/app.css"/>';
    var printDiv = document.getElementById("invoiceDiv").innerHTML;

    let newWindow = window.open(
      "",
      "_blank",
      "location=yes,height=570,width=720,scrollbars=yes,status=yes"
    );
    newWindow.document.body.innerHTML = css + printDiv;
    newWindow.window.print();
    newWindow.document.close();
  };
  printBarcode = (barcode) => {
    return JsBarcode("#barcode", barcode, {
      width: 1.5,
      height: 40,
    });
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
          return productarray;
        });
      }
    }
    this.state.product_Array = productarray;
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
                      <td className="text-center">{b[0].barcode}</td>
                      <td className="text-center">{b[0].title}</td>
                      <td className="text-center">{b[0].color}</td>
                      <td className="text-center">{b[0].price}</td>
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
    let m_productarray = [];
    let { products } = this.props;
    let { orderedBarcode } = this.props.location.state;
    let { barcodesArray } = this.state;
    let m_product = [];
    if (!!barcodesArray.length) {
      barcodesArray.forEach((element, e_index) => {
        m_product = orderedBarcode.filter((f) => f !== element.barcode);
      });
      this.state.m_product = m_product;
    }
    if (products && m_product) {
      let sortedAray = this.getSortedData(products);
      if (sortedAray) {
        m_product.forEach((element) => {
          m_productarray.push(
            sortedAray.filter((f) => f.barcode.toString() === element)
          );
          return m_productarray;
        });
      }
    }
    this.state.m_productarray = m_productarray;
    return this.state.m_productarray.map((m_product, m_product_index) => (
      <>
        <div id="sizes_box" key={m_product_index}>
          <div className="row">
            <div
              style={{ float: "left", width: "90%" }}
              className="overflow-x-scroll"
            >
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
                    <td className="text-center">{m_product[0].barcode}</td>
                    <td className="text-center">{m_product[0].title}</td>
                    <td className="text-center">{m_product[0].color}</td>
                    <td className="text-center">{m_product[0].price}</td>
                  </tr>
                </tbody>
              </table>
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
          <td className="text-center">{b.qty} </td>
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
          <td className="text-center">{b.qty} </td>
          <td className="text-center">{b.price} </td>
        </tr>
      </>
    ));
  };

  charge_array_for_pdf = () => {
    const { charge_data } = this.state;
    return charge_data.map((c, c_index) => (
      <>
        <tr key={c_index}>
          <td className="text-center">{c.name} </td>
          <td className="text-center">{c.category}</td>
          <td className="text-center">{c.amount} </td>
        </tr>
      </>
    ));
  };
  discount_array_for_pdf = () => {
    const { discount_data } = this.state;
    return discount_data.map((d, d_index) => (
      <>
        <tr key={d_index}>
          <td className="text-center">{d.name} </td>
          <td className="text-center">{d.category}</td>
          <td className="text-center">{d.amount} </td>
        </tr>
      </>
    ));
  };

  parseProductsArray(arr) {
    const newArr = [];
    arr.forEach((item) =>
      newArr.push({
        title: item.name,
        color: item.colorname,
        orderQty: item.qty,
        ...item,
      })
    );
    return newArr;
  }

  render() {
    const { product_Array, amount_remaing } = this.state;
    const { auth } = this.props;
    const { user } = auth;
    if (user && user.systemRole === "Employee") {
      if (user && !user.sections.includes("Rentproduct")) {
        return <Redirect to="/Error" />;
      }
    }
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.props.saved === true) {
      return <Redirect to="/returnproduct" />;
    }
    // if (this.state.redirect === true) {
    //   return <Redirect to="/rentproduct" />;
    // }
    // if (this.props.location.state === undefined) {
    //   return <Redirect to="/rentproduct" />;
    // }
    const { owe_from_customer } = this.state;
    const { customer } = this.props;
    const { state } = this.props.location;
    const { order } = state;

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
                        <h4 className="card-title">Trả Đồ</h4>
                        <h5>
                          {owe_from_customer ? "Tính Tiền" : "Hoàn Tiền"}{" "}
                        </h5>
                      </div>
                      <div className="card-content">
                        <div className="card-body">
                          <div id="colors_box">
                            {owe_from_customer ? (
                              <React.Fragment>
                                <h3 className="text-center">
                                  {amount_remaing > 0
                                    ? "Khách Hàng Nợ"
                                    : "Đã Trả Đủ"}{" "}
                                  :
                                  <strong>
                                    <span className="text-warning ml-2">
                                      {amount_remaing > 0
                                        ? `${amount_remaing} VNĐ`
                                        : "Đã Trả Đủ"}
                                    </span>
                                  </strong>
                                </h3>
                                <br />
                                {amount_remaing > 0 ? (
                                  <h1 className="text-center">
                                    {/* vui lòng thu từ 1000 VND từ khách hàng */}
                                    Làm ơn nhận{" "}
                                    <strong>
                                      <span className="text-success">
                                        {amount_remaing ? amount_remaing : 0}{" "}
                                        VNĐ{" "}
                                      </span>
                                    </strong>
                                    từ khách hàng.
                                  </h1>
                                ) : (
                                  ""
                                )}

                                <hr />
                                {this.state.order.leaveID ? (
                                  <h3 className="text-center">
                                    Trả khách CMND/BLX mang tên
                                    <strong>
                                      {this.state.order.customerId}
                                    </strong>
                                    .
                                  </h3>
                                ) : (
                                  <h3 className="text-center">
                                    Khách hàng không để lại CMND/BLX.
                                  </h3>
                                )}
                                <form onSubmit={this.onSubmit}>
                                  <div className="row text-center">
                                    <div className="col-md-12 btn-cont">
                                      <div className="form-group">
                                        <button
                                          type="submit"
                                          className="btn btn-raised btn-primary round btn-min-width mr-1 mb-1"
                                          id="btnSize2"
                                        >
                                          <i className="ft-check"></i>
                                          Hoàn Tất & Hoá Đơn
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <h3 className="text-center">
                                  Hoàn Trả Khách :
                                  <strong>
                                    <span className="text-warning ml-2">
                                      {amount_remaing} VNĐ
                                    </span>
                                  </strong>
                                </h3>
                                <br />
                                <h1 className="text-center">
                                  Làm ơn hoàn{" "}
                                  <strong>
                                    <span className="text-danger">
                                      {amount_remaing} VNĐ{" "}
                                    </span>
                                  </strong>
                                  lại cho khách.
                                </h1>
                                <hr />
                                {this.state.order.leaveID ? (
                                  <h3 className="text-center">
                                    Trả khách CMND/BLX mang tên
                                    <strong>
                                      {this.state.order.customerId}
                                    </strong>
                                    .
                                  </h3>
                                ) : (
                                  <h3 className="text-center">
                                    Khách hàng không để lại CMND/BLX.
                                  </h3>
                                )}

                                <hr />
                                <form onSubmit={this.onSubmit}>
                                  <div className="row text-center">
                                    <div className="col-md-12 btn-cont">
                                      <div className="form-group">
                                        <button
                                          type="submit"
                                          className="btn btn-raised btn-primary round btn-min-width mr-1 mb-1"
                                          id="btnSize2"
                                        >
                                          <i className="ft-check"></i>
                                          Hoàn Tất & Hoá Đơn
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </React.Fragment>
                            )}

                            <div>
                              <br />
                            </div>
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
                                ? `${customer.name}${" #"}${
                                    customer.contactnumber
                                  }`
                                : ""}
                            </h4>
                          </div>
                          <div className="text-center">
                            <h4>
                              {state
                                ? `${"Đơn Hàng"}${" #"} ${
                                    state.order.orderNumber
                                  }`
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
                              <p>Missing Products</p>
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
                            <hr />
                            <h3>Charges</h3>
                            <table
                              style={{ width: "100%" }}
                              className="table table-bordered"
                              cellPadding="10"
                            >
                              <thead></thead>
                              <tbody>{this.charge_array_for_pdf()}</tbody>
                            </table>
                            <h3>Discounts</h3>
                            <table
                              style={{ width: "100%" }}
                              className="table table-bordered"
                              cellPadding="10"
                            >
                              <thead></thead>
                              <tbody>{this.discount_array_for_pdf()}</tbody>
                            </table>
                            <hr />
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
                                <h6>{state.order.insuranceAmt}</h6>
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
                                  {this.state.leaveID == "true"
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
                                    // value={`${"FINAL INVOICE TOTAL: $"}${this.finalInVoiceTotal()}`}
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
                                For questions and contact information please
                                check out
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
              <ReceiptUI
                product_Array={this.parseProductsArray(product_Array)}
                username={user?.username}
                order={{ ...order, status: "Completed" }}
                currentlyPaid={owe_from_customer ? amount_remaing : 0}
                previouslyPaid={order.pay_amount}
                refundAmount={
                  owe_from_customer ? -amount_remaing : amount_remaing
                }
                discountsArray={this.props.location?.state?.discount_data}
                chargesArray={this.props.location?.state?.charge_data}
              />
            </div>
          </div>
        </div>
        <OCAlertsProvider />
      </React.Fragment>
    );
  }
}

ReturnPrepaid.propTypes = {
  getAllProductsAll: PropTypes.func.isRequired,
  getCustomer: PropTypes.func.isRequired,
  addNewRentProduct: PropTypes.func.isRequired,
  getProductById: PropTypes.func.isRequired,
  updateProductIndex: PropTypes.func.isRequired,
  getOrderbyOrderNumber: PropTypes.func.isRequired,
  addNewInvoice: PropTypes.func.isRequired,
  getLastRecord: PropTypes.func.isRequired,
  auth: PropTypes.object,
  products: PropTypes.array,
  customer: PropTypes.array,
  order: PropTypes.array,
  saved: PropTypes.bool,
  generateInvoice: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  product: state.product.product,
  auth: state.auth,
  lastRecord: state.rentproduct.lastrecord,
  order: state.returnproduct.returnproduct,
  products: state.product.products,
  customer: state.customer.customer,
  generateInvoice: state.rentproduct.generateInvoice,
  saved: state.product.saved,
});
export default connect(mapStateToProps, {
  getAllProductsAll,
  getCustomer,
  addNewRentProduct,
  getProductById,
  updateProductIndex,
  addNewInvoice,
  getOrderbyOrderNumber,
  getLastRecord,
  updateRentedProduct,
})(ReturnPrepaid);
