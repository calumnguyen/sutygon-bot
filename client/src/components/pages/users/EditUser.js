import React, { Component } from 'react'
import Sidebar from '../../layout/Sidebar'
import Header from '../../layout/Header'
import { updateUser, getUser, codeVerify ,updatePassword} from '../../../actions/user'
import Loader from '../../layout/Loader'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as moment from 'moment'
// import DatePicker from "react-datepicker";
import { Redirect } from 'react-router-dom'
// import "react-datepicker/dist/react-datepicker.css";
import Moment from 'react-moment'
import dateFormat from 'dateformat';
import { Link } from 'react-router-dom'
import Switch from "react-switch";
import DatePicker from "react-datepicker";
import $ from 'jquery';
import { OCAlertsProvider } from '@opuscapita/react-alerts';
import { OCAlert } from '@opuscapita/react-alerts';
import "react-datepicker/dist/react-datepicker.css";
import Alert from '../../layout/Alert'
import Modal from 'react-awesome-modal';
// import { compareSync } from 'bcryptjs'


class EditUser extends Component {
  state = {
    visible: false,
    isEdit: false,
    isEditO: false,
    isEditP: false,
    saving: false,
    imgUpd: false,
    Inventory: false,
    Rentproduct: false,
    Barcode: false,
    Orders: false,
    Customers: false,
    Appointments: false,
    Returnproduct: false,
    Calender: false,
    Report: false,
    sections: '',
    id: '',
    firstname: '',
    userID: '',
    jobTitle: '',
    username: '',
    systemRole: '',
    status: false,
    joinDate: '',
    base_rate: '',
    period: '',
    fullname: '',
    email: '',
    contactnumber: '',
    gender: '',
    birthday: "",
    address: '',
    avatar: '',
    statusChecked: '',
    show:false,
    code: '',
    imgUpd: false,
    src: false,
    setIsOpen: false,
    password:"",
    newpassword:"",
    confirmpassword:""

  }

  async componentDidMount() {
    if (this.props.match.params.id) {
      const id = this.props.match.params.id
      await this.props.getUser(id)
      const { user } = this.props
      if (user) {
        this.setState({
          id: user._id,
          avatar: user.avatar,
          firstname: user.fullname,
          fullname: user.fullname,
          userID: user.userID,
          jobTitle: user.jobTitle,
          username: user.username,
          systemRole: user.systemRole,
          statusChecked: user.accountStatus,
          status: user.accountStatus === "active" ? true : false,
          // joinDate: user.createdOn,
          base_rate: user.salary && user.salary.base_rate ? user.salary.base_rate : "",
          period: user.salary && user.salary.period ? user.salary.period : '',
          email: user.email,
          contactnumber: user.contactnumber,
          gender: user.gender,
          address: user.address,
          birthday: user.birthday,
          avatar: user.avatar,
          sections: user.sections
        })
      }
    }
  }

  updatePassword = async (e)=>{
    e.preventDefault();
    e.preventDefault();
    const state = { ...this.state }
    const user = {
      username: state.username,
      currentpassword: (state.password).trim(),
      newpassword: (state.newpassword).trim(),
      confirmpassword: (state.confirmpassword).trim()
    }
    if (state.id !== "") {
       await this.props.updatePassword(user, state.id) }
  }
  openModalforPassword = (e) =>{
e.preventDefault();
this.setState({
  show:true
})
  }
  handleCheck = (type) => {
    var response = false;
    const { sections } = this.state
    if (sections) {
      var s = sections.indexOf(type);
      if (sections[s] === type) {
        response = true;
      }
    }
    return response
  }

  openModal = (e) => {
    e.preventDefault();
    this.setState({
      visible: true
    });
  }
  closeModal = (e) => {
    e.preventDefault();
    this.setState({
      visible: false,
      show:false
    });
  }
  authorize = async (e) => {
    e.preventDefault();
    const { code } = this.state
    await this.props.codeVerify(code)

    if (this.props.codeverified === true) {
      OCAlert.alertSuccess("Successfully Authorized")

      this.setState({
        // code: "",
        visible: false
      })
    }
    
    if (this.props.codeverified === false) {
      this.setState({
        code: "",
        visible: true
      })
      OCAlert.alertError("Wrong Authorization Code")

    }
    
  }
  setShow = (e) => {
    e.preventDefault();
    this.setState({ show: true });
  }

  selected = async () => {
    const sections = [];
    const checkeds = document.getElementsByClassName('input');
    for (let i = 0; i < checkeds.length; i++) {
      if (checkeds[i].checked) {
        sections.push(checkeds[i].name);
      }
    }
    this.setState({
      sections: sections
    })

  }
  handleSalary = (e) => {
    this.setState({ [e.target.name]: parseInt(e.target.value) ? parseInt(e.target.value) : '' })
  }
  onSubmit = async (e) => {
    e.preventDefault();
    const state = { ...this.state }
    await this.selected();
    const sessionsArr = Object.values(this.state.sections);
    this.setState({ saving: true });
    const salary = [];
    salary.push({
      'period': this.state.period,
      'base_rate': this.state.base_rate
    })

    const formData = new FormData()
    if (state.avatar !== "") {
      formData.append('avatar', state.avatar)
    }
    else {
      OCAlert.alertError("Please Upload Profile Image", { timeOut: 3000 })
      this.setState({ saving: false });
      return;
    }
    formData.append('jobTitle', state.jobTitle)
    formData.append('systemRole', state.systemRole)
    formData.append('accountStatus', state.statusChecked)
    formData.append('username', state.username)
    formData.append('salary', JSON.stringify(salary))
    formData.append('fullname', state.fullname)
    formData.append('email', state.email)
    formData.append('contactnumber', state.contactnumber)
    formData.append('birthday', state.birthday)
    formData.append('gender', state.gender)
    formData.append('address', state.address)
    formData.append('sections', sessionsArr)
    formData.append('code', state.code)
    formData.append('userID', state.userID)
    await this.props.updateUser(formData, state.id)
    this.setState({ saving: false });

  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
  }


  _onChange = (e, id = '') => {
    this.setState({
      [e.target.name]: e.target.files[0],
      imgUpd: true,
      src: URL.createObjectURL(e.target.files[0]),
    })
  }

  togglehandleChange = (status) => {
    if (status === true) {
      this.setState({ statusChecked: "active", status: true });
    }

    else if (status === false) {
      this.setState({ statusChecked: "inactive", status: false });
    }
  }

  _handleChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleChange = (e, name) => {

    this.setState({ [e.target.name]: !this.state[name] })
  }
  _onEditSystemConfig = (e) => {
    e.preventDefault();
    this.setState({
      isEditS: true
    })
  }

  _onEdit = (e) => {
    e.preventDefault();
    this.setState({
      isEdit: true
    })
  }

  _onEditOrganization = (e) => {
    e.preventDefault();
    this.setState({
      isEditO: true
    })
  }
  handleChangeForDate = (date, e) => {
    let formattedDate = this.formatDate(date);
    this.setState({
      birthday: formattedDate
    });
  }
  _onEditPersonalInfo = (e) => {
    e.preventDefault();
    this.setState({
      isEditP: true
    })
  }
  _onChange = (e, id = '') => {
    this.setState({
      [e.target.name]: e.target.files[0],
      imgUpd: true,
      src: URL.createObjectURL(e.target.files[0]),
    })
  }
  render() {
    const { auth } = this.props
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to='/' />
    }
    const { user } = auth
    if (this.props.saved) {
      return <Redirect to='/user' />
    }


    return (
      <React.Fragment>
        <Loader />
        <div className='wrapper menu-collapsed'>
          <Sidebar location={this.props.location}></Sidebar>
          <Header></Header>

          <div className='main-panel'>
            <div className='main-content'>
              <div className='content-wrapper'>
                <div className='form-body'>
                  <div className='card'>
                    <div className='card-header'>
                      <h4 className='form-section'>
                        <i className='ft-user'></i>
                        {this.state.id === '' ? '' : 'Update User'}
                      </h4>
                    </div>

                    <div className='card-body'>
                      <div className="px-3">
                        <form className="form form-horizontal form-bordered"
                          encType='multipart/form-data'
                          action='/upload'
                          method='POST'
                          onSubmit={(e) => this.onSubmit(e)}
                        >

                          <Alert />
                          <OCAlertsProvider />

                          <div className="form-body">
                            <h4 className="form-section"><i className="ft-info"></i> Profile Picture </h4>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label className="col-md-4 label-control" htmlFor="inputGroupFile01">Profile Picture</label>
                                  <div className="col-md-8">
                                    <div className="custom-file">
                                      <input
                                        name="avatar"
                                        type="file"
                                        className="custom-file-input border-primary"
                                        id="inputGroupFile01"
                                        aria-describedby="inputGroupFileAddon01"
                                        accept='image/jpeg,image/gif,image/jpg,image/png,image/x-eps'
                                        onChange={(e) => this._onChange(e)}
                                      />
                                      <label className="custom-file-label" htmlFor="inputGroupFile01">Choose
                       file</label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6 text-center">
                                {this.state.imgUpd === false && this.state.src === false ?
                                  <img className='media-object round-media'
                                    src={this.state.avatar}
                                    alt='User'
                                    height={80} />
                                  :
                                  <img className='media-object round-media'
                                    src={this.state.src}
                                    alt='User'
                                    height={80} />
                                }
                              </div>
                            </div>
                            <h4 className="form-section mt-4"><i className="ft-info"></i> System Information <button className="btn btn-default mb-1 p-0" onClick={(e) => this._onEdit(e)} style={{ 'marginLeft': '70%' }}><i className="ft-edit"></i></button></h4>

                            <div className="row">


                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label className="col-md-4 label-control" htmlFor="userinput1">Name</label>
                                  <div className="col-md-8">
                                    <input type="text"
                                      id="userinput1"
                                      className="form-control border-primary"
                                      placeholder="Name"
                                      name="firstname"
                                      value={this.state.fullname}
                                      readOnly
                                    />
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label className="col-md-4 label-control" htmlFor="userinput4">User Name</label>
                                  <div className="col-md-8">
                                    {this.state.isEdit === true ?
                                      <input type="text"
                                        id="userinput4"
                                        className="form-control border-primary"
                                        placeholder="User Name"
                                        name="username"
                                        value={this.state.username}
                                        onChange={e => this._handleChange(e)}
                                      />
                                      :
                                      <input type="text"
                                        id="userinput4"
                                        className="form-control border-primary"
                                        placeholder="User Name"
                                        name="username"
                                        value={this.state.username}
                                        readOnly />

                                    }
                                  </div>
                                </div>

                                <div className="form-group row">
                                  <label className="col-md-4 label-control" htmlFor="userinput4">Status</label>
                                  <div className="col-md-8">
                                    {this.state.isEdit === true ?
                                      <input type="text"
                                        id="userinput4"
                                        className="form-control border-primary"
                                        placeholder="Status"
                                        name="status"
                                        value={this.state.status === true ? "Active" : "In-Active"}
                                        // onChange={e => this._handleChange(e)}
readOnly
                                      />
                                      :
                                      <input type="text"
                                        id="userinput4"
                                        className="form-control border-primary"
                                        placeholder="Status"
                                        name="status"
                                        value={this.state.status === true ? "Active" : "In-Active"}
                                        readOnly
                                      />

                                    }
                                  </div>
                                </div>
                                <div className="form-group row last">
                                  <div className="col-md-4"></div>
                                  <div className="col-md-8">
                                    <Link
                                  onClick={(e) => this.openModalforPassword(e)}
                                  type='button'
className="font-medium-3"
                                    ><i className="ft-external-link"></i>  Change Password</Link>
                                  </div>
                                </div>


                              </div>

                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label className="col-md-4 label-control" htmlFor="userinput2">ID Number</label>
                                  <div className="col-md-8">
                                    <input type="text"
                                      id="userinput2"
                                      className="form-control border-primary"
                                      placeholder="ID Number"
                                      name="userID"
                                      value={this.state.userID}
                                      readOnly
                                    />
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label className="col-md-4 label-control" htmlFor="userinput4">Job Title</label>
                                  <div className="col-md-8">
                                    {this.state.isEdit === true ?
                                      <input type="text"
                                        id="userinput4"
                                        className="form-control border-primary"
                                        placeholder="Job Title"
                                        name="jobTitle"
                                        value={this.state.jobTitle}
                                        onChange={e => this._handleChange(e)}

                                      />
                                      :
                                      // <label className="label-control" htmlFor="userinput4">{this.state.jobTitle}</label>

                                      <input type="text"
                                        id="userinput4"
                                        className="form-control border-primary"
                                        placeholder="Job Title"
                                        name="jobTitle"
                                        value={this.state.jobTitle}
                                        readOnly
                                      />
                                    }
                                  </div>
                                </div>

                                <div className="form-group row">
                                  <label className="col-md-4 label-control" htmlFor="userinput4">System Role</label>
                                  <div className="col-md-8">
                                    {this.state.isEdit === true ?
                                      <>
                                        <select
                                          id='type'
                                          name='systemRole'
                                          required
                                          defaultValue='----'
                                          className='form-control border-primary'
                                          onChange={(e) => this._handleChange(e)}
                                        >

                                          <option
                                            name="systemRole"
                                            value='Admin'
                                          >
                                            {' '}
                                Admin{' '}
                                          </option>
                                          <option
                                            name="systemRole"
                                            value='Employee'
                                          >
                                            {' '}
                                Employee{' '}
                                          </option>
                                        </select>
                                      </>

                                      :
                                      <input type="text"
                                        id="userinput4"
                                        className="form-control border-primary"
                                        placeholder="System Role"
                                        name="systemRole"
                                        value={this.state.systemRole}
                                        readOnly
                                      />
                                    }
                                  </div>
                                </div>

                              </div>

                            </div>










                            <h4 className="form-section mt-5"><i className="ft-info"></i> Organization Information </h4>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label className="col-md-4 label-control" htmlFor="userinput5">Join Date</label>
                                  <div className="col-md-8">
                                    <input
                                      className="form-control border-primary"
                                      type="text" placeholder="Join Date" id="userinput5" name="joinDate" readOnly
                                    // value={this.state.joinDate}

                                    />
                                  </div>
                                </div>

                                <div className="form-group row">
                                  <label className="col-md-4 label-control" htmlFor="userinput6">Salary</label>
                                  <div className="col-md-8">
                                    {this.state.isEditO === true ?
                                      <input className="form-control border-primary"
                                        type="salary"
                                        placeholder="Salary"
                                        id="userinput6"
                                      // value={this.state.salary}
                                      // onChange={e => this._handleChange(e)}
                                      />
                                      :
                                      <input className="form-control border-primary"
                                        type="salary"
                                        placeholder="Salary"
                                        id="userinput6"
                                        // value={this.state.salary}
                                        // onChange={e => this._handleChange(e)}
                                        readOnly
                                      />
                                    }


                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label className="col-md-4 label-control">Next pay day</label>
                                  <div className="col-md-8">
                                    <input className="form-control border-primary"
                                      type="number" placeholder="Next pay day" id="userinput7"
                                      readOnly value={""}

                                    />
                                  </div>
                                </div>

                                <div className="form-group row">
                                  <label className="col-md-4 label-control">Last Review</label>
                                  <div className="col-md-8">
                                    <input className="form-control border-primary"
                                      type="number" placeholder="Last Review" id="userinput7" readOnly value={""}
                                    />
                                  </div>
                                </div>

                              </div>
                            </div>
                            <h4 className="form-section mt-5"><i className="ft-info"></i> Personal Information
                            <button className="btn btn-default mb-1 p-0" onClick={(e) => this._onEditPersonalInfo(e)} style={{ 'marginLeft': '70%' }}><i className="ft-edit"></i></button>
                            </h4>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label className="col-md-4 label-control" htmlFor="userinput1">Full Name</label>
                                  <div className="col-md-8">
                                    {this.state.isEditP === true ?
                                      <input type="text" id="userinput1"
                                        className="form-control border-primary"
                                        placeholder="Full Name"
                                        name="fullname"
                                        value={this.state.fullname}
                                        onChange={e => this._handleChange(e)}

                                      />
                                      :
                                      <input type="text" id="userinput1"
                                        className="form-control border-primary"
                                        placeholder="Full Name"
                                        name="fullname"
                                        value={this.state.fullname}
                                        readOnly
                                      />

                                    }
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label className="col-md-4 label-control" htmlFor="userinput2">Email</label>
                                  <div className="col-md-8">
                                    {this.state.isEditP === true ?
                                      <input type="text" id="userinput2"
                                        className="form-control border-primary"
                                        placeholder="Email"
                                        name="email"
                                        value={this.state.email}
                                        onChange={e => this._handleChange(e)}

                                      />
                                      :
                                      <input type="text" id="userinput2"
                                        className="form-control border-primary"
                                        placeholder="Email"
                                        name="email"
                                        value={this.state.email}
                                        readOnly
                                      />
                                    }
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label className="col-md-4 label-control" htmlFor="userinput4">Phone Number</label>
                                  <div className="col-md-8">
                                    {this.state.isEditP === true ?
                                      <input type="text" id="userinput4"
                                        className="form-control border-primary"
                                        placeholder="Phone Number"
                                        name="contactnumber"
                                        value={this.state.contactnumber}
                                        onChange={e => this._handleChange(e)}
                                      />
                                      :
                                      <input type="text" id="userinput4"
                                        className="form-control border-primary"
                                        placeholder="Phone Number"
                                        name="contactnumber"
                                        value={this.state.contactnumber}
                                        readOnly />
                                    }
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label className="col-md-4 label-control" htmlFor="userinput4">Birthday</label>
                                  <div className="col-md-8" data-date-format="dd/mm/yyyy">

                                    {this.state.isEditP === true ?
                                      <DatePicker
                                        dateFormat="dd/MM/yyyy" selected={Date.parse(this.state.birthday)}
                                        className="form-control border-primary"
                                        onChange={(e) => this.handleChangeForDate(e)}//only when value has changed
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                      />
                                      :
                                      <DatePicker
                                        dateFormat="dd/MM/yyyy" selected={Date.parse(this.state.birthday)}
                                        className="form-control border-primary"
                                        readOnly
                                      />
                                    }
                                  </div>
                                </div>

                                <div className="form-group row">
                                  <label className="col-md-4 label-control" htmlFor="userinput4">Gender</label>
                                  <div className="col-md-8">
                                    {this.state.isEditP === true ?
                                      <>
                                        <label className='radio-inline'>
                                          <input
                                            type='radio'
                                            name='gender'
                                            onChange={(e) => this._handleChange(e)}
                                            checked={this.state.gender === 'male'}
                                            value='male'
                                          />{' '}
                              Male
                            </label>
                                        <label className='radio-inline'>
                                          <input
                                            type='radio'
                                            name='gender'
                                            value='female'
                                            onChange={(e) => this._handleChange(e)}
                                            checked={this.state.gender === 'female'}
                                          />{' '}
                              Female
                            </label>
                                        <label className='radio-inline'>
                                          <input
                                            type='radio'
                                            name='gender'
                                            value='other'
                                            onChange={(e) => this._handleChange(e)}
                                            checked={this.state.gender === 'other'}
                                          />{' '}
                              Others
                            </label>
                                      </>

                                      :
                                      <input type="text"
                                        id="userinput4"
                                        className="form-control border-primary"
                                        placeholder="Gender"
                                        name="gender"
                                        value={this.state.gender}
                                        readOnly />
                                    }
                                  </div>
                                </div>
                                <div className="form-group row last">
                                  <label className="col-md-4 label-control" htmlFor="userinput4">Address</label>
                                  <div className="col-md-8">
                                    {this.state.isEditP === true ?
                                      <input type="text"
                                        id="userinput4"
                                        className="form-control border-primary"
                                        placeholder="Address"
                                        name="address"
                                        value={this.state.address}
                                        onChange={e => this._handleChange(e)}
                                      />
                                      :
                                      <input type="text"
                                        id="userinput4"
                                        className="form-control border-primary"
                                        placeholder="Address"
                                        name="address"
                                        value={this.state.address}
                                        readOnly />
                                    }


                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {user && user.systemRole === "Admin" && this.state.systemRole === "Employee" ?
                            <>

                              <h4 className="form-section mt-5"><i className="ft-info"></i> System Configuration
                              <button className="btn btn-default mb-1 p-0" onClick={(e) => this._onEditSystemConfig(e)} style={{ 'marginLeft': '70%' }}><i className="ft-edit"></i></button>

                              </h4>

                              <h4 className=''>
                                {`${'Configure system for'} ${this.state.fullname}`}
                              </h4>
                              <div className="row ml-3">

                                <div className='form-group col-md-6'>
                                  <br></br>
                                  <label className='radio-inline'>
                                    <input
                                      className="input"
                                      type='checkbox'
                                      name='Inventory'
                                      onChange={(e) => this.handleChange(e, 'Inventory')}
                                      checked={this.state.isEditS === true ? this.state.Inventory === true : this.handleCheck('Inventory')}
                                      value={this.state.Inventory}

                                    />{' '}
Inventory
</label>

                                </div>

                                <div className='form-group col-md-6'>
                                  <br></br>
                                  <label className='radio-inline'>
                                    <input
                                      type='checkbox'
                                      name='Returnproduct'
                                      className="input"
                                      onChange={(e) => this.handleChange(e, 'Returnproduct')}
                                      checked={this.state.isEditS === true ? this.state.Returnproduct === true : this.handleCheck('Returnproduct')}
                                      value={this.state.Returnproduct}

                                    />{' '}
Return Product
</label>

                                </div>
                                <div className='form-group col-md-5 mb-2'></div>

                              </div>


                              <div className="row ml-3">

                                <div className='form-group col-md-6'>
                                  <br></br>
                                  <label className='radio-inline'>
                                    <input
                                      type='checkbox'
                                      name='Barcode'
                                      className="input"

                                      onChange={(e) => this.handleChange(e, 'Barcode')}
                                      checked={this.state.isEditS === true ? this.state.Barcode === true : this.handleCheck('Barcode')}
                                      value={this.state.Barcode}
                                    />{' '}
Barcode
</label>

                                </div>

                                <div className='form-group col-md-6'>
                                  <br></br>
                                  <label className='radio-inline'>
                                    <input
                                      type='checkbox'
                                      name='Orders'

                                      className="input"

                                      onChange={(e) => this.handleChange(e, 'Orders')}
                                      checked={this.state.isEditS === true ? this.state.Orders === true : this.handleCheck('Orders')}
                                      value={this.state.Orders}
                                    />{' '}
Orders
</label>

                                </div>
                                <div className='form-group col-md-5 mb-2'></div>

                              </div>

                              <div className="row ml-3">

                                <div className='form-group col-md-6'>
                                  <br></br>
                                  <label className='radio-inline'>
                                    <input
                                      type='checkbox'
                                      className="input"


                                      name='Customers'
                                      onChange={(e) => this.handleChange(e, 'Customers')}
                                      checked={this.state.isEditS === true ? this.state.Customers === true : this.handleCheck('Customers')}
                                      value={this.state.Customers}
                                    />{' '}
Customers
</label>

                                </div>

                                <div className='form-group col-md-6'>
                                  <br></br>
                                  <label className='radio-inline'>
                                    <input
                                      type='checkbox'
                                      className="input"


                                      name='Appointments'
                                      onChange={(e) => this.handleChange(e, 'Appointments')}
                                      checked={this.state.isEditS === true ? this.state.Appointments === true : this.handleCheck('Appointments')}
                                      value={this.state.Appointments}
                                    />{' '}
Appointments
</label>

                                </div>
                                <div className='form-group col-md-5 mb-2'></div>

                              </div>

                              <div className="row ml-3">

                                <div className='form-group col-md-6'>
                                  <br></br>
                                  <label className='radio-inline'>
                                    <input
                                      type='checkbox'
                                      className="input"


                                      name='Rentproduct'
                                      onChange={(e) => this.handleChange(e, 'Rentproduct')}
                                      checked={this.state.isEditS === true ? this.state.Rentproduct === true : this.handleCheck('Rentproduct')}
                                      value={this.state.Rentproduct}
                                    />{' '}
Rent a product
</label>

                                </div>

                                <div className='form-group col-md-6'>
                                  <br></br>
                                  <label className='radio-inline'>
                                    <input
                                      type='checkbox'
                                      className="input"
                                      name='Calender'
                                      onChange={(e) => this.handleChange(e, 'Calender')}
                                      checked={this.state.isEditS === true ? this.state.Calender === true : this.handleCheck('Calender')}

                                      value={this.state.Calender}
                                    />{' '}
Calender
</label>

                                </div>
                                <div className='form-group col-md-5 mb-2'></div>

                              </div>

                              <div className="row ml-3">

                                <div className='form-group col-md-6'>
                                  <br></br>
                                  <label className='radio-inline'>
                                    <input
                                      type='checkbox'

                                      className="input"

                                      name='Report'
                                      onChange={(e) => this.handleChange(e, 'Report')}
                                      checked={this.state.isEditS === true ? this.state.Report === true : this.handleCheck('Report')}
                                      value={this.state.Report}
                                    />{' '}
Report
</label>

                                </div>

                                <div className='form-group col-md-5 mb-2'></div>

                              </div>
                            </> : ""}

                          {user && user.systemRole === "Admin" && this.state.systemRole === "Employee" ?
                            <>
                              <h4 className="form-section mt-5"><i className="ft-info"></i> Status Configuration</h4>
                              <div className="form-group row">
                                <label className="col-md-4 label-control" htmlFor="userinput1">Status</label>
                                <div className="col-md-8">
                                  <Switch
                                    name="status"
                                    className="react-switch float-center"
                                    onChange={(e) => this.togglehandleChange(e, 'status')}
                                    checked={this.state.status}

                                  />
                                  {(this.props.user && this.props.user.accountStatus === "inactive" && this.props.user.inactivated_date) ?
                                    <p className="text-muted">Inactivated on {`${this.props.user.inactivated_date && moment(this.props.user.inactivated_date).format("DD-MMM-YYYY")}`}</p>
                                    : " "}
                                </div>
                              </div>

                            </>


                            : ""}

                          {user && user.systemRole === "Admin" ?
                            <>
                              <h4 className="form-section mt-3"><i className="ft-info"></i> Salary </h4>
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="form-group row">

                                    <label className="col-md-2 label-control" htmlFor="userinput1">Base Rate</label>
                                    <div className="col-md-10">
                                      <div className="position-relative has-icon-right">
                                        {this.state.isEdit === true ?



                                          <input type="text"
                                            id="userinput1" className="form-control border-primary" placeholder="Base Rate"
                                            name="base_rate"
                                            value={this.state.base_rate}
                                            onChange={e => this.handleSalary(e)}
                                          />
                                          : <input type="text" id="userinput1" className="form-control border-primary" placeholder="Base Rate"
                                            name="base_rate"
                                            value={this.state.base_rate}
                                            readOnly />
                                        }
                                        <div className="form-control-position">
                                          <button className="btn btn-default m-1 p-0" onClick={(e) => this._onEdit(e)} ><i className="ft-edit"></i></button>
                                        </div>
                                      </div>
                                    </div>


                                  </div>

                                  <div className="form-group row">
                                    <label className="col-md-2 label-control" htmlFor="projectinput6">Period</label>
                                    <div className="col-md-10">

                                      <select
                                        id="projectinput6"
                                        name="period"
                                        className="form-control"
                                        onChange={(e) => this._handleChange(e)}
                                        defaultValue={this.state.period}
                                      >
                                        <option value="none" defaultValue={this.state.period} >---Select---</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="bi-weekly">Bi-Weekly</option>
                                        <option value="monthly">Monthly</option>

                                      </select>

                                    </div>
                                  </div>
                                  {/* <div className="form-group row">
                                    <label className="col-md-2 label-control" htmlFor="userinput4">Effective Date</label>
                                    <div className="col-md-10">
                                      <input type="text"
                                        id="userinput4"
                                        className="form-control border-primary"
                                        placeholder="Effective Date"
                                        name="e_date"
                                        value={""}
                                        readOnly
                                      />
                                    </div>
                                  </div> */}
                                  <div className='form-actions top'>
                                    <button
                                      type='button'
                                      onClick={(e) => this.openModal(e)}

                                      className='mb-2 mr-2 btn btn-raised btn-primary btn-openModal'
                                    >
                                      <i className='ft-chevron-right' /> Update Salary
</button>
                                  </div>

                                </div>
                              </div>
                            </>


                            : ""}
                          <h4 className="form-section mt-3"> </h4>
{/* {this.state.birthday === undefined ? <div className='form-actions top'>   <button
                                  type='button'
                                  className='mb-2 mr-2 btn btn-raised btn-primary disabled'
                                >
                                  <i className='ft-chevron-right' /> Save changes
                                </button> </div> : */}

                          <div className='form-actions top'>
                            {this.state.saving ? (
                              <button
                                type="button"
                                className="mb-2 mr-2 btn btn-raised btn-primary">
                                <div
                                  className="spinner-grow spinner-grow-sm "
                                  role="status"></div> &nbsp; Saving</button>
                            ) : (
                                <button
                                  type='submit'
                                  className='mb-2 mr-2 btn btn-raised btn-primary'
                                >
                                  <i className='ft-chevron-right' /> Save changes
                                </button>
                              )}
                          </div>
  {/* } */}
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className='footer footer-static footer-light'>
              <p className='clearfix text-muted text-sm-center px-2'>
                <span>
                  Quyền sở hữu của &nbsp;{' '}
                  <a
                    href='https://www.sutygon.com'
                    id='pixinventLink'
                    target='_blank'
                    className='text-bold-800 primary darken-2'
                  >
                    SUTYGON-BOT{' '}
                  </a>
                        , All rights reserved.{' '}
                </span>
              </p>
            </footer>
          </div>
          <Modal visible={this.state.visible} width="400" height="250" effect="fadeInUp" onClickAway={(e) => this.closeModal(e)}>
            <div>
            
              <div className="modal-body">
                <h4 className="text-center">Please enter the authorization code to make this change</h4>
                <input
                  name="code"
                  value={this.state.code}
                  onChange={(e) => this._handleChange(e)}
                  placeholder="Enter Code here"
                  className="form-control border-primary"


                />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={(e) => this.authorize(e)}
                  className="btn grey btn-lg btn-outline-success">Authorize</button>
             <button type="button"  onClick={(e) => this.closeModal(e)}
                  className="btn grey btn-lg btn-outline-danger">Close</button>
              </div>
              <div>
            <OCAlertsProvider containerStyle={{width: '80%',height:'25%'}} />
            </div>
            </div>
          </Modal>
          <Modal visible={this.state.show} width="400" height="350" effect="fadeInUp" onClickAway={(e) => this.closeModal(e)}>
            <div>
            <div className="modal-header">
                              <h3>Update Password</h3>
</div>
              <div className="modal-body">
              <div className="form-group row">
                                <div className="col-md-12">
                                  <input
                                    type="password"
                                    className="form-control border-primary"
                                    placeholder="Enter Current password here"
                                    name="password"
                                    value={this.state.password}
                                    onChange={(e) => this._handleChange(e)}

      /></div>
                              </div>
                              <div className="form-group row">

                                <div className="col-md-12">
                                  <input
                                    type="password"
                                    className="form-control border-primary"
                                    placeholder="Enter New password here"
                                    name="newpassword"
                                    value={this.state.newpassword}
                                    onChange={(e) => this._handleChange(e)}

                                  /></div>
                              </div>
                              <div className="form-group row">
                                <div className="col-md-12">
                                  <input
                                    type="password"

                                    className="form-control border-primary"
                                    placeholder="Re type password"
                                    name="confirmpassword"
                                    value={this.state.confirmpassword}
                                    onChange={(e) => this._handleChange(e)}

                                  /></div>
                              </div>               
              </div>
              <div className="modal-footer">
                <button type="button" onClick={(e) => this.updatePassword(e)}
                  className="btn grey btn-lg btn-outline-success">Update Password</button>
                   <button type="button"  onClick={(e) => this.closeModal(e)}
                  className="btn grey btn-lg btn-outline-danger">Close</button>
              </div>
            </div>
          </Modal>
        </div>
      </React.Fragment >
    )
  }
}

EditUser.propTypes = {
  user: PropTypes.object,
  auth: PropTypes.object,
  saved: PropTypes.bool,
  codeverified: PropTypes.bool,
  getUser: PropTypes.func.isRequired,
  codeVerify: PropTypes.func.isRequired,
  updatePassword:PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  saved: state.user.saved,
  user: state.user.profile,
  codeverified: state.user.codeverified
})

export default connect(mapStateToProps, {
  updateUser, codeVerify,
  getUser,updatePassword
})(EditUser)