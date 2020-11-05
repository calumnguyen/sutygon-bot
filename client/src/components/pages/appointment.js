import React, { Component } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import { addNewAppointment } from "../../actions/appointment";
import { getAllProducts } from "../../actions/product";
import { getAllCustomers } from "../../actions/customer";
import Alert from "../layout/Alert";
import Loader from "../layout/Loader";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class AddAppointment extends Component {
  state = {
    id: "",
    appointmentNumber: "",
    start: "",
    end: "",
    customer: "",
    user: "",
    saving: false,
  };
  async componentDidMount() {
    this.props.getAllProducts();
    this.props.getAllCustomers();

  }

  handleChange = (e, id = "") => {
    this.setState({ [e.target.name]: e.target.value });

  };

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ saving: true });

    const state = { ...this.state };
    const { user } = this.props.auth;
    const appointment = {
      appointmentNumber: state.appointmentNumber,
      start: state.start,
      end: state.start,
      customer: state.customer,
      user: user._id,
    };

    if (state.id === "") {
      await this.props.addNewAppointment(appointment);

    }
    this.setState({ saving: false });
  }
  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/" />;
    }

    if (this.props.saved) {
      return <Redirect to="/calender" />;
    }
    const { customer } = this.state;
    const { customers } = this.props.customers;

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
                        <h4 className="form-section"><i className="icon-social-dropbox"></i>
                          Add New Appointment</h4>
                      </div>

                      <div className="card-body">

                        <form onSubmit={(e) => this.onSubmit(e)}>
                          <Alert />

                          <div className="row">
                            <div className="form-group col-6 mb-2">
                              <label htmlFor="issueinput5">Select Customer</label>
                              <select
                                name="customer"
                                className="form-control"
                                onChange={(e) => this.handleChange(e)}
                              >
                                <option value="DEFAULT"> -- select -- </option>
                                {customers &&
                                  customers.map((record) => (
                                    <option
                                      key={record._id}
                                      value={record._id}
                                      selected={record._id === customer}
                                    >
                                      {record.name +
                                        " - " +
                                        record.contactnumber}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <div className="form-group col-md-6 mb-2">
                              <label
                                htmlFor="issueinput3"
                              >Appointment Date
                    </label>
                              <input
                                type="date"
                                id="issueinput3"
                                className="form-control"
                                name="start"
                                data-toggle="tooltip"
                                data-trigger="hover"
                                data-placement="top"
                                data-title="Date Opened"
                                onChange={(e) => this.handleChange(e)}
                                value={this.state.start}
                              />
                            </div>
                          </div>


                          <div className="form-actions top">

                            {this.state.saving ? (
                              <button
                                type="button"
                                className="mb-2 mr-2 btn btn-raised btn-primary"
                              >
                                <div
                                  className="spinner-grow spinner-grow-sm "
                                  role="status"
                                ></div>
                                &nbsp; Creating
                              </button>
                            ) : (
                                <button
                                  type="submit"
                                  className="mb-2 mr-2 btn btn-raised btn-primary"
                                >
                                  <i className="ft-check" /> Create Appointment
                                </button>
                              )}
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
                            <a href="https://www.sutygon.com" rel="noopener noreferrer"  id="pixinventLink" target="_blank" className="text-bold-800 primary darken-2">SUTYGON-BOT </a>, All rights reserved. </span></p>
            </footer>

          </div>

        </div>

      </React.Fragment>

    );
  }
}

AddAppointment.propTypes = {
  saved: PropTypes.bool,
  addNewAppointment: PropTypes.func.isRequired,
  auth: PropTypes.object,
  getAllCustomers: PropTypes.func.isRequired,
  getAllProducts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  appointment: state.appointment,
  saved: state.appointment.saved,
  auth: state.auth,
  products: state.product,
  customers: state.customer

});
export default connect(mapStateToProps, {
  addNewAppointment, 
  getAllCustomers, 
  getAllProducts
})(AddAppointment);

