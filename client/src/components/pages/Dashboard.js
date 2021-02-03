import React, { Component } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import Loader from "../layout/Loader";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAllAppointments } from "../../actions/appointment";
import { getAllRentedProducts } from "../../actions/rentproduct";
import { getAllProducts } from "../../actions/product";
import { getUser } from "../../actions/user";
import { getAllEvents, getAllBirthdayEvents } from "../../actions/events";
import { changeShopStatus, getShop } from "../../actions/dashboard";
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
    await this.props.getAllEvents();
    await this.props.getAllBirthdayEvents();
    await this.getPendingEvents();
  }

  async changeShopStatus(status) {
    await this.props.changeShopStatus(status);
    await this.props.getShop();
  }

  calculate_age = (dob1) => {
    var today = new Date();
    var birthDate = new Date(dob1);
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age_now--;
      
    }
    {
      this.setState({ age: age_now });
    }
    return age_now;
  };

  getPendingEvents() {
    var dateAfterSevenDays = moment(moment().add(7, "days")).format();
    const new_Dateafter7days =
      new Date(dateAfterSevenDays).getFullYear() +
      "-" +
      ("0" + (Number(new Date(dateAfterSevenDays).getMonth()) + 1)).slice(-2) +
      "-" +
      ("0" + (Number(new Date(dateAfterSevenDays).getDate()) - 1)).slice(-2) +
      "T22:20:52.000Z";
    console.log(new_Dateafter7days);
    var currentdate = moment(moment().subtract(1, "days")).format();
    const { events } = this.props;
    const { b_events } = this.props;
    const m_bevents = [];

    b_events &&
      b_events.forEach((event) => {
        const new_Date =
          new Date(event.date).getFullYear() +
          "-" +
          ("0" + (Number(new Date(event.birthdate).getMonth()) + 1)).slice(-2) +
          "-" +
          ("0" + (Number(new Date(event.birthdate).getDate()) - 1)).slice(-2) +
          "T22:20:52.000Z";
        const age = this.calculate_age(event.birthdate);
        m_bevents.push({
          date: new_Date,
          timeStart: event.timeStart,
          timeEnd: event.timeEnd,
          name: event.name && `${event.name}'s ${age} Birthday Aniversary`,
          note: event.note,
          location: event.location,
          _id: "",
          type: "birthdayEvent",
        });
      });
    let updatedEvents = [...m_bevents, ...events];


    var currenWeekEvents = updatedEvents.filter((a) => {
      var m_date =
        new Date(a.date).getFullYear() +
        "-" +
        ("0" + (Number(new Date(a.date).getMonth()) + 1)).slice(-2) +
        "-" +
        ("0" + Number(new Date(a.date).getDate())).slice(-2) +
        "T22:20:52.000Z";

      return (
        moment(m_date).format() >= currentdate && a.date <= dateAfterSevenDays
      );
    });
    this.setState({
      currenWeekEvents:currenWeekEvents
    })
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
        let returningOrders = events.filter((f) => f.readyForPickUp == true);
        return returningOrders.length;
      } else {
        return 0;
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
                  <h4 className="ml-2 mb-2 text-bold-400">
                    Hello {user && user.fullname && `${user.fullname}`}, hope
                    you have a great day!
                  </h4>
                </div>
                <div className="row">
                  <div className="col-md-7">
                    <div className="container px-6 mx-auto grid">
                      <div className="grid gap-6 mb-8 md:grid-cols-4 xl:grid-cols-4">
                        {/* card1 */}
                        <div className="flex items-center bg-white shadow-xs card-dashboard">
                          <div className="text-orange-500 gradient-blueberry rounded-full card-dashboard-span">
                            <div className="text">
                              {this.orderPickUpToday()}
                            </div>
                          </div>
                          <div className="text-card">
                            <span>Pickup Today</span>
                          </div>
                        </div>
                        {/* card2 */}
                        <div className="flex items-center bg-white shadow-xs card-dashboard">
                          <div className="text-orange-500 gradient-red-pink rounded-full card-dashboard-span">
                            <div className="text">{this.getReturnOrder()}</div>
                          </div>
                          <div className="text-card">
                            <span>Return Today</span>
                          </div>
                        </div>
                        {/* card3 */}
                        <div className="flex items-center bg-white shadow-xs card-dashboard">
                          <div className="gradient-light-blue-indigo rounded-full card-dashboard-span-op">
                            <div className="text">
                              {this.getTodaysAppointment()}
                            </div>
                          </div>
                          <div className="text-card-app">
                            <span> Appointments</span> <br />{" "}
                            <span className="text-card-1"> Today</span>
                          </div>
                        </div>
                        {/* card4 */}
                        <div className="flex items-center bg-white shadow-xs card-dashboard text-center">
                          <div className="text-orange-500 gradient-crystal-clear rounded-full card-dashboard-span">
                            <div className="text">0</div>
                          </div>
                          <div className="text-card-order">
                            <span> Orders with</span> <br />{" "}
                            <span> Request</span>
                          </div>
                        </div>{" "}
                        {/* card5 */}
                        <div className="flex items-center bg-white shadow-xs card-dashboard">
                          <div className="text-orange-500 gradient-orange rounded-full card-dashboard-span">
                            <div className="text">
                              {" "}
                              {this.getOverDueOrder()}
                            </div>
                          </div>
                          <div className="text-card-overdue">
                            <span> Overdue Orders</span>
                          </div>
                        </div>{" "}
                        {/* card6 */}
                        <div className="flex items-center bg-white shadow-xs card-dashboard">
                          <div className="text-orange-500 gradient-love-couple rounded-full card-dashboard-span">
                            {" "}
                            <div className="text">
                              {this.getTodaysOrder()}
                            </div>{" "}
                          </div>
                          <div className="text-card-noorder">
                            <span> New Orders Today</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      user && user.systemRole == "Admin" ? "col-md-5" : ""
                    }
                  >
                    {user && user.systemRole === "Admin" ? (
                      <>
                        <div className="card card-alert gradient-light-blue-indigo">
                          <div className=" card-alert-row w-100">
                            {this.state.currenWeekEvents &&
                              this.state.currenWeekEvents.length > 0 &&
                              this.state.currenWeekEvents.map((a, a_i) => {
                                return (
                                  <div
                                    className="alert alert-secondary alert-dismissible m-1"
                                    // role="alert"
                                  >
                                    <button
                                      type="button"
                                      className="close"
                                      data-dismiss="alert"
                                      aria-label="Close"
                                    >
                                      <span aria-hidden="true">&times;</span>
                                    </button>
                                    <p className="my-n1">
                                        {a.age?
                                        <>
                                        <strong>{a.name}'s</strong>
                                         {a.age} 'Birthday Anniversary. Happy Birthday',{a.name}`!
                                  </>       :
                                         <strong>{a.name}'s</strong>
                                        }
                                      </p>
                                      <p className="my-n1">
                                        <small class="text-muted">
                                          Date :
                                          {moment(a.date).format("MM/DD/YYYY")}{" "}
                                        </small>
                                      </p>
                                      <p className="my-n1">
                                        <small class="text-muted">
                                          From :
                                          {moment(a.timeStart).format(
                                            "hh:mm A"
                                          )}:{" "}
                                          To :{" "}
                                          {moment(a.timeEnd).format("hh:mm A")}
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
                      </>
                    ) : (
                      " "
                    )}
                  </div>
                </div>

                {user && user.systemRole === "Admin" ? (
                  <>
                    {" "}
                    <div className="row mt-5">
                      <div className="container-fluid px-6 mx-auto grid">
                        <div className="grid gap-6 mb-8 md:grid-cols-4 xl:grid-cols-ab">
                          {/* card1 */}
                          <div className="flex items-center bg-white shadow-xs card-store">
                            <div className="gradient-light-blue-indigo rounded-full card-dashboard-store">
                              {this.props.shop[0] &&
                                (this.props.shop[0].status === "on" ? (
                                  <i className="fa fa-unlock-alt"></i>
                                ) : (
                                  <i className="fa fa-lock"></i>
                                ))}{" "}
                            </div>

                            <div className="store-text">
                              {" "}
                              <span className="span-2">
                                {" "}
                                Store{" "}
                                {this.props.shop[0] &&
                                  (this.props.shop[0].status === "on"
                                    ? "open"
                                    : "close")}{" "}
                                at{" "}
                              </span>
                              <span className="span-1">
                                {" "}
                                {this.props.shop[0] &&
                                  startTime
                                    .tz("Asia/Vientiane")
                                    .format("hh:mm a")}{" "}
                              </span>{" "}
                              <span className="span-2">on</span>
                              <span className="span-1">
                                {" "}
                                {this.props.shop[0] &&
                                  startTime
                                    .tz("Asia/Vientiane")
                                    .format("DD-MMM-YY")}
                              </span>
                            </div>
                            <div className="gradient-blueberry btn-store">
                              {this.props.shop[0] &&
                                (this.props.shop[0].status === "on" ? (
                                  <button
                                    type="button"
                                    onClick={() => this.changeShopStatus("off")}
                                    className="btn text-white m-1"
                                  >
                                    Close the door
                                    <i className="fa fa-lock ml-2 fa-1x"></i>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => this.changeShopStatus("on")}
                                    className="btn text-white m-1"
                                  >
                                    Open door{" "}
                                    <i className="fa fa-unlock-alt ml-2 fa-1x"></i>
                                  </button>
                                ))}
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
  getAllEvents: PropTypes.func.isRequired,
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
  user: state.user.user,
  auth: state.auth,
  products: state.product.products,
  appointment: state.appointment.appointments,
  shop: state.dashboard.shop,
  rentedproducts: state.rentproduct.rentproducts,
  events: state.events.events,
  b_events: state.events.birthdayevents,
});
export default connect(mapStateToProps, {
  getAllAppointments,
  getAllProducts,
  getAllRentedProducts,
  changeShopStatus,
  getShop,
  getAllEvents,
  getUser,
  getAllBirthdayEvents,
})(Dashboard);
