import React, { Component } from 'react'
import Sidebar from '../../layout/Sidebar'
import Header from '../../layout/Header'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  getAllUsers,
  deleteUser,
  blockUser,
  findUsers,
} from '../../../actions/user'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import Alert from '../../layout/Alert'
import Loader from '../../layout/Loader'

class ViewUser extends Component {
  state = {
<<<<<<< HEAD
    search: '',
=======
    // search: '',
    activeUsers: false,
    inactiveUsers: false,
    users: "",
    activeuser: "",
    allusers: true
>>>>>>> 4eb51da3b03744e5ff9da88895744413945231c6
  }

  async componentDidMount() {
    await this.props.getAllUsers()
<<<<<<< HEAD
  }
=======
>>>>>>> 4eb51da3b03744e5ff9da88895744413945231c6

  }
  getTAble = () => {
    const { auth } = this.props
    const auth_user = auth.user
<<<<<<< HEAD
    const { users } = this.props
    let tbl_sno = 1
    if (users) {
      if (users.length === 0) {
=======
    this.getUser();
    const userArr = this.getUser();
    if (userArr) {
      if (userArr.length === 0) {
>>>>>>> 4eb51da3b03744e5ff9da88895744413945231c6
        return (
          <tr>
            <td colSpan={6} className='text-center'>
              No User Found
            </td>
          </tr>
        )
      }
<<<<<<< HEAD
      return users.map((user) => (
        <tr key={user._id}>
          <td className='text-center text-muted'>{tbl_sno++}</td>
          <td className='text-center'>
            <img
              className='media-object round-media'
              src={`${user.avatar}`}
              alt='Profile'
              height={75}
            />
=======
      return userArr.map((user) => (

        <tr key={user._id}>
          <td className="text-center">
            <img className="media-object round-media" src={`${user.avatar}`} alt="Profile" height={75} />
>>>>>>> 4eb51da3b03744e5ff9da88895744413945231c6
          </td>
          <td className="text-center">{user.userID}</td>

<<<<<<< HEAD
          <td className='text-center'>{user.username}</td>
          <td className='text-center'>{user.contactnumber}</td>
          <td className='text-center'>{user.email}</td>
          <td className='text-center'>{user.gender}</td>
          <td className='text-center'>
            {user.accountStatus === 'active' && (
              <span className='badge badge-success'>Active</span>
            )}
            {user.accountStatus === 'block' && (
              <span className='badge badge-warning'>Block</span>
=======
          <td className="text-center">{user.fullname}</td>
          <td className="text-center">{user.jobTitle}</td>
          <td className="text-center">{user.type}</td>
          <td className="text-center">
            {user.accountStatus === "active" && (
              <span className="badge badge-success">ACTIVE</span>
            )}
            {user.accountStatus === "block" && (
              <span className="badge badge-warning">INACTIVE</span>
>>>>>>> 4eb51da3b03744e5ff9da88895744413945231c6
            )}
          </td>
          <td className='text-center'>
            <Link
              to={{ pathname: `/user/view/${user._id}` }}
              className='info p-0'
            >
              <i
                className='ft-user font-medium-3 mr-2'
                title='View Profile'
              ></i>
            </Link>
            <Link
              to={{ pathname: `/user/edituser/${user._id}` }}
              className='success p-0'
            >
              <i
                className='ft-edit-2 font-medium-3 mr-2 '
                title='Edit User'
              ></i>
            </Link>
            <Link
              to='/user'
              onClick={() => this.onDelete(user._id)}
              className='danger p-0'
            >
              <i className='ft-x font-medium-3 mr-2' title='Delete'></i>
            </Link>
            {auth_user && auth_user.type === 'Admin' ? (
              <Link
                to={{ pathname: `/user` }}
                onClick={() => this.onBlock(user._id)}
                className='info p-0'
              >
                <i
                  className='ft-alert-triangle font-medium-3 mr-2'
                  title='Block User'
                ></i>
              </Link>
            ) : (
              ''
            )}
          </td>
        </tr>
      ))
    }
<<<<<<< HEAD
=======
  };

  getUser = () => {
    const { users } = this.props;
    if (users) {
      const activeUsers = users.filter(a => a.accountStatus === "active");
      const inactiveUsers = users.filter(a => a.accountStatus === "inactive");

      if (this.state.allusers === true) {
        return users;
      }

      else if (this.state.activeUsers === true) {
        return activeUsers;
      }
      else if (this.state.inactiveUsers === true) {
        return inactiveUsers;
      }

    }
  }
  handleChange = () => {
    this.setState({
      allusers: false,
      inactiveUsers: false,
      activeUsers: true,
    })
  }

  handleChange_Inactive = () => {
    this.setState({
      activeUsers: false,
      allusers: false,
      inactiveUsers: true,
    })
  }

  handleChange_alluser = () => {
    this.setState({
      activeUsers: false,
      inactiveUsers: false,
      allusers: true
    })
>>>>>>> 4eb51da3b03744e5ff9da88895744413945231c6
  }

  handleChange = (e, id = '') => {
    this.setState({ search: e.target.value })
  }

  onDelete = (id) => {
    confirmAlert({
      title: 'Delete User',
      message: 'Are you sure you want to delete this record?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.props.deleteUser(id)
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    })
  }

  onBlock = (id) => {
    confirmAlert({
      title: 'Block User',
      message: 'Are you sure you want to block this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.props.blockUser(id)
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    })
  }

<<<<<<< HEAD
  async searchTable() {
    const searchVal = this.state.search
    if (searchVal) {
      await this.props.findUsers(searchVal)
    } else {
      await this.props.getAllUsers()
    }
  }
=======

>>>>>>> 4eb51da3b03744e5ff9da88895744413945231c6

  render() {
    const { auth } = this.props
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to='/' />
    }

    const { users } = this.props

    return (
      <React.Fragment>
        <Loader />
        <div className='wrapper menu-collapsed'>
          <Sidebar location={this.props.location}></Sidebar>
          <Header></Header>
          <div className='main-panel'>
            <div className='main-content'>
              <div className='content-wrapper'>
                <section id='simple-table'>
                  <div className='row'>
                    <div className='col-sm-12'>
                      <div className='card'>
                        <div className='card-header'>
                          <h4 className='card-title'>All Users</h4>
                        </div>
<<<<<<< HEAD
                        <div className='card-content'>
                          <div className='card-body'>
                            <div className='row'>
                              <div className='col-md-4'>
                                <input
                                  type='text'
                                  className='form-control'
                                  name='search'
                                  onChange={(e) => this.handleChange(e)}
                                />
                              </div>
                              <div className='col-md-4'>
                                <a
                                  className='btn btn-success'
                                  href=''
                                  onClick={() => this.searchTable()}
                                >
                                  <i className='fa fa-search'></i> Search{' '}
                                </a>
                              </div>
                              <div className='col-md-4'>
                                <Link
                                  to='/user/adduser'
                                  className='btn btn-primary pull-right'
                                >
                                  {' '}
                                  <i className='fa fa-plus'></i> New User
                                </Link>
=======
                        <div className="card-content">
                          <div className="card-body">
                            <div className="row">
                              <div className='col-md-8'>
                                <label className='radio-inline' style={{ marginLeft: '10px' }} >
                                  <input
                                    type='radio'
                                    name='activeUser'
                                    checked={this.state.allusers}
                                    onChange={(e) => this.handleChange_alluser(true)}
                                    checked={this.state.allusers === true}

                                  />{' '}
                                  All Users
                                </label>
                                <label className='radio-inline' style={{ marginLeft: '10px' }} >
                                  <input
                                    type='radio'
                                    name='activeUser'
                                    checked={this.state.activeUsers}
                                    onChange={(e) => this.handleChange(true)}
                                    checked={this.state.activeUsers === true}
                                  />{' '}
                                  Active Users
                                </label>
                                <label
                                  className='radio-inline'
                                  style={{ marginLeft: '10px' }}
                                >
                                  <input
                                    type='radio'
                                    name='InactiveUser'
                                    checked={this.state.inactiveUsers}
                                    onChange={(e) => this.handleChange_Inactive(true)}
                                    checked={this.state.inactiveUsers === true}
                                  />{' '}
                                  Inactive Users
                                </label>
                              </div>

                              <div className='col-md-4'>

                                <Link to="/user/adduser" className="btn btn-primary pull-right"> <i className="fa fa-plus"></i> New User</Link>
>>>>>>> 4eb51da3b03744e5ff9da88895744413945231c6
                              </div>
                            </div>
                            <Alert />
                            <table className='table'>
                              <thead>
                                <tr>
<<<<<<< HEAD
                                  <th className='text-center'>#</th>
                                  <th className='text-center'>Avatar</th>

                                  <th className='text-center'>Full Name</th>
                                  <th className='text-center'>Contact</th>
                                  <th className='text-center'>E-mail</th>
                                  <th className='text-center'>Gender</th>
                                  <th className='text-center'>
                                    Account Status
                                  </th>
                                  <th className='text-center'>Actions</th>
=======
                                  <th className="text-center">Avatar</th>
                                  <th className="text-center">ID#</th>
                                  <th className="text-center">Full Name</th>
                                  <th className="text-center" >Job Title</th>
                                  <th className="text-center">System Role</th>
                                  <th className="text-center">Status</th>
                                  <th className="text-center">View/Edit</th>
>>>>>>> 4eb51da3b03744e5ff9da88895744413945231c6
                                </tr>
                              </thead>
                              <tbody>{this.getTAble()}</tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
<<<<<<< HEAD
          <footer className='footer footer-static footer-light'>
            <p className='clearfix text-muted text-sm-center px-2'>
              <span>
                Quyền sở hữu của &nbsp;{' '}
                <a
                  href='https://www.sutygon.com'
                  rel='noopener noreferrer'
                  id='pixinventLink'
                  target='_blank'
                  className='text-bold-800 primary darken-2'
                >
                  SUTYGON-BOT{' '}
                </a>
                , All rights reserved.{' '}
              </span>
            </p>
=======
          <footer className="footer footer-static footer-light">
            <p className="clearfix text-muted text-sm-center px-2"><span>Quyền sở hữu của &nbsp;{" "}
              <a href="https://www.sutygon.com" rel="noopener noreferrer" id="pixinventLink" target="_blank" className="text-bold-800 primary darken-2">SUTYGON-BOT </a>, All rights reserved. </span></p>
>>>>>>> 4eb51da3b03744e5ff9da88895744413945231c6
          </footer>
        </div>
      </React.Fragment>
    )
  }
}

ViewUser.propTypes = {
  getAllUsers: PropTypes.func.isRequired,
  auth: PropTypes.object,
  deleteUser: PropTypes.func.isRequired,
  blockUser: PropTypes.func.isRequired,
  findUsers: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  users: state.user.users,
  auth: state.auth,
})
export default connect(mapStateToProps, {
  getAllUsers,
  deleteUser,
  blockUser,
  findUsers,
})(ViewUser)
