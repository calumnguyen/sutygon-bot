import React, { Component } from 'react'
import Sidebar from '../../layout/Sidebar'
import Header from '../../layout/Header'
import { updateUser, getUser } from '../../../actions/user'
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
 
import "react-datepicker/dist/react-datepicker.css";

class EditUser extends Component {
  state = {
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
    sections: [],
    id: '',
    firstname: '',
    userID: '',
    jobTitle: '',
    username: '',
    systemRole: '',
    status: false,
    joinDate: '',
    salary: '',
    fullname: '',
    email: '',
    contactnumber: '',
    gender: '',
    birthday: "4-Sept-1990",
    address: '',
    avatar: '',
    statusChecked: '',
    imgUpd:false,
    src:false,
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
          userID: user.userID,
          jobTitle: user.jobTitle,
          username: user.username,
          systemRole: user.systemRole,
          statusChecked: user.accountStatus,
          status: user.accountStatus === "active" ? true : false,
          // joinDate: user.createdOn,
          // salary: user.salary,
          fullname: user.fullname,
          email: user.email,
          contactnumber: user.contactnumber,
          gender: user.gender,
          address: user.address,
          // birthday: user.birthday,
          avatar: user.avatar,

        })
      }
    }
  }

  selected = async () => {
    const sections = [];
    let value;
    const checkeds = document.getElementsByTagName('input');
    for (let i = 0; i < checkeds.length; i++) {
      if (checkeds[i].checked) {
        sections.push(checkeds[i].name);
      }
    }
    value = sections;
    this.setState({
      sections: sections
    })

  }

  onSubmit = async (e) => {
    e.preventDefault();
    await this.selected();
    const sessionsArr = Object.values(this.state.sections);
    this.setState({ saving: true });

    const formData = new FormData()
    formData.append('avatar', this.state.avatar)
    formData.append('jobTitle', this.state.jobTitle)
    formData.append('systemRole', this.state.systemRole)
    formData.append('accountStatus', this.state.statusChecked)
    formData.append('username', this.state.username)
    formData.append('salary', this.state.salary)
    formData.append('fullname', this.state.fullname)
    formData.append('email', this.state.email)
    formData.append('contactnumber', this.state.contactnumber)
    formData.append('birthday', this.state.birthday)
    formData.append('gender', this.state.gender)
    formData.append('address', this.state.address)
    formData.append('sections', sessionsArr)

    await this.props.updateUser(formData, this.state.id)
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
    console.log(formattedDate);
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
                                {this.state.imgUpd === false&& this.state.src === false ?
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
                            <h4 className="form-section"><i className="ft-info"></i> System Information <button className="btn btn-default mb-1 p-0" onClick={(e) => this._onEdit(e)} style={{ 'marginLeft': '70%' }}><i className="ft-edit"></i></button></h4>

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
                                        value={this.state.status}
                                        onChange={e => this._handleChange(e)}

                                      />
                                      :
                                      <input type="text"
                                        id="userinput4"
                                        className="form-control border-primary"
                                        placeholder="Status"
                                        name="status"
                                        value={this.state.status}
                                        readOnly
                                      />

                                    }
                                  </div>
                                </div>
                                <div className="form-group row last">
                                  <div className="col-md-8">
                                    <Link>Change Password</Link>
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
                                      // <input type="text"
                                      //   id="userinput4"
                                      //   className="form-control border-primary"
                                      //   placeholder="System Role"
                                      //   name="systemRole"
                                      //   value={this.state.systemRole}
                                      // />
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
                            <h4 className="form-section mt-5"><i className="ft-info"></i> Personal Information <button className="btn btn-default mb-1 p-0" onClick={(e) => this._onEditPersonalInfo(e)} style={{ 'marginLeft': '70%' }}><i className="ft-edit"></i></button></h4>
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
                                  <div className="col-md-8">
                                    {this.state.isEditP === true ?
                                    <DatePicker
                                    dateFormat="yyyy/MM/dd"
                                    selected={this.state.birthday}
                                    // onSelect={handleDateSelect} //when day is clicked
                                    onChange={(e) => this.handleChangeForDate(e)}//only when value has changed
                                  />
                                      // <div className="input-group date" id="datetimepicker1" data-target-input="nearest">
                                      //   <input type='text'
                                      //     name="birthday"
                                      //     data-target="#datetimepicker1" data-toggle="datetimepicker"
                                      //     className="form-control pickadate-selectors"
                                      //     placeholder="Month &amp; Year Dropdown"
                                      //     onChange={(e) => this.handleChangeForDate(e)}
                                      //     value={moment(this.state.birthday).format("DD-MMM-YYYY")}

                                      //   />
                                      //   <div className="input-group-append">
                                      //     <span className="input-group-text">
                                      //       <span className="fa fa-calendar-o"></span>
                                      //     </span>
                                      //   </div>
                                      // </div>
                                      // <DatePicker
                                      //   id="issueinput3"
                                      //   selected={this.state.birthday}
                                      //   className="form-control border-primary"
                                      //   dateFormat="dd-MM-yyyy"
                                      //   onChange={(e) => this.handleChangeForDate(e)}
                                      //   popperPlacement="top-start"
                                      //   showMonthDropdown
                                      //   showYearDropdown
                                      // />
                                      :
                                      <div className="input-group">

                                      <input
                                        className="form-control border-primary"

                                        value={moment(this.state.birthday).format("DD-MMM-YYYY")}
                                        readOnly
                                      ></input>
                                         <div className="input-group-append">
                                          <span className="input-group-text">
                                            <span className="fa fa-calendar-o"></span>
                                          </span>
                                        </div>
                                      </div>

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
                              <h4 className="form-section mt-5"><i className="ft-info"></i> System Configuration <button className="btn btn-default mb-1 p-0" onClick={(e) => this._onEditPersonalInfo(e)} style={{ 'marginLeft': '70%' }}><i className="ft-edit"></i></button></h4>

                              <h4 className=''>
                                {`${'Configure system for'} ${this.state.fullname}`}
                              </h4>
                              <div className="row ml-3">

                                <div className='form-group col-md-6'>
                                  <br></br>
                                  <label className='radio-inline'>
                                    <input
                                      type='checkbox'
                                      name='Inventory'
                                      onChange={(e) => this.handleChange(e, 'Inventory')}
                                      checked={this.state.Inventory === true}
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
                                      onChange={(e) => this.handleChange(e, 'Returnproduct')}
                                      checked={this.state.Returnproduct === true}
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
                                      onChange={(e) => this.handleChange(e, 'Barcode')}
                                      checked={this.state.Barcode === true}
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
                                      onChange={(e) => this.handleChange(e, 'Orders')}
                                      checked={this.state.Orders === true}
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
                                      name='Customers'
                                      onChange={(e) => this.handleChange(e, 'Customers')}
                                      checked={this.state.Customers === true}
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
                                      name='Appointments'
                                      onChange={(e) => this.handleChange(e, 'Appointments')}
                                      checked={this.state.Appointments === true}
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
                                      name='Rentproduct'
                                      onChange={(e) => this.handleChange(e, 'Rentproduct')}
                                      checked={this.state.Rentproduct === true}
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
                                      name='Calender'
                                      onChange={(e) => this.handleChange(e, 'Calender')}
                                      checked={this.state.Calender === true}
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
                                      name='Report'
                                      onChange={(e) => this.handleChange(e, 'Report')}
                                      checked={this.state.Report === true}
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

                          <div className='form-actions top'>
                            {/* {(this.state.isEdit === true || this.state.isEditO === true || this.state.isEditP === true) ?
                              <button
                                className="mb-2 mr-2 btn btn-raised btn-primary">
                                <i className='ft-chevron-right' /> Update
                            </button> : */}
                            <button
                              type='submit'
                              className='mb-2 mr-2 btn btn-raised btn-primary'
                            >
                              <i className='ft-chevron-right' /> Update
                                </button>
                            {/* } */}
                          </div>

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
        </div>
      </React.Fragment >
    )
  }
}

EditUser.propTypes = {
  user: PropTypes.object,
  auth: PropTypes.object,
  saved: PropTypes.bool,
  getUser: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  saved: state.user.saved,
  user: state.user.profile
})

export default connect(mapStateToProps, {
  updateUser,
  getUser
})(EditUser)