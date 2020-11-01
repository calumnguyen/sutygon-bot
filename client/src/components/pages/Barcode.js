import React, { Component } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import { getAllProducts, updateProduct, getProductById, barcodeUpdateProduct, deleteItem, deleteProduct } from "../../actions/product";
import Loader from "../layout/Loader";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import shortid from "shortid";
import { OCAlertsProvider } from '@opuscapita/react-alerts';
import { OCAlert } from '@opuscapita/react-alerts';
import { confirmAlert } from "react-confirm-alert";



import "../../custom.css";

var JsBarcode = require('jsbarcode');
var { createCanvas } = require("canvas");


class Barcode extends Component {
  state = {
    dataType: "without_barcode",
    saving: false,
  };

  async componentDidMount() {
    await this.props.getAllProducts();
  }

  // return sorted products for barcodes / without barcodes
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

              let length;
              if (this.state.dataType == "without_barcode") { // show sizes without barcodes
                // if we have some barcodes then skip that 
                // number of rows for the current size
                if (size.barcodes) {
                  // if barcodes availble then length should be qty - barcodes length
                  length = size.qty - size.barcodes.length;
                } else {
                  length = size.qty;
                }
              } else { // show sizes with barcode
                if (size.barcodes) {
                  length = size.barcodes.length;
                } else {
                  length = 0;
                }
              }

              let i;
              for (i = 0; i < length; i++) {
                let row = {
                  product_id: product_id,
                  color_id: color_id,
                  size_id: size_id,
                  short_product_id: product.productId,
                  barcodeIndex: i, // will be used to identify index of barcode when changeBarcode is called
                  title: product_name + " | " + color_name + " | " + size_name,
                  barcodes: (size.barcodes) ? size.barcodes : []
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

  handleChange = (type = "") => {
    this.setState({ 'dataType': type });
  };

  getTAbleRows = () => {

    let products = this.props.products;
    if (products) {
      let sortedProducts = this.getSortedData(products);
      // let tbl_sno = 1;
      if (sortedProducts) {
        if (sortedProducts.length === 0) {
          return (
            <tr>
              <td colSpan={10} className="text-center">
                No product Found
            </td>
            </tr>
          );
        }
        return sortedProducts.map((product, i) => {
          return (
            <tr key={i}>
              <td>
                {product.short_product_id}
              </td>
              <td>
                <div className="form-group">
                  <div className="">
                    {product.title}
                  </div>
                </div>
              </td>
              {(this.state.dataType == 'with_barcode') && (
                <td>
                  <span className="badge badge-secondary">{product.barcodes[product.barcodeIndex].barcode}</span>
                </td>
              )}
              <td>
                {(this.state.dataType == 'without_barcode') ? (
                  <button
                    type="button"
                    className="btn btn-raised btn-primary round btn-min-width mr-1 mb-1"
                    onClick={(e) => this.genPrintRandBarcode(e, product.product_id, product.color_id, product.size_id)}
                  >
                    Generate &amp; PRINT random barcode
                  </button>
                ) : (
                    <button
                      type="button"
                      className="btn btn-raised btn-primary round btn-min-width mr-1 mb-1"
                      onClick={(e) => this.changeBarcode(e, product.product_id, product.color_id, product.size_id, product.barcodeIndex)}
                    >
                      Change Barcode
                    </button>
                  )}
              </td>
              <td>
                {(this.state.dataType == 'without_barcode') ? (
                  <form onSubmit={(e) => this.OnSubmitScanBarcode(e, product.product_id, product.color_id, product.size_id)}>
                    <input
                      type="text"
                      className="form-control mm-input"
                      placeholder={"Scan existing Barcode"}
                      maxLength={8}
                      minLength={8}
                    />
                  </form>
                ) : (
                    <button
                      type="button"
                      className="btn btn-raised btn-primary round btn-min-width mr-1 mb-1"
                      onClick={(e) => this.printBarcode(product.barcodes[product.barcodeIndex].barcode)}
                    >
                      Print Barcode
                    </button>
                  )}
              </td>
              <td>
                {(this.state.dataType == 'without_barcode') ? (
                  <button
                    type="button"
                    className="btn btn-raised btn-primary round btn-min-width mr-1 mb-1"
                    onClick={(e) => this.deleteConfirm(e, product.product_id, product.color_id, product.size_id)}
                  >
                    Delete Item
                  </button>
                ) : (
                    <button
                      type="button"
                      className="btn btn-raised btn-primary round btn-min-width mr-1 mb-1"
                      onClick={(e) => this.deleteConfirm(e, product.product_id, product.color_id, product.size_id, product.barcodeIndex)}
                    >
                      Delete Item
                    </button>
                  )}
              </td>
            </tr>
          );
        });
      }
    }

  };

  // return sorted products for barcodes
  getBarcodeData = (products) => {
    // looping through prducts
    let barcodes = [];
    products.forEach((product, p_index) => {
      if (product.color) {
        product.color.forEach((color, c_index) => {
          if (color.sizes) {
            color.sizes.forEach((size, s_index) => {
              let length;
              if (size.barcodes) {
                length = size.barcodes.length;
              } else {
                length = 0;
              }
              for (var i = 0; i < length; i++) {
                barcodes.push(size.barcodes[i].barcode);
              }
            });
          }
        });
      }
    }); // products foreach ends here
    return barcodes;
  };

  // runs when existing barcode is scanned
  OnSubmitScanBarcode = async (e, product_id, color_id, size_id) => {
    e.preventDefault();
    const {products}=this.props;
    const barcodesData = this.getBarcodeData(products);
    // get barcode input value
    let barcode = e.target[0].value;
    const isInclude = barcodesData.includes(barcode)
    if(isInclude === true){
          // error message
      OCAlert.alertError('This barcode already exist! Try again', { timeOut: 3000 });
      return;
    }
    // empty barcode input
    else if(isInclude === false){
    e.target[0].value = '';
    this.saveBarCode(barcode, product_id, color_id, size_id);
    // success message
    OCAlert.alertSuccess('Barcode Scanned and Added Successfully!');
  }
  }

  // generate and print random bar code
  genPrintRandBarcode = async (e, product_id, color_id, size_id) => {
    // generate random barcode
    let barcode = Math.floor(Math.random() * 99999999) + 11111111;
    this.saveBarCode(barcode, product_id, color_id, size_id);
    this.printBarcode(barcode);
    OCAlert.alertSuccess('Barcode Generated and Saved Successfully!');
  }


  deleteConfirm = async (e, product_id, color_id, size_id, barcodeIndex) => {
    confirmAlert({
      title: "Delete Item",
      message: "Are you sure you want to delete this Item?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.deleteItem(e, product_id, color_id, size_id, barcodeIndex);
          },
        },
        {
          label: "No",
          onClick: () => { },
        },
      ],
    });
  }

  // Delete Item
  deleteItem = async (e, product_id, color_id, size_id, barcodeIndex) => {
    // get product by id
    await this.props.getProductById(product_id);
    const { product } = this.props;
    // return;

    let total_qty = 0;
    if (product && product.color) {
      // loop through product colors
      product.color.forEach((color, c_index) => {
        // get right color obj
        if (color._id == color_id) {
          // get right size obj
          if (color.sizes) {
            color.sizes.forEach((size, s_index) => {
              total_qty += parseInt(size.qty);
              if (size.id == size_id) {
                // decrease size qty
                if (size.qty > 0) {
                  size.qty = parseInt(size.qty) - 1;

                  // if barcode is availble remove it too
                  if (typeof barcodeIndex !== "undefined") {
                    size.barcodes.splice(barcodeIndex, 1);
                  }
                }
              }
            })
          }
        }
      })
      // update product for barcode only
      await this.props.deleteItem(product, product_id);

    }

    OCAlert.alertSuccess('Item Deleted Successfully!');
    this._deleteProduct();

  }

  _deleteProduct = async () => {
    const { product } = this.props
    let total_qty = 0;
    if (product && product.color) {
      // loop through product colors
      product.color.forEach((color, c_index) => {
        if (color.sizes) {
          color.sizes.forEach((size, s_index) => {
            total_qty += parseInt(size.qty);
          })
        }
      })
      if (total_qty == 0) {
        await this.props.deleteProduct(product._id);
        OCAlert.alertSuccess('Product Deleted Successfully!');

      }
      return;
    }
  }

  // change existing barcode in size object and correct index
  changeBarcode = async (e, product_id, color_id, size_id, barcodeIndex) => {
    confirmAlert({
      title: "Change Barcode",
      message: "Are you sure you want to Remove barcode for this item?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.saveBarCode(null, product_id, color_id, size_id, 'update', barcodeIndex);
            OCAlert.alertSuccess('Barcode is Removed and moved to Without barcode tab');
          },
        },
        {
          label: "No",
          onClick: () => { },
        },
      ],
    });
  }

  printBarcode = (barcode) => {
    var canvas = createCanvas();

    // convert barcode to image and open in new window and print
    JsBarcode(canvas, barcode);
    let html = '<img src="' + canvas.toDataURL() + '" style="width: 100%" />';
    let newWindow = window.open("", '_blank', 'location=yes,height=570,width=720,scrollbars=yes,status=yes');
    newWindow.document.write(html);
    newWindow.window.print();
    newWindow.document.close();
  }

  // saves the barcode in specific item > color > size object
  saveBarCode = async (barcode, product_id, color_id, size_id, mode = 'add', barcodeIndex = '') => {

    // get product by id
    await this.props.getProductById(product_id);
    const { product } = this.props;

    if (product && product.color) {
      // loop through product colors
      product.color.forEach((color, c_index) => {
        // get right color obj
        if (color._id == color_id) {
          // get right size obj
          if (color.sizes) {
            color.sizes.forEach((size, s_index) => {
              if (size.id == size_id) {
                // check if current size obj contain barcodes or not
                if (size.barcodes) {

                  if (mode == 'add') {
                    size.barcodes.push({ barcode });  // Add barcode
                  } else {
                    // size.barcodes[barcodeIndex].barcode = barcode; // Change barcode
                    size.barcodes.splice(barcodeIndex, 1);
                  }
                } else {
                  // create new barcode array
                  size.barcodes = [];
                  // and push this new barcode to it
                  size.barcodes.push({ barcode });
                }
              }
            })
          }
        }
      })

      // update product for barcode only
      await this.props.barcodeUpdateProduct(product, product_id);
      return barcode;
    }
  }

  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/" />;
    }
    // if (this.props.saved) {
    //   return <Redirect to="/barcode" />;
    // }


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
                        <h4 className="form-section">Barcode</h4>
                      </div>

                      <div className="card-body">
                        <div className="custom-radio custom-control-inline ml-3">
                          <input
                            type="radio"
                            id="customRadioInline1"
                            name="dataType"
                            className="custom-control-input"
                            onChange={(e) => this.handleChange("without_barcode")}
                            checked={this.state.dataType === "without_barcode"}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="customRadioInline1"
                          >
                            Items Without Barcode
                          </label>
                        </div>

                        <div className="custom-radio custom-control-inline ml-3">
                          <input
                            type="radio"
                            id="customRadioInline2"
                            name="dataType"
                            className="custom-control-input"
                            onChange={(e) => this.handleChange("with_barcode")}
                            checked={this.state.dataType === "with_barcode"}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="customRadioInline2"
                          >
                            Items With Barcode
                          </label>
                        </div>

                        <br />
                        <br />
                        <table className="table text-center">
                          <thead>
                            <tr>
                              <th>Product ID</th>
                              <th>Product</th>
                              {(this.state.dataType == "with_barcode") && (
                                <th>Barcode</th>
                              )}
                              <th>Change Barcode</th>
                              <th>Scan Barcode</th>
                              <th>Delete item</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.getTAbleRows()}
                          </tbody>
                          <tbody></tbody>
                        </table>
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

Barcode.propTypes = {
  saved: PropTypes.bool,
  getAllProducts: PropTypes.func.isRequired,
  updateProduct: PropTypes.func.isRequired,
  barcodeUpdateProduct: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  getProductById: PropTypes.func.isRequired,
  deleteProduct: PropTypes.func.isRequired,
  auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
  products: state.product.products,
  product: state.product.product,
  saved: state.product.saved,
  auth: state.auth,
});
export default connect(mapStateToProps, {
  getAllProducts,
  updateProduct,
  getProductById,
  barcodeUpdateProduct,
  deleteItem,
  deleteProduct
})(Barcode);
