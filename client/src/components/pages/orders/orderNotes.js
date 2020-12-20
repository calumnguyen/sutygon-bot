import React, { Component } from 'react'
import Sidebar from '../../layout/Sidebar'
import Header from '../../layout/Header'
import Loader from '../../layout/Loader'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import Alert from '../../layout/Alert'
import PropTypes from 'prop-types'
import { confirmAlert } from 'react-confirm-alert'
import BootstrapTable from 'react-bootstrap-table-next'
import ToolkitProvider from 'react-bootstrap-table2-toolkit'
import {
  addAlterNote,
  getAlterNotes,
  markDone,
} from '../../../actions/alterNotes'
import Spinner from '../../layout/Spinner.js'

class OrderNotes extends Component {
  state = {
    order_id: '',
    note: '',
    alter_request: false,
    alternotes: '',
    loading: true,
  }

  async componentDidMount() {
    await this.props.getAlterNotes()
    const { alternotes, loading } = this.props
    this.setState({
      alternotes,
      loading,
    })
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleToggle = (e) => {
    this.setState({
      alter_request: !this.state.alter_request,
    })
  }

  onSubmit = async (e) => {
    e.preventDefault()
    let { order_id, note, alter_request } = this.state
    console.log(order_id, note, alter_request)

    await this.props.addAlterNote({
      order_id,
      note,
      alter_request,
    })

    const { alternotes } = this.props

    this.setState({
      alternotes,
    })

    this.setState({
      order_id: '',
      note: '',
      alter_request: '',
    })
  }

  markAsDoneAlert = (id) => {
    confirmAlert({
      title: 'Confirm',
      message: `Are you sure to mark as done ?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await this.props.markDone(id)

            var foundIndex = this.state.alternotes.findIndex((x) => x._id == id)
            this.state.alternotes[foundIndex].done = true

            this.setState({
              alternotes: this.state.alternotes,
            })
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    })
  }

  alterNotesTable = () => {
    let alterNotesArr = []

    let { alternotes } = this.state

    if (alternotes) {
      alternotes.forEach((note) => {
        let prodString = ``

        if (note.products) {
          note.products.forEach((product) => {
            prodString += `${product.name} | ${product.colorname} | ${product.size}`
            prodString += '\n'
          })
        }

        alterNotesArr.push({
          order_id: note.order_id,
          products: prodString,
          note: note.note,
          type: note.alter_request ? 'Request' : 'Note',
          status: note.done ? (
            'Done'
          ) : (
            <Link
              onClick={() => {
                this.markAsDoneAlert(note._id)
              }}
            >
              Mark as done
            </Link>
          ),
          note_by: `${note.emp_name}.`,
        })
      })
    }

    const columns = [
      {
        dataField: 'order_id',
        text: 'Order ID',
        sort: true,
      },
      {
        dataField: 'products',
        text: 'Products',
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: '140px', textAlign: 'left' }
        },
      },
      {
        dataField: 'note',
        text: 'Note',
        sort: true,
      },
      {
        dataField: 'type',
        text: 'Type',
        sort: true,
      },
      {
        dataField: 'status',
        text: 'Status',
        sort: true,
      },
      {
        dataField: 'note_by',
        text: 'Note By',
        sort: true,
      },
    ]

    const defaultSorted = [
      {
        dataField: 'contactnumber',
        order: 'asc',
      },
    ]

    return (
      <ToolkitProvider
        // bootstrap4
        keyField='id'
        data={alterNotesArr ? alterNotesArr : []}
        columns={columns}
        defaultSorted={defaultSorted}
        // search
      >
        {(props) => (
          <div>
            <BootstrapTable {...props.baseProps} />
            <br />
          </div>
        )}
      </ToolkitProvider>
    )
  }

  render() {
    return (
      <React.Fragment>
        <Loader />
        <div className='wrapper menu-collapsed'>
          <Sidebar location={this.props.location}></Sidebar>
          <Header></Header>

          <div className='main-panel'>
            <div className='main-content'>
              <div className='content-wrapper'>
                <section id='form-action-layouts'>
                  <div className='form-body'>
                    <div className='card'>
                      <div className='card-header'>
                        <h4 className='form-section'>
                          <i className='icon-bag' /> Alteration Notes
                        </h4>
                      </div>
                      <div className='card-body'>
                        <div className='row'>
                          {' '}
                          <Alert />
                        </div>
                        <form
                          className='form form-horizontal form-bordered'
                          // method='POST'
                          onSubmit={(e) => this.onSubmit(e)}
                        >
                          <h4 className='form-section '>
                            <i className='ft-info'></i> Add a Note
                          </h4>
                          <div className='row'>
                            <div className='col-md-2'>
                              <div className=''>
                                <div className=''>
                                  <input
                                    type='text'
                                    id='projectinput3'
                                    className='form-control border-primary'
                                    placeholder='Order ID'
                                    name='order_id'
                                    value={this.state.order_id}
                                    onChange={(e) => {
                                      this.onChangeHandler(e)
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className='col-md-5'>
                              <div className=''>
                                <div className=''>
                                  <input
                                    type='text'
                                    id='projectinput3'
                                    className='form-control border-primary'
                                    placeholder='Note'
                                    name='note'
                                    value={this.state.note}
                                    onChange={(e) => {
                                      this.onChangeHandler(e)
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className='col-md-2'>
                              <div className=''>
                                <div className=''>
                                  <label className='radio-inline'>
                                    <input
                                      className='input'
                                      type='checkbox'
                                      name='alter_request'
                                      onChange={(e) => this.handleToggle()}
                                      checked={this.state.alter_request}
                                    />{' '}
                                    Alter request?
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className='col-md-3'>
                              <div className=''>
                                <div className=''>
                                  <button className='btn btn-success'>
                                    <i className='fa fa-plus'></i> Add{' '}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className='card-body'>
                        <form
                          className='form form-horizontal form-bordered'
                          method='POST'
                          // onSubmit={(e) => this.onSubmit(e)}
                        >
                          <h4 className='form-section '>
                            <i className='ft-info'></i> See Notes
                          </h4>
                          <div className='row'>
                            <div className='col-md-12'>
                              {this.state.loading ? (
                                // <div>loading....</div>
                                <Spinner />
                              ) : (
                                this.alterNotesTable()
                              )}
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </section>
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
        </div>
      </React.Fragment>
    )
  }
}

OrderNotes.propTypes = {
  getAlterNotes: PropTypes.func.isRequired,
  addAlterNote: PropTypes.func.isRequired,
  markDone: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  alternotes: state.alternotes.alternotes,
  loading: state.alternotes.loading,
})
export default connect(mapStateToProps, {
  addAlterNote,
  getAlterNotes,
  markDone,
})(OrderNotes)
