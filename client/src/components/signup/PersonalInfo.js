import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import FirstName from "./FirstName";
import LastName from "./LastName";
import DOB from "./DOB";
import Gender from "./Gender";
import OtherInfo from ".//OtherInfo";
import axios from "axios";
import Alert from "../layout/Alert";
// import { getShop } from "../../actions/dashboard";
import { OCAlertsProvider } from "@opuscapita/react-alerts";
import { OCAlert } from "@opuscapita/react-alerts";
import { connect } from "react-redux";
import Swal from "sweetalert2";
export class Index extends Component {
  state = {
    step: 1,
    id: "",
    firstname: "",
    lastname: "",
    phone: "",
    dob: "",
    gender: "",
    company: "",
    companyaddress: "",
    // extra
    errors: "",
    loader: false,
    isLoading: false,
    message: "",
  };

  async componentDidMount() {
    const { state } = this.props.location;
    if (state) {
      this.setState({
        id: state.userExist._id,
      });
    }
  }

  // Proceed to next step
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1,
    });
  };

  // Go back to prev step
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1,
    });
  };

  // Handle fields change
  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };

  onSubmitData = async (e) => {
    e.preventDefault();
    try {
      this.setState({ isLoading: true });
      const {
        id,
        firstname,
        lastname,
        phone,
        dob,
        gender,
        company,
        companyaddress,
        message,
      } = this.state;
      const data = {
        id,
        firstname,
        lastname,
        phone,
        dob,
        gender,
        company,
        companyaddress,
        message,
      };
      const res =await axios.post("/api/auth/signup_update", data);
      if (res.data) {
        this.setState({
          id: "",
        });
        await Swal.fire("Registration", res.data.msg, "success");
         this.props.history.replace("/login");
      }
    } catch (e) {}
  };

  render() {
    if (this.props.location.state === undefined) {
      return <Redirect to="/signup" />;
    }
    const { step } = this.state;
    const {
      firstname,
      lastname,
      phone,
      dob,
      gender,
      company,
      companyaddress,
      isLoading,
      message,
    } = this.state;
    const values = {
      firstname,
      lastname,
      phone,
      dob,
      gender,
      company,
      companyaddress,
      isLoading,
      message,
    };
    switch (step) {
      case 1:
        return (
          <FirstName
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 2:
        return (
          <LastName
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 3:
        return (
          <DOB
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 4:
        return (
          <Gender
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 5:
        return (
          <OtherInfo
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            onSubmitData={this.onSubmitData}
            values={values}
          />
        );
      default:
        console.log("");
    }
  }
}

export default connect(null)(Index);
