import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import { getAllProducts, getProductById, updateProductIndex } from "../../../actions/product";
import { getCustomer } from "../../../actions/customer";
import { addNewInvoice } from "../../../actions/invoices";
import { updateRentedProduct } from "../../../actions/rentproduct";
import Loader from "../../layout/Loader";
import * as moment from 'moment'
import shortid from "shortid";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "../../../custom.css"
var JsBarcode = require('jsbarcode');


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
    leaveID: "",
    returnAmt: "",
    totalPaid: "",
    orderBarcode: "",
    product_Array: "",
    m_product: "",
    m_productarray: "",
    m_total: "",
    generateInvoice:true,

  };

  handleChange = (e, id = "") => {
    this.setState({ [e.target.name]: e.target.value });
  };

  async componentDidMount() {
    const { data } = this.props.location
    if (data) {
      this.setState({
        customer: data.customer,
        order: data.order,
        insuranceAmt: data.order[0].insuranceAmt,
        barcodesArray: data.barcodesArray,
        taxAmt: data.order[0].taxAmt,
        totalPaid: data.order[0].total,
        leaveID: data.order[0].leaveID
      });
    }

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
                  barcode: size.barcodes[i].barcode,
                  color: color_name + " | " + size_name,
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
      m_total = Number(m_total) + Number(element[0].price)
    })
    this.state.m_total = m_total;
    return m_total
  }
  customerOwe = () => {
    const { insuranceAmt, m_total } = this.state;
    let customerOwe;
    if (m_total > insuranceAmt) {
      customerOwe = Number(m_total) - Number(insuranceAmt)
    }
    else if (insuranceAmt >= m_total) {
      customerOwe = Number(insuranceAmt) - Number(m_total)
    }
    return customerOwe;
  }

  returnAmt = () => {
    const { insuranceAmt, m_total } = this.state;
    let returnAmt;
    if (m_total > insuranceAmt) {
      returnAmt = Number(m_total) - Number(insuranceAmt)
    }
    else if (insuranceAmt >= m_total) {
      returnAmt = Number(insuranceAmt) - Number(m_total)
    }
    return returnAmt;
  }

  finalInVoiceTotal = () => {
    const { totalPaid, insuranceAmt, missingItmCharges } = this.state;
    const finalInVoiceTotal = Number(Number(totalPaid) - Number(insuranceAmt) + Number(missingItmCharges));
    return finalInVoiceTotal;
  }
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
    this.state.product_Array = productarray
    return productarray.map((b, b_index) => (
      <>
        <div id="sizes_box" key={b_index}>
          <div className="row" >

            <div style={{ float: "left", width: "90%" }} >
              <table className="table table-bordered table-light" style={{ "borderWidth": "1px", 'borderColor': "#aaaaaa", 'borderStyle': 'solid' }}>
                <thead></thead>
                <tbody>
                  <tr key={b_index} style={{ "margin": "3px" }}>
                    <td className="text-center">{b[0].barcode}</td>
                    <td className="text-center">{b[0].title}</td>
                    <td className="text-center">{b[0].color}</td>
                    <td className="text-center">{b[0].price}</td>

                  </tr>
                </tbody>
              </table>

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
    ))
  }


  missingProducts = () => {
    let m_productarray = [];
    let { products } = this.props;
    let { orderedBarcode } = this.props.location.data;
    let { barcodesArray } = this.state;
    let m_product = [];
    if (!!barcodesArray.length) {
      barcodesArray.forEach((element, e_index) => {
        m_product = orderedBarcode.filter((f) => f !== element.barcode)
      })
      this.state.m_product = m_product
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
          <div className="row" >

            <div style={{ float: "left", width: "90%" }} >
              <table className="table table-bordered table-light" style={{ "borderWidth": "1px", 'borderColor': "#aaaaaa", 'borderStyle': 'solid' }}>
                <thead></thead>
                <tbody>
                  <tr key={m_product_index} style={{ "margin": "3px" }}>
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
    ))
  }

  invoiceproductBox = () => {
    const { product_Array } = this.state
    return product_Array.map((b, b_index) => (
      <>
        <tr key={b_index} >
          <td className="text-center">{b[0].barcode} </td>
          <td className="text-center">{b[0].title}</td>
          <td className="text-center">{b[0].color} </td>
          <td className="text-center">{b[0].price} </td>

        </tr>

      </>
    ))
  }


  m_invoiceproductBox = () => {
    const { m_productarray } = this.state
    return m_productarray.map((b, b_index) => (
      <>
        <tr key={b_index} >
          <td className="text-center">{b[0].barcode} </td>
          <td className="text-center">{b[0].title}</td>
          <td className="text-center">{b[0].color} </td>
          <td className="text-center">{b[0].price} </td>

        </tr>
      </>
    ))
  }

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ saving: true,      generateInvoice:true,    });

    const state = { ...this.state };
    const { user } = this.props.auth;
    const { order } = this.props.location.data;
    
if(state.generateInvoice=== true){
    if (order && state.orderNumber) {
      const invoiceReturn = {
        order_id: order[0]._id,
        customer: order[0].customer,
        user_id: user._id,
        type: "Return-Invoice",
        orderBarcode: state.orderNumber
      }
      await this.props.addNewInvoice(invoiceReturn);

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
        // console.log('got from db', product);
        if (product) {
          product.color.forEach((color, c_index) => {

            // get right color obj
            if (color._id === pd[0].color_id) {
              // get right size obj
              if (color.sizes) {
                color.sizes.forEach((size, s_index) => {
                  if (size.id === pd[0].size_id) {
                    // check if current size obj contain barcodes or not
                    if (size.barcodes) {
                      // Add isRented
                      size.barcodes[pd[0].barcodeIndex].isRented = false;
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
      
    

        const rentedProduct = {
          status: "Completed",
        }
        this.props.updateRentedProduct(rentedProduct, order[0]._id)
      });

    }
    this.printInvoice()
    this.setState({ saving: false });

  };
  printInvoice = () => {
    var css = '<link rel="stylesheet"  href="%PUBLIC_URL%/assets/css/app.css"/>'
    var printDiv = document.getElementById('invoiceDiv').innerHTML

    let newWindow = window.open("", '_blank', 'location=yes,height=570,width=720,scrollbars=yes,status=yes');
    newWindow.document.body.innerHTML = css + printDiv
    newWindow.window.print();
    newWindow.document.close();
  }
  printBarcode = (barcode) => {
    return JsBarcode("#barcode", barcode, {
      width: 1.5,
      height: 40,
    });

  }

  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/" />;
    }
        if (this.props.location.data === undefined) {
        return <Redirect to="/returnproduct" />;

    }

    const { customer } = this.props;
    const { data } = this.props.location;
   
    if (this.props.saved === true) {
      return <Redirect to="/returnproduct" />;

    }
    const { order } = data;

    const { barcodesArray } = data
    const { customerOwe, insuranceAmt, m_total } = this.state;

    return (
      <React.Fragment>
        <Loader />
        <div className="wrapper menu-collapsed">
          <Sidebar location={this.props.location} >
          </Sidebar>
          <Header>
          </Header>

          <div className="main-panel">
            <div className="main-content">
              <div className="content-wrapper">
                <section id="form-action-layouts">
                  <div className="form-body">
                    <div className="card">
                      <div className="card-header">
                        <h4 className="form-section">
                          Return Product
                          </h4>
                      </div>

                      <div className="card-body table-responsive">
                        <div id="colors_box">
                          <div className="row color-row">
                            <div className="col-md-12">
                              <div className="text-center">
                                <h2>    Scan and match barcodes with all items    </h2>
                                <br />
                              </div>
                              <div className="form-group">
                                <div style={{ 'float': 'left' }}>

                                  <h3>{(customer) ? `${customer.name}${"#"}${customer.contactnumber}` : ""}</h3>
                                  <br />
                                </div>
                                <div style={{ 'float': 'right' }}>
                                  <h3>{(data) ? `${"Order"}${"#"} ${order[0].orderNumber}` : ""}</h3>

                                </div>
                              </div>
                            </div>
                            <form onSubmit={(e) => this.onSubmit(e)}>

                              <div className="text-center">
                                <h3>    You are returning {(order && order.length > 0) ? `${barcodesArray.length}${"/"}${order[0].barcodes.length}` : `0`} products in this order </h3>
                                <br />
                              </div>
                              <div className="col-md-12">
                                <div id="sizes_box">
                                  {this.productBox()}
                                  <br />
                                  {barcodesArray.length !== order[0].barcodes.length ?
                                    <h3>Missing Products</h3>
                                    : ""}
                                  {barcodesArray.length !== order[0].barcodes.length ?
                                    this.missingProducts()
                                    : ""}
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="form-group">
                                        <div style={{ 'float': 'left' }}>
                                          <h4 id="padLeft">Enter total missing items charge</h4>
                                        </div>
                                        <div style={{ 'paddingLeft': '700px' }}>
                                          <input
                                            name="missingItmCharges"
                                            style={{ 'width': '85%', 'color': 'black' }}
                                            type="text"
                                            className="form-control mm-input s-input text-center"
                                            placeholder="Total"
                                            id="setSizeFloat"
                                            required
                                            value={!!this.state.m_productarray.length ? this.getMissingItemTotal() : "0"}
                                            onChange={(e) => this.handleChange(e)}
                                          />
                                        </div>  </div>
                                    </div>
                                  </div>
                                  <br />

                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="form-group">
                                        <div style={{ 'float': 'left' }}>

                                          <h4 id="padLeft">Insurance return
to customer</h4>
                                        </div>
                                        <div style={{ 'paddingLeft': '700px' }}>
                                          <input
                                            name="insuranceAmt"
                                            style={{ 'width': '85%', 'color': 'black' }}
                                            type="text"
                                            className="form-control mm-input s-input text-center"
                                            placeholder="Total"
                                            id="setSizeFloat"
                                            readOnly
                                            value={this.state.order[0] ? this.state.order[0].insuranceAmt : ""}
                                            onChange={(e) => this.handleChange(e)}


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

                                          <h4 id="padLeft">Customer owe
</h4>
                                        </div>
                                        <div style={{ 'paddingLeft': '700px' }}>
                                          <input
                                            name="customerOwe"
                                            style={{ 'width': '85%', 'color': 'black' }}
                                            type="text"
                                            className="form-control mm-input s-input text-center"
                                            placeholder="Total"
                                            id="setSizeFloat"
                                            value={customerOwe}
                                            required
                                            value={(insuranceAmt) ? `${this.customerOwe()}` : "0"}
                                            onChange={(e) => this.handleChange(e)}
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

                                          <h4 id="padLeft">  Return customer
</h4>
                                        </div>
                                        <div style={{ 'paddingLeft': '700px' }}>
                                          <input
                                            name="returnCustomer"
                                            style={{ 'width': '85%', 'color': 'black' }}
                                            type="text"
                                            className="form-control mm-input s-input text-center"
                                            placeholder=""
                                            id="setSizeFloat"
                                            value={(insuranceAmt) ? `${this.returnAmt()}` : "0"}
                                            onChange={(e) => this.handleChange(e)}

                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <br />

                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="form-group">
                                        <div className="text-center">

                                          <div style={{ 'float': 'left' }}>

                                          </div>
                                          <div style={{ 'float': 'center', 'paddingRight': '170px' }}>


                                            <h4>{order[0].leaveID === true ? `${"Customer left ID. Please return ID to customer."}` : `${"No ID"}`}</h4> </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <br />
                                  <div className="col-md-12">
                                    <div id="sizes_box">
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
                                            ><i className="ft-check"></i> Submit &amp; Generate Invoice	</button>
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
              <p className="clearfix text-muted text-sm-center px-2"><span>Quyền sở hữu của &nbsp;{" "}
                <a href="https://www.sutygon.com" rel="noopener noreferrer" id="pixinventLink" target="_blank" className="text-bold-800 primary darken-2">SUTYGON-BOT </a>, All rights reserved. </span></p>
            </footer>

          </div>
          {/* Invoice Modal */}
          <div class="modal fade text-left" id="primary" tabindex="-1" role="dialog" aria-labelledby="myModalLabel8"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header bg-primary white">
                  <h4 class="modal-title text-center" id="myModalLabel8">Invoice</h4>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div id="colors_box">
                    <div className="row color-row">
                      <div className="col-md-12">
                        <div className="text-center">

                          <h4>{(customer) ? `${customer.name}${"#"}${customer.contactnumber}` : ""}</h4>
                        </div>
                        <div className="text-center">
                          <h4>{(data) ? `${"Order"}${"#"} ${order[0].orderNumber}` : ""}</h4>

                        </div>
                      </div>
                      <div className="col-md-12">
                        <div >
                          {this.invoiceproductBox()}
                          {!!this.state.m_productarray.length ?
                            <h5>Missing Products</h5> : ""}
                          {!!this.state.m_productarray.length ?
                            this.m_invoiceproductBox() : ""}

                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>

                              <h6 id="padLeft">Insurance amount</h6>
                            </div>
                            <div className="col-md-6" style={{ 'float': 'right', 'color': 'black' }}>
                              <h6 >
                                {this.state.insuranceAmt}
                              </h6>
                            </div>
                          </div>



                          <div className="row justify-content-center">
                            <div className="form-group">

                              <div className="text-center" style={{ 'width': '300%' }}>
                                <input
                                  type="text"

                                  className="form-control mm-input s-input text-center"
                                  placeholder="Total"
                                  style={{ 'color': 'black' }}

                                  id="setSizeFloat"

                                  value={`${"PAID TOTAL: $"}${this.state.insuranceAmt}`}

                                />


                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>


                              <h6 >Lost Items Charge
</h6></div>

                            <div className="col-md-6" style={{ 'float': 'right', 'color': 'black' }}>



                              <h6 >
                                {this.state.m_total}
                              </h6>

                            </div>

                          </div>




                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>

                              <h6 id="padLeft">Amount Return to customer</h6>
                            </div>
                            <div className="col-md-6" style={{ 'float': 'right', 'color': 'black' }}>
                              <h6 >

                                {(customerOwe && insuranceAmt && m_total) ? `${this.returnAmt()}` : "0"}
                              </h6>
                            </div>



                          </div>

                          <br />


                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>


                              <h6 id="padLeft">Leave ID</h6>
                            </div>
                            <div className="col-md-6" style={{ 'float': 'right', 'color': 'black' }}>
                              <h6 >
                                {this.state.leaveID === "true" ? `${"Yes"}` : `${"No"}`}
                              </h6>
                            </div>

                          </div>



                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>
                              <h6 id="padLeft">Rent From</h6>
                            </div>
                            <div style={{ 'float': 'right', 'color': 'black', 'marginLeft': '25px' }}>
                              <h6>
                                {moment(this.state.rentDate).format('DD/MMM/YYYY')}

                              </h6>
                            </div>


                          </div>



                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>
                              <h6 >Return Date</h6>
                            </div>

                            <div style={{ 'float': 'right', 'color': 'black', 'marginLeft': '25px' }}>
                              <h6 >

                                {moment(this.state.returnDate).format('DD/MMM/YYYY')}
                              </h6>
                            </div>


                          </div>
                          <br />

                          <div className="container">
                            <div class="row justify-content-md-center">

                              <div class="col-md-12">
                                <input
                                  style={{ 'color': 'black', 'width': '90%' }}
                                  type="text"
                                  className="form-control mm-input s-input text-center"
                                  placeholder="Total"

                                  id="setSizeFloat"
                                  value=


                                  {`${"FINAL INVOICE TOTAL: $"}${this.finalInVoiceTotal()}`}

                                />
                              </div>
                            </div>
                          </div>
                          <br />

                          <div className="col-md-12">

                            <table>
                              <tr>
                                <td style={{ 'backgroundColor': 'white', 'textAlign': 'center', 'padding': '8px', 'width': '50%' }}>
                                  <svg id="barcode"></svg>

                                </td>
                                <td style={{ 'textAlign': 'center', 'padding': '8px', 'width': '50%' }}> Authorized by <br />
                                                        Sutygon-Bot</td>
                              </tr>
                            </table>


                          </div>
                          <br />
                          <div className="container">
                            <div class="row justify-content-md-center">

                              <div class="col-lg-auto">
                                <input
                                  style={{ 'color': 'black', 'width': '-webkit-fill-available' }}
                                  type="text"
                                  className="form-control mm-input s-input text-center"
                                  placeholder="Total"

                                  id="setSizeFloat"
                                  value=


                                  {`${"Order Completed"}`}

                                />
                              </div>

                            </div>
                          </div>
                          <br />
                          <div className="row">
                            <p>For questions and contact information please check out
                                              <a href="https://www.sutygon.com" rel="noopener noreferrer" id="pixinventLink" target="_blank" className="text-bold-800 primary darken-2">www.sutygon-bot.com</a></p>
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

          <div id="invoiceDiv" style={{ 'width': '100%', 'display': 'none' }}>
            <h1 style={{ 'text-align': 'center' }}>
              {(customer) ? `${customer.name}${"#"}${customer.contactnumber}` : ""}            </h1>
            <h1 style={{ 'text-align': 'center' }}>
              {(data) ? `${"Order"}${"#"} ${order[0].orderNumber}` : ""}            </h1>

            <table style={{ 'width': '100%' }} cellpadding="10"><thead></thead>
              <tbody>
                {this.invoiceproductBox()}
              </tbody>
            </table>
            <table style={{ 'width': '100%' }} cellpadding="10"><thead></thead><tbody>
              {!!this.state.m_productarray.length ?

                <h5>Missing Products</h5> : ""}

              {!!this.state.m_productarray.length ?

                this.m_invoiceproductBox() : ""}
            </tbody>
            </table>
            <hr />
            <table style={{ 'width': '100%' }} cellpadding="10"><thead></thead>
              <tbody>
                <tr>
                  <td style={{ 'width': '90%' }} >Insurance amount</td>
                  <td>
                    {this.state.insuranceAmt}
                  </td>
                </tr>

                <tr>
                  <tr><h4 style={{ 'text-align': 'center' }}>{`${"PAID TOTAL: "}${this.state.insuranceAmt}`}</h4>
                  </tr>
                </tr>
                <tr>
                  <td>Lost Items Charge</td>
                  <td>
                    {this.state.m_total}
                  </td>
                </tr>
                <tr>
                  <td>Amount Return to customer</td>
                  <td>
                    {(customerOwe && insuranceAmt && m_total) ? `${this.returnAmt()}` : "0"}
                  </td>
                </tr>
              </tbody>
            </table>
            <br />

            <table style={{ 'width': '100%' }} cellpadding="10"><thead></thead>
              <tbody>
                <tr style={{textAlign:"center"}}>
                  <td>
                    {this.state.leaveID === true ? `${"Customer left ID. Please return IDto customer"}` : `${"No ID"}`}
                  </td>
                </tr>
                <tr>
                  <td>Rent From</td>
                  <td>
                    {moment(this.state.rentDate).format('DD/MMM/YYYY')}
                  </td>
                </tr>
                <tr>
                  <td>Return Date</td>
                  <td>
                    {moment(this.state.returnDate).format('DD/MMM/YYYY')}
                  </td>
                </tr>
                <tr><h4 style={{ 'text-align': 'center' }}>{`${"FINAL INVOICE TOTAL: "}${this.finalInVoiceTotal()}`}</h4></tr>

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
                <tr><h4 style={{ 'text-align': 'center' }}>{`${"ORDER COMPLETED"}`}</h4></tr>

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
            <br />
            <br />

          </div>


        </div>



      </React.Fragment>

    );
  }
}



MatchBarcodes.propTypes = {
  getCustomer: PropTypes.func.isRequired,
  getAllProducts: PropTypes.func.isRequired,
  getProductById: PropTypes.func.isRequired,
  updateProductIndex: PropTypes.func.isRequired,
  updateRentedProduct: PropTypes.func.isRequired,
  saved: PropTypes.bool,
  order: PropTypes.array,
  customer: PropTypes.array,
  addNewInvoice: PropTypes.func.isRequired,
  auth: PropTypes.object,
  generateInvoice: PropTypes.bool,

};

const mapStateToProps = (state) => ({
  products: state.product.products,
  product: state.product.product,
  customer: state.customer.customer,
  auth: state.auth,
  saved: state.product.saved,
  generateInvoice: state.product.generateReturnInvoice,


});
export default connect(mapStateToProps, {
  getCustomer, getAllProducts, getProductById, updateProductIndex, updateRentedProduct, addNewInvoice,



})(MatchBarcodes);
