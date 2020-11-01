import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import { getAllProducts, getProductById, updateProductIndex } from "../../../actions/product";
import { getCustomer } from "../../../actions/customer";
import { addNewInvoice } from "../../../actions/invoices";
import { updateRentedProduct } from "../../../actions/rentproduct";
import Loader from "../../layout/Loader";
import { Link } from "react-router-dom";
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
    taxAmt: "",
    customer_id: "",
    order: "",
    missingItmCharges: "",
    customerOwe: "",
    insuranceAmt: "",
    leaveID: "",
    returnAmt: "",
    totalPaid: "",
    orderBarcode: "",
    product_Array: "",
  };

  handleChange = (e, id = "") => {
    this.setState({ [e.target.name]: e.target.value });
  };

  async componentDidMount() {
    const { order } = this.props;
    const { data } = this.props.location
    if (data) {
      this.setState({
        customer_id: data.customer,
        order: data.order,
        insuranceAmt: data.order[0].insuranceAmt,
        barcodesArray: data.barcodesArray,
        taxAmt: data.order[0].taxAmt,
        totalPaid: data.order[0].total,
      });
    }
    await this.props.getCustomer(this.state.customer_id);

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
                  title: product_name + " | " + color_name + " | " + size_name,
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

  customerOwe = () => {
    const { insuranceAmt, missingItmCharges } = this.state;
    let customerOwe;
    if(missingItmCharges > insuranceAmt){
      customerOwe = missingItmCharges - insuranceAmt
    }
    else if(missingItmCharges <= insuranceAmt){
      customerOwe = insuranceAmt - missingItmCharges
    }
    return customerOwe;
  }

  returnAmt = () => {
    const { insuranceAmt, missingItmCharges } = this.state;
    let returnAmt;
    if(missingItmCharges > insuranceAmt){
      returnAmt = missingItmCharges - insuranceAmt
    }
    else if(missingItmCharges <= insuranceAmt){
      returnAmt = insuranceAmt - missingItmCharges
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
    let { order } = this.props.location.data;
    let { barcodesArray } = this.state;
    console.log("barcodesArray", barcodesArray)
    const { products } = this.props;
    if (products && barcodesArray) {
      let sortedAray = this.getSortedData(products);
      if (sortedAray) {
        barcodesArray.forEach((element) => {
          productarray.push(
            sortedAray.filter((f) => f.barcode == element.barcode)
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

            <div style={{ float: "left", width: "100%" }} >
              <input
                type="text"
                value={`${b[0].title} ${"|"} ${b[0].barcode}`}
                className="form-control mm-input s-input text-center"
                placeholder="Barcode"
                id="widthBr"
                style={{ width: "60%" }}
                readOnly
              />

              <input
                type="text"
                value={`${b[0].price}`}
                className="form-control mm-input s-input text-center"
                placeholder="Barcode"
                id="setSize"
                name="total"
                readOnly

              />
            </div>
            <br />

          </div>

        </div>

      </>
    ))
  }


  missingProducts = () => {
    let m_productarray = [];
    let { order } = this.props.location.data;
    let { orderedBarcode } = this.props.location.data;
    let { barcodesArray } = this.state;
    for (var i = 0; i < orderedBarcode.length; i++) {
      const m_product = orderedBarcode.filter((f) => f != barcodesArray)
      console.log("m_product", m_product)

    }
    let m_barcodeArray = [];

    console.log("m_barcodeArray", m_barcodeArray)
    return;
    const { products } = this.props;
    if (products && barcodesArray) {
      let sortedAray = this.getSortedData(products);
      if (sortedAray) {
        barcodesArray.forEach((element) => {
          m_productarray.push(
            sortedAray.filter((f) => f.barcode == element.barcode)
          );
          return m_productarray;
        });
      }
    }
    this.state.m_productarray = m_productarray
    return m_productarray.map((b, b_index) => (
      <>
        <div id="sizes_box" key={b_index}>
          <div className="row" >

            <div style={{ float: "left", width: "100%" }} >
              <input
                type="text"
                value={`${b[0].title} ${"|"} ${b[0].barcode}`}
                className="form-control mm-input s-input text-center"
                placeholder="Barcode"
                id="widthBr"
                style={{ width: "60%" }}
                readOnly
              />

              <input
                type="text"
                value={`${b[0].price}`}
                className="form-control mm-input s-input text-center"
                placeholder="Barcode"
                id="setSize"
                name="total"
                readOnly

              />
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
        <div id="sizes_box" key={b_index} >
          <div className="row" style={{ 'alignContent': 'center' }} >

            <input
              type="text"
              value={`${b[0].title} ${"|"} ${b[0].barcode}`}
              className="form-control mm-input s-input text-center"
              placeholder="Barcode"
              name="barcode"
              id="widthBr"
              readOnly
              style={{ width: "240px", color: 'black' }}
            />

            <input
              type="text"
              className="form-control mm-input s-input text-center"
              placeholder="Price"
              id="setSize"
              readOnly
              name="total"
              style={{ color: 'black', width: '120px' }}
              value={`${b[0].price}`}

            />
          </div>
        </div>

      </>
    ))
  }



  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ saving: true });

    const state = { ...this.state };
    const { user } = this.props.auth;
    const { customer } = this.props;
    const { order } = this.props.location.data;
    const orderBarcode = shortid.generate();
    this.setState({
      orderBarcode: orderBarcode

    })
    if (order) {
      const invoiceReturn = {
        order_id: order[0]._id,
        customer_id: order[0].customer,
        user_id: user._id,
        type: "Return-Invoice",
        orderBarcode: state.orderBarcode
      }
      await this.props.addNewInvoice(invoiceReturn);
      this.printBarcode(orderBarcode)

    }

    let { product_Array } = this.state;

    if (product_Array) {
      let products = [];
      let counter = 1;

      product_Array.forEach(async (pd, p_index) => {
        await this.props.getProductById(pd[0].product_id); // <-- Error is here this should give updated product in every loop

        let { product } = this.props;
        counter++;
        // console.log('got from db', product);
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
          // orderBarcode: this.generateOrderBarcode(order[0]._id)
        }
        this.props.updateRentedProduct(rentedProduct, order[0]._id)
      });

    }
    this.setState({ saving: false });

  };
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

    const { customer } = this.props;
    const { data } = this.props.location;
    if (this.props.location.data == undefined) {
      return <Redirect to="/returnproduct" />;

    }
    const { order } = data;

    const { barcodesArray } = data
    const { customerOwe, insuranceAmt, missingItmCharges } = this.state;

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

                                  <h3>{(customer) ? `${customer[0].name}${"#"}${customer[0].contactnumber}` : ""}</h3>
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

                                  <h3>Missing Products</h3>
                                  {this.missingProducts()}
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
                                            value={missingItmCharges}
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
                                            value={this.state.order ? `${this.state.order[0].insuranceAmt}` : "$0"}
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
                                            value={(insuranceAmt && missingItmCharges) ? `${this.customerOwe()}` : "0"}
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
                                            value={(customerOwe && insuranceAmt && missingItmCharges) ? `${this.returnAmt()}` : "0"}
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

                                          <h4 id="padLeft">Leave ID</h4>
                                        </div>
                                        <div style={{ 'float': 'right', 'paddingRight': '170px' }}>

                                          <div className="">
                                            <input
                                              // className="custom-control-input"
                                              type="radio"
                                              name="leaveID"
                                              value={true}
                                              onChange={(e) => this.handleChange(e)}
                                              checked={this.state.leaveID === "true"}
                                            />
                                            <label
                                            // className="custom-control-label"
                                            >YES</label>
                                          </div>
                                          <div className="">
                                            <input
                                              type="radio"
                                              name="leaveID"
                                              value={false}
                                              onChange={(e) => this.handleChange(e)}
                                              checked={this.state.leaveID === "false"}
                                            />
                                            <label
                                            >NO</label>
                                          </div>                    </div>
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
                                            data-toggle="modal"
                                            data-backdrop="false"
                                            data-target="#primary"
                                          ><i className="ft-check"></i> Submit &amp; Generate Invoice	</button>
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
                <a href="https://www.sutygon.com" id="pixinventLink" target="_blank" className="text-bold-800 primary darken-2">SUTYGON-BOT </a>, All rights reserved. </span></p>
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
                        <div className="form-group">
                          <div style={{ 'float': 'left' }}>

                            <h4>{(customer) ? `${customer[0].name}${"#"}${customer[0].contactnumber}` : ""}</h4>
                          </div>
                          <div style={{ 'float': 'right' }}>
                            <h4>{(data) ? `${"Order"}${"#"} ${order[0].orderNumber}` : ""}</h4>

                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div id="sizes_box">
                          {this.invoiceproductBox()}

                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>
                              <h6 id="padLeft">Tax amount</h6>
                            </div>
                            <div className="col-md-6" style={{ 'textAlign': 'center', 'color': 'black' }}>

                              <h6 >
                                {this.state.taxAmt}
                              </h6>
                            </div>

                          </div>


                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>

                              <h6 id="padLeft">Insurance amount</h6>
                            </div>
                            <div className="col-md-6" style={{ 'textAlign': 'center', 'color': 'black' }}>
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

                            <div className="col-md-6 text-center" style={{ 'color': 'black' }}>



                              <h6 >
                                {this.state.missingItmCharges}
                              </h6>

                            </div>

                          </div>




                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>

                              <h6 id="padLeft">Amount Return to customer</h6>
                            </div>
                            <div className="col-md-6" style={{ 'textAlign': 'center', 'color': 'black' }}>
                              <h6 >

                                {(customerOwe && insuranceAmt && missingItmCharges) ? `${this.returnAmt()}` : "0"}
                              </h6>
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
                            <div style={{ 'textAlign': 'center', 'color': 'black', 'marginLeft': '25px' }}>
                              <h6>
                                {moment(this.state.rentDate).format('DD/MMM/YYYY')}

                              </h6>
                            </div>


                          </div>



                          <div className="row">
                            <div className="col-md-6" style={{ 'float': 'left', 'color': 'black' }}>
                              <h6 >Return Date</h6>
                            </div>

                            <div style={{ 'textAlign': 'center', 'color': 'black', 'marginLeft': '25px' }}>
                              <h6 >

                                {moment(this.state.returnDate).format('DD/MMM/YYYY')}
                              </h6>
                            </div>


                          </div>


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


                                  {`${"FINAL INVOICE TOTAL: $"}${this.finalInVoiceTotal()}`}

                                />
                              </div>

                            </div>
                          </div>
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
                          <div className="row">
                            <p>For questions and contact information please check out
                                              <a href="https://www.sutygon.com" id="pixinventLink" target="_blank" className="text-bold-800 primary darken-2">www.sutygon-bot.com</a></p>
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
};

const mapStateToProps = (state) => ({
  products: state.product.products,
  product: state.product.product,
  customer: state.customer.customer,
  auth: state.auth,

});
export default connect(mapStateToProps, {
  getCustomer, getAllProducts, getProductById, updateProductIndex, updateRentedProduct, addNewInvoice,



})(MatchBarcodes);