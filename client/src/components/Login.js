import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../actions/auth";
import Alert from "./layout/Alert";
import { getShop } from "../actions/dashboard";

class Login extends Component {
  state = {
    formData: {
      email: "",
      password: "",
    },
  };

  async componentDidMount() {
    this.props.getShop();
  }

  onChange = (e) => {
    let { formData } = this.state;
    formData[e.target.name] = e.target.value;
    this.setState({ formData });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const { login } = this.props;

    const { username, password } = this.state.formData;
    login(username, password);

  }

  render() {
    const { shop } = this.props;
    const { user } = this.props.auth;

    if (user && user.type == "Employee") {
      if (shop) {
        let openShop = shop[0]
        if (openShop) {
          if (this.props.AuthLoading === false && this.props.isAuthenticated) {
            if (openShop.status == "on") {
              return <Redirect to="/dashboard" />;
            }

            else if (openShop.status == "off") {
              // setAlert("Shop is closed", "danger", 5000);
            }
          }

        }
      }
    }
    // if(user && user.type == "User") {
    //   if(shop){
    //   let openShop = shop[0]
    //   console.log(openShop)
    //    if(openShop && openShop.status === "off"){
    //     console.log("USer")
    //     localStorage.clear();
    //     this.props.history.push("/");
    //     window.location.reload();
    //     setAlert("Shop is closed", "danger", 5000);
    //    }
    // };
    // }

    if (user && user.type == "Admin") {
      if (this.props.AuthLoading === false && this.props.isAuthenticated) {
        return <Redirect to="/dashboard" />;
      }
    }

    return (

      <div className="wrapper menu-collapsed">
        <div className="main-panel">
          <div className=""  >
            <div className="" >
              <section id="login"  >
                <div className="container-fluid" >
                  <div className="row full-height-vh m-0">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                      <div className="card mx-5">
                        <div className="card-content">
                          <div className="card-body login-img">
                            <div className="row m-0">
                              <div className="col-lg-6 d-lg-block d-none py-2 text-center align-middle mt-5 mb-n5 img-block">
                                <img alt=""
                                  className="img-fluid imglogin"
                                  width="400"
                                  height="230">
                                </img>
                              </div>
                              <div className="col-lg-6 col-md-12 bg-white px-4 pt-3">
                                <div className="logo-img text-center align-middle">
                                  <img 
                                  alt={"Sutygon-bot"}
                                  src="assets/img/logos/logo.png" height={100} width={100} />
                                </div>
                                <h4 className="mb-2 card-title text-center align-middle" style={{}}>Đăng Nhập</h4>
                                <p className="card-text mb-3 text-center align-middle">
                                  Đăng Nhập Với Một Nụ Cười Nào
                  </p>
                                <form onSubmit={(e) => this.onSubmit(e)}>
                                  <Alert />

                                  <input type="text"
                                    className="form-control mb-3"
                                    placeholder="Username"
                                    required
                                    onChange={(e) => this.onChange(e)}
                                    name="username" />
                                  <input type="password"
                                    className="form-control mb-1"
                                    placeholder="Password"
                                    required
                                    onChange={(e) => this.onChange(e)}
                                    name="password" />
                                  <div className="fg-actions justify-content-between">
                                    <div className="recover-pass">
                                      <input
                                        className="btn btn-primary btn-lg btn-block"
                                        type="submit"
                                        value="Tôi đã sẵn sàng để chăm sóc khách hàng"
                                      />
                                    </div>
                                  </div>
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


Login.propTypes = {
  auth: PropTypes.object,
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  getShop: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  AuthLoading: state.auth.loading,
  auth: state.auth,
  shop: state.dashboard.shop

});

export default connect(mapStateToProps, {
  login,
  getShop
})(Login);
