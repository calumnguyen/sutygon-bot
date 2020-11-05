import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import { addNewOrder } from "../../../actions/order";
import { getAllCustomers } from "../../../actions/customer";
import { getAllProducts } from "../../../actions/product";
import Alert from "../../layout/Alert";
import Loader from "../../layout/Loader";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class AddOrder extends Component {
    state = {
      id: "",
      orderNumber: `${"RP"}${Date.now()}`,
      customer: "",
      product: "",
      orderedQuantity: "",
      orderedSize: "",
      emoloyee: "",
      deliveryDate:"",
      returnDate:"",
      saving: false,
    };


    async componentDidMount() {
        this.props.getAllProducts();
        this.props.getAllCustomers();
      // check form is to Add or Edit
      if (this.props.match.params.id) {
        const id = this.props.match.params.id;
       await this.props.getProduct(id);
        const { product } = this.props;
        if (product) {
          this.setState({
            id: id,
            name: product.name,
            username: product.username,
            fabric: product.fabric,
            color: product.color,
            size:product.size,
            availableQuantity:product.availableQuantity,
            rentedQuantity:product.rentedQuantity,


          });
        }
      }
    }
    _onChange = (e, id = "") => {
      this.setState({ [e.target.name]: e.target.files[0] });
  }


    handleChange = (e, id = "") => {
        this.setState({ [e.target.name]: e.target.value });
    };
    getavailableQuantity = () => {
      const { products } = this.props.products;
      if (this.state.product) {
        const result = products.filter(record => record._id === this.state.product)
        if (result) {
          return result[0].availableQuantity
        }
      }
    }
    getRentedQuantity = () => {
      const { products } = this.props.products;
      if (this.state.product) {
        const result = products.filter(record => record._id === this.state.product)
        if (result) {
          return result[0].rentedQuantity
        }
      }
    }
    onSubmit = async (e) => {
      e.preventDefault();
      this.setState({ saving: true });

      const state = { ...this.state };
      const { user } = this.props.auth;

      const order = {
        orderNumber: state.orderNumber,
        product: state.product,
        customer: state.customer,
        user: user._id,
        orderedSize:state.orderedSize,
        orderedQuantity:state.orderedQuantity,
        deliveryDate: state.deliveryDate,
        returnDate: state.returnDate,

        image: state.image
      };
      await this.props.addNewOrder(order);

      this.setState({ saving: false });
    };

    render() {
        const { auth } = this.props;
        if (!auth.loading && !auth.isAuthenticated) {
          return <Redirect to="/" />;
        }

        if (this.props.saved) {
            return <Redirect to="/dashboard" />;
          }
          const { product, customer } = this.state;
          const { customers } = this.props.customers;
          const { products } = this.props.products;

        return (
            <React.Fragment>
              <Loader />
                <div className="wrapper menu-collapsed">
                    <Sidebar location={this.props.location} >
                    </Sidebar>
                    <Header>
                    </Header>

                    <div className="main-panel">
                        <div className="main-content">
                        <div className="content-wrapper">
                        <section id="form-action-layouts">
     <div className="form-body">

        <div className="card">
          <div className="card-header">
                <h4 className="form-section"><i className="icon-social-dropbox"></i>
                    {this.state.id === ""
                          ? "Add New Order"
                          : "Update Order"}</h4>
            </div>

            <div className="card-body">

            <form onSubmit={(e) => this.onSubmit(e)}>
<Alert />
                          <div className="row">
                            <div className="form-group col-6 mb-2">
                              <label htmlFor="issueinput5">Chọn Khách Hàng</label>
                              <select
                                name="customer"
                                className="form-control"
                                onChange={(e) => this.handleChange(e)}
                              >
                                <option value="DEFAULT"> -- select -- </option>
                                {customers &&
                                  customers.map((record) => (
                                    <option
                                      key={record._id}
                                      value={record._id}
                                      selected={record._id === customer}
                                    >
                                      {record.name +
                                        " - " +
                                        record.email}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <div className="form-group col-6 mb-2">
                              <label htmlFor="issueinput5">Chọn Sản Phẩm</label>
                              <select
                                name="product"
                                className="form-control"
                                onChange={(e) => this.handleChange(e)}
                                                              >
                                <option value="DEFAULT"> -- select -- </option>
                                {products &&
                                  products.map((record) => (
                                    <option
                                      key={record._id}
                                      value={record._id}
                                      selected={record._id === product}
                                    >
                                      {record.name}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-group col-md-6 mb-2">
                              <label htmlFor="projectinput4">Số Lượng Khả Dụng</label>
                              <input type="text"
                                id="projectinput4"
                                className="form-control"
                                placeholder="Available Quantity"
                                name="availableQuantity"
                               value={this.getavailableQuantity() >= 0 ?  this.getavailableQuantity(): `Available Quantity`}
                                onChange={(e) => this.handleChange(e)}
                                readOnly
                              />
                            </div>
                            <div className="form-group col-md-6 mb-2">
                              <label htmlFor="projectinput4">Số Lượng Đã Thuê</label>
                    <input type="text"
                     id="projectinput4"
                      className="form-control"
                       placeholder="Rented Quantity"
                       name="orderedQuantity"
                        value={this.getRentedQuantity() >= 0 ?  this.getRentedQuantity(): `Rented Quantity`}
                       onChange={(e) => this.handleChange(e)}
                       readOnly

                       />
                            </div>
                          </div>

                          <div className="row">
                            <div className="form-group col-md-6 mb-2">
                              <label htmlFor="projectinput4">Kích Cỡ</label>
                              <input type="text"
                                id="projectinput4"
                                className="form-control"
                                placeholder="Size"
                                name="orderedSize"
                                value={this.state.orderedSize}
                                onChange={(e) => this.handleChange(e)}

                              />
                            </div>
                            <div className="form-group col-md-6 mb-2">
                            <label htmlFor="projectinput4">Số Lượng</label>
                              <input type="text"
                                id="projectinput4"
                                className="form-control"
                                placeholder="Quantity"
                                name="orderedQuantity"
                                value={this.state.orderedQuantity}
                                onChange={(e) => this.handleChange(e)}

                              />

                            </div>
                          </div>

                          <div className="row">
                            <div className="form-group col-md-6 mb-2">
                              <label
                                htmlFor="issueinput3"
                              >Ngày Lấy Đồ
                    </label>
                              <input
                                type="date"
                                id="issueinput3"
                                className="form-control"
                                name="deliveryDate"
                                data-toggle="tooltip"
                                data-trigger="hover"
                                data-placement="top"
                                data-title="Date Opened"
                                onChange={(e) => this.handleChange(e)}
                                value={this.state.deliveryDate}
                              />
                            </div>
                            <div className="form-group col-md-6 mb-2">
                              <label
                                htmlFor="issueinput3"
                              >
                                Ngày Trả Đồ
                      </label>
                              <input
                                type="date"
                                id="issueinput3"
                                className="form-control"
                                name="returnDate"
                                data-toggle="tooltip"
                                data-trigger="hover"
                                data-placement="top"
                                data-title="Date Opened"
                                onChange={(e) => this.handleChange(e)}
                                value={this.state.returnDate}
                              />
                            </div>
                          </div>
                          <div className="form-actions top">
                       {this.state.saving ? (
                            <button
                              type="button"
                              className="mb-2 mr-2 btn btn-raised btn-primary"
                            >
                              <div
                                className="spinner-grow spinner-grow-sm "
                                role="status"
                              ></div>
                                &nbsp; Adding
                            </button>
                          ) : (
                              <button
                                type="submit"
                                className="mb-2 mr-2 btn btn-raised btn-primary"
                              >
                                <i className="ft-check" /> Create Order
                              </button>
                            )}



                          </div>
                        </form>
             </div>
           </div>
          </div>
        </section>

        </div>
                        </div>

                        <footer className="footer footer-static footer-light">
                            <p className="clearfix text-muted text-sm-center px-2"><span>Quyền sở hữu của &nbsp;{" "}
                            <a href="https://www.sutygon.com" rel="noopener noreferrer"  id="pixinventLink" target="_blank" className="text-bold-800 primary darken-2">SUTYGON-BOT </a>, All rights reserved. </span></p>
                        </footer>

                    </div>

                </div>

            </React.Fragment>

        );
    }
}

AddOrder.propTypes = {
  saved: PropTypes.bool,
  addNewOrder: PropTypes.func.isRequired,
  auth: PropTypes.object,
  getAllCustomers:PropTypes.func.isRequired,
  getAllProducts:PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    saved: state.product.saved,
    auth: state.auth,
    products: state.product,
    customers: state.customer
});
export default connect(mapStateToProps, {
    getAllCustomers,
    getAllProducts,
   addNewOrder
})(AddOrder);
