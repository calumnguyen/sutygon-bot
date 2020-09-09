import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
// import { getReport} from "../../../actions/order";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Alert from "../../layout/Alert";
import moment from 'moment';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
class ReportOrder extends Component {

    async componentDidMount() {
        // await this.props.getOrders();
        console.log("reportgeneration", this.props)
    };

    handleChange = (e, id = "") => {
        this.setState({ [e.target.name]: e.target.value });
    };

    // handlePdf = () => {
    //     const input = document.getElementById('page');

    //     html2canvas(input)
    //         .then((canvas) => {
    //             const imgData = canvas.toDataURL('image/png');
    //             const pdf = new jsPDF('p', 'px', 'a4');
    //             var width = pdf.internal.pageSize.getWidth();
    //             var height = pdf.internal.pageSize.getHeight();

    //             pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
    //             pdf.save("download.pdf");
    //         });
    // };
    getTAble = () => {
        const { data } = this.props.location;
        const { user } = this.props.auth;

        let tbl_sno = 1;
        if (data) {
            if (data.length === 0) {
                return (
                    <tr>
                        <td colSpan={6} className="text-center">
                            No Order Found
            </td>
                    </tr>
                );
            }
            return data.map((record, i) => (
                <tr key={i}>

                    <td className="text-center text-muted">{tbl_sno++}</td>
                    <td className="text-center">{""}</td>
                    <td className="text-center">{record.orderNumber}</td>

                    <td className="text-center">{record.customer.name}</td>
                    <td className="text-center">{record.product.name}</td>
                    <td className="text-center">{user.username}</td>
                    <td className="text-center">{moment(record.deliveryDate).format("DD/MMM/YYYY")}</td>

                    

                </tr>

            ));
        }
    };


    render() {
        const { auth } = this.props;
        if (!auth.loading && !auth.isAuthenticated) {
            return <Redirect to="/" />;
        }
        const { data } = this.props.location;
        const { user } = this.props.auth;

        return (
            <React.Fragment>
                <div className="wrapper menu-collapsed">
                <section className="invoice-template">
  <div className="card"  >
    <div className="card-content p-3">
      <div id="invoice-template" className="card-body" id="page">
        <div id="invoice-company-details" className="row">
          <div className="col-md-6 col-sm-12 text-center text-md-left">
            <div className="media" >
              <img src="assets/img/logos/logo.png" alt="company logo" width="130" height="130" />
              <div className="media-body">
                {/* <ul className="ml-2 px-0 list-unstyled">
                  <li className="text-bold-800">Pixinvent Creative Studio</li>
                  <li>4025 Oak Avenue,</li>
                  <li>Melbourne,</li>
                  <li>Florida 32940,</li>
                  <li>USA</li>
                </ul> */}
              </div>
            </div>

          </div>
          <div className="col-md-6 col-sm-12 text-center text-md-right">
            {/* <p><span className="text-muted">Starting Date :</span> {moment(data.deliveryDate).format("DD/MMM/YYYY")}</p> */}
            {/* <p><span className="text-muted">Terms :</span> Due on Receipt</p> */}
            {/* <p><span className="text-muted">Ending Date :</span>{moment(data.deliveryDate).format("DD/MMM/YYYY")}</p> */}
            <p><span className="text-muted">User :</span> {user ? user.username:""}</p>

          </div>
        </div>
        
        {/* <div id="invoice-customer-details" className="row pt-2">
          <div className="col-sm-12 text-left">
            <p className="text-muted">Bill To</p>
          </div>
          <div className="col-md-6 col-sm-12  text-center text-md-left">
            <ul className="px-0 list-unstyled">
              <li className="text-bold-800">Mr. Bret Lezama</li>
              <li>4879 Westfall Avenue,</li>
              <li>Albuquerque,</li>
              <li>New Mexico-87102.</li>
            </ul>
          </div>
          <div className="col-md-6 col-sm-12 text-center text-md-right">
            <p><span className="text-muted">Invoice Date :</span> 06/05/2016</p>
            <p><span className="text-muted">Terms :</span> Due on Receipt</p>
            <p><span className="text-muted">Due Date :</span> 10/05/2016</p>
          </div>
        </div> */}
      
        <div id="invoice-items-details" className="pt-2">
          <div className="row">
            <div className="table-responsive col-sm-12">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th></th>
                    <th>Order Number</th>
                    <th className="text-center">Customer</th>
                    <th className="text-center">Product</th>
                    <th className="text-center">Order Status</th>
                    <th className="text-center">Delivery Date</th>
                     {/* <th className="text-center">Amount</th>  */}
                  </tr>
                </thead>
                <tbody>
                {this.getTAble()}
                       </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-12 text-left">
              <p className="lead">Payment Methods:</p>
              {/* <div className="row">
                <div className="col-12">
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td>Bank name:</td>
                        <td className="text-right">ABC Bank, USA</td>
                      </tr>
                      <tr>
                        <td>Acc name:</td>
                        <td className="text-right">Amanda Orton</td>
                      </tr>
                      <tr>
                        <td>IBAN:</td>
                        <td className="text-right">FGS165461646546AA</td>
                      </tr>
                      <tr>
                        <td>SWIFT code:</td>
                        <td className="text-right">BTNPP34</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div> */}
            </div>
            <div className="col-md-6 col-sm-12">
              <p className="lead">Total</p>
              {/* <div className="table-responsive">
                <table className="table">
                  <tbody>
                    <tr>
                      <td>Sub Total</td>
                      <td className="text-right">$ 14,900.00</td>
                    </tr>
                    <tr>
                      <td>TAX (12%)</td>
                      <td className="text-right">$ 1,788.00</td>
                    </tr>
                    <tr>
                      <td className="text-bold-800">Total</td>
                      <td className="text-bold-800 text-right"> $ 16,688.00</td>
                    </tr>
                    <tr>
                      <td>Payment Made</td>
                      <td className="pink text-right">(-) $ 4,688.00</td>
                    </tr>
                    <tr className="bg-grey bg-lighten-4">
                      <td className="text-bold-800">Balance Due</td>
                      <td className="text-bold-800 text-right">$ 12,000.00</td>
                    </tr>
                  </tbody>
                </table>
              </div> */}
              <div className="text-center">
                <p>Authorized person</p>
                {/* <img src="assets/img/pages/signature-scan.png" alt="signature" className="width-250" />
                <h6>Amanda Orton</h6>
                <p className="text-muted">Managing Director</p> */}
              </div>
            </div>
          </div>
        </div>
        <div id="invoice-footer">
          <div className="row">
            <div className="col-md-9 col-sm-12">
              <h6>Terms &amp; Condition</h6>
              <p>You know, being a test pilot isn't always the healthiest business in the world. We predict too
                much for the next year and yet far too little for the next 10.</p>
            </div>
            {/* <div class="col-md-3 col-sm-12 text-center">
              <button type="button"                             onClick={() => this.handlePdf()}
 class="btn btn-primary btn-raised my-1"><i class="fa fa-paper-plane-o"></i> Download
                PDF</button>
            </div> */}
         
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

                    <footer className="footer footer-static footer-light">
                        <p className="clearfix text-muted text-sm-center px-2"><span>Powered by &nbsp;{" "}
                            <a href="https://www.alphinex.com" id="pixinventLink" target="_blank" className="text-bold-800 primary darken-2">Alphinex Solutions </a>, All rights reserved. </span></p>
                    </footer>


                </div>

            </React.Fragment>

        );
    }
}


ReportOrder.propTypes = {
    auth: PropTypes.object,
    // getAllOrders: PropTypes.func.isRequired,

    // orders: PropTypes.array,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    // orders: state.order
});
export default connect(mapStateToProps, {
    // getAllOrders
})(ReportOrder);
