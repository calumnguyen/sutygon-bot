import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import { deleteCustomer, getAllCustomers ,findCustomers} from "../../../actions/customer";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Alert from "../../layout/Alert";
import Loader from "../../layout/Loader";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";


class ViewCustomer extends Component {
  
  state = {
    filter: "",
    search:'',
  };
  async componentDidMount() {
    await this.props.getAllCustomers();
  }

  
  handleChange = (e, id = "") => {
    this.setState({ [e.target.name]: e.target.value });
  };

  async searchTable() {
    // e.preventDefault();
    const searchVal = this.state.search;
    if (searchVal) {
      await this.props.findCustomers(searchVal);
    } else {
      await this.props.getAllCustomers();
    }
  }

  getTAble = () => {
    const { customers,searchedCustomer } = this.props;
    
    if (customers) {
      if (customers.length === 0) {
        return (
          <tr>
            <td colSpan={6} className="text-center">
              Không tìm thấy khách hàng với thông tin này.
            </td>
          </tr>
        );
      }
      return customers.map((customer, i) => (
        <tr key={i}>

          <td className="text-center">{""}</td>

          <td className="text-center">{customer.name}</td>
          <td className="text-center">{customer.contactnumber}</td>
           <td className="text-center">{customer.online_account.exist}</td>
         <td className="text-center">{"Diamond"}</td>
          <td className="text-center">
          <Link to= {{ pathname: `/customer/editcustomer/${customer._id}`}}
              className="success p-0">
              <i className="ft-edit-3 font-medium-3 mr-2 " title="Edit User"></i>
            </Link>
            <Link to="/customer"
              onClick={() => this.onDelete(customer._id)}
              className="danger p-0">
              <i className="ft-x font-medium-3 mr-2" title="Delete"></i>
            </Link>

          </td>

        </tr>
      ));
    }
  };


  onDelete = (id) => {
    confirmAlert({
      title: "Delete Customer",
      message: "Are you sure you want to delete this record?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.props.deleteCustomer(id);
          },
        },
        {
          label: "No",
          onClick: () => { },
        },
      ],
    });
  };



  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/" />;
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
                <section id="extended">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title">Tất Cả Khách Hàng</h4>
                        </div>
                        <div className="card-content">
                          <div className="card-body table-responsive">
                            <div className="row">
                            <div className="col-md-4">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="search"
                                  onChange={(e) => this.handleChange(e)}
                                />
                              </div>
                            <div className="col-md-4">
                                <button
                                  // href="/customer"
                                  className="btn btn-success"
                                  onClick={() => this.searchTable()}
                                >
                                  <i className="fa fa-search"></i> Search{" "}
                                </button>
                              </div>
                              <div className="col-md-4">
                                <Link to="/customer/addcustomer" className="btn btn-primary pull-right"> <i className="fa fa-plus"></i> New Customer</Link>
                              </div>
                            </div>
                            <Alert />
                            <table className="table text-center">
                              <thead>
                                <tr>
                                  <th></th>
                                  <th>Contact Number</th>
                                  <th>Full Name</th>
                                  <th>Online Account</th>
                                  <th>Membership</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody> {this.getTAble()} </tbody>
                            </table>
                          </div>
                        </div>
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

ViewCustomer.propTypes = {
  auth: PropTypes.object,
  getAllCustomers: PropTypes.func.isRequired,
  deleteCustomer: PropTypes.func.isRequired,
  findCustomers:PropTypes.func.isRequired,
  customers: PropTypes.array,
};
const mapStateToProps = (state) => ({
  customers: state.customer.customers ,
  searchedCustomer:state.customer.searchedCustomer,
  auth: state.auth,
});
export default connect(mapStateToProps, {
  getAllCustomers,
  deleteCustomer,findCustomers
})(ViewCustomer);
