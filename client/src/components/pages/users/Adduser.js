import React, { Component } from 'react'
import Sidebar from '../../layout/Sidebar'
import Header from '../../layout/Header'
import {
  addNewUser,
  updateUser, getUser
} from '../../../actions/user'
import Loader from '../../layout/Loader'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import shortid from "shortid";

class AddUser extends Component {
  state = {
    id: '',
    fullname: '',
    username: '',
    email: '',
    contactnumber: '',
    gender: '',
    avatar: '',
    jobTitle: '',
    saving: false,
    isEdit: false,
    imgUpd: false,
    src: '',
    systemRole: '',
    userID: ''
  }

  async componentDidMount() {
    const userID = Math.floor(Math.random() * 8999999999 + 1000000000);
    const tempPwd = shortid.generate();

    this.setState({
      userID: userID,
      tempPwd: tempPwd
    })
    if (this.props.match.params.id) {
      const id = this.props.match.params.id
      await this.props.getUser(id)
      const { user } = this.props
      if (user) {
        this.setState({
          id: id,
          fullname: user.username,
          username: user.username,
          avatar: user.avatar,
          tempPwd: tempPwd,
          email: user.email,
          contactnumber: user.contactnumber,
          systemRole: user.systemRole,
          gender: user.gender,
          userID: userID,
          isEdit: true,

        })
      }
    }
  }

  _onChange = (e, id = '') => {
    this.setState({
      [e.target.name]: e.target.files[0],
      imgUpd: true,
      src: URL.createObjectURL(e.target.files[0]),
    })
  }

  handleChange = (e, id = '') => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleChangeNumber = (e) => {
    this.setState({ [e.target.name]: parseInt(e.target.value) ? parseInt(e.target.value) : '' })
  }

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ saving: true });

    const formData = new FormData()
    formData.append('avatar', this.state.avatar)
    formData.append('username', this.state.username)
    formData.append('fullname', this.state.username)
    formData.append('contactnumber', this.state.contactnumber)
    formData.append('email', this.state.email)
    formData.append('password', this.state.tempPwd)
    formData.append('systemRole', this.state.systemRole)
    formData.append('gender', this.state.gender)
    formData.append('jobTitle', this.state.jobTitle)
    formData.append('userID', this.state.userID)


    if (this.state.id === '') {
      await this.props.addNewUser(formData)
    } else {
      await this.props.updateUser(formData, this.state.id)
    }
    return;
    // this.setState({ saving: false, saved: true })
  }


  render() {
    const { auth } = this.props
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to='/' />
    }
    if (this.props.saved == true) {
      return <Redirect push to={{
        pathname: "/user/configuresystemuser",
        data: { state: this.state, user: this.props.user },

      }}
      />
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
                        {this.state.id === '' ? 'Add New User' : 'Update User'}
                      </h4>
                    </div>

                    <div className='card-body'>
                      <form
                        className="form form-horizontal form-bordered"
                        encType='multipart/form-data'
                        action='/upload'
                        method='POST'
                        onSubmit={(e) => this.onSubmit(e)}

                      >
                        <div className='row'>
                          <div className='form-group col-md-6 mb-2'>
                            <label className="col-md-3 label-control" htmlFor="inputGroupFile01">Profile Image</label>
                            <div className="custom-file col-md-9">
                              <input
                                name='avatar'
                                type='file'
                                className="custom-file-input border-primary" id="inputGroupFile01"
                                aria-describedby="inputGroupFileAddon01"
                                accept='image/jpeg,image/gif,image/jpg,image/png,image/x-eps'
                                onChange={(e) => this._onChange(e)}
                              />
                              <label className="custom-file-label" htmlFor="inputGroupFile01">Select Profile Image
                       </label>
                            </div>
                          </div>
                          <div className='form-group col-md-6 mb-2 text-center'>
                            {this.state.isEdit === true &&
                              this.state.imgUpd === false ? (
                                <img
                                  className='media-object round-media'
                                  src={this.state.avatar}
                                  alt='User'
                                  height={100}
                                />
                              ) : (
                                ''
                              )}
                            {this.state.imgUpd === true ? (
                              <img
                                className='media-object round-media'
                                src={`${this.state.src}`}
                                alt='User'
                                height={100}
                              />
                            ) : (
                              ''
                            )}
                          </div>

                        </div>
                        <div className='row'>
                          <div className="col-md-6">
                            <div className='form-group row'>
                              <label className="col-md-3 label-control" htmlFor='userinput1'>User Name</label>
                              <div className="col-md-9">
                                <input
                                  type='text'
                                  id="userinput1" className="form-control border-primary" placeholder='User Name'
                                  required data-validation-required-message="This field is required"
                                  name='username'

                                  onChange={(e) => this.handleChange(e)}
                                  value={this.state.username}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className='form-group row'>
                              <label className="col-md-3 label-control" htmlFor='userinput1'>Full Name</label>
                              <div className="col-md-9">
                                <input
                                  type='text'
                                  id="userinput1" className="form-control border-primary"
                                  placeholder='Full Name'
                                  name='fullname'
                                  required
                                  onChange={(e) => this.handleChange(e)}
                                  value={this.state.fullname}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='row'>
                          <div className="col-md-6">
                            <div className='form-group row'>
                              <label className="col-md-3 label-control" for="userinput1">E-mail</label>
                              <div className="col-md-9">
                                <input
                                  type='text'
                                  id="userinput2" className="form-control border-primary"
                                  placeholder='E-mail'
                                  name='email'
                                  required
                                  onChange={(e) => this.handleChange(e)}
                                  value={this.state.email}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">

                            <div className='form-group row'>
                              <label className="col-md-3 label-control" for="userinput1">
                                Contact Number
                            </label>
                              <div className="col-md-9">
                                <input
                                  type='text'
                                  id="userinput2" className="form-control border-primary"
                                  required
                                  placeholder='Phone'
                                  name='contactnumber'
                                  onChange={(e) => this.handleChangeNumber(e)}
                                  value={this.state.contactnumber}
                                />
                              </div>
                            </div></div>
                        </div>
                        <div className='row'>
                          <div className="col-md-6">
                            <div className='form-group row'>
                              <label className="col-md-3 label-control" for="userinput1">Job Title</label>
                              <div className="col-md-9">
                                <input
                                  type='text'
                                  id="userinput1" className="form-control border-primary"
                                  placeholder='Job Title'
                                  name='jobTitle'
                                  required
                                  onChange={(e) => this.handleChange(e)}
                                  value={this.state.jobTitle}
                                />
                              </div></div>
                          </div>
                          <div className="col-md-6">
                            <div className='form-group row'>
                              <label className="col-md-3 label-control" for="userinput1">Select Type</label>
                              <div className="col-md-9 ">
                                <select
                                  id='type'
                                  name='systemRole'
                                  required
                                  defaultValue='----'
                                  className='form-control border-primary'
                                  onChange={(e) => this.handleChange(e)}
                                >

                                  <option
                                    name="systemRole"

                                    // value={'Admin' === this.state.type}
                                    // selected={'SuperAdmin' === this.state.type}
                                    value='Admin'
                                  >
                                    {' '}
                                Admin{' '}
                                  </option>
                                  <option
                                    name="systemRole"

                                    // value={'Employee' === this.state.type}
                                    // selected={'Employee' === this.state.type}
                                    value='Employee'
                                  >
                                    {' '}
                                Employee{' '}
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>

                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className='form-group row'>
                              <label className="col-md-3 label-control" for="userinput1">Gender</label>
                              <div className="col-md-9">
                                <label className='radio-inline'>
                                  <input
                                    type='radio'
                                    name='gender'
                                    onChange={(e) => this.handleChange(e)}
                                    // checked={this.state.gender === 'male'}
                                    value='male'
                                  />{' '}
                              Male
                            </label>
                                <label className='radio-inline'>
                                  <input
                                    type='radio'
                                    name='gender'
                                    value='female'
                                    onChange={(e) => this.handleChange(e)}
                                  // checked={this.state.gender === 'female'}
                                  />{' '}
                              Female
                            </label>
                                <label className='radio-inline'>
                                  <input
                                    type='radio'
                                    name='gender'
                                    value='other'
                                    onChange={(e) => this.handleChange(e)}
                                  // checked={this.state.gender === 'other'}
                                  />{' '}
                              Others
                            </label>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">

                          </div>
                        </div>
                        <div className='form-actions top'>
                          {(this.state.avatar === "" || this.state.contactnumber === "" || this.state.email === "" || this.state.fullname === "" || this.state.gender === "" || this.state.jobTitle === "") ?
                            <button
                              className="mb-2 mr-2 btn btn-raised btn-primary disabled">
                              <i className='ft-chevron-right' /> Next
                          </button> :
                            <>
                              {this.state.systemRole === "Employee" ?
                                <Link
                                  to={{

                                    // pathname: this.state.systemRole ==="Employee" ? "/user/configuresystem" : "/user/configuresystemuser",
                                    pathname: "/user/configuresystem",
                                    data: this.state
                                  }}
                                  className='mb-2 mr-2 btn btn-raised btn-primary'
                                >
                                  <i className='ft-chevron-right' /> Next
                                </Link>
                                :

                                <button

                                  type='submit'
                                  className='mb-2 mr-2 btn btn-raised btn-primary'
                                >
                                  <i className='ft-chevron-right' /> Next
                         </button>
                              }</>

                          }
                        </div>
                      </form>
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
      </React.Fragment>
    )
  }
}

AddUser.propTypes = {
  getUser: PropTypes.func.isRequired,
  auth: PropTypes.object,
  saved: PropTypes.bool,
  updateUser: PropTypes.func.isRequired,
  addNewUser: PropTypes.func.isRequired,

}

const mapStateToProps = (state) => ({
  auth: state.auth,
  saved: state.user.saved,
  user: state.user.profile,
})
export default connect(mapStateToProps, {
  updateUser, addNewUser,

  getUser,
})(AddUser)
