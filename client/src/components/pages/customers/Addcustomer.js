import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import { addNewCustomer, getCustomer, updateCustomer } from "../../../actions/customer";
import { Redirect,Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Alert from "../../layout/Alert";
import Loader from "../../layout/Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import * as moment from 'moment'
import Switch from "react-switch";


class AddCustomer extends Component {
  state = {
    id: "",
    name: "",
    contactnumber: "",
    email: "",
    address: "",
    birthday: '',
    company: '',
    company_address: '',
    block_account: '',
    online_account: '',
    membership:'',
    saving: false,
    isEdit: false
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
          membership:customer.online_account.membership,
          birthday: moment(customer.birthday).format("DD/MM/YYYY"),
        });
      }

    }

  }
  handleChangeForDate = (date, e) => {
    this.setState({
      birthday: date
    });
  }

  togglehandleChange = (status) => {
    if (status === true) {
      this.setState({ block_account: true });
    }

    else if (status === false) {
      this.setState({ block_account: false });
    }
  }
  handleChange = (e, id = "") => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleChangeNumber = (e) => {
    this.setState({ [e.target.name]: parseInt(e.target.value) ? parseInt(e.target.value) : '' })
  }
  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ saving: true });
    const state = { ...this.state };
    const customer = {
      name: state.name,
      email: state.email,
      contactnumber: state.contactnumber,
      address: state.address,
      birthday: moment(state.birthday),
      company: state.company,
      company_address: state.company_address,
      online_account: state.online_account,
      block_account: state.block_account
    };
    if (state.id === "") {
      await this.props.addNewCustomer(customer);

    }
    else {
      await this.props.updateCustomer(customer, state.id)
    }
    this.setState({ saving: false });
  }
  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/" />;
    }

    if (this.props.saved) {
      return <Redirect to="/customer" />;
    }

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
                        <h4 className="form-section"><i className="ft-user"></i>
                          {this.state.id === "" ? "Đăng Ký Khách Hàng Mới" : "Update Customer"}
                        </h4>
                      </div>


                      <div className="card-body">
                        <form
                          className="form form-horizontal form-bordered"
                          method='POST'
                          onSubmit={(e) => this.onSubmit(e)}>
                          <Alert />
                          <h4 className="form-section "><i className="ft-info"></i> Personal information</h4>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group row">
                                <label className="col-md-3 label-control" htmlFor="projectinput1">Name</label>

                                <div className="col-md-9">
                                  {this.state.isEdit === false ?
                                    <input type="text" id="projectinput1"
                                      className="form-control border-primary"
                                      placeholder="Name"
                                      name="name"
                                      required
                                      value={this.state.name}
                                      onChange={(e) => this.handleChange(e)}

                                    />
                                    :
                                    <input type="text" id="projectinput1"
                                      className="form-control border-primary"
                                      placeholder="Name"
                                      name="name"
                                      required
                                      value={this.state.name}
                                      onChange={(e) => this.handleChange(e)}
                                      readOnly
                                    />}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-md-3 label-control" htmlFor="projectinput4">Contact Number</label>

                                <div className="col-md-9">
                                  <input type="text"
                                    id="projectinput4"
                                    className="form-control border-primary"
                                    placeholder="Contact Number"
                                    name="contactnumber"
                                    value={this.state.contactnumber}
                                    onChange={(e) => this.handleChangeNumber(e)}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-md-3 label-control" htmlFor="projectinput3">E-mail</label>
                                <div className="col-md-9">
                                  <input type="email"
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
                                <label className="col-md-3 label-control" htmlFor="projectinput3">Company</label>
                                <div className="col-md-9">
                                  <input type="text"
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
                                <label className="col-md-3 label-control" htmlFor="projectinput1">Address</label>
                                <div className="col-md-9">
                                  <textarea type="text"
                                    id="projectinput1"
                                    rows="4" className="form-control col-md-12 border-primary"
                                    placeholder="Address"
                                    name="address"
                                    value={this.state.address}
                                    onChange={(e) => this.handleChange(e)}
                                    required
                                    textarea />
                                </div></div>
                              <div className="form-group row">
                                <label className="col-md-3 label-control" htmlFor="projectinput3">Birthday</label>
                                <div className="col-md-9">
                                  {this.state.isEdit === false ?
                                    <DatePicker
                                      dateFormat="dd/MM/yyyy" selected={this.state.birthday}
                                      className="form-control border-primary"
                                      onChange={(e) => this.handleChangeForDate(e)}//only when value has changed
                                      peekNextMonth
                                      showMonthDropdown
                                      showYearDropdown
                                    />
                                    :
                                    <input value={this.state.birthday}
                                      className="form-control border-primary"
                                      readOnly
                                    />
                                  }

                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-md-3 label-control" htmlFor="projectinput3">Company Address</label>
                                <div className="col-md-9">
                                  <input type="text"
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
                          {this.state.isEdit === true ?
                            <>
                              <h4 className="form-section mt-4"><i className="ft-info"></i> Block Customer</h4>
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="form-group row">
                                    <label className="col-md-3  label-control" htmlFor="userinput1">Status</label>
                                    <div className="col-md-8">
                                      <Switch
                                        name="status"
                                        className="react-switch float-center"
                                        onChange={(e) => this.togglehandleChange(e, 'status')}
                                        checked={this.state.block_account}

                                      />

                                    </div> </div>
                                </div>
                              </div>

                            </>


                            : ""}

<h4 className="form-section "><i className="ft-info"></i> Online Account Information</h4>
                      {this.state.online_account.exist === 'no' ?  
                      <div className="row">
                        <div className="col-md-6">
                        <div className="form-group row">
                        <h4 className="ml-4 alert alert-secondary"> No online account found.</h4>
                      </div></div></div>
                      :
<>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group row">
                                <label className="col-md-3 label-control" htmlFor="projectinput1">Username</label>

                                <div className="col-md-9">
                                    <input type="text" id="projectinput1"
                                      className="form-control border-primary"
                                      placeholder="Name"
                                      name="name"
                                      required
                                      value={this.state.name}
                                      onChange={(e) => this.handleChange(e)}
                                      readOnly
                                    />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-md-3 label-control" htmlFor="projectinput4">Date Account Created</label>

                                <div className="col-md-9">
                                  <input type="text"
                                    id="projectinput4"
                                    className="form-control border-primary"
                                    placeholder="Contact Number"
                                    name="contactnumber"
                                    value={this.state.acc_createDate}
                                    onChange={(e) => this.handleChangeNumber(e)}
                                    required
                                  />
                                </div>
                              </div>
                             <div>
                               <Link><i className="ft-arrow-up-right"></i>Deactivate online account
</Link>
                             </div>
                            </div>
                            <div className="col-md-6">
                            <div className="form-group row">
                                <label className="col-md-3 label-control" htmlFor="projectinput3">Membership</label>
                                <div className="col-md-9">
                                  <input type="text"
                                    id="projectinput3"
                                    className="form-control border-primary"
                                    placeholder="Membership"
                                    name="membership"
                                    value={this.state.membership}
                                    onChange={(e) => this.handleChange(e)}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-md-3 label-control" htmlFor="projectinput3">Email</label>
                                <div className="col-md-9">
                                  <input type="text"
                                    id="projectinput3"
                                    className="form-control border-primary"
                                    placeholder="Email"
                                    name="email"
                                    value={this.state.online_account.email === "unverified" ?"Unverified. Resend verification link?":"Verified"}
                                    onChange={(e) => this.handleChange(e)}
                                    readOnly
                                  />
                                </div>
                              </div>

                            </div>

                          </div>
                          </>}
                          <div className="form-actions top">
                            {this.state.id === ""
                              ?
                              <>{this.state.saving ? (
                                <button
                                  type="button"
                                  className="mb-2 mr-2 btn btn-raised btn-primary">
                                  <div
                                    className="spinner-grow spinner-grow-sm "
                                    role="status"></div>  &nbsp; Adding </button>
                              ) : (
                                  <button
                                    type="submit"
                                    className="mb-2 mr-2 btn btn-raised btn-primary">
                                    <i className="ft-check" /> Add Customer</button>
                                )}
                              </> : <>{this.state.saving ? (
                                <button
                                  type="button"
                                  className="mb-2 mr-2 btn btn-raised btn-primary">
                                  <div
                                    className="spinner-grow spinner-grow-sm "
                                    role="status"></div>  &nbsp; Save </button>
                              ) : (
                                  <button
                                    type="submit"
                                    className="mb-2 mr-2 btn btn-raised btn-primary">
                                    <i className="ft-check" /> Save Changes</button>
                                )}
                              </>}
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <footer className="footer footer-static footer-light">
              <p className="clearfix text-muted text-sm-center px-2"><span>Quyền sở hữu của &nbsp;{" "}
                <a href="https://www.sutygon.com" rel="noopener noreferrer" id="pixinventLink" target="_blank" className="text-bold-800 primary darken-2">SUTYGON-BOT </a>, All rights reserved. </span></p>
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
  updateCustomer: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  saved: state.customer.saved,
  auth: state.auth,
  customer: state.customer.customer,

});
export default connect(mapStateToProps, {
  addNewCustomer, updateCustomer,
  getCustomer
})(AddCustomer);
