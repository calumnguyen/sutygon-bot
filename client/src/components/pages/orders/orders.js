import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../layout/Sidebar'
import Header from '../../layout/Header'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Alert from '../../layout/Alert'
import Loader from '../../layout/Loader'
import {
  getAllRentedProducts,
  deleteRentedProduct,
  getOrderSearchStatus,
} from '../../../actions/rentproduct'
import { getAllProducts } from '../../../actions/product'
import { confirmAlert } from 'react-confirm-alert'
import * as moment from 'moment'
import 'react-confirm-alert/src/react-confirm-alert.css'
import BootstrapTable from 'react-bootstrap-table-next'
import ToolkitProvider from 'react-bootstrap-table2-toolkit'

import Spinner from '../../layout/Spinner.js'

class Orders extends Component {
  state = {
    status: [],
    loading: false,
    search: '',
  }

  async componentDidMount() {
    await this.props.getAllRentedProducts()
  }

  handleStatusToggle = async (name) => {
    let selectedstatus = this.state.status.indexOf(name)

    let resultant = [...this.state.status]

    if (selectedstatus === -1) {
      resultant.push(name)
    } else {
      resultant.splice(selectedstatus, 1)
    }
    this.setState({ status: resultant })
    console.log(resultant)

    if (resultant.length == 0) {
      // if user deselect all the elements then fetch all statuses.
      await this.props.getAllRentedProducts()
    } else {
      // is arra contains atleast 1 item then make this request.
      await this.props.getOrderSearchStatus({ status: resultant })
    }
  }

  orderTable = () => {
    const { rentproducts } = this.props

    if (rentproducts) {
      let ordersDataArr = []
      rentproducts.forEach((order, idx) => {
        ordersDataArr.push({
          orderNumber: order.orderNumber,
          name: order.customer ? order.customer.name : '',
          phone: order.customer ? order.customer.contactnumber : '',
          status:
            order.status == 'lost' ? (
              <span className='badge badge-danger'>{order.status}</span>
            ) : order.status == 'active' ? (
              <span className='badge badge-success'>{order.status}</span>
            ) : order.status == 'ready' ? (
              <span className='badge badge-primary'>{order.status}</span>
            ) : order.status == 'alteration' ? (
              <span className='badge badge-warning'>{order.status}</span>
            ) : (
              <span className='badge badge-info'>{order.status}</span>
            ),

          actions: (
            <>
              <Link
                to={{ pathname: `/orders/vieworder/${order._id}` }}
                className='success p-0'
              >
                <i
                  className='ft-edit-3 font-medium-3 mr-2 '
                  title='View Order'
                ></i>
              </Link>
            </>
          ),
        })
      })

      const columns = [
        {
          dataField: 'orderNumber',
          text: 'Order Id',
          sort: true,
        },
        {
          dataField: 'name',
          text: 'Customer name',
          sort: true,
        },
        {
          dataField: 'phone',
          text: 'Phone number',
          sort: true,
        },
        {
          dataField: 'status',
          text: 'Status',
          sort: true,
        },
        {
          dataField: 'actions',
          text: 'View/Edit',
          sort: true,
        },
      ]

      const MySearch = (props) => {
        let input
        const handleClick = () => {
          props.onSearch(input.value)
        }
        return (
          <>
            <div className='row'>
              <div className='col-md-3'>
                <input
                  className='form-control'
                  style={{ backgroundColor: 'white' }}
                  ref={(n) => (input = n)}
                  type='text'
                />
              </div>
              <div className='col-md-3'>
                <button className='btn btn-success' onClick={handleClick}>
                  <i className='fa fa-search'></i> Search{' '}
                </button>
              </div>
            </div>
            <div className='row ml-5'>
              <div className='form-group col-md-3 mb-1'>
                <br></br>
                <label className='radio-inline'>
                  <input
                    type='checkbox'
                    name='pending'
                    onChange={() => {
                      this.handleStatusToggle('pending')
                    }}
                    checked={this.state.status.find((s) => s == 'pending')}
                  />{' '}
                  Pending
                </label>
              </div>

              <div className='form-group col-md-3 mb-1'>
                <br></br>
                <label className='radio-inline'>
                  <input
                    type='checkbox'
                    name='active'
                    onChange={() => {
                      this.handleStatusToggle('active')
                    }}
                    checked={this.state.status.find((s) => s == 'active')}
                  />{' '}
                  Active
                </label>
              </div>

              <div className='form-group col-md-3 mb-1'>
                <br></br>
                <label className='radio-inline'>
                  <input
                    type='checkbox'
                    name='pickup'
                    onChange={() => {
                      this.handleStatusToggle('pickup')
                    }}
                    checked={this.state.status.find((s) => s == 'pickup')}
                  />{' '}
                  Pickup Today
                </label>
              </div>

              <div className='form-group col-md-3 mb-1'>
                <br></br>
                <label className='radio-inline'>
                  <input
                    type='checkbox'
                    name='return'
                    onChange={() => {
                      this.handleStatusToggle('return')
                    }}
                    checked={this.state.status.find((s) => s == 'return')}
                  />{' '}
                  Return Today
                </label>
              </div>

              <div className='form-group col-md-3 mb-1'>
                <br></br>
                <label className='radio-inline'>
                  <input
                    type='checkbox'
                    name='alteration'
                    onChange={() => {
                      this.handleStatusToggle('alteration')
                    }}
                    checked={this.state.status.find((s) => s == 'alteration')}
                  />{' '}
                  Alteration
                </label>
              </div>

              <div className='form-group col-md-3 mb-1'>
                <br></br>
                <label className='radio-inline'>
                  <input
                    type='checkbox'
                    name='ready'
                    onChange={() => {
                      this.handleStatusToggle('ready')
                    }}
                    checked={this.state.status.find((s) => s == 'ready')}
                  />{' '}
                  Ready
                </label>
              </div>

              <div className='form-group col-md-3 mb-1'>
                <br></br>
                <label className='radio-inline'>
                  <input
                    type='checkbox'
                    name='overdue'
                    onChange={() => {
                      this.handleStatusToggle('overdue')
                    }}
                    checked={this.state.status.find((s) => s == 'overdue')}
                  />{' '}
                  Overdue
                </label>
              </div>

              <div className='form-group col-md-3 mb-1'>
                <br></br>
                <label className='radio-inline'>
                  <input
                    type='checkbox'
                    name='lost'
                    onChange={() => {
                      this.handleStatusToggle('lost')
                    }}
                    checked={this.state.status.find((s) => s == 'lost')}
                  />{' '}
                  Lost
                </label>
              </div>

              <div className='form-group col-md-3 mb-1'>
                <br></br>
                <label className='radio-inline'>
                  <input
                    type='checkbox'
                    name='past'
                    onChange={() => {
                      this.handleStatusToggle('past')
                    }}
                    checked={this.state.status.find((s) => s == 'past')}
                  />{' '}
                  Past
                </label>
              </div>
            </div>
          </>
        )
      }

      return (
        <ToolkitProvider
          // bootstrap4
          keyField='id'
          data={ordersDataArr.length === 0 ? [] : ordersDataArr}
          columns={columns}
          // defaultSorted={defaultSorted}
          search
        >
          {(props) => (
            <div>
              <MySearch {...props.searchProps} />
              <BootstrapTable {...props.baseProps} />
              <br />
            </div>
          )}
        </ToolkitProvider>
      )
    } else {
      return <div>No orders found.</div>
    }
  }

  render() {
    return (
      <>
        <Loader />
        <div className='wrapper menu-collapsed'>
          <Sidebar location={this.props.location}></Sidebar>
          <Header></Header>
          <div className='main-panel'>
            <div className='main-content'>
              <div className='content-wrapper'>
                <section id='extended'>
                  <div className='row'>
                    <div className='col-sm-12'>
                      <div className='card'>
                        <div className='card-header'>
                          <h4 className='card-title'>Orders</h4>
                        </div>
                        <div className='card-content'>
                          <div className='card-body table-responsive'>
                            <Alert />
                            {this.state.loading ? (
                              <Spinner />
                            ) : (
                              this.orderTable()
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
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
          </footer>
        </div>
      </>
    )
  }
}

Orders.propTypes = {
  auth: PropTypes.object,
  getAllRentedProducts: PropTypes.func.isRequired,
  getAllProducts: PropTypes.func.isRequired,
  deleteRentedProduct: PropTypes.func.isRequired,
  getOrderSearchStatus: PropTypes.func.isRequired,
  rentproducts: PropTypes.array,
  products: PropTypes.array,
}

const mapStateToProps = (state) => ({
  rentproducts: state.rentproduct.rentproducts,
  auth: state.auth,
  loading: state.rentproduct.loading,
})
export default connect(mapStateToProps, {
  getAllRentedProducts,
  deleteRentedProduct,
  getAllProducts,
  getOrderSearchStatus,
})(Orders)
