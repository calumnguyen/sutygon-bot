import React, { Component } from "react";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAllStores, deleteShop } from "../../../actions/shop";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Alert from "../../layout/Alert";
import Loader from "../../layout/Loader";
import MPagination from "../../../components/pagination/MPagination";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { OCAlertsProvider } from "@opuscapita/react-alerts";

class ViewShops extends Component {
  state = {
    couponsStatus: "active",
    page: 1,
    copied: false,
    currentIndex: "",
  };

  componentDidMount = async () => {
    this.props.getAllStores(this.state.page);
  };

  getTAble = () => {
    const { shops } = this.props;
    if (shops) {
      if (shops.length === 0) {
        return (
          <tr>
            <td colSpan={9} className="text-center">
              No Data Found
            </td>
          </tr>
        );
      }
      return shops.map((shop, index) => (
        <tr key={shop._id}>
          <td className="text-center">{index + 1}</td>

          <td className="text-center">{shop.name}</td>
          <td className="text-center">
            <CopyToClipboard
              text={`https://sutygon.app/${shop.slug}/Login`}
              onCopy={() => {
                this.setState({ copied: true, currentIndex: index });
                setTimeout(() => {
                  this.setState({ copied: false, currentIndex: "" });
                }, 800);
              }}
            >
              <span
                className="btn btn-sm btn-info"
                style={{ cursor: "pointer", marginBottom: "0px" }}
              >
                Copy to clipboard
              </span>
            </CopyToClipboard>
            {this.state.copied && this.state.currentIndex == index ? (
              <span className="text-danger ml-1">Copied</span>
            ) : (
              ""
            )}
          </td>
          <td className="text-center">{shop.address}</td>

          <td className="text-center">
            <Link
              to={{ pathname: `/stores/edit/${shop._id}` }}
              className="success p-0"
            >
              <i
                className="ft-edit-2 font-medium-3 mr-2 "
                title="Xem Thông Tin"
              ></i>
            </Link>

            {/* <Link
              to="/stores"
              onClick={() => this.onDelete(shop._id)}
              className="danger p-0"
            >
              <i className="ft-x font-medium-3 mr-2" title="Xoá Mã"></i>
            </Link>*/}
          </td>
        </tr>
      ));
    }
  };

  onDelete = (id) => {
    confirmAlert({
      title: "Xoá Mã Giảm Giá?",
      message: "Bạn có chắc chắn muốn xoá mã giảm giá này không?",
      buttons: [
        {
          label: "Có, xoá mã!",
          onClick: () => {
            this.props.deleteShop(id);
          },
        },
        {
          label: "Hủy",
          onClick: () => {},
        },
      ],
    });
  };
  onChangePage = (page) => {
    this.setState({ page: page });
  };

  render() {
    const { auth } = this.props;
    if (!auth.loading && !auth.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    const { user } = auth;

    if (user && user.systemRole === "Employee") {
      if (user && !user.sections.includes("Shops")) {
        return <Redirect to="/Error" />;
      }
    }
    return (
      <React.Fragment>
        <Loader />
        <div className="wrapper menu-collapsed">
          <Sidebar location={this.props.location}></Sidebar>
          <Header></Header>
          <div className="main-panel">
            <div className="main-content">
              <div className="content-wrapper">
                <section id="simple-table">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title">stores</h4>
                        </div>
                        <div className="card-content">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-12">
                                <Link
                                  to={{
                                    pathname: "/stores/add",
                                  }}
                                  className="btn btn-primary pull-right"
                                >
                                  <i className="fa fa-plus"></i> Add New Store
                                </Link>
                              </div>
                            </div>
                            <Alert />
                            <OCAlertsProvider />
                            {/* {this.props.coupons_total > 10 && (
                              <MPagination
                                onChangePage={this.onChangePage}
                                currentPage={this.state.page}
                                products_total={this.props.coupons_total}
                              />
                            )} */}
                            <table className="table">
                              <thead>
                                <tr>
                                  <th className="text-center">STT</th>
                                  <th className="text-center">Store Name</th>
                                  <th className="text-center">Slug</th>
                                  <th className="text-center">Address</th>
                                  <th className="text-center">Hành Động</th>
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
          <footer className="footer footer-static footer-light">
            <p className="clearfix text-muted text-sm-center px-2">
              <span>
                Quyền sở hữu của &nbsp;{" "}
                <a
                  href="https://www.sutygon.com"
                  rel="noopener noreferrer"
                  id="pixinventLink"
                  target="_blank"
                  className="text-bold-800 primary darken-2"
                >
                  SUTYGON-BOT{" "}
                </a>
                , All rights reserved.{" "}
              </span>
            </p>
          </footer>
        </div>
      </React.Fragment>
    );
  }
}

ViewShops.propTypes = {
  getAllStores: PropTypes.func.isRequired,
  deleteShop: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  shops: state.shops.shops,
  shops_total: state.shops.shops_total,
  auth: state.auth,
});
export default connect(mapStateToProps, {
  getAllStores,
  deleteShop,
})(ViewShops);
