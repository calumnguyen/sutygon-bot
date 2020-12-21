import React, { useEffect } from 'react'
import Dashboard from './components/pages/Dashboard'
import Login from './components/Login'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { loadUser } from './actions/auth'
import setAuthToken from './utils/setAuthToken'
import PrivateRoute from './routing/PrivateRoute'
import AddUser from './components/pages/users/Adduser'
import View from './components/pages/users/view'
import ViewUser from './components/pages/users/Viewuser'
import AddCustomer from './components/pages/customers/Addcustomer'
import AddProduct from './components/pages/products/Addproduct'
import Orders from './components/pages/orders/orders'
import ViewOrder from './components/pages/orders/viewOrder'
import OrderNotes from './components/pages/orders/orderNotes'
import Calender from './components/pages/calender'
import AddAppointment from './components/pages/appointment'
import ViewCustomer from './components/pages/customers/Viewcustomer'
import ViewProduct from './components/pages/products/Viewproduct'
import Product from './components/pages/products/Product'
import RentProduct from './components/pages/rentproduct'
import Checkout from './components/pages/checkout'
import ReturnProduct from './components/pages/returnproduct/returnproduct'
import ScanBarcode from './components/pages/returnproduct/scanBarcode'
import RentOrder from './components/pages/rentOrder'
import ActivateAccount from './components/pages/ActivateAccount'
import Test from './components/pages/users/test'
import Error from './components/pages/Error'

import Report from './components/pages/report/report'
import ReportOrder from './components/pages/report/reportOrder'
import MatchBarcodes from './components/pages/returnproduct/matchBarcodes'
// import Calender from "./components/pages/calender";

// Redux
import { Provider } from 'react-redux'
import store from './store'
import Barcode from './components/pages/Barcode'
import ConfigureSystem from './components/pages/users/ConfigureSystem'
import ConfigureSystemUser from './components/pages/users/ConfigureSystemUser'
import EditUser from './components/pages/users/EditUser'
// import SalaryUpdate from './components/pages/users/SalaryUpdate'
import StoreClosed from './components/pages/StoreClosed'

if (localStorage.token) {
  setAuthToken(localStorage.token)
}
const Main = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router forceRefresh={true}>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route exact path='/Login' component={Login} />

          {/* Dashboard */}
          <PrivateRoute exact path='/dashboard' component={Dashboard} />

          {/* users */}
          <PrivateRoute exact path='/user/adduser' component={AddUser} />
          <PrivateRoute
            exact
            path='/user/configuresystem'
            component={ConfigureSystem}
          />
          <PrivateRoute
            exact
            path='/user/configuresystemuser'
            component={ConfigureSystemUser}
          />
          <PrivateRoute exact path='/user' component={ViewUser} />
          <PrivateRoute exact path='/user/edituser/:id' component={EditUser} />
          <PrivateRoute exact path='/user/view/:id' component={View} />
          {/* <PrivateRoute exact path='/user/updatesalary/:id' component={SalaryUpdate} /> */}
          <PrivateRoute exact path='/storeclosed' component={StoreClosed} />
          <PrivateRoute
            exact
            path='/ActivateAccount'
            component={ActivateAccount}
          />

          {/* customers */}
          <PrivateRoute
            exact
            path='/customer/addcustomer'
            component={AddCustomer}
          />
          <PrivateRoute exact path='/customer' component={ViewCustomer} />
          <PrivateRoute
            exact
            path='/customer/editcustomer/:id'
            component={AddCustomer}
          />

          {/* products */}
          <PrivateRoute
            exact
            path='/product/addproduct'
            component={AddProduct}
          />
          <PrivateRoute exact path='/product' component={ViewProduct} />
          <PrivateRoute
            exact
            path='/product/editproduct/:id'
            component={AddProduct}
          />
          <PrivateRoute
            exact
            path='/product/viewproduct/:id'
            component={Product}
          />
          <PrivateRoute exact path='/test' component={Test} />

          {/* rent product */}
          <PrivateRoute exact path='/rentproduct' component={RentProduct} />
          <PrivateRoute exact path='/checkout' component={Checkout} />
          <PrivateRoute exact path='/rentorder' component={RentOrder} />
          {/* <PrivateRoute exact path='/rentinvoice' component={RentInvoice} /> */}

          {/* return product */}
          <PrivateRoute exact path='/returnproduct' component={ReturnProduct} />
          <PrivateRoute exact path='/matchbarcodes' component={MatchBarcodes} />
          <PrivateRoute exact path='/scanbarcode' component={ScanBarcode} />

          {/* orders */}
          <PrivateRoute exact path='/orders' component={Orders} />
          <PrivateRoute
            exact
            path='/orders/vieworder/:id'
            component={ViewOrder}
          />
          <PrivateRoute
            exact
            path='/orders/alternotes'
            component={OrderNotes}
          />

          {/* appointment */}
          <PrivateRoute exact path='/appointments' component={AddAppointment} />

          {/* calender */}
          <PrivateRoute exact path='/calender' component={Calender} />

          {/* report */}
          <PrivateRoute exact path='/reports' component={Report} />
          <PrivateRoute exact path='/report' component={ReportOrder} />

          {/* barcode */}
          <PrivateRoute exact path='/barcode' component={Barcode} />
          <PrivateRoute exact path='/Error' component={Error} />
        </Switch>
      </Router>
    </Provider>
  )
}

export default Main
