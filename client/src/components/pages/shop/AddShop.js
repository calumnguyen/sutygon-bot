import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import Alert from "../../layout/Alert";
import { addNewShop, getShopById, updateStore } from "../../../actions/shop";
import Loader from "../../layout/Loader";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";
import moment from "moment";
class AddShop extends Component {
  state = {
    shopId: "",
    shop_name: "",
    address: "",
    slug: "",
    email: "",
    phone: "",
  };

  async componentDidMount() {
    const id = this.props.match.params.id;
    await this.props.getShopById(id);
    const { shop } = this.props;
    if (shop) {
      this.setState({
        shopId: shop._id,
        shop_name: shop.name,
        address: shop.address,
        slug: shop.slug,
        email: shop.officialEmail,
        phone: shop.phone,
      });
    }
  }

  onSubmit = async () => {
    if (this.state.shop_name === "") {
      OCAlert.alertError("Shop name is required", { timeOut: 5000 });
      return;
    }

    if (this.state.address === "") {
      OCAlert.alertError("Shop address is required", {
        timeOut: 5000,
      });
      return;
    }
    const formData = {
      name: this.state.shop_name,
      address: this.state.address,
      slug: this.state.slug,
      officialEmail: this.state.email,
      phone: this.state.phone,
    };

    if (this.state.shopId === "") {
      await this.props.addNewShop(formData);
      this.setState({
        shop_name: "",
        address: "",
        slug: "",
        email: "",
        phone: "",
      });
      return;
    } else {
      console.log(formData)
      await this.props.updateStore(formData, this.state.shopId);
    }
    return;
  };
  handleChange = (e, type) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onChangeShopName = (e) => {
    let value = e.target.value;
    this.setState({
      shop_name: value,
      slug: value.toLowerCase().split(" ").join("_"),
    });
  };
  render() {
    return (
      <React.Fragment>
        <Loader />
        <div className="wrapper menu-collapsed">
          <Sidebar location={this.props.location}></Sidebar>
          <Header></Header>

          <div className="main-panel">
            <div className="main-content">
              <div className="content-wrapper">
                <div className="form-body">
                  <div className="card">
                    <div className="card-header">
                      <h4 className="form-section">
                        <i className="fa fa-home  "></i>{" "}
                        {this.state.shopId ? "Edit Store" : "Add New Store"}
                      </h4>
                    </div>

                    <div className="card-body">
                      <div
                        className="form form-horizontal form-bordered" //
                      >
                        <Alert />
                        <OCAlertsProvider />
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-4 label-control"
                                htmlFor="shop_name"
                              >
                                Store Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <div className={`col-md-8`}>
                                <div class="input-group">
                                  <input
                                    type="text"
                                    id="shop_name"
                                    className="form-control border-primary"
                                    placeholder={"Store Name"}
                                    name="shop_name"
                                    onChange={this.onChangeShopName}
                                    value={this.state.shop_name}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-4 label-control"
                                htmlFor="shop_name"
                              >
                                Store Slug{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <div className={`col-md-8`}>
                                <div class="input-group">
                                  <input
                                    type="text"
                                    id="slug"
                                    readOnly
                                    className="form-control border-primary"
                                    placeholder={"Store slug"}
                                    name="slug"
                                    onChange={(e) =>
                                      this.handleChange(e, "slug")
                                    }
                                    value={this.state.slug}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-4 label-control"
                                htmlFor="phone"
                              >
                                phone Number
                              </label>
                              <div className="col-md-8">
                                <div class="input-group">
                                  <input
                                    type="text"
                                    id="phone"
                                    className="form-control border-primary"
                                    placeholder="Store phone Number"
                                    name="phone"
                                    // required
                                    onChange={(e) =>
                                      this.handleChange(e, "phone")
                                    }
                                    value={this.state.phone}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-4 label-control"
                                htmlFor="min_requirement"
                              >
                                Store Email
                              </label>
                              <div className="col-md-8">
                                <div class="input-group">
                                  <input
                                    type="email"
                                    id="email"
                                    className="form-control border-primary"
                                    placeholder="Store email address "
                                    name="email"
                                    // required
                                    onChange={(e) =>
                                      this.handleChange(e, "email")
                                    }
                                    value={this.state.email}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-4 label-control"
                                htmlFor="min_requirement"
                              >
                                Store Address{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <div className="col-md-8">
                                <div class="input-group">
                                  <textarea
                                    name="address"
                                    placeholder="Store Address"
                                    onChange={(e) =>
                                      this.handleChange(e, "address")
                                    }
                                    value={this.state.address}
                                    className="form-control border-primary"
                                    id="address"
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="form-actions top mt-3">
                          <div className="col-md-6">
                            <button
                              className="btn btn-primary"
                              onClick={() => this.onSubmit()}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer className="footer footer-static footer-light">
              <p className="clearfix text-muted text-sm-center px-2">
                <span>
                  Quyền sở hữu của &nbsp;{" "}
                  <a
                    href="https://www.sutygon.com"
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
      </React.Fragment>
    );
  }
}

AddShop.propTypes = {
  getShopById: PropTypes.func.isRequired,
  addNewShop: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  saved: state.user.saved,
  user: state.user.profile,
  shop: state.shops.shop,
});
export default connect(mapStateToProps, {
  addNewShop,
  getShopById,
  updateStore
})(AddShop);
