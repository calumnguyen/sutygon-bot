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
import { OCAlertsProvider } from '@opuscapita/react-alerts';
import { OCAlert } from '@opuscapita/react-alerts';

class ScanBarcode extends Component {
  state = {
    barcode: [],
    customer: "",
    order: "",
    barcodeFromInput: "",
    matchedBarcodes: []
  };

  async componentDidMount() {
    const { data } = this.props.location;
    if (data) {
      this.setState({
        customer: data.customer,
        barcode: data.order[0].barcodes,
        order: data.order
      });

    }
  }

  addBarcodeRow = () => {
    let { barcode } = this.state; // get all barcode
    barcode.push({
      id: shortid.generate(),
      barcode: "",
    });
    this.setState({ barcode });
  };
  handleChangeInput = (e, id = "") => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onScanBarcode = (e) => {

    e.preventDefault();
    e.target[0].value = '';
    const { barcode } = this.state;
    let { barcodeFromInput } = this.state;
    const { matchedBarcodes } = this.state;

    let m_barcode = [];
    matchedBarcodes.forEach((barcode, b_index) => {
      m_barcode.push(
        barcode.barcode)
    })
    const isInclude = m_barcode.includes(barcodeFromInput)
    if (isInclude === true) {
      OCAlert.alertError('This barcode already scanned! Try again', { timeOut: 3000 });
      this.setState({ barcodeFromInput: "" });
      return;

    }

    let isMatch = barcode.includes(barcodeFromInput)
    if (isMatch === true) {
      matchedBarcodes.push({
        barcode: barcodeFromInput,
      });
      this.setState({ matchedBarcodes, barcodeFromInput: "" });

    }
    else {
      OCAlert.alertError(`The barcode you enter does not match with any item
        in this order. Please try again!`, { timeOut: 3000 });

    }


  }

  removeBarcodeRow = (id) => {
    let { barcode } = this.state;
    barcode = barcode.filter((barcode) => barcode.id !== id); // get current barode
    this.setState({ barcode });
  };

   getBarcodeRow = () => {
    let { matchedBarcodes } = this.state; // get all barcode
    if (matchedBarcodes) {
      return matchedBarcodes.map((barcode) => (
        <div id="sizes_box" key={barcode.id || barcode._id}>
          <div className="row">
            <div className="left">
              <input
                type="text"
                className="form-control mm-input s-input"
                placeholder="Barcode"
                id="widthBr"
                style={{ width: "-webkit-fill-available" }}
                value={barcode.barcode}
              />
            </div>
            <div className="right">
              <button
                type="button"
                className="btn btn-raised btn-sm btn-icon btn-default mt-1"
              >
                <i className="fa fa-check fa-2x text-success"></i>
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
    if (this.props.location.data === undefined) {
       return <Redirect to="/returnproduct" />;

    }
    if (this.props.saved) {
      return <Redirect to="/orders" />;
    }
    const { customer } = this.state;
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
                        <h4 className="card-title">Return a Product</h4>
                      </div>
                      <div className="card-content">
                        <div className="card-body table-responsive">
                          <form className="" action="index.html" method="post">
                            <div id="colors_box">
                              <div className="row color-row">
                                <div className="col-md-12">
                                  <div className="form-group">
                                    <h2>Scan Barcode And Match Items</h2>
                                  </div>
                                </div>

                                <div className="col-md-12">
                                  <div className="form-group">
                                    <h3>
                                      {customer && customer.name}{" "}
                                      {`${"#"}${customer && customer.contactnumber
                                        }`}
                                    </h3>
                                  </div>
                                </div>

                                <div className="col-md-12">
                                  <div className="form-group">
                                    <form onSubmit={e => this.onScanBarcode(e)}>
                                      <input
                                        name="barcodeFromInput"
                                        className="form-control mm-input col-md-12"
                                        type="text"
                                        value={this.state.barcodeFromInput}
                                        onChange={(e) => this.handleChangeInput(e)}

                                      />
                                    </form>
                                  </div>
                                </div>

                                <div className="col-md-12">
                                  {this.getBarcodeRow()}

                                  <div className="row text-center ">
                                    <div className="col-md-12 btn-cont">
                                      <div className="form-group">
                                        {!!this.state.matchedBarcodes.length ?
                                          <Link
                                            to={{
                                              pathname: "/matchbarcodes",
                                              data: {
                                                // customer: this.props.customer[0]._id,
                                                barcodesArray: this.state.matchedBarcodes,
                                                order: this.state.order,
                                                orderedBarcode: this.state.barcode,
                                              },

                                            }}
                                            type="submit"
                                            className="btn btn-raised btn-primary round btn-min-width mr-1 mb-1"
                                            id="btnSize2"
                                          >
                                            <i className="ft-check"></i> Next
                                    </Link> :
                                          <Link

                                            type="submit"
                                            className="btn btn-raised btn-primary round btn-min-width mr-1 mb-1 disabled"
                                            id="btnSize2"
                                          >
                                            <i className="ft-check"></i> Next
                                  </Link>
                                        }

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
                <a href="https://www.sutygon.com" rel="noopener noreferrer"  id="pixinventLink" target="_blank" className="text-bold-800 primary darken-2">SUTYGON-BOT </a>, All rights reserved. </span></p>
            </footer>
          </div>
        </div>
        <OCAlertsProvider />
      </React.Fragment>
    );
  }
}

ScanBarcode.propTypes = {
  auth: PropTypes.object,
  customer: PropTypes.array,
  getCustomer:PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  customer: state.customer.customer,
});
export default connect(mapStateToProps, {
  getCustomer,
})(ScanBarcode);
