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
import shortid from "shortid";

class ConfigureSystemUser extends Component {
    state = {
        id: '',
        fullname: '',
        username: '',
        jobTitle: '',
        type: 'Admin',
        userID: ""

    }

    async componentDidMount() {
        // check form is to Add or Edit

        const { data } = this.props.location
        const userID = Math.floor(Math.random() * 8999999999 + 1000000000);
        const tempPwd = shortid.generate();
        // if(data) {
        this.setState({
            // fullname: data.fullname,
            // username: data.username,
            // jobTitle: data.jobTitle,
            userID: userID,
            tempPwd: tempPwd
        })
        // }


    }

    onDone= (e) =>{
        e.preventDefault();
        // return <Redirect to='/user/adduser' />
    }

    handleChange = (e, id = '') => {
        this.setState({ [e.target.name]: e.target.value })
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
                                                {`${'Successfully added'} ${this.state.fullname} ${','} ${this.state.jobTitle}`}
                                            </h4>
                                        </div>

                                        <div className='card-body'>
                                            <Alert />
                                            <form
                                                action='/upload'
                                                method='POST'
                                            >

                                                <div className="row ml-2 mb-2">
                                                    <label>User Name :</label>
                                                    <label>{this.state.username}</label>
                                                </div>
                                                <div className="row ml-2 mb-2">
                                                    <label>ID# :</label>
                                                    <label>{this.state.userID}</label>
                                                </div>
                                                <div className="row ml-2">

                                                    <p>Here is a temporary password. Please give it to {`${this.state.fullname}`} and they must change their password when they log in for the first time.</p>
                                                </div>


                                                <div className="row ml-2" >
                                                    <div className="col-md-4"></div>
                                                    <div className="col-md-4 d-flex align-items-center justify-content-center" style={{ 'height': '10vh', 'backgroundColor': 'whitesmoke' }}>
                                                        <h4 className="text-center"> {this.state.tempPwd}</h4>
                                                    </div>
                                                    <div className="col-md-4"></div>

                                                </div>

                                                <div className='form-actions top'>
                                                    <button
                                                        onClick={e => this.onDone(e)}
                                                        type='submit'
                                                        className='mb-2 mr-2 btn btn-raised btn-primary'
                                                    >
                                                        <i className='ft-chevron-down' /> Done
                                                    </button>
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

ConfigureSystemUser.propTypes = {
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
})(ConfigureSystemUser)
