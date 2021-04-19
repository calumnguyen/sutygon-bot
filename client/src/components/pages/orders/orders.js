import React, { Component } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Alert from "../../layout/Alert";
import "../orders/orders.css";
import Loader from "../../layout/Loader";
import {
  getAllRentedProducts,
  deleteRentedProduct,
  getOrderSearchStatus,
} from "../../../actions/rentproduct";
import { getAllProductsAll } from "../../../actions/product";
import { confirmAlert } from "react-confirm-alert";
import * as moment from "moment";
import "react-confirm-alert/src/react-confirm-alert.css";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import OrderStatus from "./small/Status";
import Spinner from "../../layout/Spinner.js";
import {
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
} from "reactstrap";
import { Button } from "bootstrap";
import OrderCard from "./OrderCard";
import OrdersList from "./OrdersList";

class Orders extends Component {
  state = {
    status: [],
    loading: false,
    search: "",
  };

  async componentDidMount() {
    await this.props.getAllRentedProducts();
  }

  handleStatusToggle = async (name) => {
    let selectedstatus = this.state.status.indexOf(name);

    let resultant = [...this.state.status];

    if (selectedstatus === -1) {
      resultant.push(name);
    } else {
      resultant.splice(selectedstatus, 1);
    }
    this.setState({ status: resultant });

    if (resultant.length == 0) {
      // if user deselect all the elements then fetch all statuses.
      await this.props.getAllRentedProducts();
    } else {
      // is arra contains atleast 1 item then make this request.
      await this.props.getOrderSearchStatus({ status: resultant });
    }
  };
  isToday = (someDate) => {
    return moment(someDate).isSame(Date.now(), "day");
  };
  orderTable = () => {
    const { rentproducts } = this.props;

    if (rentproducts?.length) {
      let ordersDataArr = [];
      rentproducts.forEach((order, idx) => {
        ordersDataArr.push({
          orderNumber: order.orderNumber,
          name: order.customer ? order.customer.name : "",
          phone: order.customer ? order.customer.contactnumber : "",
          status: (
            <OrderStatus
              title={order.status}
              reservedStatus={order.reservedStatus}
              readyForPickUp={order.readyForPickUp}
              pickedUpStatus={order.pickedUpStatus}
              total={`${order.total_notes ? order.total_notes : 0} g/c`}
              remain={`${
                order.notes
                  ? order.notes.filter(
                      (i) => i.done == false && i.alter_request == true
                    ).length
                  : 0
              } y/c  ${this.isToday(order.rentDate) ? "| PickUp Today" : ""}`}
            />
          ),
          actions: (
            <>
              <Link
                to={{ pathname: `/orders/vieworder/${order._id}` }}
                className="success p-0"
              >
                <i
                  className="ft-edit-3 font-medium-3 mr-2 "
                  title="Xem Đơn Hàng"
                ></i>
              </Link>
            </>
          ),
        });
      });

      return (
        <>
          {rentproducts.map((item, index) => (
            <OrderCard key={item.id} index={index} item={item} />
          ))}
        </>
      );
    } else {
      return <div>Chưa có đơn hàng nào</div>;
    }
  };

  render() {
    const { rentproducts } = this.props;
    return (
      <>
        <Loader />
        <div className="wrapper menu-collapsed">
          <Sidebar location={this.props.location}></Sidebar>
          <Header></Header>
          <div className="main-panel">
            <div className="main-content">
              <div className="content-wrapper">
                <section id="extended">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title">Đơn Hàng</h4>
                        </div>
                        <div className="card-content">
                          <div className="card-body table-responsive">
                            <Alert />
                            {this.state.loading ? (
                              <Spinner />
                            ) : (
                              <OrdersList rentproducts={rentproducts} />
                            )}
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
      </>
    );
  }
}

Orders.propTypes = {
  auth: PropTypes.object,
  getAllRentedProducts: PropTypes.func.isRequired,
  getAllProductsAll: PropTypes.func.isRequired,
  deleteRentedProduct: PropTypes.func.isRequired,
  getOrderSearchStatus: PropTypes.func.isRequired,
  rentproducts: PropTypes.array,
  products: PropTypes.array,
};

const mapStateToProps = (state) => ({
  rentproducts: state.rentproduct.rentproducts,
  auth: state.auth,
  loading: state.rentproduct.loading,
});
export default connect(mapStateToProps, {
  getAllRentedProducts,
  deleteRentedProduct,
  getAllProductsAll,
  getOrderSearchStatus,
})(Orders);
