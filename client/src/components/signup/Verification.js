import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import { updatePassword, getUser } from "../../actions/user";
import axios from "axios";
import Alert from "../layout/Alert";
// import { getShop } from "../../actions/dashboard";
import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";
class Verification extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    newpassword: "",
    confirmpassword: "",
    id: "",
    tempPass: "",
    userID: "",
  };

  async componentDidMount() {
    // this.props.getShop();

    // await this.props.getUser(userID)
  }
  async componentDidUpdate(prevProps, prevState) {
    if (this.props.auth.error !== prevProps.auth.error) {
      const { auth } = this.props;
      const { userInfo } = auth.error;
      if (userInfo) {
        this.setState({
          tempPass: userInfo.tempPass,
          userID: userInfo.userID,
        });
      }
    }
  }
  onChange = (e) => {
    // let { formData } = this.state;

    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = axios.post("/");
    } catch (e) {}
  };

  render() {
    // const { shop } = this.props;
    const { user } = this.props.auth;

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
                              <div className="col-lg-6 d-lg-block d-none py-2 text-center align-middle mt-5 mb-n5 img-block">
                                <img
                                  alt=""
                                  className="img-fluid imglogin"
                                  width="400"
                                  height="230"
                                ></img>
                              </div>
                              <div className="col-lg-6 col-md-12 bg-white px-4 pt-3">
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
                                  Sign Up
                                </h4>
                                <p className="card-text mb-3 text-center align-middle">
                                  Sign Up With A Smile
                                </p>
                                <form onSubmit={(e) => this.onSubmit(e)}>
                                  <Alert />

                                  <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Username"
                                    required
                                    onChange={(e) => this.onChange(e)}
                                    name="username"
                                  />
                                  <input
                                    type="password"
                                    className="form-control mb-1"
                                    placeholder="Password"
                                    required
                                    onChange={(e) => this.onChange(e)}
                                    name="password"
                                  />
                                  <div className="fg-actions justify-content-between">
                                    <div className="recover-pass">
                                      <input
                                        className="btn btn-primary btn-lg btn-block"
                                        type="submit"
                                        value="Create You Account"
                                      />
                                    </div>
                                  </div>
                                  <Link class="nav-link" to={"/Login"}>
                                    Login
                                  </Link>
                                </form>
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

Verification.propTypes = {
  auth: PropTypes.object,
  passwordUpdated: PropTypes.bool,
  userID: PropTypes.object,
  user: PropTypes.object,
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  // getShop: PropTypes.func.isRequired,
  updatePassword: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  AuthLoading: state.auth.loading,
  userID: state.auth.error,
  auth: state.auth,
  // shop: state.dashboard.shop,
  passwordUpdated: state.user.passwordUpdated,
  user: state.user.user,
});

export default connect(mapStateToProps, {
  login,
  updatePassword,
  getUser,
  // getShop,
})(Verification);
