import { Calendar, momentLocalizer } from "react-big-calendar";
import React, { Component } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import Alert from "../layout/Alert";
import moment from "moment";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getAllAppointments } from "../../actions/appointment";
const localizer = momentLocalizer(moment); // or globalizeLocalizer

class AppointmentCalendar extends Component {
  state = {
    id: "",
    start: "",
    end: "",
    title: "",
  };

  async componentDidMount() {
    await this.props.getAllAppointments();
  }

  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/" />;
    }
    const { user } = auth;
    if (user && user.systemRole === "Employee") {
      if (user && !user.sections.includes("Calender")) {
        return <Redirect to="/Error" />;
      }
    }
    const { calendar } = this.props;
    let newEvents;
    if (calendar) {
      newEvents = calendar.map((event) => ({
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
    }

    return (
      <React.Fragment>
        <div className="wrapper menu-collapsed">
          <Sidebar location={this.props.location}></Sidebar>
          <Header></Header>

          <div className="main-panel">
            <div className="main-content">
              <div className="content-wrapper">
                <section id="form-action-layouts">
                  <div className="form-body">
                    <div className="card">
                      <div className="card-header">
                        <h4 className="form-section">
                          <i className="icon-social-dropbox"></i>Calendar
                        </h4>
                      </div>
                      <Alert />

                      <div className="card-body">
                        {newEvents ? (
                          <Calendar
                            localizer={localizer}
                            events={newEvents}
                            defaultDate={new Date()}
                            views={{
                              month: true,
                              week: true,
                              day: true,
                            }}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 500 }}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </section>
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
        </div>
      </React.Fragment>
    );
  }
}

AppointmentCalendar.propTypes = {
  saved: PropTypes.bool,
  auth: PropTypes.object,
  getAllAppointments: PropTypes.func.isRequired,
  calendar: PropTypes.array,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  calendar: state.appointment.appointments,
});
export default connect(mapStateToProps, {
  getAllAppointments,
})(AppointmentCalendar);
