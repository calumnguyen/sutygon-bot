import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import Alert from "../../layout/Alert";
import {
  addNewCoupon,
  updateCoupon,
  getCouponById,
} from "../../../actions/coupons";
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
    couponId: "",
    // fields
    discount_amount: "",
    coupon_type: "percentage", //percentage or amount
    max_payout: "",
    min_requirement: "",
    number_of_use_per_customer: "",
    max_life: "",
    note: "",
    code: "",
    start_date: "",
    end_date: "",
    tags: [],
    eligibility: "all",
    product_ids: [],
    product_tags: [],
    sign: "%",
  };

  async componentDidMount() {
    if (this.props.match.params.couponId) {
      const couponId = this.props.match.params.couponId;
      await this.props.getCouponById(couponId);
      const { coupon } = this.props;
      if (coupon) {
        this.setState({
          couponId: coupon._id,
          discount_amount: coupon.discount_amount,
          coupon_type: coupon.coupon_type,
          max_payout: coupon.max_payout,
          number_of_use_per_customer: coupon.number_of_use_per_customer,
          max_life: coupon.max_life,
          note: coupon.note,
          code: coupon.code,
          start_date: coupon.start_date,
          end_date: coupon.end_date,
          // tags: coupon.tags,
          eligibility: coupon.eligibility,
          // product_ids: coupon.product_ids,
          product_tags: coupon.product_tags,
        });
      }
    }
  }
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

  onSubmit = async () => {
  
    if (this.state.discount_amount === "") {
      OCAlert.alertError("Discount Amount Required", { timeOut: 3000 });
      return;
    }

    if (
      this.state.coupon_type == "percentage" &&
      this.state.max_payout === ""
    ) {
      OCAlert.alertError("Max Payout is  Required", { timeOut: 3000 });
      return;
    }
    if (this.state.max_life === "") {
      OCAlert.alertError("Max life  Required", { timeOut: 3000 });
      return;
    }
    if (this.state.number_of_use_per_customer === "") {
      OCAlert.alertError("Number of use per customer  Required", {
        timeOut: 3000,
      });
      return;
    }
    if (this.state.number_of_use_per_customer === "") {
      OCAlert.alertError("Number of use per customer  Required", {
        timeOut: 3000,
      });
      return;
    }
    if (this.state.code === "") {
      OCAlert.alertError("Coupon Code Required", { timeOut: 3000 });
      return;
    }
    if (this.state.end_date === "") {
      OCAlert.alertError("End Date  Required", { timeOut: 3000 });
      return;
    }

    const {
      tags,
      discount_amount,
      coupon_type,
      max_payout,
      number_of_use_per_customer,
      max_life,
      note,
      code,
      start_date,
      end_date,
      product_ids,
      product_tags,
      eligibility,
      min_requirement,
    } = this.state;
    const coma_tags = tags.length ? tags.join() : "";
    const formData = {
      discount_amount,
      coupon_type,
      max_payout,
      number_of_use_per_customer,
      max_life,
      note:this.state.note,
      code,
      start_date,
      end_date,
      tags: coma_tags,
      eligibility,
      product_ids,
      product_tags,
    };

    if (min_requirement) {
      formData["min_requirement"] = min_requirement;
    }

    if (this.state.couponId === "") {
      await this.props.addNewCoupon(formData);
    } else {
      await this.props.updateCoupon(formData, this.state.couponId);
    }
    return;
  };
  handleChange = (e, type) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    const { coupon_type } = this.state;
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
                          <div className="col-md-12">
                            <div className="form-group row">
                              <div className="col-md-3">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="coupon_type"
                                    value="percentage"
                                    onChange={(e) =>
                                      this.setState({
                                        coupon_type: "percentage",
                                      })
                                    }
                                    checked={
                                      this.state.coupon_type === "percentage"
                                    }
                                    value="male"
                                    required
                                  />{" "}
                                  Percentage
                                </label>
                              </div>

                              <div className="col-md-3">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="coupon_type"
                                    value="amount"
                                    onChange={(e) =>
                                      this.setState({
                                        coupon_type: "amount",
                                      })
                                    }
                                    required
                                    checked={
                                      this.state.coupon_type === "amount"
                                    }
                                  />{" "}
                                  Amount
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-4 label-control"
                                htmlFor="discount_amount"
                              >
                                Amount Discount*
                              </label>
                              <div className={`col-md-8`}>
                                <div class="input-group">
                                  <input
                                    type="text"
                                    id="discount_amount"
                                    className="form-control border-primary"
                                    placeholder=" Amount Discount"
                                    // required
                                    // data-validation-required-message="This field is required"
                                    name="discount_amount"
                                    onChange={(e) =>
                                      this.handleChange(e, "discount_amount")
                                    }
                                    // onBlur={(e) => this.validateUserName(e)}
                                    value={this.state.discount_amount}
                                  />
                                  <span class="input-group-addon p-1 px-2">
                                    {coupon_type == "percentage" ? "%" : "VDN"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {coupon_type == "percentage" && (
                            <div className="col-md-6">
                              <div className="form-group row">
                                <label
                                  className="col-md-4 label-control"
                                  htmlFor="max_payout"
                                >
                                  Max payout
                                </label>
                                <div className="col-md-8">
                                  <input
                                    type="text"
                                    id="max_payout"
                                    className="form-control border-primary"
                                    placeholder="Max payout (VND) "
                                    name="max_payout"
                                    // required
                                    onChange={(e) =>
                                      this.handleChange(e, "max_payout")
                                    }
                                    value={this.state.max_payout}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-4 label-control"
                                htmlFor="min_requirement"
                              >
                                Min-requirement (optional)
                              </label>
                              <div className="col-md-8">
                                <input
                                  type="text"
                                  id="min_requirement"
                                  className="form-control border-primary"
                                  placeholder="Min-requirement (VND)"
                                  name="min_requirement"
                                  // required
                                  onChange={(e) =>
                                    this.handleChange(e, "min_requirement")
                                  }
                                  value={this.state.min_requirement}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-4 label-control"
                                htmlFor="max_life"
                              >
                                Max Life*
                              </label>
                              <div className="col-md-8">
                                <input
                                  type="number"
                                  id="max_life"
                                  className="form-control border-primary"
                                  placeholder="Max Life*"
                                  name="max_life"
                                  // required
                                  onChange={(e) =>
                                    this.handleChange(e, "max_life")
                                  }
                                  // onBlur={(e) => this.validateEmail(e)}
                                  value={this.state.max_life}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-4 label-control"
                                htmlFor="number_of_use_per_customer"
                              >
                                Number of Use per customer*
                              </label>
                              <div className="col-md-8">
                                <input
                                  type="number"
                                  id="number_of_use_per_customer"
                                  className="form-control border-primary"
                                  placeholder="Number of Use*"
                                  name="number_of_use_per_customer"
                                  // required
                                  onChange={(e) =>
                                    this.handleChange(
                                      e,
                                      "number_of_use_per_customer"
                                    )
                                  }
                                  // onBlur={(e) => this.validateEmail(e)}
                                  value={this.state.number_of_use_per_customer}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-4 label-control"
                                htmlFor="start_date"
                              >
                                Start Date*
                              </label>
                              <div className="col-md-8">
                                <input
                                  type="date"
                                  id="start_date"
                                  className="form-control border-primary"
                                  placeholder="Number of Use*"
                                  name="start_date"
                                  // required
                                  onChange={(e) =>
                                    this.handleChange(e, "start_date")
                                  }
                                  // onBlur={(e) => this.validateEmail(e)}
                                  value={this.state.start_date}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group row">
                              <label
                                className="col-md-4 label-control"
                                htmlFor="end_date"
                              >
                                End Date*
                              </label>
                              <div className="col-md-8">
                                <input
                                  type="date"
                                  id="end_date"
                                  className="form-control border-primary"
                                  placeholder="Number of Use*"
                                  name="end_date"
                                  // required
                                  onChange={(e) =>
                                    this.handleChange(e, "end_date")
                                  }
                                  // onBlur={(e) => this.validateEmail(e)}
                                  value={this.state.end_date}
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
                                htmlFor="code"
                              >
                                COUPON Code
                              </label>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  id="code"
                                  className="form-control border-primary"
                                  placeholder="Coupon Code"
                                  name="code"
                                  // required
                                  onChange={(e) =>
                                    this.setState({
                                      code: e.target.value,
                                    })
                                  }
                                  value={this.state.code}
                                />
                              </div>
                              <div className="col-md-3">
                                <button
                                  className={"btn btn-warning"}
                                  type={"button"}
                                  onClick={() => {
                                    this.setState({
                                      code: this.makeid(8),
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
                                className="col-md-4 label-control"
                                htmlFor="note"
                              >
                                Coupon Note
                              </label>
                              <div className="col-md-8 ">
                                <textarea
                                  onChange={(e) => this.setState({note:e.target.value})}
                                  cols="40"
                                >
                                  {this.state.note}
                                </textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group row">
                              <label
                                className="col-md-3 label-control"
                                htmlFor="Coupon tags"
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
                        </div>

                        <div className="row">
                          <div className="form-group row">
                            <label
                              className="col-md-3 label-control"
                              htmlFor="note"
                            >
                              Eligible products*
                            </label>
                            <div className="col-md-2">
                              <label className="radio-inline">
                                <input
                                  type="radio"
                                  name="eligibility"
                                  value="all"
                                  onChange={(e) =>
                                    this.setState({
                                      eligibility: "all",
                                    })
                                  }
                                  checked={this.state.eligibility === "all"}
                                  value="male"
                                  required
                                />{" "}
                                All
                              </label>
                            </div>
                            <div className="col-md-2">
                              <label className="radio-inline">
                                <input
                                  type="radio"
                                  name="eligibility"
                                  value="only"
                                  onChange={(e) =>
                                    this.setState({
                                      eligibility: "only",
                                    })
                                  }
                                  required
                                  checked={this.state.eligibility === "only"}
                                />{" "}
                                ONLY
                              </label>
                            </div>

                            <div className="col-md-2">
                              <label className="radio-inline">
                                <input
                                  type="radio"
                                  name="eligibility"
                                  value="exclude"
                                  onChange={(e) =>
                                    this.setState({
                                      eligibility: "exclude",
                                    })
                                  }
                                  required
                                  checked={this.state.eligibility === "exclude"}
                                />{" "}
                                EXCLUDE
                              </label>
                            </div>

                            <div className="col-md-3">
                              <label className="radio-inline">
                                <input
                                  type="radio"
                                  name="eligibility"
                                  value="each"
                                  onChange={(e) =>
                                    this.setState({
                                      eligibility: "each",
                                    })
                                  }
                                  required
                                  checked={this.state.eligibility === "each"}
                                />{" "}
                                EACH
                              </label>
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

AddCoupons.propTypes = {
  // getUser: PropTypes.func.isRequired,
  // auth: PropTypes.object,
  // saved: PropTypes.bool,
  // updateUser: PropTypes.func.isRequired,
  addNewCoupon: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  saved: state.user.saved,
  user: state.user.profile,
});
export default connect(mapStateToProps, {
  addNewCoupon,
})(AddCoupons);
