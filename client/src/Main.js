import React, { useEffect } from "react";
import Dashboard from "./components/pages/Dashboard";
import Login from "./components/Login";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./routing/PrivateRoute";
import AddUser from "./components/pages/users/Adduser";
import View from "./components/pages/users/view";

import ViewUser from "./components/pages/users/Viewuser";
import AddCustomer from "./components/pages/customers/Addcustomer";
import AddProduct from "./components/pages/products/Addproduct";
import Orders from "./components/pages/orders/orders";
import AddOrder from "./components/pages/orders/AddOrder";

import Calender from "./components/pages/calender";
import AddAppointment from "./components/pages/appointment";
import ViewCustomer from "./components/pages/customers/Viewcustomer";
import ViewProduct from "./components/pages/products/Viewproduct";

import Product from "./components/pages/products/Product";
import RentProduct from "./components/pages/rentproduct";
import Report from "./components/pages/report/report";
import ReportOrder from "./components/pages/report/reportOrder";


// import Calender from "./components/pages/calender";

// Redux
import { Provider } from "react-redux";
import store from "./store";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const Main = () => {

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Switch>
        
          <Route exact path="/" component={Login} />
          <Route exact path="/Login" component={Login} />
          {/* Dashboard */}
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          {/* users */}
          <PrivateRoute exact path="/user/adduser" component={AddUser} />
          <PrivateRoute exact path="/user" component={ViewUser} />
          <PrivateRoute exact path="/user/edituser/:id" component={AddUser} />
          <PrivateRoute exact path="/user/view/:id" component={View} />

          {/* customers */}
          <PrivateRoute exact path="/customer/addcustomer" component={AddCustomer} />
          <PrivateRoute exact path="/customer" component={ViewCustomer} />
          {/* products */}
          <PrivateRoute exact path="/product/addproduct" component={AddProduct} />
          <PrivateRoute exact path="/product" component={ViewProduct} />
          <PrivateRoute exact path="/product/editproduct/:id" component={AddProduct} />
          <PrivateRoute exact path="/product/viewproduct/:id" component={Product} />

{/* rent product */}
          <PrivateRoute exact path="/rentproduct" component={RentProduct} />

{/* orders */}
<PrivateRoute exact path="/orders" component={Orders} />
          <PrivateRoute exact path="/orders/addorder" component={AddOrder} />

{/* appointment */}
<PrivateRoute exact path="/appointments" component={AddAppointment} />

{/* calender */}
<PrivateRoute exact path="/calender" component={Calender} />

{/* report */}
<PrivateRoute exact path="/reports" component={Report} />
<PrivateRoute exact path="/report" component={ReportOrder} />



        </Switch>
      </Router>
    </Provider>
  );
};

export default Main;
