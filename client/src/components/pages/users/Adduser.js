import React, { Component } from 'react'
import Sidebar from '../../layout/Sidebar'
import Header from '../../layout/Header'
import { updateUser, getUser } from '../../../actions/user'
import Loader from '../../layout/Loader'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class AddUser extends Component {
  state = {
    id: '',
    fullname: '',
    username: '',
    email: '',
    contactnumber: '',
    type: 'Admin',
    gender: '',
    avatar: '',
    jobTitle: '',
    saving: false,
    isEdit: false,
    imgUpd: false,
    src: '',
  }

  async componentDidMount() {
    // check form is to Add or Edit
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
          email: user.email,
          contactnumber: user.contactnumber,
          type: user.type,
          gender: user.gender,
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

  handleChangeNumber = (e) =>{
    this.setState({ [e.target.name]: parseInt(e.target.value) ? parseInt(e.target.value) : ''})
  }
  render() {
    const { auth } = this.props
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to='/' />
    }
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
                        {this.state.id === '' ? 'Add New User' : 'Update User'}
                      </h4>
                    </div>

                    <div className='card-body'>
                      <form
                        encType='multipart/form-data'
                        action='/upload'
                        method='POST'
                      >
                        <div className='row'>
                          <div className='form-group col-12 mb-2'>
                            <label>Select Profile Image</label>
                            <input
                              name='avatar'
                              type='file'
                              className='form-control-file'
                              id='projectinput8'
                              accept='image/jpeg,image/gif,image/jpg,image/png,image/x-eps'
                              onChange={(e) => this._onChange(e)}
                            />
                            <br />
                            {this.state.isEdit === true &&
                              this.state.imgUpd === false ? (
                                <img
                                  className='media-object round-media'
                                  src={`${this.state.avatar}`}
                                  alt='Product image'
                                  height={100}
                                />
                              ) : (
                                ''
                              )}
                            {this.state.imgUpd === true ? (
                              <img
                                className='media-object round-media'
                                src={`${this.state.src}`}
                                alt='Product image'
                                height={100}
                              />
                            ) : (
                                ''
                              )}
                          </div>

                          <div className='form-group col-12 mb-2'></div>
                        </div>
                        <div className='row'>
                          <div className='form-group col-md-6 mb-2'>
                            <label htmlFor='projectinput1'>User Name</label>
                            <input
                              type='text'
                              id='projectinput1'
                              className='form-control'
                              placeholder='User Name'
                              required data-validation-required-message="This field is required"
                              name='username'

                              onChange={(e) => this.handleChange(e)}
                              value={this.state.username}
                            />
                          </div>
                          <div className='form-group col-md-6 mb-2'>
                            <label htmlFor='projectinput2'>Full Name</label>
                            <input
                              type='text'
                              id='projectinput2'
                              className='form-control'
                              placeholder='Full Name'
                              name='fullname'
                              required
                              onChange={(e) => this.handleChange(e)}
                              value={this.state.fullname}
                            />
                          </div>
                        </div>

                        <div className='row'>
                          <div className='form-group col-md-6 mb-2'>
                            <label htmlFor='projectinput3'>E-mail</label>
                            <input
                              type='text'
                              id='projectinput3'
                              className='form-control'
                              placeholder='E-mail'
                              name='email'
                              required
                              onChange={(e) => this.handleChange(e)}
                              value={this.state.email}
                            />
                          </div>
                          <div className='form-group col-md-6 mb-2'>
                            <label htmlFor='projectinput4'>
                              Contact Number
                            </label>
                            <input
                              type='text'
                              id='projectinput4'
                              className='form-control'
                              required
                              placeholder='Phone'
                              name='contactnumber'
                              onChange={(e) => this.handleChangeNumber(e)}
                              value={this.state.contactnumber}
                            />
                          </div>
                        </div>
                        <div className='row'>
                          <div className='form-group col-md-6 mb-2'>
                            <label htmlFor='projectinput3'>Job Title</label>
                            <input
                              type='text'
                              id='projectinput3'
                              className='form-control'
                              placeholder='Job Title'
                              name='jobTitle'
                              required
                              onChange={(e) => this.handleChange(e)}
                              value={this.state.jobTitle}
                            />
                          </div>
                          <div className='form-group col-md-6 mb-2'>
                            <label htmlFor='projectinput6'>Select Type</label>
                            <select
                              id='type'
                              name='type'
                              required
                              defaultValue='----'
                              className='form-control'
                              onChange={(e) => this.handleChange(e)}
                            >

                              <option
                                value={'SuperAdmin' === this.state.type}
                              // selected={'SuperAdmin' === this.state.type}
                              // value='SuperAdmin'
                              >
                                {' '}
                                Admin{' '}
                              </option>
                              <option
                                value={'Employee' === this.state.type}
                              // selected={'Employee' === this.state.type}
                              // value='Employee'
                              >
                                {' '}
                                Employee{' '}
                              </option>
                            </select>
                          </div>
                          <div className='form-group col-md-6 mb-2'>
                            <label htmlFor='projectinput6'>Gender</label>
                            <br></br>
                            <label className='radio-inline'>
                              <input
                                type='radio'
                                name='gender'
                                onChange={(e) => this.handleChange(e)}
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
                                onChange={(e) => this.handleChange(e)}
                                checked={this.state.gender === 'female'}
                              />{' '}
                              Female
                            </label>
                            <label className='radio-inline'>
                              <input
                                type='radio'
                                name='gender'
                                value='other'
                                onChange={(e) => this.handleChange(e)}
                                checked={this.state.gender === 'other'}
                              />{' '}
                              Others
                            </label>
                          </div>
                        </div>

                        <div className='form-actions top'>
                          {(this.state.avatar == "" ||this.state.contactnumber == ""||this.state.email == ""||this.state.fullname == "" ||this.state.gender== "" ||this.state.jobTitle== "") ? 
                          <button
 className="mb-2 mr-2 btn btn-raised btn-primary disabled">
 <i className='ft-chevron-right' /> Next
                          </button> :
                          <Link
                            to={{
                              pathname: "/user/configuresystem",
                              data: this.state
                            }}
                            type='submit'
                            className='mb-2 mr-2 btn btn-raised btn-primary'
                          >
                            <i className='ft-chevron-right' /> Next
                                </Link>
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
  updateUser: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.user.profile,
})
export default connect(mapStateToProps, {
  updateUser,
  getUser,
})(AddUser)
