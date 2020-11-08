import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import { getOrderbyCustomerNumber, getOrderbyOrder, getOrderbyID } from "../../../actions/returnproduct";
import { getAllProducts } from "../../../actions/product";
import { getCustomer } from "../../../actions/customer";
import Loader from "../../layout/Loader";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "../../../custom.css"

class ReturnProduct extends Component {
  state = {
    customer: "",
    orderNumber: "",
    customer_id: "",
    selectedOrder: false,
    orderId: "",
    seletedOrder: "",
    product_Array: "",
    tryAgain: false,
    isSearched:false
  };

  async componentDidMount() {
    await this.props.getAllProducts();
    }

  tryAgain = (e) => {
    e.preventDefault();
    this.setState({
      tryAgain: true
    })
    var orderNumber = document.getElementById("orderNumber");
    var contactNumber = document.getElementById("contactnumber");
    var statusBox = document.getElementById("statusBox");
    contactNumber.value = "";
    contactNumber.focus();
    statusBox.value = "";
    orderNumber.value = ""

  }

  //handle change for input fields
  handleChange = (e, id = "") => {
    this.setState({ [e.target.name]: e.target.value });
  };
  //search by Customer Number
  onSubmitCustomer = async (e) => {
    e.preventDefault();
    this.setState({ saving: true ,});
    const state = { ...this.state };
    await this.props.getOrderbyCustomerNumber(state.customer.trim());
    const { orders } = this.props
    if(orders){
    await this.props.getCustomer(orders[0].customer);
    }
    this.setState({ saving: false, tryAgain: false , orders: orders });
  };
  //search by order number
  onSubmitOrderNumber = async (e) => {
    e.preventDefault();
    this.setState({ saving: true });

    const state = { ...this.state };
    await this.props.getOrderbyOrder(state.orderNumber.trim());
    const { orders } = this.props
    if(orders){

    await this.props.getCustomer(orders[0].customer);
    }
    this.setState({ saving: false, tryAgain: false, orders: orders });
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


  productBox = () => {

    const { seletedOrder } = this.state;
    let productarray = [];

    let { barcodes } = seletedOrder[0];

    const { products } = this.props;
    if (products) {

      let sortedAray = this.getSortedData(products);
      if (sortedAray) {

        barcodes.forEach((element) => {
          productarray.push(
            sortedAray.filter((f) => f.barcode.toString() === element)
          );
        });

        this.state.product_Array = productarray;
        return productarray.map((p, p_index) => {
         return <>  <div className="form-group">
            <div className="row" key={p_index}>

              <input
                type="text"
                value={`${p[0].title} ${"|"} ${p[0].barcode}`}
                className="form-control mm-input s-input text-center text-dark"
                placeholder="Barcode"
                id="setSize1"
                style={{ 'width': '110%' }}
                readOnly
              />
              
            </div>
          </div>
        </>
        })
      }
    }
  }
  CutomerBox =  () => {
    const { orders } = this.props;
    const { customeR } = this.props;
    

    let returningOrders = orders.filter((f => f.status !== "Completed"))
    return returningOrders.map((o, o_index) => (
      <>
        <div className="col-md-12">
          <div className="row form-group"  onClick={(e) => this.selectedOrder(e, o._id)}
>
          <div className="col-md-11">
              <input
                type="text"
                id="statusBox"
                className="form-control mm-input text-center"
                style={{ 'color': '#495057', 'width': '-webkit-fill-available' }}
                value={(o && customeR) ? `${"Order#"}${o.orderNumber}${"             "}${customeR.name}${"             "}${"OrderStatus-"}${o.status}` : "No Order Found"}
                readOnly />
            </div>
           
          </div>
        </div>
      </>

    ))
  }

  selectedOrder = (e, order_id) => {
    this.setState({
      selectedOrder: true
    })
    e.preventDefault()
    const orderID = order_id
    const { orders } = this.props;
    const seletedOrder = orders.filter((f) => f._id === orderID);
    this.setState({
      seletedOrder: seletedOrder
    })
  }

  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/" />;
    }

    const { orders } = this.state;
    const { customeR } = this.props;

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

                        <div className="card-body table-responsive">
                          <form onSubmit={(e) => this.onSubmitCustomer(e)}>

                            <div className="form-group">
                              <h3>Enter Customer 10-digit phone number</h3>
                              <div className="position-relative has-icon-right">
                                <input
                                  name="customer"
                                  type="text"
                                  placeholder="Search"
                                  className="form-control round"
                                  id="contactnumber"
                                  min="0"
                                  ref="contactnumber"
                                  onChange={(e) => this.handleChange(e)}
                                />
                                <div className="form-control-position">
                                  <button
                                    type="submit"
                                    className="mb-2 mr-2 btn ft-search">
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>

                          <form onSubmit={(e) => this.onSubmitOrderNumber(e)}>
                            <div className="form-group">
                              <h3>Or Scan/Enter Order Number</h3>
                              <div className="position-relative has-icon-right">
                                <input
                                  name="orderNumber"
                                  type="text"
                                  placeholder="Search"
                                  className="form-control round"
                                  id="orderNumber"
                                  min="0"
                                  ref="orderNumber"
                                  onChange={(e) => this.handleChange(e)} />
                                <div className="form-control-position">
                                  <button
                                    type="submit"
                                    className="mb-2 mr-2 btn ft-search">
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>

                          {(this.props.orders && this.state.tryAgain === false) ? <>
                            <div id="colors_box" >
                              <div className="row color-row">
                                <div className="row">
                                  <div className="col-md-12">
                                    <h3>Is this the One</h3>
                                  </div>
                                </div>
                                {(this.props.orders && this.state.tryAgain === false && !!this.props.orders.length) ? this.CutomerBox() :

                                  <div className="col-md-12" >
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        id="statusBox"
                                        className="form-control mm-input text-center"
                                        style={{ 'color': '#495057' }}
                                        value={"No Order Found"}
                                        readOnly />
                                    </div>
                                  </div>
                                }

                                <div className="col-md-12">
                                  <div className="text-center">
                                    <button
                                      type="button"
                                      className="btn btn-raised btn-primary round btn-min-width mr-1 mb-1 text-center"
                                      onClick={(e) => this.tryAgain(e)}
                                      id="btnSize" ><i className="ft-rotate-cw"></i> Try Again
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </> : ""}
                          <div id="colors_box">
                            {(this.state.selectedOrder === true && this.state.tryAgain === false) ?
                              <div className="row color-row" id="statusBox1">
                                <div className="col-md-12">
                                  <div className="form-group">
                                    <div style={{ 'float': 'left' }}>
                                      <h3>{(customeR) ? `${customeR.name}${"#"}${customeR.contactnumber}` : ""}</h3>
                                    </div>
                                    <div style={{ 'float': 'right' }}>
                                      <h3>{(orders && this.state.selectedOrder === true) ? `${"Order"}${"#"} ${this.state.seletedOrder[0].orderNumber}` : ""}</h3>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-12">
                                {this.state.seletedOrder.length > 0 ?

                                      <div id="colors_box">
                                         {this.productBox()} 
                                        <div className="btn-cont text-center">
                                          <div className="form-group">
                                            <Link
                                              to={{
                                                pathname: "/scanBarcode",
                                                data: {
                                                  customer: this.props.customeR,
                                                  order: this.state.seletedOrder
                                                }
                                              }}
                                              type="submit"
                                              className="btn btn-raised btn-primary round btn-min-width mr-1 mb-1 text-center"
                                              id="btnSize2" ><i className="ft-check"></i> Next</Link>
                                          </div>
                                        </div>
                                      </div> 
                                   :""}
                                </div>
                              </div> 
                                : ""}  
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
              <a href="https://www.sutygon.com" rel="noopener noreferrer"  id="pixinventLink" target="_blank" className="text-bold-800 primary darken-2">SUTYGON-BOT </a>, All rights reserved. </span></p>
            </footer>
          </div>
        </div>
      </React.Fragment>

    );
  }
}

ReturnProduct.propTypes = {
  getOrderbyCustomerNumber: PropTypes.func.isRequired,
  getOrderbyOrder: PropTypes.func.isRequired,
  getCustomer: PropTypes.func.isRequired,
  getAllProducts: PropTypes.func.isRequired,
  getOrderbyID: PropTypes.func.isRequired,
  orders: PropTypes.array,
  customeR: PropTypes.array,
  auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
  products: state.product.products,
  orders: state.returnproduct.returnorder,
  customeR: state.customer.customer,
  auth: state.auth,

});
export default connect(mapStateToProps, {
  getOrderbyCustomerNumber,
  getOrderbyOrder,
  getCustomer,
  getAllProducts,
  getOrderbyID


})(ReturnProduct);