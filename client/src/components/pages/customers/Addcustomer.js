import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import {
  addNewCustomer,
  getCustomer,
  updateCustomer,
  getInsight,
} from "../../../actions/customer";
import { Redirect, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Alert from "../../layout/Alert";
import Loader from "../../layout/Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from "moment";
import Switch from "react-switch";
import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";
import { noConflict } from "jquery";

class AddCustomer extends Component {
  state = {
    id: "",
    name: "",
    contactnumber: "",
    email: "",
    address: "",
    birthday: "",
    company: "",
    company_address: "",
    block_account: "",
    online_account: "",
    membership: "",
    saving: false,
    isEdit: false,
    year: false,
    selectedYear: "",
    month: false,
    selectedMonth: "",
    alltime: false,
    selectedAllyear: "",
  };

  async componentDidMount() {
    if (this.props.match.params.id) {
      const id = this.props.match.params.id;
      await this.props.getCustomer(id);

      const { customer } = this.props;
      if (customer) {
        this.setState({
          id: id,
          isEdit: true,
          name: customer.name,
          contactnumber: customer.contactnumber,
          email: customer.email,
          address: customer.address,
          company: customer.company,
          company_address: customer.company_address,
          block_account: customer.block_account,
          online_account: customer.online_account,
          membership: customer.online_account.membership,
          year: customer.year ? moment(customer.year).format("DD/MM/YYYY") : "",
          createdAt: moment(customer.createdAt).format("DD/MM/YYYY"),
          birthday: moment(customer.birthday).format("DD/MM/YYYY"),
        });
      }
    }
  }
  handleChangeForDate = (date, name, e) => {
    if (this.state.id === "") {
      this.setState({
        birthday: date,
      });
    }
    if (this.state.id !== "") {
      if (name === "selectedYear") {
        this.setState({
          selectedYear: date,
          selectedMonth: "",
          alltime: false,
        });
      } else if (name === "selectedMonth") {
        this.setState({
          selectedMonth: date,
          selectedYear: "",
          alltime: false,
        });
      }
    }
  };

  togglehandleChange = (status) => {
    if (status === true) {
      this.setState({ block_account: true });
    } else if (status === false) {
      this.setState({ block_account: false });
    }
  };
  handleChange = (e, id = "") => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleCheck = (e, name) => {
    if (name === "month") {
      this.setState({
        [e.target.name]: !this.state[name],
        year: false,
        alltime: false,
      });
    }
    if (name === "year") {
      this.setState({
        [e.target.name]: !this.state[name],
        month: false,
        alltime: false,
      });
    }
    if (name === "alltime") {
      this.setState({
        [e.target.name]: !this.state[name],
        month: false,
        year: false,
      });
    }
  };

  handleChangeNumber = (e) => {
    this.setState({
      [e.target.name]: parseInt(e.target.value) ? parseInt(e.target.value) : "",
    });
  };
  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ saving: true });
    const state = { ...this.state };
let m_oc = [];
m_oc.push({
  'exist':"no",
  "membership":this.state.membership,
  'username':this.state.name,
  'email':this.state.email,
  'deactivate':false,
  'account_created':this.state.createdAt,
})
    var customer = {
      name: state.name,
      email: state.email,
      contactnumber: state.contactnumber,
      address: state.address,
      birthday: moment(state.birthday),
      company: state.company,
      company_address: state.company_address,

      online_account:m_oc,
      // block_account: state.block_account
    };

    if (state.id === "") {
      await this.props.addNewCustomer(customer);
    } else {
      await this.props.updateCustomer(customer, state.id);
    }
    this.setState({ saving: false });
  };

  getInsight = async (e) => {
    e.preventDefault();
    if (this.props.match.params.id) {
      const id = this.props.match.params.id;

      const timeframe = {
        year: moment(this.state.selectedYear).add(1, "month"),
        month: moment(this.state.selectedMonth).add(1, "month"),
        allTime: this.state.alltime,
      };
      await this.props.getInsight(id, timeframe);
    }
  };
  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/" />;
    }

    if (this.props.saved) {
      return <Redirect to="/customer" />;
    }
    
    if (this.props.insight) {
      var {orders} = this.props.insight;
    }

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
                        <h4 className="form-section">
                          <i className="ft-user"></i>
                          {this.state.id === ""
                            ? "Đăng Ký Khách Hàng Mới"
                            : "Update Customer"}
                        </h4>
                      </div>
                      <div>
                        {" "}
                        <OCAlertsProvider />
                        <Alert />
                      </div>

                      <div className="card-body">
                        <form
                          className="form form-horizontal form-bordered"
                          method="POST"
                          onSubmit={(e) => this.onSubmit(e)}
                        >
                          <Alert />
                          <h4 className="form-section ">
                            <i className="ft-info"></i> Personal information
                          </h4>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group row">
                                <label
                                  className="col-md-3 label-control"
                                  htmlFor="projectinput1"
                                >
                                  Name
                                </label>

                                <div className="col-md-9">
                                  {this.state.isEdit === false ? (
                                    <input
                                      type="text"
                                      id="projectinput1"
                                      className="form-control border-primary"
                                      placeholder="Name"
                                      name="name"
                                      required
                                      value={this.state.name}
                                      onChange={(e) => this.handleChange(e)}
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      id="projectinput1"
                                      className="form-control border-primary"
                                      placeholder="Name"
                                      name="name"
                                      required
                                      value={this.state.name}
                                      onChange={(e) => this.handleChange(e)}
                                      readOnly
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label
                                  className="col-md-3 label-control"
                                  htmlFor="projectinput4"
                                >
                                  Contact Number
                                </label>

                                <div className="col-md-9">
                                  <input
                                    type="text"
                                    id="projectinput4"
                                    className="form-control border-primary"
                                    placeholder="Contact Number"
                                    name="contactnumber"
                                    value={this.state.contactnumber}
                                    onChange={(e) => this.handleChangeNumber(e)}
                                    required
                                    minLength={10}
                                    maxLength={10}
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label
                                  className="col-md-3 label-control"
                                  htmlFor="projectinput3"
                                >
                                  E-mail
                                </label>
                                <div className="col-md-9">
                                  <input
                                    type="email"
                                    id="projectinput3"
                                    className="form-control border-primary"
                                    placeholder="E-mail"
                                    name="email"
                                    value={this.state.email}
                                    onChange={(e) => this.handleChange(e)}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label
                                  className="col-md-3 label-control"
                                  htmlFor="projectinput3"
                                >
                                  Company
                                </label>
                                <div className="col-md-9">
                                  <input
                                    type="text"
                                    id="projectinput3"
                                    className="form-control border-primary"
                                    placeholder="Company"
                                    name="company"
                                    value={this.state.company}
                                    onChange={(e) => this.handleChange(e)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group row">
                                <label
                                  className="col-md-3 label-control"
                                  htmlFor="projectinput1"
                                >
                                  Address
                                </label>
                                <div className="col-md-9">
                                  <textarea
                                    type="text"
                                    id="projectinput1"
                                    rows="4"
                                    className="form-control col-md-12 border-primary"
                                    placeholder="Address"
                                    name="address"
                                    value={this.state.address}
                                    onChange={(e) => this.handleChange(e)}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label
                                  className="col-md-3 label-control"
                                  htmlFor="projectinput3"
                                >
                                  Birthday
                                </label>
                                <div className="col-md-9">
                                  {this.state.isEdit === false ? (
                                    <DatePicker
                                      dateFormat="dd/MM/yyyy"
                                      selected={this.state.birthday}
                                      className="form-control border-primary"
                                      onChange={(e) =>
                                        this.handleChangeForDate(e, "birthday")
                                      } //only when value has changed
                                      // popperPlacement="top-end"
                                      // peekNextMonth
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="scroll"
                                    />
                                  ) : (
                                    <input
                                      value={this.state.birthday}
                                      className="form-control border-primary"
                                      readOnly
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label
                                  className="col-md-3 label-control"
                                  htmlFor="projectinput3"
                                >
                                  Company Address
                                </label>
                                <div className="col-md-9">
                                  <input
                                    type="text"
                                    id="projectinput3"
                                    className="form-control border-primary"
                                    placeholder="Company Address"
                                    name="company_address"
                                    value={this.state.company_address}
                                    onChange={(e) => this.handleChange(e)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          {this.state.isEdit === true ? (
                            <>
                              <h4 className="form-section mt-4">
                                <i className="ft-info"></i> Block Customer
                              </h4>
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="form-group row">
                                    <label
                                      className="col-md-3  label-control"
                                      htmlFor="userinput1"
                                    >
                                      Status
                                    </label>
                                    <div className="col-md-8">
                                      <Switch
                                        name="status"
                                        className="react-switch float-center"
                                        onChange={(e) =>
                                          this.togglehandleChange(e, "status")
                                        }
                                        checked={this.state.block_account}
                                      />
                                    </div>{" "}
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          {this.state.isEdit === true ? (
                            <>
                              <h4 className="form-section mt-4">
                                <i className="ft-info"></i> Online Account
                                Information
                              </h4>
                              {this.state.online_account.exist === "no" ? (
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="form-group row">
                                      <h4 className="ml-4 alert alert-secondary">
                                        {" "}
                                        No online account found.
                                      </h4>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="form-group row">
                                        <label
                                          className="col-md-3 label-control"
                                          htmlFor="projectinput1"
                                        >
                                          Username
                                        </label>

                                        <div className="col-md-9">
                                          <input
                                            type="text"
                                            id="projectinput1"
                                            className="form-control border-primary"
                                            placeholder="Name"
                                            name="name"
                                            required
                                            value={this.state.name}
                                            onChange={(e) =>
                                              this.handleChange(e)
                                            }
                                            readOnly
                                          />
                                        </div>
                                      </div>
                                      <div className="form-group row">
                                        <label
                                          className="col-md-3 label-control"
                                          htmlFor="projectinput4"
                                        >
                                          Account Created
                                        </label>

                                        <div className="col-md-9">
                                          <input
                                            type="text"
                                            id="projectinput4"
                                            className="form-control border-primary"
                                            placeholder="Contact Number"
                                            name="contactnumber"
                                            value={this.state.createdAt}
                                            onChange={(e) =>
                                              this.handleChangeNumber(e)
                                            }
                                            required
                                          />
                                        </div>
                                      </div>
                                      <div className="form-group row">
                                        <label
                                          className="col-md-3 label-control"
                                          htmlFor="projectinput3"
                                        >
                                         
                                        </label>
                                        <div className="col-md-9">
                                         <Link
                                      to=""
                                      onClick={(e) => this.openModalforPassword(e)}
                                      type='button'
                                      className="font-medium-3"
                                    ><i className="ft-external-link"></i>  De-Activate online account</Link>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="form-group row">
                                        <label
                                          className="col-md-3 label-control"
                                          htmlFor="projectinput3"
                                        >
                                          Membership
                                        </label>
                                        <div className="col-md-9">
                                          <input
                                            type="text"
                                            id="projectinput3"
                                            className="form-control border-primary"
                                            placeholder="Membership"
                                            name="membership"
                                            value={this.state.membership}
                                            onChange={(e) =>
                                              this.handleChange(e)
                                            }
                                            required
                                          />
                                        </div>
                                      </div>
                                      <div className="form-group row">
                                        <label
                                          className="col-md-3 label-control"
                                          htmlFor="projectinput3"
                                        >
                                          Email
                                        </label>
                                        <div className="col-md-9">
                                          <input
                                            type="text"
                                            id="projectinput3"
                                            className="form-control border-primary"
                                            placeholder="Email"
                                            name="email"
                                            value={
                                              this.state.online_account
                                                .email === "unverified"
                                                ? "Unverified"
                                                : "Verified"
                                            }
                                            onChange={(e) =>
                                              this.handleChange(e)
                                            }
                                            readOnly
                                          />
                                        </div>
                                      </div>
                                      {this.state.online_account
                                                .email === "unverified" ? 
                                      <div className="form-group row">
                                        <label
                                          className="col-md-3 label-control"
                                          htmlFor="projectinput3"
                                        >
                                        </label>
                                        <div className="col-md-9">
                                        <Link
                                      to=""
                                      onClick={(e) => this.openModalforPassword(e)}
                                      type='button'
                                      className="font-medium-3"
                                    ><i className="ft-external-link"></i>Resend Verification Link?</Link>
                                        </div>
                                      </div>:""}
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          ) : (
                            ""
                          )}
                          <div className="form-actions top">
                            {this.state.id === "" ? (
                              <>
                                {this.state.saving ? (
                                  <button
                                    type="button"
                                    className="mb-2 mr-2 btn btn-raised btn-primary"
                                  >
                                    <div
                                      className="spinner-grow spinner-grow-sm "
                                      role="status"
                                    ></div>{" "}
                                    &nbsp; Adding{" "}
                                  </button>
                                ) : (
                                  <button
                                    type="submit"
                                    className="mb-2 mr-2 btn btn-raised btn-primary"
                                  >
                                    <i className="ft-check" /> Add Customer
                                  </button>
                                )}
                              </>
                            ) : (
                              <>
                                {this.state.saving ? (
                                  <button
                                    type="button"
                                    className="mb-2 mr-2 btn btn-raised btn-primary"
                                  >
                                    <div
                                      className="spinner-grow spinner-grow-sm "
                                      role="status"
                                    ></div>{" "}
                                    &nbsp; Save{" "}
                                  </button>
                                ) : (
                                  <button
                                    type="submit"
                                    className="mb-2 mr-2 btn btn-raised btn-primary"
                                  >
                                    <i className="ft-check" /> Save Changes
                                  </button>
                                )}
                              </>
                            )}
                          </div>

                          {this.state.isEdit === true ? (
                            <>
                              <h4 className="form-section mt-4">
                                <i className="ft-info"></i> Insight
                              </h4>
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="form-group row">
                                    <label
                                      className="col-md-3 label-control"
                                      htmlFor="userinput1"
                                    >
                                      Choose a timeframe
                                    </label>
                                    <div className="col-md-9">
                                      <label
                                        className="radio-inline"
                                        htmlFor="one_year"
                                      >
                                        <input
                                          type="radio"
                                          name="year"
                                          id="one_year"
                                          onChange={(e) =>
                                            this.handleCheck(e, "year")
                                          }
                                          checked={this.state.year === true}
                                          value={true}
                                        />{" "}
                                        One Year
                                      </label>{" "}
                                      {"          "}
                                      <label
                                        className="radio-inline"
                                        htmlFor="one_month"
                                      >
                                        <input
                                          type="radio"
                                          name="month"
                                          id="one_month"
                                          value={true}
                                          checked={this.state.month === true}
                                          onChange={(e) =>
                                            this.handleCheck(e, "month")
                                          }
                                        />{" "}
                                        One Month
                                      </label>{" "}
                                      {"          "}
                                      <label
                                        className="radio-inline"
                                        htmlFor="all_year"
                                      >
                                        <input
                                          type="radio"
                                          name="alltime"
                                          id="all_year"
                                          onChange={(e) =>
                                            this.handleCheck(e, "alltime")
                                          }
                                          checked={this.state.alltime === true}
                                          value={true}
                                        />{" "}
                                        All Year
                                      </label>{" "}
                                      {"          "}
                                    </div>
                                  </div>
                                  <div className="form-group row">
                                    <label className="col-md-3 label-control">
                                      {this.state.year === true
                                        ? "Pick a year from 2012"
                                        : this.state.month === true
                                        ? "Pick a month from 2012"
                                        : ""}
                                    </label>
                                    <div className="col-md-9">
                                      {this.state.year === true ? (
                                        <DatePicker
                                          dateFormat="yyyy"
                                          selected={this.state.selectedYear}
                                          className="form-control border-primary"
                                          onChange={(e) =>
                                            this.handleChangeForDate(
                                              e,
                                              "selectedYear"
                                            )
                                          }
                                          minDate={new Date(2011, 1, 1)}
                                          maxDate={new Date()}
                                          showYearPicker
                                          dropdownMode="scroll"
                                        />
                                      ) : this.state.month === true ? (
                                        <DatePicker
                                          dateFormat="yyyy/MM"
                                          selected={this.state.selectedMonth}
                                          className="form-control border-primary"
                                          onChange={(e) =>
                                            this.handleChangeForDate(
                                              e,
                                              "selectedMonth"
                                            )
                                          }
                                          minDate={new Date(2011, 1, 1)}
                                          maxDate={new Date()}
                                          showMonthYearPicker
                                          dropdownMode="scroll"
                                        />
                                      ) : (
                                        ""
                                      )}
                                      <div className="mt-2 top">
                                        <button
                                          type="submit"
                                          className="mb-2 mr-2 btn btn-raised btn-success"
                                          onClick={(e) => this.getInsight(e)}
                                        >
                                          <i className="ft-check" /> Get Insight
                                        </button>
                                      </div>{" "}
                                    </div>
                                  </div>
                                </div>{" "}
                                <div className="col-md-6">
                                  {this.props.insight ? (
                                    <div className="card card-outline-success box-shadow-0">
                                      <div className="card-body">
                                        <div className="card-content">
                                          <div className="card-text">
                                            <dl className="row">
                                              <dt className="col-md-9">
                                                {this.state.year === true
                                                  ? `Total spent in ${moment(
                                                      this.state.selectedYear
                                                    ).format("yyyy")}`
                                                  : this.state.month === true
                                                  ? `Total spent in ${moment(
                                                      this.state.selectedMonth
                                                    ).format("MMMM-yyyy")}`
                                                  : ""}
                                              </dt>
                                              <dd className="col-md-3" style={{textAlignLast:'end'}}>
                                                {orders[0].Total_spent}
                                              </dd>
                                            </dl>
                                            <dl className="row">
                                              <dt className="col-md-9">
                                                {this.state.year === true
                                                  ? `Total order in ${moment(
                                                      this.state.selectedYear
                                                    ).format("yyyy")}`
                                                  : this.state.month === true
                                                  ? `Total orders in ${moment(
                                                      this.state.selectedMonth
                                                    ).format("MMMM-yyyy")}`
                                                  : ""}
                                              </dt>
                                              <dd className="col-md-3" style={{textAlignLast:'end'}}>
                                                {orders[0].total_orders}
                                              </dd>
                                            </dl>

                                            <dl className="row">
                                              <dt className="col-md-9">
                                                {this.state.year === true
                                                  ? `Total discounts in ${moment(
                                                      this.state.selectedYear
                                                    ).format("yyyy")}`
                                                  : this.state.month === true
                                                  ? `Total discounts in ${moment(
                                                      this.state.selectedMonth
                                                    ).format("MMMM-yyyy")}`
                                                  : ""}
                                              </dt>
                                              <dd className="col-md-3" style={{textAlignLast:'end'}}></dd>
                                            </dl>
                                            <dl className="row">
                                              <dt className="col-md-9">
                                                {this.state.year === true
                                                  ? `Total insurance paid in ${moment(
                                                      this.state.selectedYear
                                                    ).format("yyyy")}`
                                                  : this.state.month === true
                                                  ? `Total insuarance paid in ${moment(
                                                      this.state.selectedMonth
                                                    ).format("MMMM-yyyy")}`
                                                  : ""}
                                              </dt>
                                              <dd className="col-md-3" style={{textAlignLast:'end'}}>
                                                {orders[0].insuranceAmt}
                                              </dd>
                                            </dl>
                                            <dl className="row">
                                              <dt className="col-md-9">
                                                {this.state.year === true
                                                  ? `Total insurance returned in ${moment(
                                                      this.state.selectedYear
                                                    ).format("yyyy")}`
                                                  : this.state.month === true
                                                  ? `Total insurance returned in ${moment(
                                                      this.state.selectedMonth
                                                    ).format("MMMM-yyyy")}`
                                                  : ""}
                                              </dt>
                                              <dd className="col-md-3"style={{textAlignLast:'end'}}>
                                                {""}
                                              </dd>
                                            </dl>
                                            <dl className="row">
                                              <dt className="col-md-9">
                                                {this.state.year === true
                                                  ? `Total damage-fee paid in ${moment(
                                                      this.state.selectedYear
                                                    ).format("yyyy")}`
                                                  : this.state.month === true
                                                  ? `Total damage-fee paid in ${moment(
                                                      this.state.selectedMonth
                                                    ).format("MMMM-yyyy")}`
                                                  : ""}
                                              </dt>
                                              <dd className="col-md-3" style={{textAlignLast:'end'}}></dd>
                                            </dl>
                                            <dl className="row">
                                              <dt className="col-md-9">
                                                {this.state.year === true
                                                  ? `Total late-fee in ${moment(
                                                      this.state.selectedYear
                                                    ).format("yyyy")}`
                                                  : this.state.month === true
                                                  ? `Total late-fee in ${moment(
                                                      this.state.selectedMonth
                                                    ).format("MMMM-yyyy")}`
                                                  : ""}
                                              </dt>
                                              <dd className="col-md-3" style={{textAlignLast:'end'}}></dd>
                                            </dl>
                                            <dl className="row">
                                              <dt className="col-md-9">
                                                {this.state.year === true
                                                  ? `Total tax paid in ${moment(
                                                      this.state.selectedYear
                                                    ).format("yyyy")}`
                                                  : this.state.month === true
                                                  ? `Total tax paid in ${moment(
                                                      this.state.selectedMonth
                                                    ).format("MMMM-yyyy")}`
                                                  : ""}{" "}
                                              </dt>
                                              <dd className="col-md-3" style={{textAlignLast:'end'}}>
                                                {orders[0].tax}
                                              </dd>
                                            </dl>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </form>
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
                    rel="noopener noreferrer"
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

AddCustomer.propTypes = {
  saved: PropTypes.bool,
  addNewCustomer: PropTypes.func.isRequired,
  getCustomer: PropTypes.func.isRequired,
  auth: PropTypes.object,
  customer: PropTypes.object,
  updateCustomer: PropTypes.func.isRequired,
  getInsight: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  saved: state.customer.saved,
  auth: state.auth,
  customer: state.customer.customer,
  insight: state.customer.insight,
});
export default connect(mapStateToProps, {
  addNewCustomer,
  updateCustomer,
  getCustomer,
  getInsight,
})(AddCustomer);
