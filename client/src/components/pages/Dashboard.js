import React, { Component } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import Loader from "../layout/Loader";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAllAppointments } from "../../actions/appointment";
import { getAllOrders } from "../../actions/order";
import { getAllRentedProducts} from "../../actions/rentproduct";
import { getAllProducts} from "../../actions/product";
import { changeShopStatus, getShop} from "../../actions/dashboard";
import * as moment from 'moment'
import { setAlert } from "../../actions/alert";
// import { getAllAppointments } from "../../actions/appointment";
// import { getAllAppointments } from "../../actions/appointment";

import "../../login.css"
import "../../dashbaord.css"
import { dateFnsLocalizer } from "react-big-calendar";

class Dashboard extends Component {

  async componentDidMount() {
    await this.props.getAllAppointments();
    await this.props.getAllOrders();
    await this.props.getAllRentedProducts();
    await this.props.getAllProducts();
    await this.props.getShop();
  }

  async changeShopStatus(status)  {
    await this.props.changeShopStatus(status);
    await this.props.getShop();
  }
  getPendingOrder = ()=>{
    // e.preventDefault()
    const { orders } = this.props;
if(orders){

  let events = orders.filter(a => (new Date(a.deliveryDate)).getTime() - (new Date()).getTime() > 0);
  return events.length;

  }
}
getOverDueOrder = ()=>{
  // e.preventDefault()
  const { orders } = this.props;
  console.log(orders)
if(orders){
console.log(new Date)

 let events = orders.filter(a => (new Date(a.deliveryDate)).getTime()-  (new Date()).getTime()  < 0);
return events.length;

}
}
getReturnOrder = ()=>{
 
  // e.preventDefault()
  const { orders } = this.props;
  console.log(orders)
if(orders){

const date = new Date()

let events = orders.filter(a =>console.log(new Date(a.returnDate) ));
return events.length;
}


}
getTodaysAppointment = ()=>{
  // e.preventDefault()
  const { appointment} = this.props;
if(appointment){

 let events = appointment.filter(a => new Date(a.end) - new Date == 0);
 return events.length;

}
}
  render() {
    const { shop } = this.props;
    const { user } = this.props.auth; 
  console.log(this.props)
if(user && user.type == "User") {
      if(shop){
      let openShop = shop[0]
       if(openShop && openShop.status === "off"){
        localStorage.clear();
        this.props.history.push("/");
        window.location.reload();
        setAlert("Shop is closed", "danger", 5000);
       }
    };
    }
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
          <div class="row">
  <div class="col-xl-3 col-lg-6 col-md-6 col-12">
    <div class="card gradient-blackberry">
      <div class="card-content">
        <div class="card-body pt-2 pb-0">
          <div class="media">
            <div class="media-body white text-left">
    <h3 class="font-large-1 mb-0">{this.getPendingOrder()}</h3>
              <span>Pending Orders</span>
            </div>
            <div class="media-right white text-right">
              <i class="icon-pie-chart font-large-1"></i>
            </div>
          </div>
        </div>
        <div id="Widget-line-chart" class="height-75 WidgetlineChart WidgetlineChartshadow mb-2">
        </div>
      </div>
    </div>
  </div>
  <div class="col-xl-3 col-lg-6 col-md-6 col-12">
    <div class="card gradient-ibiza-sunset">
      <div class="card-content">
        <div class="card-body pt-2 pb-0">
          <div class="media">
            <div class="media-body white text-left">
    <h3 class="font-large-1 mb-0">{this.getOverDueOrder()}</h3>
              <span>Over Due Orders</span>
            </div>
            <div class="media-right white text-right">
              <i class="icon-bulb font-large-1"></i>
            </div>
          </div>
        </div>
        <div id="Widget-line-chart1" class="height-75 WidgetlineChart WidgetlineChartshadow mb-2">
        </div>

      </div>
    </div>
  </div>

  <div class="col-xl-3 col-lg-6 col-md-6 col-12">
    <div class="card gradient-green-tea">
      <div class="card-content">
        <div class="card-body pt-2 pb-0">
          <div class="media">
            <div class="media-body white text-left">
              <h3 class="font-large-1 mb-0">{this.getTodaysAppointment()}</h3>
              <span>Todays Appointment</span>
            </div>
            <div class="media-right white text-right">
              <i class="icon-graph font-large-1"></i>
            </div>
          </div>
        </div>
        <div id="Widget-line-chart2" class="height-75 WidgetlineChart WidgetlineChartshadow mb-2">
        </div>
      </div>
    </div>
  </div>
  <div class="col-xl-3 col-lg-6 col-md-6 col-12">
    <div class="card gradient-pomegranate">
      <div class="card-content">
        <div class="card-body pt-2 pb-0">
          <div class="media">
            <div class="media-body white text-left">
              <h3 class="font-large-1 mb-0">{this.getReturnOrder()}</h3>
              <span>Return Orders</span>
            </div>
            <div class="media-right white text-right">
              <i class="icon-wallet font-large-1"></i>
            </div>
          </div>
        </div>
        <div id="Widget-line-chart3" class="height-75 WidgetlineChart WidgetlineChartshadow mb-2">
        </div>
      </div>
    </div>
  </div>
</div>
          {user && user.type === "Admin" ?
      <>
          <div className="row">
            <div className="col-md-12">
            <div className="card">
              <div className="card-body">
            
                  <div className="row">
                    <div className="col-md-7 txt-sep">
                      <h2>Shop was {this.props.shop[0] && (this.props.shop[0].status == "on" ? "Opened" : "Closed")} on</h2>
                      <h1> <span className="badge badge-info">{this.props.shop[0] && moment(this.props.shop[0].shopStartTime).format('HH:mm a')}</span></h1>
                      <p><span className="badge badge-pill badge-light">{this.props.shop[0] && moment(this.props.shop[0].shopStartTime).format('DD-MMM-YY')}</span> </p>
                    </div>
                    <div className="col-md-3 txt-sep">
                      <h3 className="mt-1">Status</h3>
                      <p className="badge badge-pill badge-light">{this.props.shop[0] && (this.props.shop[0].status == "on" ? "Opened" : "Closed")}</p>
                    </div>
                    <div className="col-md-2">
                    <h3 className="mt-1">Action</h3>
                      {this.props.shop[0] && (this.props.shop[0].status == "on" ? (
                        <button type="button" onClick={() => this.changeShopStatus('off')} className="btn btn-link">Stop</button>
                      ) : (
                        <button type="button" onClick={() => this.changeShopStatus('on')} className="btn btn-link">Start</button>
                      ))}
                    </div>
                  </div>

              </div>
            </div>
            </div>
          </div> 
          </> : " "}

          </div>
        </div>
      
        <footer className="footer footer-static footer-light">
          <p className="clearfix text-muted text-sm-center px-2"><span>Powered by &nbsp;{" "}
          <a href="https://www.alphinex.com" id="pixinventLink" target="_blank" className="text-bold-800 primary darken-2">Alphinex Solutions </a>, All rights reserved. </span></p>
        </footer>
   
      </div>

  </div>

</React.Fragment>

    );
  }
}

Dashboard.propTypes = {
  getAllAppointments: PropTypes.func.isRequired,
  getAllOrders: PropTypes.func.isRequired,
  getAllProducts: PropTypes.func.isRequired,
  getAllRentedProducts: PropTypes.func.isRequired,
  changeShopStatus: PropTypes.func.isRequired,
  getShop: PropTypes.func.isRequired,
  auth: PropTypes.object,
  products: PropTypes.array,
  orders: PropTypes.array,
  rentedproducts:PropTypes.array,
  shop: PropTypes.array};

const mapStateToProps = (state) => ({
  users: state.user.users,
  auth: state.auth,
  products: state.product.products,
  appointment: state.appointment.appointments,
  orders: state.order.orders,
  shop: state.dashboard.shop

});
export default connect(mapStateToProps, {
   getAllAppointments, getAllOrders,getAllProducts,getAllRentedProducts, changeShopStatus, getShop
})(Dashboard);

