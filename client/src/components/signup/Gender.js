import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import { updatePassword, getUser } from '../../actions/user';
import axios from 'axios';
import Alert from '../layout/Alert';
// import { getShop } from "../../actions/dashboard";
import { OCAlertsProvider } from '@opuscapita/react-alerts';
import { OCAlert } from '@opuscapita/react-alerts';
class Gender extends Component {
  onSubmit = async (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  render() {
    const { values, handleChange } = this.props;
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
                              {/* <div className="col-lg-6 d-lg-block d-none py-2 text-center align-middle mt-5 mb-n5 img-block">
                                <img
                                  alt=""
                                  className="img-fluid imglogin"
                                  width="400"
                                  height="230"
                                ></img>
                              </div> */}
                              <div className='col-lg-12 col-md-12 bg-white px-4 py-3'>
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
                                  Thông Tin Cá Nhân
                                </h4>
                                <p
                                  className='card-text mb-3 text-center align-middle'
                                  style={{ width: '400px' }}
                                >
                                  Chúng tôi cần thêm thông tin để mở cửa hàng
                                  cho bạn!
                                </p>

                                <form onSubmit={(e) => this.onSubmit(e)}>
                                  <Alert />
                                  <div className='form-group'>
                                    <label htmlFor='gender'>
                                      Bạn nhận định bản thân thuộc giới tính
                                      nào?
                                    </label>
                                    <select
                                      className='form-control mb-3'
                                      onChange={handleChange('gender')}
                                    >
                                      <option value={'none'}>
                                        Không muốn trả lời
                                      </option>
                                      <option value={'male'}>Nam</option>
                                      <option value={'female'}>Nữ</option>
                                    </select>
                                    {/* <input
                                      type="text"
                                      className="form-control mb-3"
                                      placeholder="What gender do you identify as?"
                                      required
                                      value={values.gender}
                                      autoComplete="off"
                                      onChange={handleChange("gender")}
                                      name="gender"
                                    /> */}
                                  </div>
                                  <div className='fg-actions justify-content-between'>
                                    <div className='recover-pass'>
                                      <input
                                        className='btn btn-primary btn-lg btn-block'
                                        type='submit'
                                        value='Tiếp'
                                      />
                                    </div>
                                  </div>
                                </form>
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

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(Gender);
