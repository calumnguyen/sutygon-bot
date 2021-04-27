import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import shortid from "shortid";
import Loader from "../../layout/Loader";
import { getCustomer } from "../../../actions/customer";
import { getAllProductsAll } from "../../../actions/product";
import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";
import Axios from "axios";
import moment from "moment";
import DF from "date-diff";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
class Checkout extends Component {
  state = {
    barcode: [],
    customer_id: "",
    data: "",
    isModal: false,
    isLoading: false,
    errormsg: "",
    bc: "",
    getOrder: "",
    myRentDate: "",
    warningProduct: {},
    showWarning: false,
  };

  async componentDidMount() {
    await this.props.getAllProductsAll();

    const { state } = this.props.location;

    if (state) {
      this.setState({
        customer_id: state.customer,
        data: state.data,
        myRantDate: moment(state.data.rentDate).format("DD-MM-YYYY"),
        barcode: state.barcode ? state.barcode : [],
      });
    }
    if (this.state.customer_id) {
      await this.props.getCustomer(this.state.customer_id);
    }
  }

  addBarcodeRow = (product, mildCriticalQty, criticalQty, veryCriticalQty) => {
    let { barcode } = this.state; // get all barcode
    if (veryCriticalQty < 1) {
    } else if (criticalQty < 1)
      this.setState({
        showWarning: true,
        warningLabel: "Critical",
        warningProduct: product,
      });
    else if (mildCriticalQty < 1)
      this.setState({
        showWarning: true,
        warningLabel: "Mild Critical",
        warningProduct: product,
      });

    barcode.push({
      id: product.size_id,
      barcode: product.barcode,
      sameBarcode: product.sameBarcode,
      qty: product.qty,
      mildCriticalQty,
      criticalQty,
      veryCriticalQty,
      orderQty: 1,
    });
    this.setState({ barcode: [...barcode] });
  };

  onChangeOpenModal = () => {
    if (this.state.isModal) {
      this.setState({ isModal: !this.state.isModal });
    }
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
                  isLost: size.barcodes[i].isLost,
                  price: price,
                  sameBarcode: size.sameBarcode,
                  qty: size.sameBarcode ? size.qty : 1,
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

  onScanBarcode = async (e) => {
    e.preventDefault();
    const { products } = this.props;
    if (products) {
      const sortedArray = this.getSortedData(products);
      const bc = e.target[0].value;
      const { barcode } = this.state;

      let m_barcode = [];
      barcode.forEach((barcode, b_index) => {
        m_barcode.push(barcode.barcode);
      });
      e.target[0].value = "";
      const isInclude = m_barcode.includes(bc);

      if (isInclude === true) {
        // error message
        OCAlert.alertError(
          "Bạn đã bỏ sản phẩm này vào đơn hàng rồi. Vui lòng kiểm tra lại.",
          {
            timeOut: 5000,
          }
        );
        return;
      }
      const selectedProduct = sortedArray.filter(
        (barcode) => barcode.barcode.toString() === bc.trim()
      )[0]; // get current barode
      if (selectedProduct === undefined) {
        OCAlert.alertError(
          `Không có sản phẩm nào với mã sản phẩm này. Vui lòng kiểm tra lại.`,
          { timeOut: 5000 }
        );
        return;
      }

      // if (barcodeArry.isRented && barcodeArry.isRented === true) {
      //   OCAlert.alertError(
      //     `This barcode is already Rented. Please try again!`,
      //     { timeOut: 3000 }
      //   );
      //   return;
      // }
      // if (barcodeArry.isLost === true) {
      //   OCAlert.alertError(`This barcode is Lost. Please try again!`, {
      //     timeOut: 3000,
      //   });
      //   return;
      // }
      else {
        this.setState({ isLoading: true });
        const result = await Axios.get(
          `/api/rentedproducts/checkBarcode/${bc}`
        );
        if (!result.data?.length) {
          this.setState({ isLoading: false });
          this.addBarcodeRow(selectedProduct);
        } else {
          this.setState({ isLoading: false, getOrder: result.data });
          const res = this.compareDateOfOrder(result.data, selectedProduct);
          if (res) {
            this.addBarcodeRow(
              selectedProduct,
              res.mildCriticalQty,
              res.criticalQty,
              res.veryCriticalQty
            );
          }
        }
        this.setState({ isLoading: false });
      }
    }
  };
  removeBarcodeRow = (id) => {
    let { barcode } = this.state;
    barcode = barcode.filter((barcode) => barcode.id !== id); // get current barode
    this.setState({ barcode });
  };
  onProceed = () => {
    const { warningProduct } = this.state;
    if (warningProduct) this.addBarcodeRow(warningProduct, 0, 0, 0);
    this.setState({ isModal: false, warningProduct: {} });
  };

  compareDateOfOrder = (ordersArray, product) => {
    const newRentDate = new Date(this.state.data.rentDate);
    const newReturnDate = new Date(this.state.data.returnDate);
    if (!product.sameBarcode) {
      let date1 = new Date(ordersArray[0].returnDate);
      let diff = new DF(newRentDate, date1);
      const finalDays = Math.ceil(diff.days());
      if (finalDays <= -1) {
        this.setState({
          errormsg: "RẤT NGUY HIỂM",
          isModal: true,
          bc: product.barcode.toString(),
          warningProduct: product,
        });
        return false;
      }
      if (finalDays == 0) {
        this.setState({
          errormsg: "Nguy Hiểm",
          isModal: true,
          bc: product.barcode.toString(),
          warningProduct: product,
        });
        return false;
      }
      if (finalDays <= 5) {
        this.setState({
          errormsg: "Hơi Gần Ngày",
          isModal: true,
          bc: product.barcode.toString(),
          warningProduct: product,
        });
        return false;
      }
      return { warningQty: 1, criticalQty: 1 };
    } else {
      const veryCriticalOrders = [];
      const mildCriticalOrders = [];
      const criticalOrders = [];

      ordersArray.forEach((order) => {
        const { rentDate, returnDate } = order;
        const orderRentDate = new Date(rentDate);
        const orderReturnDate = new Date(returnDate);
        const veryCritical =
          (newRentDate >= orderRentDate && newRentDate <= orderReturnDate) ||
          (newReturnDate >= orderRentDate && newReturnDate <= orderReturnDate);
        const daysDifference = new DF(newRentDate, orderReturnDate).days();
        const mildCritical =
          newRentDate > orderReturnDate &&
          daysDifference <= 5 &&
          daysDifference > 1;
        const critical = newRentDate > orderReturnDate && daysDifference <= 1;
        if (critical) criticalOrders.push(order);
        if (mildCritical) mildCriticalOrders.push(order);
        if (veryCritical) veryCriticalOrders.push(order);
      });

      let veryCriticalQty = parseInt(product.qty);
      if (veryCriticalOrders.length) {
        veryCriticalOrders.forEach((order) => {
          const orderItem = order.orderItems.filter(
            (item) => item.barcode == product.barcode
          )[0];
          veryCriticalQty -= parseInt(orderItem.orderQty);
        });
        if (veryCriticalQty < 1) {
          this.setState({
            errormsg: "RẤT NGUY HIỂM",
            isModal: true,
            bc: product.barcode.toString(),
            warningProduct: product,
          });
          return false;
        }
      }

      let criticalQty = veryCriticalQty;
      if (criticalOrders.length) {
        criticalOrders.forEach((order) => {
          const orderItem = order.orderItems.filter(
            (item) => item.barcode == product.barcode
          )[0];
          criticalQty -= parseInt(orderItem.orderQty);
        });
      }

      let mildCriticalQty = criticalQty;
      if (mildCriticalOrders.length) {
        mildCriticalOrders.forEach((order) => {
          const orderItem = order.orderItems.filter(
            (item) => item.barcode == product.barcode
          )[0];
          mildCriticalQty -= parseInt(orderItem.orderQty);
        });
      }

      if (criticalQty < 0) {
        criticalQty = 0;
      }
      if (mildCriticalQty < 0) {
        mildCriticalQty = 0;
      }

      return { mildCriticalQty, criticalQty, veryCriticalQty };
    }
  };

  handleChange = (e, barcode_id = "") => {
    let name = e.target.name;
    let value = e.target.value;
    let { barcode } = this.state;

    let barcode_obj = barcode.filter((barcode) => barcode.id === barcode_id)[0];
    const barcodeIndex = barcode.findIndex(
      (barcode) => barcode.id === barcode_id
    );
    barcode_obj[name] = value;
    barcode[barcodeIndex] = barcode_obj;

    this.setState({ barcode });
  };

  renderBarcodeRow = () => {
    let { barcode } = this.state; // get all barcode
    if (barcode) {
      return barcode.map((barcodeItem, index) => {
        const isMildCritical = (qty) =>
          typeof barcodeItem.mildCriticalQty == "number"
            ? qty > barcodeItem.mildCriticalQty
            : false;
        const isCritical = (qty) =>
          typeof barcodeItem.criticalQty == "number"
            ? qty > barcodeItem.criticalQty
            : false;
        const isVeryCritical = (qty) =>
          typeof barcodeItem.veryCriticalQty == "number"
            ? qty > barcodeItem.veryCriticalQty
            : false;
        const isError = (qty) => qty < 1 || qty > barcodeItem.qty;

        const updateQty = (qty) => {
          const prevQty = barcode[index].orderQty;
          barcode[index].orderQty = qty;

          if (isError(qty) && !isError(prevQty)) {
            this.setState({
              showWarning: true,
              warningLabel: "Error",
              warningProduct: barcodeItem,
            });
          } else if (isVeryCritical(qty) && !isVeryCritical(prevQty)) {
            this.setState({
              showWarning: true,
              warningLabel: "Very Critical",
              warningProduct: barcodeItem,
            });
          } else if (isCritical(qty) && !isCritical(prevQty)) {
            this.setState({
              showWarning: true,
              warningLabel: "Critical",
              warningProduct: barcodeItem,
            });
          } else if (isMildCritical(qty) && !isMildCritical(prevQty)) {
            this.setState({
              showWarning: true,
              warningLabel: "Mild Critical",
              warningProduct: barcodeItem,
            });
          }

          this.setState({ barcode: [...barcode] });
        };

        return (
          <div id="sizes_box" key={barcodeItem.id || barcodeItem._id}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <input
                type="text"
                className="form-control mm-input s-input"
                placeholder="Barcode"
                name="barcode"
                id="widthBr"
                style={{ width: "-webkit-fill-available", color: "black" }}
                onChange={(e) => this.handleChange(e, barcodeItem.id)}
                value={barcodeItem.barcode}
              />
              {barcodeItem.sameBarcode && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginRight: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Qty:
                  <input
                    min={1}
                    onChange={(e) => updateQty(parseInt(e.target.value))}
                    onBlur={(e) => {
                      const value = parseInt(e.target.value);
                      if (value) {
                        if (value > barcodeItem.qty) updateQty(barcodeItem.qty);
                        else if (value < 1) updateQty(1);
                      } else updateQty(1);
                    }}
                    max={barcodeItem.qty}
                    style={{
                      width: "40px",
                      marginLeft: "3px",
                      color: isError(barcodeItem.orderQty)
                        ? "#800000"
                        : isVeryCritical(barcodeItem.orderQty)
                        ? "red"
                        : isCritical(barcodeItem.orderQty)
                        ? "orange"
                        : isMildCritical(barcodeItem.orderQty)
                        ? "gold"
                        : "black",
                    }}
                    type="number"
                    value={barcodeItem.orderQty}
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => this.removeBarcodeRow(barcodeItem.id)}
                className="btn-sm btn-danger"
              >
                <i className="fa fa-minus"></i>
              </button>
            </div>
          </div>
        );
      });
    }
  };

  validateBarcodes = (barcodes) => {
    barcodes.forEach((barcode) => {
      if (barcode.orderQty < 1) barcode.orderQty = 1;
      if (barcode.orderQty > barcode.qty) barcode.orderQty = barcode.qty;
    });
    return barcodes;
  };

  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/login" />;
    }

    if (this.props.location.state === undefined) {
      return <Redirect to="/rentproduct" />;
    }
    // if (this.props.customer === null) {
    //   return <Redirect to="/rentproduct" />;
    // }
    const { user } = auth;
    if (user && user.systemRole === "Employee") {
      if (user && !user.sections.includes("Rentproduct")) {
        return <Redirect to="/Error" />;
      }
    }

    const { customer } = this.props;
    return (
      <React.Fragment>
        <Loader />
        {this.state.isLoading && <LoadingComp />}
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
                                  <h2>
                                    Quét/Nhập Mã Sản Phẩm Để Bỏ Đồ Vào Hóa Đơn
                                  </h2>
                                </div>
                              </div>

                              <div className="col-md-12 my-2">
                                <div className="form-group">
                                  <h3>
                                    <strong>
                                      {customer && customer.name}{" "}
                                    </strong>
                                  </h3>
                                  <h4>{`${"Điện Thoại: "}${
                                    customer && customer.contactnumber
                                  }`}</h4>
                                </div>
                              </div>

                              <div className="col-md-12">
                                <div className="form-group">
                                  <form onSubmit={(e) => this.onScanBarcode(e)}>
                                    <input
                                      className="form-control mm-input col-md-12"
                                      maxLength={8}
                                      minLength={8}
                                      type="text"
                                    />
                                  </form>
                                </div>
                              </div>

                              <div className="col-md-12">
                                {this.renderBarcodeRow()}

                                <div className="row text-center ">
                                  <div className="col-md-12 btn-cont">
                                    <div className="form-group">
                                      {!!this.state.barcode.length ? (
                                        <Link
                                          to={{
                                            pathname: "/rentorder",
                                            state: {
                                              customer_id:
                                                customer && customer._id,
                                              barcode: this.validateBarcodes([
                                                ...this.state.barcode,
                                              ]),
                                              data: this.state.data,
                                            },
                                          }}
                                          type="button"
                                          className="btn btn-raised btn-primary round btn-min-width mr-1 mb-1 mt-2"
                                          id="btnSize2"
                                        >
                                          <i className="ft-check"></i>
                                          Thanh Toán Hoá Đơn
                                        </Link>
                                      ) : (
                                        <h4 className="mt-2">
                                          Đơn hàng trống. Quét mã để bắt đầu.
                                        </h4>
                                      )}
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
                </section>
              </div>
            </div>
            <footer className="footer footer-static footer-light">
              <p className="clearfix text-muted text-sm-center px-2">
                <span>
                  Quyền sở hữu của &nbsp;{" "}
                  <a
                    href="https://www.sutygon.com"
                    id="pixinventLink"
                    rel="noopener noreferrer"
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
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          // classes        className={classes.modal}
          open={this.state.isModal}
          // onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.isModal}>
            <div
              style={{
                width: 500,
                backgroundColor: "#fff",
                border: "2px solid gray",
                padding: "5px",
                color: "#000",
              }}
              // className={classes.paper}
            >
              <h5 id="transition-modal-title" style={{ color: "#000" }}>
                Sản phẩm với mã {this.state.bc} tìm thấy trong một đơn hàng khác
                với khả năng bị trùng ngày thuê.
              </h5>
              <h3 className="text-center">
                Ngày Thuê Của Khách :{" "}
                {this.state.myRentDate ? this.state.myRentDate : ""}
              </h3>
              <div className="overflow-x-scroll">
                <table
                  className="table table-bordered table-light"
                  style={{
                    borderWidth: "1px",
                    borderColor: "#aaaaaa",
                    borderStyle: "solid",
                  }}
                >
                  <thead>
                    <th className="text-center">Đơn Hàng #</th>
                    <th className="text-center">Ngày Trả</th>
                  </thead>
                  <tbody>
                    <tr style={{ margin: "3px" }}>
                      <td className="text-center">
                        {this.state.getOrder?.orderNumber || ""}
                      </td>
                      <td className="text-center">
                        {this.state.getOrder
                          ? moment(this.state.getOrder.returnDate).format(
                              "DD-MM-YYYY"
                            )
                          : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h1 id="transition-modal-description" className="text-center">
                {this.state.errormsg}
              </h1>
              <div className="row ">
                <div className="mx-auto">
                  <button
                    onClick={this.onProceed}
                    className="btn btn-danger"
                    type="button"
                  >
                    Thêm Sản Phẩm
                  </button>
                  <button
                    onClick={() =>
                      this.setState({
                        isModal: false,
                        errormsg: "",
                        bc: "",
                        warningProduct: {},
                      })
                    }
                    className="btn btn-success ml-3"
                    type="button"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </Fade>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          open={this.state.showWarning}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.showWarning}>
            <div
              style={{
                width: 500,
                backgroundColor: "#fff",
                border: "2px solid gray",
                padding: "5px",
                color: "#000",
              }}
            >
              <h1
                className="text-center"
                style={{
                  color:
                    this.state.warningLabel == "Error"
                      ? "#800000"
                      : this.state.warningLabel == "Very Critical"
                      ? "red"
                      : this.state.warningLabel == "Critical"
                      ? "orange"
                      : this.state.warningLabel == "Mild Critical"
                      ? "gold"
                      : "black",
                  fontWeight: "bold",
                }}
              >
                {this.state.warningLabel}
              </h1>
              <h5 className="text-center">
                {`The selected quantity for the product barcode '${
                  this.state.warningProduct?.barcode
                }' is greater than the ${
                  this.state.warningLabel == "Error"
                    ? "total"
                    : this.state.warningLabel == "Very Critical"
                    ? "available"
                    : this.state.warningLabel == "Warning"
                    ? "safe"
                    : "safe"
                } quantity for this product.`}
              </h5>
              <div
                className="mx-auto"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button
                  onClick={() =>
                    this.setState({
                      errormsg: "",
                      warningLabel: "",
                      showWarning: false,
                      warningProduct: {},
                    })
                  }
                  className="btn btn-danger"
                  type="button"
                  style={{
                    backgroundColor:
                      this.state.warningLabel == "Error"
                        ? "#800000"
                        : this.state.warningLabel == "Very Critical"
                        ? "red"
                        : this.state.warningLabel == "Critical"
                        ? "orange"
                        : this.state.warningLabel == "Mild Critical"
                        ? "gold"
                        : "black",
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </Fade>
        </Modal>
        <OCAlertsProvider />
      </React.Fragment>
    );
  }
}

Checkout.propTypes = {
  getAllProductsAll: PropTypes.func.isRequired,
  getCustomer: PropTypes.func.isRequired,
  saved: PropTypes.bool,
  auth: PropTypes.object,
  customer: PropTypes.object,
};

const mapStateToProps = (state) => ({
  saved: state.rentproduct.saved,
  auth: state.auth,
  customer: state.customer.customer,
  products: state.product.products,
});
export default connect(mapStateToProps, {
  getCustomer,
  getAllProductsAll,
})(Checkout);

const LoadingComp = () => {
  return (
    <div className="loaderContainer">
      <div className="loader">
        <img
          src="/assets/logo-icon.gif"
          alt="Loader"
          className="loader-img"
          width="100"
        />
        <div className="ball-grid-pulse">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
