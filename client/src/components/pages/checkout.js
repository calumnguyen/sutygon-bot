import React, { Component } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import shortid from "shortid";
import Loader from "../layout/Loader";
import { getCustomer } from "../../actions/customer";
import { getAllProducts } from "../../actions/product";
import { OCAlertsProvider } from '@opuscapita/react-alerts';
import { OCAlert } from '@opuscapita/react-alerts';

class Checkout extends Component {
  state = {
    barcode: [],
    customer_id: "",
  };

  async componentDidMount() {
    await this.props.getAllProducts();

    const { data } = this.props.location;

    if (data) {
      this.setState({
        customer_id: data.customer.id,
      });
    }
    await this.props.getCustomer(this.state.customer_id);
  }

  addBarcodeRow = () => {
    let { barcode } = this.state; // get all barcode
    barcode.push({
      id: shortid.generate(),
      barcode: "",
    });
    this.setState({ barcode });
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
                  isRented: size.barcodes[i].isRented,

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
 
onScanBarcode = (e) => {
  e.preventDefault();
  const { products } = this.props;
  if (products) {
    const sortedArray = this.getSortedData(products)
    const bc = e.target[0].value;
    const { barcode } = this.state;
    let m_barcode = [];
    barcode.forEach((barcode, b_index) => {
      m_barcode.push(
        barcode.barcode)
      })
    e.target[0].value = '';
    const isInclude = m_barcode.includes(bc)
    if (isInclude === true) {
      // error message
      OCAlert.alertError('This barcode already exist in Order! Try again', { timeOut: 3000 });
      return;
    }

    const barcodeArry = sortedArray.filter((barcode) => barcode.barcode == bc.trim())[0]; // get current barode
console.log(barcodeArry)
    if (barcodeArry === undefined) {
      OCAlert.alertError(`This barcode does not exist`, { timeOut: 3000 });
      return;

    }
    if (barcodeArry.isRented === true) {
      OCAlert.alertError(`This barcode is already Rented. Please try again!`, { timeOut: 3000 });
      return;
    }
    else if ((barcodeArry.isRented == undefined) || (barcodeArry.isRented == false)) {
      const { barcode } = this.state;
      barcode.push({
        id: shortid.generate(),
        barcode: bc.trim(),
      });
      this.setState({ barcode });
    }
  }
}
removeBarcodeRow = (id) => {
  let { barcode } = this.state;
  barcode = barcode.filter((barcode) => barcode.id !== id); // get current barode
  this.setState({ barcode });
};

handleChange = (e, barcode_id = "") => {
  let name = e.target.name;
  let value = e.target.value;
  let { barcode } = this.state;

  let barcode_obj = barcode.filter((barcode) => barcode.id == barcode_id)[0];
  const barcodeIndex = barcode.findIndex(
    (barcode) => barcode.id == barcode_id
  );
  barcode_obj[name] = value;
  barcode[barcodeIndex] = barcode_obj;

  this.setState({ barcode });
};

getBarcodeRow = () => {
  let { barcode } = this.state; // get all barcode
  if (barcode) {
    return barcode.map((barcode) => (
      <div id="sizes_box" key={barcode.id || barcode._id}>
        <div className="row">
          <div className="left">
            <input
              type="text"
              className="form-control mm-input s-input"
              placeholder="Barcode"
              name="barcode"
              id="widthBr"
              style={{ width: "-webkit-fill-available" }}
              onChange={(e) => this.handleChange(e, barcode.id)}
              value={barcode.barcode}
            />
          </div>
          <div className="right">
            <button
              type="button"
              onClick={() => this.removeBarcodeRow(barcode.id)}
              className="btn btn-raised btn-sm btn-icon btn-danger mt-1"
            >
              <i className="fa fa-minus"></i>
            </button>
          </div>
          <div className="right">
            <button
              type="button"
              className="btn btn-raised btn-sm btn-success mt-1"
            >
              <i className="=ft ft-edit"></i>
            </button>
          </div>
        </div>
      </div>
    ));
  }
};

render() {
  const { auth } = this.props;
  if (!auth.loading && !auth.isAuthenticated) {
    return <Redirect to="/" />;
  }

  //   if(this.props.location.data == undefined){
  //     return <Redirect to="/rentproduct" />;

  //  }
  if (this.props.saved) {
    return <Redirect to="/orders" />;
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
                        <form className="" action="index.html" method="post">
                          <div id="colors_box">
                            <div className="row color-row">
                              <div className="col-md-12">
                                <div className="form-group">
                                  <h2>Scan Barcode To Add Items</h2>
                                </div>
                              </div>

                              <div className="col-md-12">
                                <div className="form-group">
                                  <h3>
                                    {customer && customer[0].name}{" "}
                                    {`${"#"}${customer && customer[0].contactnumber
                                      }`}
                                  </h3>
                                </div>
                              </div>

                              <div className="col-md-12">
                                <div className="form-group">
                                  <form onSubmit={e => this.onScanBarcode(e)}>
                                    <input className="form-control mm-input col-md-12" maxLength={8} minLength={8} type="text" />
                                  </form>
                                </div>
                              </div>

                              <div className="col-md-12">
                                {this.getBarcodeRow()}

                                <div className="row">
                                  <div className="col-md-12 btn-cont">
                                    <div className="form-group mb-0">
                                      <button
                                        type="button"
                                        onClick={() => this.addBarcodeRow()}
                                        className="btn"
                                      >
                                        <i className="fa fa-plus"></i> Add
                                          Barcode
                                        </button>
                                    </div>
                                  </div>
                                </div>

                                <div className="row text-center ">
                                  <div className="col-md-12 btn-cont">
                                    <div className="form-group">
                                      <Link
                                        to={{
                                          pathname: "/rentorder",
                                          data: {
                                            customer_id: (customer) && customer[0]._id,
                                            barcode: this.state.barcode,
                                          },
                                        }}
                                        type="button"
                                        className="btn btn-raised btn-primary round btn-min-width mr-1 mb-1"
                                        id="btnSize2"
                                      >
                                        <i className="ft-check"></i> Checkout
                                        </Link>
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
              </section>
            </div>
          </div>
          <footer className="footer footer-static footer-light">
            <p className="clearfix text-muted text-sm-center px-2"><span>Quyền sở hữu của &nbsp;{" "}
              <a href="https://www.sutygon.com" id="pixinventLink" target="_blank" className="text-bold-800 primary darken-2">SUTYGON-BOT </a>, All rights reserved. </span></p>
          </footer>
        </div>
      </div>
      <OCAlertsProvider />

    </React.Fragment>
  );
}
}

Checkout.propTypes = {
  getAllProducts: PropTypes.func.isRequired,
  getCustomer: PropTypes.func.isRequired,
  saved: PropTypes.bool,
  auth: PropTypes.object,
  customer: PropTypes.array,
};

const mapStateToProps = (state) => ({
  saved: state.rentproduct.saved,
  auth: state.auth,
  customer: state.customer.customer,
  products: state.product.products,

});
export default connect(mapStateToProps, {
  getCustomer,
  getAllProducts
})(Checkout);
