import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import loadjs from 'loadjs';
import {Link} from 'react-router-dom'

class Header extends Component {
  state = {
    username: "",
    userType: "",
    id: "",
    avatar: ""
  };
  

  componentDidMount() {
    loadjs(`/assets/vendors/js/core/jquery-3.2.1.min.js`);
    loadjs(`/assets/vendors/js/core/popper.min.js`);
    loadjs(`/assets/vendors/js/core/bootstrap.min.js`);
    loadjs(`/assets/vendors/js/perfect-scrollbar.jquery.min.js`);
    loadjs(`/assets/vendors/js/prism.min.js`);
    loadjs(`/assets/vendors/js/jquery.matchHeight-min.js`);
    loadjs(`/assets/vendors/js/screenfull.min.js`);
    loadjs(`/assets/vendors/js/pace/pace.min.js`);
    loadjs(`/assets/js/app-sidebar.js`);
    loadjs(`/assets/js/notification-sidebar.js`);
    loadjs(`/assets/js/customizer.js`);
    loadjs(`/assets/js/view_product.js`);
    const { user } = this.props.auth;
    if(user != undefined) {
      this.setState({
      username: user.username,
      userType: user.type,
      id:user._id,
      avatar:user.avatar
    });
    }

  }

 
  render() {
  
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-faded header-navbar">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" data-toggle="collapse" className="navbar-toggle d-lg-none float-left"><span className="sr-only">Toggle navigation</span><span className="icon-bar"></span><span className="icon-bar"></span><span className="icon-bar"></span></button><span className="d-lg-none navbar-right navbar-collapse-toggle">
              <a 
              aria-controls="navbarSupportedContent"
              href="/dashboard" 
              className="open-navbar-container black"
              ><i className="ft-more-vertical"></i></a></span>
            <form className="navbar-form navbar-right mt-1">
              <div className="position-relative has-icon-right">
              </div>
            </form>
          </div>
          <div className="navbar-container">
            <div id="navbarSupportedContent" className="collapse navbar-collapse">
              <ul className="navbar-nav">
                <li className="dropdown nav-item">
                  <a id="dropdownBasic3"  href="/dashboard"  data-toggle="dropdown" className="nav-link position-relative dropdown-toggle"><img style={{'height':'40px'}}src={this.state.avatar} />
                    <p className="d-none">User Settings</p></a>
                  <div ngbdropdownmenu="" aria-labelledby="dropdownBasic3" className="dropdown-menu text-left dropdown-menu-right">
                  
                      <a href={this.state.id ? `/user/edituser/${this.state.id}`:"" }
                       className="dropdown-item py-1"><i className="ft-edit mr-2"></i><span>Edit Profile</span></a>
                     
                    
                    <Link
                          push={true}
                           to="/"
                          onClick={() => this.props.logout()}
                          className="dropdown-item"
                        >
                          Logout
                        </Link>
                  </div>
                </li>
     
              </ul>
            </div>
          </div>
        </div>
      </nav>

  );
  }
}



Header.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object,
};



const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout })(Header);
