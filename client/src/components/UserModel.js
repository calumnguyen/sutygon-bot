import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Alert from "./layout/Alert";
import { getShop } from "../actions/dashboard";

class UserModel extends Component {
  state = {
      username: "",
      accountStatus: "",
  };

 
   render() {
    const { user } = this.props.auth;

    if (user && user.type === "Admin") {
      if (this.props.AuthLoading === false && this.props.isAuthenticated) {
        return <Redirect to="/dashboard" />;
      }
    }

    return (

      <div className="wrapper menu-collapsed">
        <div className="main-panel">
                <div className="container-fluid" >
                  <div className="row full-height-vh m-0">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                    
                
                </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}


UserModel.propTypes = {
  auth: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  AuthLoading: state.auth.loading,
  auth: state.auth,

});

export default connect(mapStateToProps, {
})(UserModel);
