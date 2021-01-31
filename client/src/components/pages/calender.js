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
import shortid from "shortid";
import {
  getAllEventts,
  addEvent,
  getEventbyID,
  updateEvent,
} from "../../actions/events";
import Modal from "react-awesome-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "moment/locale/vi";
const localizer = momentLocalizer(moment); // or globalizeLocalizer

class Calender extends Component {
  state = {
    id: "",
    name: "",
    note: "",
    timeStart: "",
    timeEnd: "",
    date: "",
    location: "",
    images_edit: "",
    saving: false,
    isEdit: false,
    image: "",
    images: [],
    filePdf: "",
    events:[]
  };

  async componentDidMount() {
    await this.props.getAllEventts();
    const { events } = this.props;
    const m_events = [];
    let b_events = events && events.filter((a) => a.birthdate != "" && a.birthdate);
    b_events &&
      b_events.forEach((event) => {
        const new_Date =
          new Date(event.date).getFullYear() +
          "-" +
          ("0" + (Number(new Date(event.birthdate).getMonth()) + 1)).slice(-2) +
          "-" +
          ("0" + (Number(new Date(event.birthdate).getDate()) - 1)).slice(-2) +
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
    let c_events = events &&  events.filter((a) => a.birthdate == null);

    if (events) {
      this.setState({
        events: [...c_events, ...m_events],
      });
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    if (prevState.id != this.state.id) {
      if (this.state.id) {
        await this.props.getEventbyID(this.state.id);
        const { event } = this.props;
        this.setState({
          name: event.name,
          note: event.note,
          date: moment(event.date),
          timeStart: moment(event.timeStart),
          timeEnd: moment(event.timeEnd),
          location: event.location,
          isEdit: true,
          images_edit: event.file,
        });
      }
    }
    if (prevProps.events != this.props.events) {
      if (this.props.events) {
        await this.props.getAllEventts();
        const { events } = this.props;
        const m_events = [];
        let b_events = events.filter((a) => a.birthdate != "" && a.birthdate);
        b_events &&
          b_events.forEach((event) => {
            const new_Date =
              new Date(event.date).getFullYear() +
              "-" +
              ("0" + (Number(new Date(event.date).getMonth()) + 1)).slice(
                -2
              ) +
              "-" +
              ("0" + (Number(new Date(event.date).getDate()) - 1)).slice(
                -2
              ) +
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
        if (events) {
          this.setState({
            events: [...c_events, ...m_events],
          });
        }
      }
    }
  }
  closeModal = (e) => {
    e.preventDefault();
    this.setState({
      show: false,
      id: "",
      name: "",
      note: "",
      timeStart: "",
      timeEnd: "",
      date: moment(new Date()),
      location: "",
      isEdit: false,
    });
  };
  openModal = (slot) => {
    if (slot.id) {
      this.setState({
        show: true,
        id: slot.id,
        timeStart: slot.start,
        timeEnd: slot.end,
        date: slot.date,
      });
    } else if (!slot.id) {
      this.setState({
        show: true,
        id: "",
        name: "",
        note: "",
        timeStart: moment(new Date(slot.slots[0])),
        timeEnd: moment(new Date(slot.slots[0])).add(15, "minutes"),
        date: moment(new Date(slot.slots[0])),
        location: "",
        isEdit: false,
      });
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  _onChange = async (e, id = "") => {
    this.setState({
      [e.target.name]: e.target.files[0],
    });
    const { images } = this.state;
    images.push({ img: e.target.files[0], id: shortid.generate() });
    this.setState(images);
  };
  handleChangeForDate = (date, name, e) => {
    if (name === "date") {
      this.setState({
        date: date,
      });
    } else if (name === "timeStart") {
      this.setState({
        timeStart: date,
      });
    } else if (name === "timeEnd") {
      this.setState({
        timeEnd: date,
      });
    }
  };

  onSubmit = async (e) => {
    e.preventDefault();
    await this.setState({ saving: true });

    const state = { ...this.state };
    const formData = new FormData();
    formData.append("name", this.state.name);
    formData.append("note", this.state.note);
    formData.append("location", this.state.location);
    formData.append("date", this.state.date);
    formData.append("timeStart", this.state.timeStart);
    formData.append("timeEnd", this.state.timeEnd);
    formData.append("birthday", "");
    formData.append("user", "");
    if (this.state.images.length > 0) {
      let m_image = [];
      state.images.forEach((img, color_i) => {
        m_image.push(img.img);
      });

      m_image.forEach((imag) => {
        formData.append("file", imag);
      });
    }
    if (this.state.filePdf) {
      formData.append("filePdf", this.state.filePdf);
    }
    if (state.id == "" || state.id == undefined) {
      await this.props.addEvent(formData);
    } else {
      await this.props.updateEvent(formData, state.id);
    }
    this.setState({ saving: false, show: false });
  };

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

    const { events } = this.state;
    let newEvents;
    if (events) {
      newEvents = events.map((event) => ({
        title: event.name,
        start: new Date(event.date),
        end: new Date(event.date),
        id: event._id,
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
                            eventPropGetter={(event) => ({
                              style: {
                                backgroundColor:
                                  event.start.getDay() < 1
                                    ? "#53997D"
                                    : event.start.getDay() < 2
                                    ? "#F73B45"
                                    : event.start.getDay() < 3
                                    ? "#FFDA43"
                                    : event.start.getDay() < 4
                                    ? "#E25FFA"
                                    : event.start.getDay() < 5
                                    ? "#979953"
                                    : event.start.getDay() < 6
                                    ? "#FF9550"
                                    : "#FF9989",
                              },
                            })}
                            selectable
                            popup
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
                            onSelectEvent={(slotInfo) =>
                              this.openModal(slotInfo)
                            }
                            onSelectSlot={(slotInfo) =>
                              this.openModal(slotInfo)
                            }
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
          <Modal
            visible={this.state.show}
            width="800"
            height={"700"}
            style={{ overflowY: "scroll" }}
            effect="fadeInUp"
            onClickAway={(e) => this.closeModal(e)}
          >
            <div>
              <div className="modal-header">
                <h4 className="mt-2">
                  <strong>Event Details</strong>
                </h4>
                <button
                  type="button"
                  onClick={(e) => this.closeModal(e)}
                  className="btn btn-sm"
                >
                  X
                </button>
              </div>

              <div className="modal-body">
                <form
                  // className="form form-horizontal form-bordered"
                  // encType="multipart/form-data"
                  // action="/upload"
                  method="POST"
                  onSubmit={(e) => this.onSubmit(e)}
                >
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Event Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control border-primary"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      placeholder="Enter Name"
                      value={this.state.name}
                      required
                      onChange={(e) => this.handleChange(e)}
                    />
                  </div>

                  <div className="form-group">
                    <div className="row">
                      <div class="col-xl-4 col-lg-6 col-md-6">
                        <fieldset class="form-group">
                          <label for="basicInput">Date</label>
                          <DatePicker
                            dateFormat="dd/MM/yyyy"
                            locale="vi"
                            selected={
                              this.state.date ? Date.parse(this.state.date) : ""
                            }
                            required
                            className="form-control border-primary"
                            onChange={(e) =>
                              this.handleChangeForDate(e, "date")
                            }
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                          />
                        </fieldset>
                      </div>
                      <div class="col-xl-4 col-lg-6 col-md-3">
                        <fieldset class="form-group">
                          <label for="helpInputTop">Start</label>
                          <DatePicker
                            locale="vi"
                            selected={
                              this.state.timeStart
                                ? Date.parse(this.state.timeStart)
                                : ""
                            }
                            required
                            className="form-control border-primary"
                            onChange={(e) =>
                              this.handleChangeForDate(e, "timeStart")
                            }
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />{" "}
                        </fieldset>
                      </div>
                      <div class="col-xl-4 col-lg-6 col-md-3">
                        <fieldset class="form-group">
                          <label for="disabledInput">End</label>
                          <DatePicker
                            locale="vi"
                            selected={
                              this.state.timeEnd
                                ? Date.parse(this.state.timeEnd)
                                : ""
                            }
                            required
                            className="form-control border-primary"
                            onChange={(e) =>
                              this.handleChangeForDate(e, "timeEnd")
                            }
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />{" "}
                        </fieldset>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={this.state.location}
                      className="form-control border-primary"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      placeholder="Enter location"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Note</label>
                    <textarea
                      type="text"
                      name="note"
                      value={this.state.note}
                      className="form-control border-primary"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      placeholder="Enter note"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Upload Images</label>
                    <input
                      name="image"
                      type="file"
                      className="border-primary col-md-6"
                      id="inputGroupFile01"
                      aria-describedby="inputGroupFileAddon01"
                      required
                      onChange={(e) => this._onChange(e)}
                    />
                    {this.state.saving ? (
                      <button
                        type="button"
                        className="mb-2 mr-2 btn btn-raised btn-primary"
                      >
                        <div
                          className="spinner-grow spinner-grow-sm "
                          role="status"
                        ></div>{" "}
                        {this.state.isEdit ? `  Updating ` : `  Saving `}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        onClick={(e) => this.onSubmit(e)}
                        className="mb-2 mr-2 btn btn-raised btn-primary"
                      >
                        <i className="ft-check" />
                        {this.state.isEdit
                          ? `  Update Event `
                          : `  Save Event `}
                      </button>
                    )}
                  </div>
                  {/* <div className="custom-file col-md-9">
                  <label htmlFor="exampleInputEmail1">Upload PDF</label>
                    <input
                      name="filePdf"
                      type="file"
                      className="border-primary"
                      id="inputGroupFile01"
                      aria-describedby="inputGroupFileAddon01"
                      required
                      onChange={(e) => this._onChange(e)}
                    />
                  </div> */}
                  <div className="form-group ">
                    {this.state.images_edit &&
                      this.state.images_edit.map((image) => {
                        return (
                          <div>
                            {" "}
                            {this.state.isEdit ? (
                              <div className="hovereffect_event m-2">
                                <img
                                  className="img-responsive"
                                  src={image.img}
                                  width="80"
                                  height="80"
                                  alt=""
                                />
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        );
                      })}
                  </div>
                  {this.state.images.length > 0 ? (
                    <div className="form-group">
                      {this.state.images &&
                        this.state.images.map((image) => {
                          return (
                            <div className="hovereffect_event m-2">
                              <img
                                className="img-responsive"
                                src={URL.createObjectURL(image.img)}
                                width="80"
                                height="80"
                                alt=""
                              />
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    ""
                  )}
                </form>
              </div>
            </div>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

Calender.propTypes = {
  saved: PropTypes.bool,
  auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  saved: state.events.saved,
  events: state.events.events,
  event: state.events.event,
});
export default connect(mapStateToProps, {
  getAllEventts,
  getEventbyID,
  updateEvent,
  addEvent,
})(Calender);
