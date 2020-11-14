import React, { Component } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../layout/Loader";
import shortid from "shortid";
import * as moment from 'moment'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getProductById, getAllProducts, updateProductIndex } from "../../actions/product";
import { getCustomer } from "../../actions/customer";
import { addNewRentProduct, getLastRecord } from "../../actions/rentproduct";
import { getOrderbyOrderNumber } from "../../actions/returnproduct";
import { addNewInvoice } from "../../actions/invoices";
import { OCAlertsProvider } from '@opuscapita/react-alerts';
import { OCAlert } from '@opuscapita/react-alerts'
import { cookie } from "express-validator";
var JsBarcode = require('jsbarcode');


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
    m_returnDate: ""
  };



  async componentDidMount() {
    await this.props.getAllProducts();
    await this.props.getLastRecord();
    const { lastRecord } = this.props
    if (lastRecord) {
      if (lastRecord.length === 0) {
        const orderNumber = "001-00";
        const newOrderNumber = this.generateRandomNumber(orderNumber)
        this.setState({
          orderNumber: newOrderNumber
        })
      }
      else if (lastRecord.length > 0) {
        const orderNumber = lastRecord[0].orderNumber;
        if (orderNumber) {
          const newOrderNumber = this.generateRandomNumber(orderNumber)
          this.setState({
            orderNumber: newOrderNumber
          })
        }

      }
    }

    const { data } = this.props.location;
    if (data) {
      this.setState({
        customer_id: data.customer_id,
        barcode_Array: data.barcode,
      });
    }
    const orderBarcode = shortid.generate();
    this.setState({
      orderBarcode: orderBarcode
    })
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
      this.setState({ rentDate: '',returnDate : '' });
    }
  }
  rentDateValidity = () => {
    let { rentDate, } = this.state;
    var currentdate = moment(rentDate).format('YYYY-MM-DD');
    const r_date = moment(new Date).format('YYYY-MM-DD');
    var isToday = moment(r_date).isSameOrBefore(currentdate); // true
    const rent = new Date(rentDate)

    if (isToday === false && (rent.getTime() - (new Date).getTime()) < 0) {
      OCAlert.alertError(`Invalid Date`, { timeOut: 3000 });
      this.focousOut(isToday);
      return;
    }

    else if ((rent.getTime() - (new Date).getTime()) > 0 || isToday === true) {
      var threeDaysAfter = (new Date(rentDate).getTime() + (2 * 24 * 60 * 60 * 1000));
      var momentthreeDaysAfter = moment(threeDaysAfter).format("DD-MM-YYYY");
      this.state.returnDate = momentthreeDaysAfter;

      this.state.m_returnDate = moment(threeDaysAfter).format("YYYY-MM-DD");
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
      total: state.total,
      returnDate: state.m_returnDate,
      rentDate: state.rentDate,
      leaveID: this.state.leaveID,
      insuranceAmt: state.insAmt,
      orderBarcode: state.orderBarcode
    };
    await this.props.addNewRentProduct(rentedOrder);

    await this.props.getOrderbyOrderNumber(state.orderNumber)
    const { order, auth } = this.props;
    if (this.props.generateInvoice === true) {
      if (order && state.orderBarcode && state.orderNumber) {
        const invoiceRent = {
          order_id: order[0]._id,
          customer_id: order[0].customer,
          user_id: auth.user._id,
          type: "Rent-Invoice",
          orderBarcode: state.orderNumber
        }
        await this.props.addNewInvoice(invoiceRent);
      }
      this.printBarcode(state.orderNumber)
    }
    let { product_Array } = this.state;

    if (product_Array) {
      let products = [];
      // let counter = 1;

      product_Array.forEach(async (pd, p_index) => {
        await this.props.getProductById(pd[0].product_id); // <-- Error is here this should give updated product in every loop

        let { product } = this.props;
        // counter++;
        if (product) {
          product.color.forEach((color, c_index) => {
            // get right color obj
            if (color._id == pd[0].color_id) {
              // get right size obj
              if (color.sizes) {
                color.sizes.forEach((size, s_index) => {
                  if (size.id == pd[0].size_id) {
                    // check if current size obj contain barcodes or not
                    if (size.barcodes) {
                      // Add isRented
                      size.barcodes[pd[0].barcodeIndex].isRented = true;
                      this.props.updateProductIndex(product, pd[0].product_id);
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

    }
    this.printInvoice()

  };

  onHandleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });

  };

  redirect = () => {
    this.setState({
      redirect: true
    })
  }
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
                  color: color_name + " | " + size_name,
                  barcode: size.barcodes[i].barcode,
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

  printInvoice = () => {
    var css = '<link rel="stylesheet"  href="%PUBLIC_URL%/assets/css/app.css"/>'
    var printDiv = document.getElementById('invoiceDiv').innerHTML

    let newWindow = window.open("", '_blank', 'location=yes,height=570,width=720,scrollbars=yes,status=yes');
    newWindow.document.body.innerHTML = css + printDiv
    newWindow.window.print();
    newWindow.document.close();
  }

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
  getBarcodeRecord() {
    let productarray = [];
    let { barcode_Array } = this.state;
    const { products } = this.props;
    if (products) {
      let sortedAray = this.getSortedData(products);
      if (sortedAray) {
        barcode_Array.forEach((element) => {
          productarray.push(
            sortedAray.filter((f) => f.barcode == element.barcode)
          );
          return productarray;
        });
      }
    }
    this.state.product_Array = productarray;
    return this.state.product_Array.map((product, b_index) => (
      <div id="sizes_box">
        <div className="row">
          <div className="left">
            <table className="table table-bordered table-light" style={{ "borderWidth": "1px", 'borderColor': "#aaaaaa", 'borderStyle': 'solid' }}>
              <thead></thead>
              <tbody>
                <tr key={b_index} style={{ "margin": "3px" }}>
                  <td className="text-center">{product[0].barcode}</td>
                  <td className="text-center">{product[0].title}</td>
                  <td className="text-center">{product[0].color}</td>
                  <td className="text-center">{product[0].price}</td>

                </tr></tbody></table>
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
      <tr>
        <td className="text-center">{product[0].barcode}</td>
        <td className="text-center">{product[0].title}</td>
        <td className="text-center">{product[0].color}</td>
        <td className="text-center">{product[0].price}</td>

      </tr>
    ));
  }

  calculateTotalWithoutTax = () => {
    let sum = 0;
    let { product_Array } = this.state;
    if (product_Array) {
      for (var i = 0; i < product_Array.length; i++) {
        sum += Number(product_Array[i][0].price);
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
      amount = totalAmount * (taxper * 0.01)
    }
    else {
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
    let { tax, insAmt, total_amt } = this.state;
    sum = Math.round(Number(total_amt) + Number(tax) + Number(insAmt));
    this.state.total = sum;
    return sum;
  };

  printBarcode = (barcode) => {
    return JsBarcode("#barcode", barcode, {
      width: 1.5,
      height: 40,
    });

  }


  handleChangeForDate = (date) => {
    let { rentDate, } = this.state;
    this.setState({ rentDate: date });
  }



  render() {
    const { auth, order } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/" />;
    }

    if (this.state.redirect === true) {
      return <Redirect to="/rentproduct" />;
    }

    if (this.props.location.data === undefined) {
      return <Redirect to="/rentproduct" />;

    }
    if (this.props.saved === true) {
      return <Redirect to="/rentproduct" />;

    }

    const { customer } = this.props;
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
                        <h4 className="card-title">Rent a Product</h4>
                      </div>
                      <div className="card-content">
                        <div className="card-body table-responsive">
                          <div id="colors_box">
                            <div className="row color-row">
                              <div className="col-md-12">
                                <div className="form-group">
                                  <h3>
                                    {customer && customer.name}{" "}
                                    {`${"#"}${customer && customer.contactnumber
                                      }`}
                                  </h3>
                                </div>
                              </div>
                              {/* <form > */}
                              <form onSubmit={(e) => this.onSubmit(e)}>

                                <div className="col-md-12">
                                  <div id="sizes_box">

                                    {this.getBarcodeRecord()}
                                    <Link
                                      to={{
                                        pathname: "/checkout",
                                        data: {
                                          customer: this.state.customer_id,
                                        }
                                      }}
                                      to="/checkout"
                                      className="btn "
                                    >
                                      <i className="fa fa-plus"></i>
                                      Go Back To Add Products
                                    </Link>

                                    <br />

                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <div style={{ float: "left" }}>
                                            <h4 id="padLeft">
                                              Total Without Tax
                                            </h4>
                                          </div>
                                          <div style={{ paddingLeft: "650px" }}>
                                            <input
                                              style={{ width: "65%" }}
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="Total"
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
                                                  : ""
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
                                              Enter tax %{" "}
                                              <span className="text-muted">
                                                (enter 0 if no tax)
                                              </span>
                                            </h4>
                                          </div>
                                          <div style={{ paddingLeft: "650px" }}>
                                            <input
                                              style={{ width: "65%" }}
                                              name="taxper"
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="Tax"
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
                                          <h4 id="arowDown" style={{ marginLeft: "715px" }}>
                                            <i className="ft-arrow-down"></i>
                                          </h4>
                                          <div style={{ paddingLeft: "650px" }}>
                                            <input
                                              style={{ width: "65%" }}
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="Tax Ammount"
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
                                              Enter Insurance Amount
                                            </h4>
                                          </div>
                                          <div style={{ paddingLeft: "650px" }}>
                                            <input
                                              name="insAmt"
                                              style={{ width: "65%" }}
                                              type="text"
                                              className="form-control mm-input s-input text-center"
                                              placeholder="Insurance"
                                              id="setSizeFloat"
                                              required
                                              value={
                                                this.state.insAmt
                                              }
                                              onChange={(e) => this.onHandleChange(e)}


                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <br />

                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <div style={{ 'float': 'left' }}>

                                            <h4 id="padLeft">Leave ID</h4>
                                          </div>
                                          <div style={{ 'textAlign': 'right', 'paddingRight': '170px' }}>

                                            <div className="" style={{}}>
                                              <input
                                                id="yes"
                                                type="radio"
                                                name="leaveID"
                                                value={true}
                                                onChange={(e) => this.onHandleChange(e)}
                                                checked={this.state.leaveID === "true"}
                                              />
                                              <label htmlFor="yes"

                                              >&nbsp;YES</label>
                                            </div>
                                            <div className="" style={{}}>
                                              <input
                                                id="no"
                                                type="radio"
                                                name="leaveID"
                                                value={false}

                                                onChange={(e) => this.onHandleChange(e)}
                                                checked={this.state.leaveID === "false"}
                                              />
                                              <label htmlFor="no"
                                              >&nbsp;NO</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <br />

                                    <div className="row">
                                      <div className="col-md-6 text-center">
                                        <label
                                          className="text-center"
                                          id="setName"
                                        >
                                          Rent Date
                                        </label>
                                      </div>

                                      <div className="col-md-6 text-center">
                                        <label
                                          className="text-center"
                                          id="setName"
                                        >
                                          Return Date
                                        </label>
                                      </div>
                                    </div>

                                    <div className="row justify-content-center">
                                      <div className="col-md-6 text-center">
                                        <DatePicker
                                          id="issueinput3"
                                          selected={this.state.rentDate}
                                          className="form-control round text-center"
                                          onChange={(e) => this.handleChangeForDate(e)}
                                          onInput={this.rentDateValidity()}
                                          dateFormat="dd-MM-yyyy"
                                          popperPlacement="top-start"

                                        />

                                        {/* <input
                                          type="date"
                                          id="issueinput3"
                                          className="form-control round text-center"
                                          name="rentDate"
                                          data-toggle="tooltip"
                                          data-trigger="hover"
                                          data-placement="top"
                                          data-title="Rent Date"
                                          required
                                          onChange={(e) => this.onHandleChange(e)}
                                          value={this.state.rentDate}
                                          onInput={this.rentDateValidity()}

                                        /> */}
                                      </div>

                                      <div className="col-md-6 text-center">
                                        <input
                                          id="issueinput4"
                                          className="round text-center"
                                          name="returnDate"
                                          style={{ 'border': '1px solid #A6A9AE', 'color': '#75787d', 'padding': '0.375rem 0.75rem', 'lineHeight': '1.5' }}
                                          required
                                          readOnly
                                          data-title="Return Date"
                                          value={this.state.returnDate === "Invalid date" ? "" : this.state.returnDate}
                                        />
                                      </div>
                                    </div>

                                    <br />
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="form-group">
                                          <div style={{ float: "left" }}>
                                            <h4 id="padLeft">Total</h4>
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
                                                this.state.total_amt
                                                  ? `${this.calculateTotal()}`
                                                  : ""
                                              }

                                            />
                                          </div>{" "}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <br />
                                  <div className="row text-center">
                                    <div className="col-md-12 btn-cont">
                                      <div className="form-group">
                                        <button
                                          type="submit"
                                          className="btn btn-raised btn-primary round btn-min-width mr-1 mb-1"
                                          id="btnSize2"
                                        // data-toggle="modal"
                                        // data-backdrop="false"
                                        // data-target="#primary"
                                        >
                                          <i className="ft-check"></i>
                                          Submit &amp; Get Invoice
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
              <p className="clearfix text-muted text-sm-center px-2"><span>Quyền sở hữu của &nbsp;{" "}
                <a href="https://www.sutygon.com" rel="noopener noreferrer" id="pixinventLink" target="_blank" className="text-bold-800 primary darken-2">SUTYGON-BOT </a>, All rights reserved. </span></p>
            </footer>
          </div>

          {/* pdf invoice  */}

          <div id="invoiceDiv" style={{ 'width': '100%', 'display': 'none' }}>
            <h1 style={{ 'text-align': 'center' }}>
              {(customer) ? `${customer.name}${"#"}${customer.contactnumber}` : ""}
            </h1>
            <h1 style={{ 'text-align': 'center' }}>
              {(this.state.orderNumber) ? `${"Order"}${"#"} ${this.state.orderNumber}` : ""}
            </h1>

            <table style={{ 'width': '100%' }} cellpadding="10"><thead></thead>
              <tbody>
                {this.getInvoiceBarcodeRecord()}
              </tbody>
            </table>
            <hr />
            <table style={{ 'width': '100%' }} cellpadding="10"><thead></thead>
              <tbody>
                <tr>
                  <td style={{ 'width': '90%' }} >Total Without Tax</td>
                  <td>{`${this.state.total_amt}`}</td>
                </tr>
                <tr>
                  <td>Tax Percentage</td>
                  <td>{`${this.state.taxper}${"%"}`}</td>
                </tr>
                <tr>
                  <td>Tax Amount</td>
                  <td>{`${this.state.tax}`}</td>
                </tr>
                <tr>
                  <td>Insurance Amount</td>
                  <td>{`${this.state.insAmt}`}</td>
                </tr>
              </tbody>
            </table>
            <br />
            <h4 style={{ 'text-align': 'center' }}>{`${"PAID TOTAL: "}${this.state.total}`}</h4>
            <br />

            <table style={{ 'width': '100%' }} cellpadding="10"><thead></thead>
              <tbody>
                <tr>
                  <td style={{ 'width': '90%' }} >Leave ID</td>
                  <td>
                    {this.state.leaveID === "true" ? `${"Yes"}` : `${"No"}`}
                  </td>
                </tr>
                <tr>
                  <td>Rent From</td>
                  <td>
                    {moment(this.state.rentDate).format('DD-MM-YYYY')}
                  </td>
                </tr>
                <tr>
                  <td>Return Date</td>
                  <td>
                    {moment(this.state.m_returnDate).format('DD-MM-YYYY')}
                  </td>
                </tr>
              </tbody>
            </table>

            <table style={{ 'width': '100%' }}><thead></thead>
              <tbody>
                <tr>
                  <td className="col-md-6" style={{ 'backgroundColor': 'white', 'textAlign': 'center', 'padding': '8px', 'width': '50%' }}>
                    <svg id="barcode"></svg>
                  </td>
                  <td className="col-md-6" style={{ 'textAlign': 'center', 'padding': '8px', 'width': '50%' }}>
                    Authorized by <br />
                                     Sutygon-Bot</td>
                </tr>
              </tbody>
            </table>
            <br />
            <br />
            <br />
            <br />

            <table style={{ "width": "100%" }}><thead></thead>
              <tbody>
                <tr>
                  <td style={{ 'text-align': 'center' }}>For questions and information please contact out www.sutygon-bot.com</td>
                </tr>
              </tbody>
            </table>

          </div>



          {/* Invoice Modal */}
          <div className="modal fade text-left" id="primary" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel8"
            aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header bg-primary white">
                  <h4 className="modal-title text-center" id="myModalLabel8">Invoice</h4>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <button type="button" className="" data-dismiss="modal" aria-label="Close">
                    <span className="fa fa-print" aria-hidden="true" onClick={(e) => this.printInvoice(e)}></span>
                  </button>
                </div>
                <div className="modal-body">
                  <div id="colors_box" id="modal-body">
                    <div className="row color-row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <div className="text-center">

                            <h4>{(customer) ? `${customer.name}${"#"}${customer.contactnumber}` : ""}</h4>
                          </div>
                          <div className="text-center">
                            <h4>{(order) ? `${"Order"}${"#"} ${order[0].orderNumber}` : ""}</h4>

                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div >
                          {this.getInvoiceBarcodeRecord()}
                          <hr />
                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>
                              <h6 id="padLeft">Total Without Tax</h6>
                            </div>
                            <div className="col-md-6" style={{ 'textAlign': 'center', 'color': 'black' }}>
                              <h6 >
                                {`${this.state.total_amt}`}
                              </h6>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>
                              <h6 id="padLeft">Tax Percentage</h6>
                            </div>
                            <div className="col-md-6" style={{ 'textAlign': 'center', 'color': 'black' }}>
                              <h6 >
                                {`${this.state.taxper}${"%"}`}
                              </h6>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>
                              <h6 id="padLeft">Tax Amount</h6>
                            </div>
                            <div className="col-md-6" style={{ 'textAlign': 'center', 'color': 'black' }}>
                              <h6 >
                                {`${this.state.tax}`}
                              </h6>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>
                              <h6 id="padLeft">Insurance Amount</h6>
                            </div>
                            <div className="col-md-6" style={{ 'textAlign': 'center', 'color': 'black' }}>
                              <h6 >
                                {`${this.state.insAmt}`}
                              </h6>
                            </div>
                          </div>
                          <div className="row justify-content-center">
                            <div className="form-group">
                              <div className="" style={{ 'width': '300%' }}>
                                <input
                                  type="text"
                                  readOnly
                                  className="form-control mm-input s-input text-center"
                                  placeholder="Total"
                                  style={{ 'color': 'black' }}

                                  id="setSizeFloat"
                                  value={`${"PAID TOTAL: $"}${this.state.total}`} />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>
                              <h6 >Amount to be returned to customer</h6>
                            </div>
                            <div className="col-md-6" style={{ 'textAlign': 'center', 'color': 'black' }}>
                              <h6 >{`${this.state.insAmt}`}</h6>
                            </div>
                          </div>
                          <br />
                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>
                              <h6 id="padLeft">Leave ID</h6>
                            </div>
                            <div className="col-md-6" style={{ 'textAlign': 'center', 'color': 'black' }}>
                              <h6 >
                                {this.state.leaveID === "true" ? `${"Yes"}` : `${"No"}`}
                              </h6>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>
                              <h6 id="padLeft">Rent From</h6>
                            </div>
                            <div style={{ 'textAlign': 'end', 'color': 'black' }}>
                              <h6 style={{ 'textAlign': 'end', 'color': 'black' }}>
                                {moment(this.state.rentDate).format('DD-MM-YYYY')}
                              </h6>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>
                              <h6 >Return Date</h6>
                            </div>

                            <div style={{ 'textAlign': 'end', 'color': 'black', }}>
                              <h6 style={{ 'textAlign': 'end', 'color': 'black' }}>
                                {moment(this.state.m_returnDate).format('DD-MM-YYYY')}
                              </h6>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <table>
                              <tbody>
                                <tr>
                                  <td className="col-md-6" style={{ 'backgroundColor': 'white', 'textAlign': 'center', 'padding': '8px', 'width': '50%' }}>
                                    <svg id="barcode"></svg>
                                  </td>
                                  <td className="col-md-6" style={{ 'textAlign': 'center', 'padding': '8px', 'width': '50%' }}>
                                    Authorized by <br />
                                     Sutygon-Bot</td>
                                </tr>
                              </tbody>
                            </table>


                          </div>
                          <div className="row">
                            <p>For questions and contact information please check out
                                              <a href="https://www.sutygon.com" id="pixinventLink" rel="noopener noreferrer" target="_blank" className="text-bold-800 primary darken-2">www.sutygon-bot.com</a>
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
        </div>
        <OCAlertsProvider />

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
  saved: state.product.saved
});
export default connect(mapStateToProps, {
  getAllProducts,
  getCustomer,
  addNewRentProduct,
  getProductById,
  updateProductIndex,
  addNewInvoice,
  getOrderbyOrderNumber,
  getLastRecord
})(RentOrder);
