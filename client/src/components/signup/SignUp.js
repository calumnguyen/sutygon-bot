import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import { updatePassword, getUser } from '../../actions/user';
import axios from 'axios';
import Alert from '../layout/Alert';
import { getShop } from '../../actions/dashboard';
import { OCAlertsProvider } from '@opuscapita/react-alerts';
import { OCAlert } from '@opuscapita/react-alerts';
import Swal from 'sweetalert2';
class SignUp extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    newpassword: '',
    confirmpassword: '',
    id: '',
    tempPass: '',
    userID: '',
    mesg: '',
    verify: false,
    code: '',
    userDetail: '',
    errors: '',
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    try {
      this.setState({ mesg: '', errors: '', isLoading: true, code: '' });
      const { email, password, username } = this.state;
      const res = await axios.post('/api/auth/send_email', {
        email: email,
        password: password,
        username: username,
      });
      this.setState({ mesg: res.data.message, verify: true, isLoading: false });
    } catch (err) {
      if (err.response !== undefined && err.response.data) {
        this.setState({ errors: err.response.data.errors, isLoading: false });
      }
    }
  };
  onSubmitVerify = async (e) => {
    e.preventDefault();
    try {
      this.setState({ isLoading: true, verify: true, mesg: '', errors: '' });
      const { code } = this.state;
      const res = await axios.post('/api/auth/check_verification_code', {
        code: code,
      });
      this.setState({
        userDetail: res.data.userExist,
        mesg: res.data.mesg,
        isLoading: false,
        errors: '',
      });
      await Swal.fire('Registration', res.data.mesg, 'success');
      this.props.history.push('/personal-info', {
        userExist: res.data.userExist,
      });
    } catch (err) {
      if (err.response !== undefined && err.response.data) {
        this.setState({ errors: err.response.data.errors, isLoading: false });
      }
    }
  };

  render() {
    if (this.state.userDetail) {
      return <Redirect to='/personal-info' />;
    }
    return (
      <div className='wrapper menu-collapsed'>
        <div className='main-panel'>
          <div className=''>
            <div className=''>
              <section id='login'>
                <div className='container-fluid'>
                  <div className='row full-height-vh m-0'>
                    <div className='col-12 d-flex align-items-center justify-content-center'>
                      <div className='card m-5'>
                        <div className='card-content'>
                          <div className='card-body login-img'>
                            <div className='row m-0'>
                              <div className='col-lg-12 col-md-12 bg-white px-4 pt-3'>
                                <div className='logo-img text-center align-middle'>
                                  <img
                                    alt={'Sutygon-bot'}
                                    src='assets/img/logos/logo.png'
                                    height={100}
                                    width={100}
                                  />
                                </div>
                                <h4
                                  className='mb-2 card-title text-center align-middle'
                                  style={{}}
                                >
                                  {this.state.verify
                                    ? 'Nhập Mã Bảo Mật'
                                    : 'Đăng Ký Tài Khoản Miễn Phí'}
                                </h4>
                                <p
                                  className='card-text mb-3 text-center align-middle'
                                  style={{ width: '400px' }}
                                >
                                  {this.state.verify
                                    ? 'Để đảm bảo tính bảo mật cho bạn, chúng tôi đã email bạn 4 chữ số bảo mật. Hãy điền mã này dưới đây để xác nhận tài khoản bạn.'
                                    : 'Mở hồ sơ với Sutygon-Bot chỉ dưới 5 phút! '}
                                </p>
                                {this.state.mesg && (
                                  <div
                                    className='alert alert-success'
                                    role='alert'
                                  >
                                    {this.state.mesg}
                                  </div>
                                )}
                                {this.state.errors && (
                                  <div
                                    className='alert alert-danger'
                                    role='alert'
                                  >
                                    {this.state.errors}
                                  </div>
                                )}

                                {this.state.verify ? (
                                  <form
                                    onSubmit={(e) => this.onSubmitVerify(e)}
                                  >
                                    <Alert />

                                    <input
                                      type='text'
                                      className='form-control mb-3'
                                      placeholder='Điền mã 4 chữ số'
                                      required
                                      value={this.state.code}
                                      maxLength={4}
                                      minLength={4}
                                      autoComplete='off'
                                      onChange={(e) => this.onChange(e)}
                                      name='code'
                                    />
                                    <div className='fg-actions justify-content-between'>
                                      <div className='recover-pass'>
                                        <button
                                          disabled={this.state.isLoading}
                                          type='submit'
                                          className='btn btn-primary btn-lg btn-block'
                                        >
                                          {this.state.isLoading && (
                                            <i className='fa fa-refresh fa-spin mr-1'></i>
                                          )}
                                          Xác Nhận
                                        </button>
                                      </div>
                                    </div>
                                    <Link className='nav-link' to={'/Login'}>
                                      Đã có tài khoản? Đăng nhập
                                    </Link>
                                  </form>
                                ) : (
                                  <form onSubmit={(e) => this.onSubmit(e)}>
                                    <Alert />
                                    <input
                                      type='text'
                                      className='form-control mb-3'
                                      placeholder='Tên đăng nhập'
                                      required
                                      onChange={(e) => this.onChange(e)}
                                      name='username'
                                    />
                                    <input
                                      type='email'
                                      className='form-control mb-3'
                                      placeholder='Email của bạn'
                                      required
                                      onChange={(e) => this.onChange(e)}
                                      name='email'
                                    />
                                    <input
                                      type='password'
                                      className='form-control mb-3'
                                      placeholder='Mật khẩu bảo mật'
                                      required
                                      onChange={(e) => this.onChange(e)}
                                      name='password'
                                    />

                                    <div className='fg-actions justify-content-between'>
                                      <div className='recover-pass'>
                                        <button
                                          disabled={this.state.isLoading}
                                          type='submit'
                                          className='btn btn-primary btn-lg btn-block'
                                        >
                                          {this.state.isLoading && (
                                            <i className='fa fa-refresh fa-spin mr-1'></i>
                                          )}
                                          Đăng Ký
                                        </button>
                                      </div>
                                    </div>
                                    <Link className='nav-link' to={'/Login'}>
                                      Đã có tài khoản? Đăng nhập
                                    </Link>
                                  </form>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SignUp.propTypes = {
  auth: PropTypes.object,
  passwordUpdated: PropTypes.bool,
  userID: PropTypes.object,
  user: PropTypes.object,
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  getShop: PropTypes.func.isRequired,
  updatePassword: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  AuthLoading: state.auth.loading,
  userID: state.auth.error,
  auth: state.auth,
  shop: state.dashboard.shop,
  passwordUpdated: state.user.passwordUpdated,
  user: state.user.user,
});

export default connect(mapStateToProps, {
  login,
  updatePassword,
  getUser,
  getShop,
})(SignUp);
