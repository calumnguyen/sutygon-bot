import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import Alert from "../../layout/Alert";
import { addNewUser, updateUser, getUser } from "../../../actions/user";
import Loader from "../../layout/Loader";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import shortid from "shortid";
import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";
import TagsInput from "./TagInput";
class AddCoupons extends Component {
  state = {
    percentage: "",
    coupon_code: "",
    payment_method: "currency", //percentage or currency
    tags: [],
  };

  makeid = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  handleTagsChange(tags) {
    this.setState({ tags: tags });
  }
  render() {
    const { payment_method } = this.state;
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
                        <i className="fa fa-gift"></i> Add New Coupons
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
                                className="col-md-3 label-control"
                                htmlFor="userinput1"
                              >
                                Amount Discount*
                              </label>
                              <div className="col-md-9">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="payment_method"
                                    value="percentage"
                                    onChange={(e) =>
                                      this.setState({
                                        payment_method: "percentage",
                                      })
                                    }
                                    checked={
                                      this.state.payment_method === "percentage"
                                    }
                                    value="male"
                                    required
                                  />{" "}
                                  Percentage
                                </label>
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="payment_method"
                                    value="currency"
                                    onChange={(e) =>
                                      this.setState({
                                        payment_method: "currency",
                                      })
                                    }
                                    required
                                    checked={
                                      this.state.payment_method === "currency"
                                    }
                                  />{" "}
                                  currency
                                </label>
                                <input
                                  type="text"
                                  // id="userinput1"
                                  className="form-control border-primary"
                                  placeholder=" Amount Discount"
                                  // required
                                  // data-validation-required-message="This field is required"
                                  // name="username"
                                  // onChange={(e) =>
                                  //   this.handleChange(e, "username")
                                  // }
                                  // onBlur={(e) => this.validateUserName(e)}
                                  // value={this.state.username}
                                />
                              </div>
                            </div>
                          </div>
                          {payment_method == "percentage" && (
                            <div className="col-md-6">
                              <div className="form-group row">
                                <label
                                  className="col-md-3 label-control"
                                  htmlFor="userinput1"
                                >
                                  Max payout
                                </label>
                                <div className="col-md-9">
                                  <input
                                    type="text"
                                    // id="userinput1"
                                    className="form-control border-primary"
                                    placeholder="Max payout (VND) "
                                    // name="fullname"
                                    // required
                                    // onChange={(e) =>
                                    //   this.handleChange(e, "fullname")
                                    // }
                                    // value={this.state.fullname}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-3 label-control"
                                htmlFor="userinput1"
                              >
                                Min-requirement
                              </label>
                              <div className="col-md-9">
                                <input
                                  type="text"
                                  // id="userinput1"
                                  className="form-control border-primary"
                                  placeholder="Min-requirement (VND)"
                                  // name="fullname"
                                  // required
                                  // onChange={(e) =>
                                  //   this.handleChange(e, "fullname")
                                  // }
                                  // value={this.state.fullname}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-3 label-control"
                                htmlFor="userinput1"
                              >
                                Number of Use*
                              </label>
                              <div className="col-md-9">
                                <input
                                  type="text"
                                  // id="userinput2"
                                  className="form-control border-primary"
                                  placeholder="Number of Use*"
                                  // name="email"
                                  // required
                                  // onChange={(e) =>
                                  //   this.handleChange(e, "email")
                                  // }
                                  // onBlur={(e) => this.validateEmail(e)}
                                  // value={this.state.email}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group row">
                              <label
                                className="col-md-2 label-control"
                                htmlFor="userinput1"
                              >
                                COUPON Code
                              </label>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  id="coupon_code"
                                  className="form-control border-primary"
                                  placeholder="Coupon Code"
                                  name="coupon_code"
                                  // required
                                  onChange={(e) =>
                                    this.setState({
                                      coupon_code: e.target.value,
                                    })
                                  }
                                  value={this.state.coupon_code}
                                />
                              </div>
                              <div className="col-md-4">
                                <button
                                  className={"btn btn-warning"}
                                  type={"button"}
                                  onClick={() => {
                                    this.setState({
                                      coupon_code: this.makeid(8),
                                    });
                                  }}
                                >
                                  Generate Code
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-3 label-control"
                                htmlFor="userinput1"
                              >
                                Coupon note
                              </label>
                              <div className="col-md-9 ">
                                <textarea cols="40"></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-3 label-control"
                                htmlFor="userinput1"
                              >
                                Coupon tags*
                              </label>
                              <div className="col-md-9">
                                <TagsInput
                                  value={this.state.tags}
                                  onChange={this.handleTagsChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6"></div>
                        </div>
                        <div className="form-actions top"></div>
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

AddCoupons.propTypes = {
  getUser: PropTypes.func.isRequired,
  auth: PropTypes.object,
  saved: PropTypes.bool,
  updateUser: PropTypes.func.isRequired,
  addNewUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  saved: state.user.saved,
  user: state.user.profile,
});
export default connect(mapStateToProps, {
  updateUser,
  addNewUser,

  getUser,
})(AddCoupons);
