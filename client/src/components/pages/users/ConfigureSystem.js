import React, { Component } from 'react'
import Sidebar from '../../layout/Sidebar'
import Header from '../../layout/Header'
import { addNewUser, updateUser, getUser } from '../../../actions/user'
import Alert from '../../layout/Alert'
import Loader from '../../layout/Loader'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class ConfigureSystem extends Component {
    state = {
        id: '',
        fullname: '',
        username: '',
        jobTitle: '',
        Inventory:'',
        Rentproduct:'',
        Barcode:'',
        Orders:'',
        Customer:'',
        Appointment:'',
        Returnproduct:'',
        Calender:'', 
        Report:'',
        sections:[],
        type: 'Admin',

    }

    async componentDidMount() {
        // check form is to Add or Edit

        const { data } = this.props.location
        console.log(data)
        if (data) {
            this.setState({
                fullname: data.fullname,
                username: data.username,
                jobTitle: data.jobTitle
            })
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
        this.setState({ [e.target.name]: true })
    }

    onSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('avatar', this.state.avatar)
        formData.append('username', this.state.username)
        formData.append('fullname', this.state.username)
        formData.append('contactnumber', this.state.contactnumber)
        formData.append('email', this.state.email)
        formData.append('password', this.state.password)
        formData.append('type', this.state.type)
        formData.append('gender', this.state.gender)

        if (this.state.id === '') {
            await this.props.addNewUser(formData)
        } else {
            await this.props.updateUser(formData, this.state.id)
        }
        this.setState({ saving: false })
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
                                                {`${'Configure system for'} ${this.state.fullname} ${','} ${this.state.jobTitle}`}
                                            </h4>
                                        </div>

                                        <div className='card-body'>
                                            <Alert />
                                            <form
                                                action='/upload'
                                                method='POST'
                                            >
                                                <div className="row ml-3">

                                                    <div className='form-group col-md-3 mb-2'>
                                                        <br></br>
                                                        <label className='radio-inline'>
                                                            <input
                                                                type='checkbox'
                                                                name='inventory'
                                                                onChange={(e) => this.handleChange(e)}
                                                                checked={this.state.Inventory === true}
                                                                value={true}
                                                            />{' '}
                              Inventory
                            </label>

                                                    </div>

                                                    <div className='form-group col-md-3 mb-2'>
                                                        <br></br>
                                                        <label className='radio-inline'>
                                                            <input
                                                                type='checkbox'
                                                                name='returnproduct'
                                                                onChange={(e) => this.handleChange(e)}
                                                                checked={this.state.Returnproduct === true}
                                                                value={true}
                                                            />{' '}
                              Return Product
                            </label>

                                                    </div>
                                                    <div className='form-group col-md-5 mb-2'></div>

                                                </div>


                                                <div className="row ml-3">

                                                    <div className='form-group col-md-3 mb-2'>
                                                        <br></br>
                                                        <label className='radio-inline'>
                                                            <input
                                                                type='checkbox'
                                                                name='barcode'
                                                                onChange={(e) => this.handleChange(e)}
                                                                checked={this.state.Barcode === true}
                                                                value={true}
                                                            />{' '}
                      Barcode
                    </label>

                                                    </div>

                                                    <div className='form-group col-md-3 mb-2'>
                                                        <br></br>
                                                        <label className='radio-inline'>
                                                            <input
                                                                type='checkbox'
                                                                name='orders'
                                                                onChange={(e) => this.handleChange(e)}
                                                                checked={this.state.Orders ===true}
                                                                value={true}
                                                            />{' '}
                      Orders
                    </label>

                                                    </div>
                                                    <div className='form-group col-md-5 mb-2'></div>

                                                </div>

                                                <div className="row ml-3">

                                                    <div className='form-group col-md-3 mb-2'>
                                                        <br></br>
                                                        <label className='radio-inline'>
                                                            <input
                                                                type='checkbox'
                                                                name='customer'
                                                                onChange={(e) => this.handleChange(e)}
                                                                checked={this.state.Customer ===true}
                                                                value={true}
                                                            />{' '}
                      Customers
                    </label>

                                                    </div>

                                                    <div className='form-group col-md-3 mb-2'>
                                                        <br></br>
                                                        <label className='radio-inline'>
                                                            <input
                                                                type='checkbox'
                                                                name='appointment'
                                                                onChange={(e) => this.handleChange(e)}
                                                                checked={this.state.Appointment === true}
                                                                value={true}
                                                            />{' '}
                      Appointments
                    </label>

                                                    </div>
                                                    <div className='form-group col-md-5 mb-2'></div>

                                                </div>

                                                <div className="row ml-3">

                                                    <div className='form-group col-md-3 mb-2'>
                                                        <br></br>
                                                        <label className='radio-inline'>
                                                            <input
                                                                type='checkbox'
                                                                name='rentproduct'
                                                                onChange={(e) => this.handleChange(e)}
                                                                checked={this.state.Rentproduct === true}
                                                                value={true}
                                                            />{' '}
                      Rent a product
                    </label>

                                                    </div>

                                                    <div className='form-group col-md-3 mb-2'>
                                                        <br></br>
                                                        <label className='radio-inline'>
                                                            <input
                                                                type='checkbox'
                                                                name='calender'
                                                                onChange={(e) => this.handleChange(e)}
                                                                checked={this.state.Calender === true}
                                                                value={true}
                                                            />{' '}
                      Calender
                    </label>

                                                    </div>
                                                    <div className='form-group col-md-5 mb-2'></div>

                                                </div>
                                                <div className="row ml-3">

                                                    <div className='form-group col-md-3 mb-2'>
                                                        <br></br>
                                                        <label className='radio-inline'>
                                                            <input
                                                                type='checkbox'
                                                                name='gender'
                                                                onChange={(e) => this.handleChange(e)}
                                                                checked={this.state.Report === true}
                                                                value={true}
                                                            />{' '}
                      Report
                    </label>

                                                    </div>

                                                    <div className='form-group col-md-5 mb-2'></div>

                                                </div>

                                                <div className='form-actions top'>
                                                    <Link
                                                        to={{
                                                            pathname: "/user/configuresystemuser",
                                                            data: this.state
                                                        }}
                                                        type='submit'
                                                        className='mb-2 mr-2 btn btn-raised btn-primary'
                                                    >
                                                        <i className='ft-chevron-right' /> Next
                                </Link>
                                                    {/* {this.state.id === '' ? (
                            <>
                              {this.state.saving ? (
                                <button
                                  type='button'
                                  className='mb-2 mr-2 btn btn-raised btn-primary'
                                >
                                  <div
                                    className='spinner-grow spinner-grow-sm '
                                    role='status'
                                  ></div>
                                  &nbsp; Adding
                                </button>
                              ) : (
                                <button
                                  type='submit'
                                  className='mb-2 mr-2 btn btn-raised btn-primary'
                                >
                                  <i className='ft-check' /> Add User
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              {this.state.saving ? (
                                <button
                                  type='button'
                                  className='mb-2 mr-2 btn btn-raised btn-primary'
                                >
                                  <div
                                    className='spinner-grow spinner-grow-sm '
                                    role='status'
                                  ></div>
                                  &nbsp; Updating
                                </button>
                              ) : (
                                <button
                                  type='submit'
                                  className='mb-2 mr-2 btn btn-raised btn-primary'
                                >
                                  <i className='ft-check' /> Update User
                                </button>
                              )}
                            </>
                          )} */}
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

ConfigureSystem.propTypes = {
    saved: PropTypes.bool,
    addNewUser: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    auth: PropTypes.object,
    updateUser: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    saved: state.user.saved,
    auth: state.auth,
    user: state.user.profile,
})
export default connect(mapStateToProps, {
    addNewUser,
    updateUser,
    getUser,
})(ConfigureSystem)
