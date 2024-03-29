import React, { Component } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../layout/Loader";
import shortid from "shortid";
import * as moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getProductById,
  getAllProducts,
  updateProductIndex,
  getAllProductsAll,
} from "../../actions/product";
import { getCustomer } from "../../actions/customer";
import { addNewRentProduct, getLastRecord } from "../../actions/rentproduct";
import { getOrderbyOrderNumber } from "../../actions/returnproduct";
import { addNewInvoice } from "../../actions/invoices";
import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { vi } from "date-fns/esm/locale";
import axios from "axios";
registerLocale("vi", vi);
setDefaultLocale("vi");
var JsBarcode = require("jsbarcode");

class RentOrder extends Component {
  state = {
    id: "",
    orderNumber: "",
    orderBarcode: "",
    barcode_Array: [],
    customer_id: "",
    product_Array: "",
    total_amt: "",
    taxper: "",
    tax: "",
    insAmt: "",
    rentDate: "",
    returnDate: "",
    total: "",
    saving: false,
    leaveID: false,
    barcodesRented: false,
    redirect: false,
    m_returnDate: "",
    coupon_code: "",
    discount_amount: 0,
    products_length: 0,
    coupon_type: "",
    someOneName: "",
    extraDays: 0,
    extraDaysAmount: 0,
    someoneElseCheckBox: false,
  };

  async componentDidMount() {
    await this.props.getAllProductsAll();
    await this.props.getLastRecord();
    const { lastRecord } = this.props;

    if (lastRecord) {
      if (lastRecord.length === 0) {
        const orderNumber = "001-00";
        const newOrderNumber = this.generateRandomNumber(orderNumber);
        this.setState({
          orderNumber: newOrderNumber,
        });
      } else if (lastRecord.length > 0) {
        const orderNumber = lastRecord[0].orderNumber;
        if (orderNumber) {
          const newOrderNumber = this.generateRandomNumber(orderNumber);
          this.setState({
            orderNumber: newOrderNumber,
          });
        }
      }
    }

    const { state } = this.props.location;
    if (state) {
      const { rentDate, returnDate, extraDays, extraDaysAmount } = state.data;
      this.setState({
        customer_id: state.customer_id,
        barcode_Array: state.barcode,
        rentDate: rentDate,
        returnDate: returnDate,
        extraDays: extraDays,
        extraDaysAmount: extraDaysAmount,
      });
    }
    const orderBarcode = shortid.generate();
    this.setState({
      orderBarcode: orderBarcode,
    });
    await this.props.getCustomer(this.state.customer_id);
  }
  generateRandomNumber(previousNumber) {
    // break number by dash
    // convert number into integer
    let n_array = previousNumber.split("-");
    // check second half if 90
    if (n_array[1] == "99") {
      // if yes increment first half
      n_array[0]++;
      n_array[1] = "00";
    } else {
      // if not add 1
      n_array[1]++;
    }

    function getPadded(num) {
      var str = "" + num;
      var pad = "000";
      return pad.substring(0, pad.length - str.length) + str;
    }
    let firstHalf = getPadded(n_array[0]);

    function getPaddedSecond(num) {
      var str = "" + num;
      var pad = "00";
      return pad.substring(0, pad.length - str.length) + str;
    }
    let secondHalf = getPaddedSecond(n_array[1]);

    let n = firstHalf + "-" + secondHalf;
    return n;
  }
  focousOut(value) {
    if (value === false) {
      this.setState({ rentDate: "", returnDate: "" });
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ saving: true });

    const state = { ...this.state };
    const { user } = this.props.auth;
    const { customer } = this.props;

    const { barcode_Array } = this.state;
    let barcodeArr = [];
    barcode_Array.forEach((element) => {
      barcodeArr.push(element.barcode);
    });

    const rentedOrder = {
      orderNumber: state.orderNumber,
      customer: state.customer_id,
      customerContactNumber: customer.contactnumber,
      user: user._id,
      barcodes: barcodeArr,
      total: state.total ? state.total : state.total_amt, //total_amt
      rentDate: state.rentDate,
      returnDate: state.returnDate,
      leaveID: this.state.leaveID,
      insuranceAmt: state.insAmt,
      orderBarcode: state.orderBarcode,
      coupon_code: this.state.coupon_code,
      tax: state.tax,
      taxper: state.taxper,
      discount_amount: state.discount_amount,
    };
    if (
      state.leaveID == true &&
      this.state.someoneElseCheckBox &&
      state.someOneName == ""
    ) {
      OCAlert.alertError(`Please Enter Some One Name`, { timeOut: 3000 });
      return;
    }
    if (state.leaveID == true && this.state.someoneElseCheckBox) {
      rentedOrder["customerId"] = state.someOneName;
    }
    if (state.leaveID == true && !this.state.someoneElseCheckBox) {
      rentedOrder["customerId"] = customer.name;
    }
    if (state.extraDays) {
      rentedOrder["extraDays"] = state.extraDays;
    }
    if (state.extraDaysAmount) {
      rentedOrder["extraDaysAmount"] = state.extraDaysAmount;
    }

    const pdfData = {
      discount_amount: state.discount_amount,
      insAmt: state.insAmt,
      tax: state.tax,
      taxper: state.taxper,
      rentDate: state.rentDate,
      returnDate: state.returnDate,
      total_without_tax: this.calculateTotalWithoutTax(),
    };

    this.props.history.push("/prepaid", {
      customer_id: state.customer_id,
      rentedOrder,
      product_Array: this.state.product_Array,
      barcode_Array: barcode_Array,
      pdfData: pdfData,
      customer: customer,
    });
    // return;
  };

  onHandleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  redirect = () => {
    this.setState({
      redirect: true,
    });
  };
  // return sorted products for barcodes
  getSortedData = (products) => {
    // looping through prducts
    let rows = [];

    products.forEach((product, p_index) => {
      let product_name = product.name;
      let product_id = product._id;
      let productId = product.productId;
      let productTag = product.tags;

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
                  color: color_name,
                  size: size_name,
                  barcode: size.barcodes[i].barcode,
                  price: price,
                  productId: productId,
                  productTag: productTag,
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

  removeBarcodeRow = (b_index, bbarcode) => {
    let barcode_Array = this.state.product_Array;
    let selectedBarcodes = this.state.barcode_Array;
    selectedBarcodes.splice(b_index, 1);
    barcode_Array.splice(b_index, 1);
    this.setState({
      product_Array: barcode_Array,
      barcode_Array: selectedBarcodes,
    });
  };
  renderProductTable() {
    let productarray = [];
    let { barcode_Array } = this.state;

    const { products } = this.props;
    if (products) {
      let sortedArray = this.getSortedData(products);
      if (sortedArray) {
        barcode_Array.forEach((element) => {
          const product = sortedArray.filter(
            (f) => f.barcode == element.barcode
          )[0];
          productarray.push({
            ...product,
            orderQty: element.orderQty,
            price: product.price * element.orderQty,
          });
          return productarray;
        });
      }
    }
    this.state.product_Array = productarray;

    return this.state.product_Array.map((product, b_index) => (
      <div id="sizes_box">
        <div className="row">
          <div className="left overflow-x-scroll">
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
                  <td className="text-center">{product.barcode}</td>
                  <td className="text-center">{product.title}</td>
                  <td className="text-center">{product.color}</td>
                  <td className="text-center">{product.size}</td>
                  <td className="text-center">{product.orderQty}</td>
                  <td className="text-center">{product.price}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="right ml-3">
            <button
              type="button"
              onClick={() =>
                this.removeBarcodeRow(b_index, barcode_Array[b_index].barcode)
              }
              className="btn btn-raised btn-sm btn-icon btn-danger mt-1"
            >
              <i className="fa fa-minus"></i>
            </button>
          </div>
          <br />
        </div>
      </div>
    ));
  }

  getInvoiceBarcodeRecord() {
    let { product_Array } = this.state;
    return product_Array.map((product, b_index) => (
      <tr key={b_index}>
        <td className="text-center">{product.barcode}</td>
        <td className="text-center">{product.title}</td>
        <td className="text-center">{product.color}</td>
        <td className="text-center">{product.price}</td>
      </tr>
    ));
  }

  calculateTotalWithoutTax = () => {
    let { product_Array, extraDaysAmount } = this.state;
    let sum = extraDaysAmount ? Number(extraDaysAmount) : 0;

    if (product_Array) {
      for (var i = 0; i < product_Array.length; i++) {
        sum += Number(product_Array[i].price);
      }
    }
    this.state.total_amt = sum;
    return sum;
  };

  calculateTax = () => {
    var totalAmount = this.calculateTotalWithoutTax();
    var { taxper } = this.state;

    let amount;
    if (taxper !== null && taxper !== "0") {
      amount = totalAmount * (taxper * 0.01);
    } else {
      amount = 0;
    }
    this.state.tax = amount;
    return amount;
  };
  calculateInsuranceAmt() {
    var totalAmount = this.calculateTotalWithoutTax();
    var insuranceAmt = Number(totalAmount) / 2;
    this.state.insAmt = insuranceAmt;
    return insuranceAmt;
  }
  calculateTotal = () => {
    let sum = 0;
    let { tax, insAmt, total_amt, discount_amount } = this.state;

    sum = Math.round(Number(total_amt) + Number(tax) + Number(insAmt));
    this.state.total = sum;
    return sum;
  };

  calculateTotalWithDiscount = () => {
    let sum = 0;
    let { tax, insAmt, total_amt, discount_amount } = this.state;
    let discountAmount = 0;
    if (discount_amount > 0) {
      discountAmount = Number(discount_amount);
    }
    sum = Math.round(
      Number(total_amt) + Number(tax) + Number(insAmt) - discountAmount
    );
    this.state.total = sum;
    return sum;
  };

  printBarcode = (barcode) => {
    return JsBarcode("#barcode", barcode, {
      width: 1.5,
      height: 40,
    });
  };

  handleChangeForDate = (date) => {
    let { rentDate } = this.state;
    this.setState({ rentDate: date });
  };

  percentage = (num, per) => {
    return (num / 100) * per;
  };

  // zohaib
  onApplyCoupon = async () => {
    const { customer } = this.props;
    const { coupon_code, product_Array } = this.state;
    if (coupon_code == "") {
      OCAlert.alertError(`Provide Coupon Code`, { timeOut: 3000 });
      return;
    }
    const p_total = this.calculateTotalWithoutTax();
    let obj = {
      coupon_code: coupon_code,
      total: p_total,
      customerId: customer._id,
      products: product_Array,
    };

    try {
      const res = await axios.post("/api/coupons/apply_coupon", obj);

      if (res.data) {
        // products_length is for each category means eligibility=="each"
        const products_length = res.data.discount_products;
        const {
          discount_amount,
          coupon_type,
          max_payout,
          eligibility,
          start_date,
          end_date,
        } = res.data.result;

        let startDate = new Date(start_date);
        let endDate = new Date(end_date);
        let new_date = new Date();
        startDate = moment(startDate).format("DD-MM-YYYY");
        endDate = moment(endDate).format("DD-MM-YYYY");
        new_date = moment(new_date).format("DD-MM-YYYY");

        if (startDate > new_date || new_date > endDate) {
          OCAlert.alertError(`Coupon is expired`, { timeOut: 3000 });
          return;
        }

        if (coupon_type == "percentage") {
          // if discount amount percentage value then calculate percentage
          //params {product_total,percentage}
          const after_calculated = this.percentage(p_total, discount_amount);
          if (after_calculated <= max_payout) {
            this.setState({
              coupon_type: coupon_type,
              discount_amount:
                eligibility == "each"
                  ? after_calculated * Number(products_length)
                  : after_calculated,
            });
          } else {
            // if (eligibility == "all") {
            //    this.setState({
            //   coupon_type: coupon_type,
            //   discount_amount:max_payout
            //    });
            //   return
            // }
            // if (eligibility == "only") {
            //    this.setState({
            //   coupon_type: coupon_type,
            //   discount_amount:max_payout
            //    });
            //   return
            // }

            if (eligibility == "each") {
              this.setState({
                coupon_type: coupon_type,
                discount_amount: discount_amount * Number(products_length),
              });
              return;
            } else {
              this.setState({
                coupon_type: coupon_type,
                discount_amount: max_payout,
              });
            }
            // // if discount amount exceeds from max payout then apply max payout
            // this.setState({
            //   coupon_type: coupon_type,
            //   discount_amount:
            //     eligibility == "each"
            //       ? discount_amount * Number(products_length)
            //       : discount_amount,
            // });
          }
        } else {
          // if not percentage then apply discount amount directly
          this.setState({
            coupon_type: coupon_type,
            discount_amount:
              eligibility == "each"
                ? discount_amount * Number(products_length)
                : discount_amount,
          });
        }
        OCAlert.alertSuccess(res.data.msg, { timeOut: 3000 });
        return;
      }
    } catch (err) {
      const errors = err.response.data;

      if (errors.msg) {
        OCAlert.alertError(errors.msg, { timeOut: 3000 });
        return;
      }
    }
  };

  render() {
    const { auth, order } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    const { user } = auth;
    if (user && user.systemRole === "Employee") {
      if (user && !user.sections.includes("Rentproduct")) {
        return <Redirect to="/Error" />;
      }
    }
    if (this.state.redirect === true) {
      return <Redirect to="/rentproduct" />;
    }

    if (this.props.location.state === undefined) {
      return <Redirect to="/rentproduct" />;
    }
    if (this.props.saved === true) {
      return <Redirect to="/rentproduct" />;
    }

    const { customer } = this.props;
    const { coupon_code } = this.state;
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
                        <h4 className="card-title">Thuê Đồ</h4>
                      </div>

                      <div className="card-content">
                        <div className="card-body table-responsive">
                          <div id="colors_box">
                            <div className="row color-row">
                              <div className="col-md-12">
                                <div className="form-group">
                                  <h3>
                                    <strong>
                                      {customer && customer.name}{" "}
                                    </strong>
                                  </h3>
                                  <h4>
                                    {`${"Điện thoại: "}${
                                      customer && customer.contactnumber
                                    }`}
                                  </h4>
                                </div>
                              </div>
                              <OCAlertsProvider />
                              <form onSubmit={(e) => this.onSubmit(e)}>
                                <div className="col-md-12">
                                  <div id="sizes_box">
                                    {this.renderProductTable()}
                                    <Link
                                      to={{
                                        pathname: "/checkout",
                                        state: {
                                          customer: this.state.customer_id,
                                          barcode: this.state.barcode_Array,
                                        },
                                      }}
                                      className="btn "
                                    >
                                      <i className="fa fa-external-link mr-2"></i>
                                      Thiếu mã? Quay lại để thêm mã vào đơn hàng
                                    </Link>

                                    <br />
                                    <div className="row mt-3">
                                      <div className="col-md-6 text-center">
                                        <label
                                          className="text-center"
                                          id="setName"
                                        >
                                          Ngày Lấy Đồ
                                        </label>
                                      </div>

                                      <div className="col-md-6 text-center">
                                        <label
                                          className="text-center"
                                          id="setName"
                                        >
                                          Ngày Trả Đồ
                                        </label>
                                      </div>
                                    </div>

                                    <div className="row justify-content-center">
                                      <div className="col-md-6 text-center">
                                        <input
                                          id="issueinput4"
                                          className="form-control round text-center"
                                          name="rentDate"
                                          style={{
                                            border: "1px solid #A6A9AE",
                                            color: "#75787d",
                                            padding: "0.375rem 0.75rem",
                                            lineHeight: "1.5",
                                          }}
                                          required
                                          readOnly
                                          data-title="Return Date"
                                          value={
                                            this.state.rentDate ===
                                            "Invalid date"
                                              ? ""
                                              : moment(
                                                  this.state.rentDate
                                                ).format("DD-MM-YYYY")
                                          }
                                        />
                                      </div>

                                      <div className="col-md-6 text-center">
                                        <input
                                          id="issueinput4"
                                          className="form-control round text-center"
                                          name="returnDate"
                                          style={{
                                            border: "1px solid #A6A9AE",
                                            color: "#75787d",
                                            padding: "0.375rem 0.75rem",
                                            lineHeight: "1.5",
                                          }}
                                          required
                                          readOnly
                                          data-title="Return Date"
                                          value={
                                            this.state.returnDate ===
                                            "Invalid date"
                                              ? ""
                                              : moment(
                                                  this.state.returnDate
                                                ).format("DD-MM-YYYY")
                                          }
                                        />
                                      </div>
                                    </div>
                                    {/* <br />
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <div style={{ float: "left" }}>
                                            <h4 id="padLeft">Extra Days</h4>
                                          </div>
                                          <div style={{ paddingLeft: "650px" }}>
                                            <input
                                              style={{ width: "65%" }}
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="Total"
                                              required
                                              readOnly
                                              id="setSizeFloat"
                                              value={
                                                this.state.extraDays
                                                  ? this.state.extraDays
                                                  : 0
                                              }
                                            />
                                          </div>{" "}
                                        </div>
                                      </div>
                                    </div> */}
                                    <br />
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <div style={{ float: "left" }}>
                                            <h4 id="padLeft">
                                              Phí gia hạn ngày thuê
                                            </h4>
                                          </div>
                                          <div style={{ paddingLeft: "650px" }}>
                                            <input
                                              style={{ width: "65%" }}
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="Total"
                                              required
                                              readOnly
                                              id="setSizeFloat"
                                              value={
                                                this.state.extraDaysAmount
                                                  ? this.state.extraDaysAmount
                                                  : 0
                                              }
                                            />
                                          </div>{" "}
                                        </div>
                                      </div>
                                    </div>
                                    <br />
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <div style={{ float: "left" }}>
                                            <h4 id="padLeft">
                                              Tổng Tiền Chưa Thuế
                                            </h4>
                                          </div>
                                          <div style={{ paddingLeft: "650px" }}>
                                            <input
                                              style={{ width: "65%" }}
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="VNĐ"
                                              name="total_amt"
                                              id="setSizeFloat"
                                              required
                                              readOnly
                                              onChange={(e) =>
                                                this.onHandleChange(e)
                                              }
                                              value={
                                                this.state.product_Array
                                                  ? `${this.calculateTotalWithoutTax()}`
                                                  : //  - (this.state
                                                    //   .discount_amount !== ""
                                                    //   ? this.state
                                                    //       .discount_amount
                                                    //   : 0)
                                                    ""
                                              }
                                            />
                                          </div>
                                          <br />
                                        </div>{" "}
                                      </div>
                                    </div>

                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <div style={{ float: "left" }}>
                                            <h4 id="padLeft">
                                              Nhập % Thuế{" "}
                                              <span className="text-muted">
                                                (nếu không tính thuế, nhập số
                                                '0')
                                              </span>
                                            </h4>
                                          </div>
                                          <div style={{ paddingLeft: "650px" }}>
                                            <input
                                              style={{ width: "65%" }}
                                              name="taxper"
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="% Thuế"
                                              id="setSizeFloat"
                                              required
                                              value={`${this.state.taxper}`}
                                              onChange={(e) =>
                                                this.onHandleChange(e)
                                              }
                                            />
                                          </div>{" "}
                                        </div>
                                      </div>
                                    </div>
                                    <br />

                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <div style={{ paddingLeft: "650px" }}>
                                            <input
                                              style={{ width: "65%" }}
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="Tiền Thuế VNĐ"
                                              id="setSizeFloat"
                                              value={
                                                this.state.product_Array &&
                                                this.state.taxper
                                                  ? `${this.calculateTax()}`
                                                  : ""
                                              }
                                              readOnly
                                            />
                                          </div>{" "}
                                        </div>
                                      </div>
                                    </div>
                                    <br />

                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <div style={{ float: "left" }}>
                                            <h4 id="padLeft">
                                              Tiền Cọc Thêm{" "}
                                              <span className="text-muted">
                                                (hoàn trả khách khi trả đồ)
                                              </span>
                                            </h4>
                                          </div>
                                          <div style={{ paddingLeft: "650px" }}>
                                            <input
                                              name="insAmt"
                                              style={{ width: "65%" }}
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="Cọc VNĐ"
                                              id="setSizeFloat"
                                              required
                                              value={this.state.insAmt}
                                              onChange={(e) =>
                                                this.onHandleChange(e)
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <br />

                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <div style={{ float: "left" }}>
                                            <h4 id="padLeft">
                                              Cọc Chứng Minh Nhân Dân/Bằng Lái
                                              Xe
                                            </h4>
                                          </div>
                                          <div
                                            style={{
                                              textAlign: "left",
                                              marginLeft: "650px",
                                            }}
                                          >
                                            <div className="" style={{}}>
                                              <input
                                                id="yes"
                                                type="radio"
                                                name="leaveID"
                                                value={true}
                                                onChange={
                                                  (e) =>
                                                    this.setState({
                                                      leaveID: true,
                                                    })
                                                  // this.onHandleChange(e)
                                                }
                                                checked={
                                                  this.state.leaveID == true
                                                }
                                              />
                                              <label
                                                htmlFor="yes"
                                                className="ml-2"
                                              >
                                                Có cọc CMND/BLX
                                              </label>
                                            </div>
                                            <div className="" style={{}}>
                                              <input
                                                id="no"
                                                type="radio"
                                                name="leaveID"
                                                value={false}
                                                onChange={
                                                  (e) =>
                                                    this.setState({
                                                      leaveID: false,
                                                    })
                                                  // this.onHandleChange(e)
                                                }
                                                checked={
                                                  this.state.leaveID == false
                                                }
                                              />
                                              <label
                                                htmlFor="no"
                                                className="ml-2"
                                              >
                                                Không cọc CMND/BLX
                                              </label>
                                            </div>
                                          </div>
                                          {this.state.leaveID == true && (
                                            <React.Fragment>
                                              <div
                                                style={{ paddingLeft: "650px" }}
                                              >
                                                <input
                                                  type="checkbox"
                                                  className="mr-2"
                                                  // className="form-control mm-input s-input text-center"
                                                  value={
                                                    this.state
                                                      .someoneElseCheckBox
                                                  }
                                                  onChange={(e) =>
                                                    this.setState({
                                                      someoneElseCheckBox: !this
                                                        .state
                                                        .someoneElseCheckBox,
                                                    })
                                                  }
                                                />{" "}
                                                Xài CMND/BLX của người khác?
                                              </div>

                                              {this.state
                                                .someoneElseCheckBox && (
                                                <div
                                                  style={{
                                                    paddingLeft: "650px",
                                                  }}
                                                >
                                                  <input
                                                    name="some_one_name"
                                                    style={{ width: "65%" }}
                                                    type="text"
                                                    className="form-control mm-input s-input text-center mt-1 "
                                                    placeholder="Tên trên thẻ"
                                                    autoComplete="off"
                                                    value={
                                                      this.state.someOneName
                                                    }
                                                    onChange={(e) =>
                                                      this.setState({
                                                        someOneName:
                                                          e.target.value,
                                                      })
                                                    }
                                                  />
                                                </div>
                                              )}
                                            </React.Fragment>
                                          )}
                                          <br />
                                        </div>
                                      </div>
                                    </div>

                                    <br />
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <div style={{ float: "left" }}>
                                            <h4 id="coupon_code1">
                                              Mã Giảm Giá
                                            </h4>
                                          </div>
                                          <div style={{ paddingLeft: "650px" }}>
                                            <input
                                              name="coupon_code"
                                              style={{ width: "65%" }}
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="Mã giảm giá"
                                              id="coupon_code1"
                                              autoComplete="off"
                                              value={this.state.coupon_code}
                                              onChange={(e) =>
                                                this.setState({
                                                  coupon_code: e.target.value,
                                                })
                                              }
                                            />

                                            <input
                                              style={{
                                                width: "65%",
                                                marginTop: "2px",
                                              }}
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="Discount"
                                              id="setSizeFloat"
                                              value={this.state.discount_amount}
                                              readOnly
                                            />
                                            <span>
                                              {this.state.coupon_type ==
                                              "percentage"
                                                ? "%"
                                                : ""}
                                            </span>

                                            <span
                                              style={{ cursor: "pointer" }}
                                              className="btn btn-info mt-1 btn-sm ml-4"
                                              onClick={this.onApplyCoupon}
                                            >
                                              Xài Mã Giảm Giá
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <br />

                                    <br />
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <div style={{ float: "left" }}>
                                            <h4 id="padLeft">
                                              Tổng Tiền
                                              <span
                                                style={{ fontSize: "16px" }}
                                              >
                                                {" "}
                                                (Chưa Giảm Giá)
                                              </span>
                                            </h4>
                                          </div>
                                          <div style={{ paddingLeft: "650px" }}>
                                            <input
                                              style={{ width: "65%" }}
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="VNĐ"
                                              required
                                              readOnly
                                              id="setSizeFloat"
                                              value={
                                                this.state.total_amt
                                                  ? this.calculateTotal()
                                                  : ""
                                              }
                                            />
                                          </div>{" "}
                                        </div>
                                      </div>
                                    </div>

                                    <br />
                                    {this.state.discount_amount > 0 && (
                                      <div className="row">
                                        <div className="col-md-12">
                                          <div className="form-group">
                                            <div style={{ float: "left" }}>
                                              <h4 id="padLeft">
                                                Tổng Tiền (Đã Giảm Giá)
                                              </h4>
                                            </div>
                                            <div
                                              style={{ paddingLeft: "650px" }}
                                            >
                                              <input
                                                style={{ width: "65%" }}
                                                type="text"
                                                className="form-control mm-input s-input text-center"
                                                placeholder="VNĐ"
                                                required
                                                readOnly
                                                id="setSizeFloat"
                                                value={
                                                  this.state.total_amt
                                                    ? `${this.calculateTotalWithDiscount()}`
                                                    : ""
                                                }
                                              />
                                            </div>{" "}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <br />
                                  <div className="row text-center">
                                    <div className="col-md-12 btn-cont">
                                      <div className="form-group">
                                        <button
                                          type="submit"
                                          className="btn btn-raised btn-primary round btn-min-width mr-1 mb-1"
                                          id="btnSize2"
                                        >
                                          <i className="ft-check mr-2"></i>
                                          Thanh Toán/Cọc Tiền Trước
                                        </button>
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
        </div>
        <div className="clearfix"></div>
      </React.Fragment>
    );
  }
}

RentOrder.propTypes = {
  getAllProducts: PropTypes.func.isRequired,
  getCustomer: PropTypes.func.isRequired,
  addNewRentProduct: PropTypes.func.isRequired,
  getProductById: PropTypes.func.isRequired,
  updateProductIndex: PropTypes.func.isRequired,
  getOrderbyOrderNumber: PropTypes.func.isRequired,
  addNewInvoice: PropTypes.func.isRequired,
  getLastRecord: PropTypes.func.isRequired,
  auth: PropTypes.object,
  products: PropTypes.array,
  customer: PropTypes.object,
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
  products: state.product.products,
});
export default connect(mapStateToProps, {
  getAllProducts,
  getAllProductsAll,
  getCustomer,
  addNewRentProduct,
  getProductById,
  updateProductIndex,
  addNewInvoice,
  getOrderbyOrderNumber,
  getLastRecord,
})(RentOrder);
