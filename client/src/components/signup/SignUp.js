import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import { updatePassword, getUser } from "../../actions/user";
import axios from "axios";
import Alert from "../layout/Alert";
import { getShop } from "../../actions/dashboard";
import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";
class SignUp extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    newpassword: "",
    confirmpassword: "",
    id: "",
    tempPass: "",
    userID: "",
    mesg: "",
    verify: false,
    code: "",
    userDetail: "",
    errors: "",
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    try {
      this.setState({ mesg: "", errors: "", isLoading: true, code: "" });
      const { email, password } = this.state;
      const res = await axios.post("/api/auth/send_email", {
        email: email,
        password: password,
      });
      this.setState({ mesg: res.data.message, verify: true, isLoading: false });
    } catch (err) {
      if (err.response !== undefined && err.response.data) {
        this.setState({ errors: err.response.data.errors, isLoading: false });
      }
    }
  };
  onSubmitVerify = async (e) => {
    e.preventDefault();
    try {
            this.setState({ isLoading: true,verify: true, mesg: "", errors: "", });
      const { code } = this.state;
      const res = await axios.post("/api/auth/check_verification_code", {
        code: code,
      });
      this.setState({ userDetail: res.data.userExist, mesg: res.data.mesg , isLoading: false,errors: "", });
      setTimeout(() => {
        this.props.history.push("/PersonalInfo", {
          userExist: res.data.userExist,
        });
      }, 1000);
    } catch (err) {
      if (err.response !== undefined && err.response.data) {
        this.setState({ errors: err.response.data.errors, isLoading: false });
      }
    }
  };

  render() {
    // if (this.state.userDetail) {
    //     return <Redirect to="/PersonalInfo" />;
    // }
    return (
      <div className="wrapper menu-collapsed">
        <div className="main-panel">
          <div className="">
            <div className="">
              <section id="login">
                <div className="container-fluid">
                  <div className="row full-height-vh m-0">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                      <div className="card m-5">
                        <div className="card-content">
                          <div className="card-body login-img">
                            <div className="row m-0">
                              <div className="col-lg-12 col-md-12 bg-white px-4 pt-3">
                                <div className="logo-img text-center align-middle">
                                  <img
                                    alt={"Sutygon-bot"}
                                    src="assets/img/logos/logo.png"
                                    height={100}
                                    width={100}
                                  />
                                </div>
                                <h4
                                  className="mb-2 card-title text-center align-middle"
                                  style={{}}
                                >
                                  {this.state.verify
                                    ? "Verify Your Email Address"
                                    : "Register"}
                                </h4>
                                <p
                                  className="card-text mb-3 text-center align-middle"
                                  style={{ width: "400px" }}
                                >
                                  {this.state.verify
                                    ? "To ensure your privacy, we have sent you a code to the email you registered with. Please provide the code below."
                                    : "Register your account"}
                                </p>
                                {this.state.mesg && (
                                  <div
                                    className="alert alert-success"
                                    role="alert"
                                  >
                                    {this.state.mesg}
                                  </div>
                                )}
                                {this.state.errors && (
                                  <div
                                    className="alert alert-danger"
                                    role="alert"
                                  >
                                    {this.state.errors}
                                  </div>
                                )}

                                {this.state.verify ? (
                                  <form
                                    onSubmit={(e) => this.onSubmitVerify(e)}
                                  >
                                    <Alert />

                                    <input
                                      type="text"
                                      className="form-control mb-3"
                                      placeholder="Enter Your 4 Digit PIN Code"
                                      required
                                      value={this.state.code}
                                      maxLength={4}
                                      minLength={4}
                                      autoComplete="off"
                                      onChange={(e) => this.onChange(e)}
                                      name="code"
                                    />
                                    <div className="fg-actions justify-content-between">
                                      <div className="recover-pass">
                                       <button
                                          disabled={this.state.isLoading}
                                          type="submit"
                                          className="btn btn-primary btn-lg btn-block"
                                        >
                                          {this.state.isLoading && (
                                            <i className="fa fa-refresh fa-spin mr-1"></i>
                                          )}
                                          Verify
                                        </button>
                                      </div>
                                    </div>
                                    <Link className="nav-link" to={"/Login"}>
                                      Have an account? Sign in here!
                                    </Link>
                                  </form>
                                ) : (
                                  <form onSubmit={(e) => this.onSubmit(e)}>
                                    <Alert />

                                    <input
                                      type="email"
                                      className="form-control mb-3"
                                      placeholder="Enter Your Email"
                                      required
                                      onChange={(e) => this.onChange(e)}
                                      name="email"
                                    />
                                    <input
                                      type="password"
                                      className="form-control mb-3"
                                      placeholder="Enter a secured password"
                                      required
                                      onChange={(e) => this.onChange(e)}
                                      name="password"
                                    />

                                    <div className="fg-actions justify-content-between">
                                      <div className="recover-pass">
                                        <button
                                          disabled={this.state.isLoading}
                                          type="submit"
                                          className="btn btn-primary btn-lg btn-block"
                                        >
                                          {this.state.isLoading && (
                                            <i className="fa fa-refresh fa-spin mr-1"></i>
                                          )}
                                          Register
                                        </button>
                                      </div>
                                    </div>
                                    <Link className="nav-link" to={"/Login"}>
                                      Have an account? Sign in here!
                                    </Link>
                                  </form>
                                )}
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
        </div>
      </div>
    );
  }
}

SignUp.propTypes = {
  auth: PropTypes.object,
  passwordUpdated: PropTypes.bool,
  userID: PropTypes.object,
  user: PropTypes.object,
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  getShop: PropTypes.func.isRequired,
  updatePassword: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  AuthLoading: state.auth.loading,
  userID: state.auth.error,
  auth: state.auth,
  shop: state.dashboard.shop,
  passwordUpdated: state.user.passwordUpdated,
  user: state.user.user,
});

export default connect(mapStateToProps, {
  login,
  updatePassword,
  getUser,
  getShop,
})(SignUp);
