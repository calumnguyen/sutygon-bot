import React, { Component } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import Loader from "../layout/Loader";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAllAppointments } from "../../actions/appointment";
import { getAllRentedProducts } from "../../actions/rentproduct";
import { getAllProducts } from "../../actions/product";
import { getAllEventts } from "../../actions/events";
import { changeShopStatus, getShop } from "../../actions/dashboard";
import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";
import * as moment from "moment";
import "../../login.css";
import "../../dashbaord.css";
import { Redirect } from "react-router-dom";

class Dashboard extends Component {
  state = {
    currenWeekEvents: [],
  };
  async componentDidMount() {
    await this.props.getAllAppointments();
    await this.props.getAllRentedProducts();
    await this.props.getAllProducts();
    await this.props.getShop();
    await this.props.getAllEventts();
    await this.getPendingEvents();
  }

  async changeShopStatus(status) {
    await this.props.changeShopStatus(status);
    await this.props.getShop();
  }

  getPendingEvents() {
    // e.preventDefault()
    var dateAfterSevenDays = moment(moment().add(7, "days")).format();
    var currentdate = moment(moment().subtract(1, "days")).format();
    const { events } = this.props;
    if (events) {
      const m_events = [];
      let b_events = events.filter((a) => a.birthdate != "" && a.birthdate);
      b_events &&
        b_events.forEach((event) => {
          const new_Date =
            new Date(event.date).getFullYear() +
            "-" +
            new Date(event.birthdate).getMonth() +
            1 +
            "-" +
            new Date(event.birthdate).getDate() +
            "T22:20:52.000Z";
          m_events.push({
            date: new_Date,
            timeStart: event.timeStart,
            timeEnd: event.timeEnd,
            name: event.name,
            note: event.note,
            location: event.location,
            _id: event._id,
            birthdate: event.birthdate,
          });
        });
      let c_events = events.filter((a) => a.birthdate == null);
      let modified_events = [...c_events, ...m_events];

      var currenWeekEvents = modified_events.filter((a) => {
        var m_date =
          new Date(a.date).getFullYear() +
          "-" +
          new Date(a.date).getMonth() +
          1 +
          "-" +
          new Date(a.date).getDate() +
          "T22:20:52.000Z";
        return m_date >= currentdate && a.date <= dateAfterSevenDays;
      });
      this.setState({
        currenWeekEvents: currenWeekEvents,
      });
    }
  }

  getPendingOrder = () => {
    // e.preventDefault()
    const { rentedproducts } = this.props;
    if (rentedproducts) {
      let events = rentedproducts.filter(
        (a) => new Date(a.returnDate) - new Date() > 0
      );

      return events.length;
    }
  };
  getOverDueOrder = () => {
    const { rentedproducts } = this.props;
    if (rentedproducts) {
      var currentdate = moment(new Date()).format("MM/DD/YYYY");

      let events = rentedproducts.filter((a) =>
        moment(moment(a.returnDate).format("MM/DD/YYYY")).isBefore(currentdate)
      );
      if (events.length > 0) {
        let returningOrders = events.filter((f) => f.status !== "Completed");
        return returningOrders.length;
      }
    }
  };

  getTodaysOrder = () => {
    // e.preventDefault()
    const { rentedproducts } = this.props;
    if (rentedproducts) {
      var currentdate = moment(new Date()).format("MM/DD/YYYY");

      let events = rentedproducts.filter((a) =>
        moment(moment(a.createdAt).format("MM/DD/YYYY")).isSame(currentdate)
      );
      return events.length;
    }
  };
  orderPickUpToday = () => {
    const { rentedproducts } = this.props;
    if (rentedproducts) {
      var currentdate = moment(new Date()).format("MM/DD/YYYY");
      let events = rentedproducts.filter((a) =>
        moment(moment(a.rentDate).format("MM/DD/YYYY")).isSame(currentdate)
      );
      let returningOrders = events.filter((f) => f.status !== "Completed");
      return returningOrders.length;
    }
  };
  getReturnOrder = () => {
    // e.preventDefault()
    const { rentedproducts } = this.props;
    if (rentedproducts) {
      var currentdate = moment(new Date()).format("MM/DD/YYYY");
      let events = rentedproducts.filter((a) =>
        moment(moment(a.returnDate).format("MM/DD/YYYY")).isSame(currentdate)
      );
      return events.length;
    }
  };
  getTodaysAppointment = () => {
    // e.preventDefault()
    const { appointment } = this.props;
    if (appointment) {
      var currentdate = moment(new Date()).format("MM/DD/YYYY");
      let events = appointment.filter((a) =>
        moment(moment(a.start).format("MM/DD/YYYY")).isSame(currentdate)
      );
      return events.length;
    }
  };

  render() {
    const { shop } = this.props;
    const { user } = this.props.auth;
    if (user && user.systemRole === "Employee") {
      if (shop) {
        let openShop = shop[0];
        if (openShop && openShop.status === "off") {
          return (
            <Redirect
              push
              to={{
                pathname: "/storeclosed",
                shop: shop[0],
              }}
            />
          );
        }
      }
    }
    const startTime =
      this.props.shop[0] && moment(this.props.shop[0].shopStartTime);

    return (
      <React.Fragment>
        <Loader />
        <div className="wrapper menu-collapsed">
          <Sidebar location={this.props.location}></Sidebar>
          <Header></Header>

          <div className="main-panel">
            <div className="main-content">
              <div className="content-wrapper">
                <div className="row">
                  <h4 className="ml-2 text-bold-400">
                    Hello {user && user.fullname && `${user.fullname}`}, hope
                    you have a great day!
                  </h4>
                </div>
                <div className="row">
                  <div className="col-md-8">
                      <div className="card w-100">
                      <div className="row w-100 m-1">

                          <div className="col-xl-4 col-lg-4 col-md-6">
                            <div className="card gradient-red-pink">
                              <div className="card-content">
                                <div className="card-body pt-2 pb-0">
                                  <div className="media">
                                    <div className="media-body white text-left">
                                      <h3 className="font-large-1 mb-0">
                                        {this.getTodaysAppointment()}
                                      </h3>
                                      <a
                                        href="/calender"
                                        style={{
                                          textDecoration: "none",
                                          color: "white",
                                        }}
                                      >
                                        Today's Appointment
                                      </a>
                                    </div>
                                    <div className="media-right white text-right">
                                      <i className="icon-pie-chart font-large-1"></i>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  id="Widget-line-chart"
                                  className="height-75 WidgetlineChart WidgetlineChartshadow mb-2"
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-4 col-lg-4 col-md-6">
                            <div className="card gradient-blueberry">
                              <div className="card-content">
                                <div className="card-body pt-2 pb-0">
                                  <div className="media">
                                    <div className="media-body white text-left">
                                      <h3 className="font-large-1 mb-0">
                                        {this.getReturnOrder()}
                                      </h3>
                                      <span>Đơn Hàng Phải Trả Hôm Nay</span>
                                    </div>
                                    <div className="media-right white text-right">
                                      <i className="icon-bulb font-large-1"></i>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  id="Widget-line-chart1"
                                  className="height-75 WidgetlineChart WidgetlineChartshadow mb-2"
                                ></div>
                              </div>
                            </div>
                          </div>

                          <div className="col-xl-4 col-lg-4 col-md-6">
                            <div className="card gradient-mint">
                              <div className="card-content">
                                <div className="card-body pt-2 pb-0">
                                  <div className="media">
                                    <div className="media-body white text-left">
                                      <h3 className="font-large-1 mb-0">
                                        {this.getOverDueOrder()}
                                      </h3>
                                      <span>Đơn Hàng Quá Hạn</span>
                                    </div>
                                    <div className="media-right white text-right">
                                      <i className="icon-graph font-large-1"></i>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  id="Widget-line-chart2"
                                  className="height-75 WidgetlineChart WidgetlineChartshadow mb-2"
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-4 col-lg-4 col-md-6">
                            <div className="card gradient-mini">
                              <div className="card-content">
                                <div className="card-body pt-2 pb-0">
                                  <div className="media">
                                    <div className="media-body white text-left">
                                      <h3 className="font-large-1 mb-0">
                                        {this.orderPickUpToday()}
                                      </h3>
                                      <span>Order Pickup Today</span>
                                    </div>
                                    <div className="media-right white text-right">
                                      <i className="icon-wallet font-large-1"></i>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  id="Widget-line-chart3"
                                  className="height-75 WidgetlineChart WidgetlineChartshadow mb-2"
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-4 col-lg-4 col-md-6">
                            <div className="card gradient-brown-brown">
                              <div className="card-content">
                                <div className="card-body pt-2 pb-0">
                                  <div className="media">
                                    <div className="media-body white text-left">
                                      <h3 className="font-large-1 mb-0">{}</h3>
                                      <span>Order Needs Alteration</span>
                                    </div>
                                    <div className="media-right white text-right">
                                      <i className="icon-wallet font-large-1"></i>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  id="Widget-line-chart3"
                                  className="height-75 WidgetlineChart WidgetlineChartshadow mb-2"
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-4 col-lg-4 col-md-6">
                            <div className="card gradient-orange">
                              <div className="card-content">
                                <div className="card-body pt-2 pb-0">
                                  <div className="media">
                                    <div className="media-body white text-left">
                                      <h3 className="font-large-1 mb-0">
                                        {this.getTodaysOrder()}
                                      </h3>
                                      <span>Today's Orders</span>
                                    </div>
                                    <div className="media-right white text-right">
                                      <i className="fa-music font-large-1"></i>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  id="Widget-line-chart3"
                                  className="height-75 WidgetlineChart WidgetlineChartshadow mb-2"
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    {user && user.systemRole === "Employee" ? (
                      <>
                        <div className="card" style={{ height:390,overflowY:'scroll'}}>
                          <div className="card-body">
                            <div className="row w-100">
                              {this.state.currenWeekEvents &&
                                this.state.currenWeekEvents.length > 0 &&
                                this.state.currenWeekEvents.map((a, a_i) => {
                                  return (
                                        <div
                                          class="alert alert-secondary alert-dismissible mb-2 w-100"
                                          role="alert"
                                        >
                                          <button
                                            type="button"
                                            class="close"
                                            data-dismiss="alert"
                                            aria-label="Close"
                                          >
                                            <span aria-hidden="true">
                                              &times;
                                            </span>
                                          </button>
                                          <p className="my-n1">
                                            Name of Event :{" "}
                                            <strong>{a.name}</strong>
                                          </p>
                                          <p className="my-n1">
                                            <small class="text-muted">
                                              Date :
                                              {moment(a.date).format(
                                                "MM/DD/YYYY"
                                              )}{" "}
                                            
                                            </small>
                                          </p>
                                          <p className="my-n1">
                                            <small class="text-muted">
                                              From : 
                                              {moment(a.timeStart).format(
                                                "hh:mm A"
                                              )}{" "}
                                              To : {" "}
                                              {moment(a.timeEnd).format(
                                                "hh:mm A"
                                              )}
                                            </small>
                                          </p>
                                          <p className="my-n1">
                                            <small class="text-muted">
                                              Location:{a.location}
                                            </small>
                                          </p>
                                          <p className="my-n1">
                                            <small class="text-muted">
                                              Note:{a.note}
                                            </small>
                                          </p>
                                        </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      " "
                    )}
                  </div>
                </div>
                {user && user.systemRole === "Admin" ? (
                  <>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="card">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-7 txt-sep">
                                <h2>
                                  Cửa Hàng Đã{" "}
                                  {this.props.shop[0] &&
                                    (this.props.shop[0].status === "on"
                                      ? "Mở Cửa"
                                      : "Đóng Cửa")}{" "}
                                  lúc
                                </h2>
                                <h1>
                                  {" "}
                                  <span className="badge badge-info">
                                    {this.props.shop[0] &&
                                      startTime
                                        .tz("Asia/Vientiane")
                                        .format("hh:mm a")}
                                  </span>
                                </h1>
                                <p>
                                  <span className="badge badge-pill badge-light">
                                    {this.props.shop[0] &&
                                      startTime
                                        .tz("Asia/Vientiane")
                                        .format("DD-MMM-YY")}
                                  </span>{" "}
                                </p>
                              </div>
                              <div className="col-md-3 txt-sep">
                                <h3 className="mt-1">Trạng thái</h3>
                                <p className="badge badge-pill badge-light">
                                  {this.props.shop[0] &&
                                    (this.props.shop[0].status === "on"
                                      ? "Mở Cửa"
                                      : "Đóng Cửa")}
                                </p>
                              </div>
                              <div className="col-md-2">
                                <h3 className="mt-1">Hành động</h3>
                                {this.props.shop[0] &&
                                  (this.props.shop[0].status === "on" ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        this.changeShopStatus("off")
                                      }
                                      className="btn btn-link"
                                    >
                                      Đóng Cửa
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        this.changeShopStatus("on")
                                      }
                                      className="btn btn-link"
                                    >
                                      Mở Cửa
                                    </button>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  " "
                )}
              </div>
            </div>

            <footer className="footer footer-static footer-light">
              <p className="clearfix text-muted text-sm-center px-2">
                <span>
                  Quyền sở hữu của &nbsp;{" "}
                  <a
                    href="https://www.sutygon.com"
                    id="pixinventLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bold-800 primary darken-2"
                  >
                    SUTYGON-BOT{" "}
                  </a>
                  , All rights reserved.{" "}
                </span>
              </p>
            </footer>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  getAllAppointments: PropTypes.func.isRequired,
  getAllProducts: PropTypes.func.isRequired,
  getAllEventts: PropTypes.func.isRequired,
  getAllRentedProducts: PropTypes.func.isRequired,
  changeShopStatus: PropTypes.func.isRequired,
  getShop: PropTypes.func.isRequired,
  auth: PropTypes.object,
  products: PropTypes.array,
  orders: PropTypes.array,
  rentedproducts: PropTypes.array,
  shop: PropTypes.object,
};

const mapStateToProps = (state) => ({
  users: state.user.users,
  auth: state.auth,
  products: state.product.products,
  appointment: state.appointment.appointments,
  shop: state.dashboard.shop,
  rentedproducts: state.rentproduct.rentproducts,
  events: state.events.events,
});
export default connect(mapStateToProps, {
  getAllAppointments,
  getAllProducts,
  getAllRentedProducts,
  changeShopStatus,
  getShop,
  getAllEventts,
})(Dashboard);
