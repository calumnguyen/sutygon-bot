import React, { Component } from 'react'
import Sidebar from '../../layout/Sidebar'
import Header from '../../layout/Header'
import { updateUser, getUser } from '../../../actions/user'
import Loader from '../../layout/Loader'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as moment from 'moment'
import DatePicker from "react-datepicker";
import { Redirect } from 'react-router-dom'
import "react-datepicker/dist/react-datepicker.css";
import Moment from 'react-moment'
import dateFormat from 'dateformat';
import { Link } from 'react-router-dom'
import Switch from "react-switch";

class SalaryUpdate extends Component {
    state = {
        id: '',
        userID:'',
        systemRole: '',
        salary: '',
        isEdit: false,
    }

    async componentDidMount() {
        if (this.props.match.params.id) {
            const id = this.props.match.params.id
            await this.props.getUser(id)
            const { user } = this.props
            if (user) {
                this.setState({
                    id: user._id,
                    userID: user.userID,
                    systemRole: user.systemRole,
                    
                })
            }
        }
    }
    _onEdit = (e) => {
        e.preventDefault();
        this.setState({
            isEdit: true
        })
    }


    onSubmit = async (e) => {
        e.preventDefault();
        this.setState({ saving: true });

        const formData = new FormData()
        formData.append('salary', this.state.salary)

        // await this.props.updateUser(formData, this.state.id)
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


                                        <div className='card-body'>
                                            <div className="px-3">
                                                <form className="form form-horizontal form-bordered"
                                                    encType='multipart/form-data'
                                                    action='/upload'
                                                    method='POST'
                                                    onSubmit={(e) => this.onSubmit(e)}
                                                >

                                                    <div className="form-body">
                                                        <h4 className="form-section"><i className="ft-info"></i> Update Salary </h4>
                                                        <div className="row">
                                                            <div className="col-md-12">

                                                                <div className="form-group row">

                                                                    <label className="col-md-3 label-control" htmlFor="userinput1">Base Rate</label>
                                                                    <div className="col-md-9">
                                                                        <div className="position-relative has-icon-right">
                                                                            {this.state.isEdit === true ?



                                                                                <input type="text" id="userinput1" className="form-control border-primary" placeholder="Name"
                                                                                    name="firstname"
                                                                                    value={this.state.salary} />
                                                                                : <input type="text" id="userinput1" className="form-control border-primary" placeholder="Name"
                                                                                    name="firstname"
                                                                                    value={this.state.salary} readOnly />
                                                                            }
                                                                            <div className="form-control-position">
                                                                                <button className="btn btn-default m-1 p-0" onClick={(e) => this._onEdit(e)} ><i className="ft-edit"></i></button>
                                                                            </div>
                                                                        </div>
                                                                    </div>


                                                                </div>

                                                                <div class="form-group row mb-2">
                                                                    <label className="col-md-3 label-control" htmlFor="projectinput6">Period</label>
                                                                    <div className="col-md-9">

                                                                        <select id="projectinput6" name="interested" class="form-control" onChange={(e) => this.handleChange(e)}
                                                                        >
                                                                            <option value="none" selected="" disabled="">---Select---</option>
                                                                            <option value="Weekly">Weekly</option>
                                                                            <option value="Bi-Weekly">Bi-Weekly</option>
                                                                            <option value="Monthly">Monthly</option>

                                                                        </select>

                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-md-3 label-control" htmlFor="userinput4">Effective Date</label>
                                                                    <div className="col-md-9">
                                                                        <input type="text"
                                                                            id="userinput4"
                                                                            className="form-control border-primary"
                                                                            placeholder="Effective Date"
                                                                            name="e_date"
                                                                            value={""}
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>


                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='form-actions top'>

                                                        <button
                                                            type='button'
                                                            data-toggle="modal"
                                                            data-target="#default"
                                                            className='mb-2 mr-2 btn btn-raised btn-primary disabled'
                                                        >
                                                            <i className='ft-chevron-right' /> Update
                                                        </button>

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
                    <div class="modal fade text-center" id="default" tabindex="-1" role="dialog" aria-labelledby="myModalLabel1"
                        aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header  text-center">
                                    <h4 class="modal-title" id="myModalLabel1">Authorization</h4>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <h5>Please enter the authorization code to make this change</h5>
                                    <input
                                        className="form-control border-primary"

                                    />
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn grey btn-lg btn-outline-success">Authorize</button>
                                    <button type="button" class="btn btn-outline-danger btn-lg" data-dismiss="modal">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}

SalaryUpdate.propTypes = {
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
})(SalaryUpdate)