import React, { Component } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAllAdminList, onStatusUpdate } from "../../actions/admin";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Alert from "../layout/Alert";
import Loader from "../layout/Loader";

import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";

class ViewAdminList extends Component {
  state = {
    activeUsers: false,
    inactiveUsers: false,
    admins: "",
    activeuser: "",
    allusers: true,
    usernamesArr: "",
    emailArr: "",
  };

  async componentDidMount() {
    this.getUsers();
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 sec
    this.getUsers(); // getting users again for updated image in case of edit
  }

  async getUsers() {
    await this.props.getAllAdminList();
    let usernames = [];
    let emails = [];
    const { admins } = this.props;
    if (admins) {
      this.setState({
        admins: admins,
      });
      admins.filter((user) => {
        usernames.push(user.username);
      });
      admins.filter((user) => {
        emails.push(user.email);
      });
      this.setState({
        usernamesArr: usernames,
        emailArr: emails,
      });
    }
  }

  getTAble = () => {
    const { auth, admins } = this.props;
    const auth_user = auth.user;
    if (admins) {
      if (admins.length === 0) {
        return (
          <tr>
            <td colSpan={9} className="text-center">
              Không tìm thấy tài khoản nào :-(
            </td>
          </tr>
        );
      }
      return admins.map((user) => (
        <tr key={user._id}>
          <td className="text-center">
            <img
              className="media-object round-media"
              src={user.avatar}
              alt="Ảnh Đại Diện"
              height={55}
            />
          </td>
          <td className="text-center">{user.fullname ? user.fullname : "-"}</td>
          <td className="text-center">
            {user.contactnumber ? user.contactnumber : "-"}
          </td>
          <td className="text-center">
            {user.company_name ? user.company_name : "-"}
          </td>
          <td className="text-center">
            {user.company_address ? user.company_address : "-"}
          </td>
          <td className="text-center">
            {user.accountStatus === "active" && (
              <span className="badge badge-success">Active</span>
            )}
            {user.accountStatus === "inactive" && (
              <span className="badge badge-warning">Inactive</span>
            )}
          </td>
          <td className="text-center">
            {/* <Link
              to={{ pathname: `/user/view/${user._id}` }}
              className="info p-0">
              <i className="ft-user font-medium-3 mr-2" title="View Profile"></i>
            </Link> */}

            {auth_user && auth_user.systemRole === "superadmin" ? (
              <Link
                to="/adminsview"
                onClick={() =>
                  this.onUpdateStatus(user._id, user.accountStatus)
                }
                className="danger p-0"
              >
                <i
                  className={`fa fa-${
                    user.accountStatus === "inactive"
                      ? "check text-success"
                      : "times text-danger"
                  } font-medium-3 mr-2`}
                  title="Update Status"
                ></i>
              </Link>
            ) : (
              ""
            )}
          </td>
        </tr>
      ));
    }
  };

  handleChange = () => {
    const { admins } = this.props;
    const activeUsers = admins.filter((a) => a.accountStatus === "active");
    this.setState({
      allusers: false,
      inactiveUsers: false,
      activeUsers: true,
      admins: activeUsers,
    });
  };
  handleChange_Inactive = () => {
    const { admins } = this.props;
    const inactiveUsers = admins.filter((a) => a.accountStatus === "inactive");
    this.setState({
      activeUsers: false,
      allusers: false,
      inactiveUsers: true,
      admins: inactiveUsers,
    });
  };

  handleChange_alluser = () => {
    const { admins } = this.props;
    this.setState({
      activeUsers: false,
      inactiveUsers: false,
      allusers: true,
      admins: admins,
    });
  };

  onUpdateStatus = (id, status) => {
    confirmAlert({
      title: " Account Status",
      message: `Are you sure you want to ${
        status == "active" ? "Inactive" : "Active"
      } this User?`,
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            const updateStatus = status == "active" ? "inactive" : "active";
            this.props.onStatusUpdate(id, updateStatus);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    const { user } = auth;

    if (user && user.systemRole === "Employee") {
      return <Redirect to="/Error" />;
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
                <section id="simple-table">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title">All Admins</h4>
                        </div>
                        <div className="card-content">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-8">
                                <label
                                  className="radio-inline"
                                  style={{ marginLeft: "10px" }}
                                >
                                  <input
                                    type="radio"
                                    name="activeUser"
                                    checked={this.state.allusers}
                                    onChange={(e) =>
                                      this.handleChange_alluser(true)
                                    }
                                    checked={this.state.allusers === true}
                                  />{" "}
                                  All
                                </label>
                                <label
                                  className="radio-inline"
                                  style={{ marginLeft: "10px" }}
                                >
                                  <input
                                    type="radio"
                                    name="activeUser"
                                    checked={this.state.activeUsers}
                                    onChange={(e) => this.handleChange(true)}
                                    checked={this.state.activeUsers === true}
                                  />{" "}
                                  Active Admins
                                </label>
                                <label
                                  className="radio-inline"
                                  style={{ marginLeft: "10px" }}
                                >
                                  <input
                                    type="radio"
                                    name="InactiveUser"
                                    checked={this.state.inactiveUsers}
                                    onChange={(e) =>
                                      this.handleChange_Inactive(true)
                                    }
                                    checked={this.state.inactiveUsers === true}
                                  />{" "}
                                  Inactive Admins
                                </label>
                              </div>

                              <div className="col-md-4"></div>
                            </div>
                            <Alert />
                            <OCAlertsProvider />
                            <div className="overflow-x-scroll">
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th className="text-center">Avatar</th>
                                    <th className="text-center">Full Name</th>
                                    <th className="text-center">
                                      Contact Number
                                    </th>
                                    <th className="text-center">
                                      Company Name
                                    </th>
                                    <th className="text-center">
                                      Company Address
                                    </th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">Update</th>
                                  </tr>
                                </thead>
                                <tbody>{this.getTAble()}</tbody>
                              </table>
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
      </React.Fragment>
    );
  }
}

ViewAdminList.propTypes = {
  getAllAdminList: PropTypes.func.isRequired,
  auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
  admins: state.admin.admins,
  auth: state.auth,
});
export default connect(mapStateToProps, {
  getAllAdminList,
  onStatusUpdate,
})(ViewAdminList);
