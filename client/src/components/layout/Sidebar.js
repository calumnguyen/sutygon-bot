import React, { Component } from "react";
import { Link } from "react-router-dom";
import { changePage } from "../../actions/pages";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ListItem  from "./smallComponents/ListItem";
import ListCustomItem from "./smallComponents/ListCustomItem";
import List from "./data";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
class Sidebar extends Component {
  componentDidMount() {
    this.props.changePage(this.props.location.pathname.replace("/", ""));
  }
  getClassName = (name) => {
    const { pathname } = this.props.location;
    let { active } = this.props;

    const path = pathname.split("/");
    const activepath = active.split("/");

    if (activepath[0] === path[1]) {
      active = path[1];
    }

    if (active === name) {
      return "open";
    } else {
      return "";
    }
  };

  handleClick = (name) => {
    this.props.changePage(name);
  };
  render() {
    const { user } = this.props.auth;
    const list = List.getList(user);
    return (
      <div
        data-active-color="white"
        data-background-color="purple-bliss"
        data-image={process.env.PUBLIC_URL + "/assets/img/sidebar-bg/01.jpg"}
        className="app-sidebar"
      >
        <div className="sidebar-header">
          <div className="logo">
            <Link to="/dashboard">
              <div className="text-center align-middle mt-n4 mb-n4">
                <img
                  alt={"Sutygon-bot"}
                  src={process.env.PUBLIC_URL + "/assets/img/logo.png"}
                  height={120}
                  width={120}
                />
              </div>
            </Link>
          </div>
        </div>
        <div className="sidebar-content">
          <div className="nav-container">
            <ul
              id="main-menu-navigation"
              data-menu="menu-navigation"
              data-scroll-to-active="true"
              className="navigation navigation-main"
            >
              <ListItem
                getClassName={this.getClassName("dashboard")}
                url={"/dashboard"}
                title={"Trang chủ"}
                icon={"ft-home"}
                handleClick={() => this.handleClick("dashboard")}
              />
            
              <DragDropContext
                onDragEnd={(param) => {
                  const srcI = param.source.index;
                  const desI = param.destination?.index;
                  if (desI) {
                    list.splice(desI, 0, list.splice(srcI, 1)[0]);
                    List.saveList(list);
                  }
                }}
              >
                <Droppable droppableId="droppable-1">
                  {(provided, _) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {list && list.map((item, i) => (
                        <Draggable
                          key={item.id}
                          draggableId={"draggable-" + item.id}
                          index={i}
                        >
                          {(provided, snapshot) => (
                            <ListCustomItem
                              provided={provided}
                              snapshot={snapshot}
                              item={item}
                              getClassName={this.getClassName}
                              handleClick={this.handleClick}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              {/* {user && user.systemRole === "Admin" ? (
                <ListItem
                  getClassName={this.getClassName("user")}
                  handleClick={() => this.handleClick("user")}
                  url={"/user"}
                  title={"Nhân Viên"}
                  icon={"ft-users"}
                />
              ) : (
                ""
              )} 

               {user &&
              user.systemRole === "Employee" &&
              user.sections.includes("Inventory") ? (
                <ListItem
                  getClassName={this.getClassName("product")}
                  url={"/product"}
                  title={"Hàng Kho"}
                  icon={"ft-box"}
                  handleClick={() => this.handleClick("product")}
                />
              ) : user && user.systemRole === "Admin" ? (
                <ListItem
                  getClassName={this.getClassName("product")}
                  url={"/product"}
                  title={"Hàng Kho"}
                  icon={"ft-box"}
                  handleClick={() => this.handleClick("product")}
                />
              ) : (
                ""
              )} 
              {user &&
              user.systemRole === "Employee" &&
              user.sections.includes("barcode") ? (
                <ListItem
                  getClassName={this.getClassName("barcode")}
                  url={"/barcode"}
                  title={"Barcode"}
                  icon={"fa fa-barcode"}
                  handleClick={() => this.handleClick("barcode")}
                />
              ) : user && user.systemRole === "Admin" ? (
                <ListItem
                  getClassName={this.getClassName("barcode")}
                  url={"/barcode"}
                  title={"Barcode"}
                  icon={"fa fa-barcode"}
                  handleClick={() => this.handleClick("barcode")}
                />
              ) : (
                ""
                  )}
             
              {user &&
              user.systemRole === "Employee" &&
              user.sections.includes("Customers") ? (
                <ListItem
                  getClassName={this.getClassName("customer")}
                  url={"/customer"}
                  title={"Khách Hàng"}
                  icon={"fa fa-user"}
                  handleClick={() => this.handleClick("customer")}
                />
              ) : user && user.systemRole === "Admin" ? (
                <ListItem
                  getClassName={this.getClassName("customer")}
                  url={"/customer"}
                  title={"Khách Hàng"}
                  icon={"fa fa-user"}
                  handleClick={() => this.handleClick("customer")}
                />
              ) : (
                ""
                  )}
             
              {user &&
              user.systemRole === "Employee" &&
              user.sections.includes("Rentproduct") ? (
                <ListItem
                  getClassName={this.getClassName("rentproduct")}
                  url={"/rentproduct"}
                  title={"Thuê Đồ"}
                  icon={"icon-basket-loaded"}
                  handleClick={() => this.handleClick("rentproduct")}
                />
              ) : user && user.systemRole === "Admin" ? (
                <ListItem
                  getClassName={this.getClassName("rentproduct")}
                  url={"/rentproduct"}
                  title={"Thuê Đồ"}
                  icon={"icon-basket-loaded"}
                  handleClick={() => this.handleClick("rentproduct")}
                />
              ) : (
                ""
                  )}
              
              {user &&
              user.systemRole === "Employee" &&
              user.sections.includes("Orders") ? (
                <ListItem
                  getClassName={this.getClassName("orders")}
                  url={"/orders"}
                  title={"Đơn Hàng"}
                  icon={"icon-bag"}
                  handleClick={() => this.handleClick("orders")}
                />
              ) : user && user.systemRole === "Admin" ? (
                <ListItem
                  getClassName={this.getClassName("orders")}
                  url={"/orders"}
                  title={"Đơn Hàng"}
                  icon={"icon-bag"}
                  handleClick={() => this.handleClick("orders")}
                />
              ) : (
                ""
                  )}
               
              

              {user &&
              user.systemRole === "Employee" &&
              user.sections.includes("Appointments") ? (
                <ListItem
                  getClassName={this.getClassName("appointments")}
                  url={"/appointments"}
                  title={"Hẹn Thử Đồ"}
                  icon={"ft-activity"}
                  handleClick={() => this.handleClick("appointments")}
                />
              ) : user && user.systemRole === "Admin" ? (
                <ListItem
                  getClassName={this.getClassName("appointments")}
                  url={"/appointments"}
                  title={"Hẹn Thử Đồ"}
                  icon={"ft-activity"}
                  handleClick={() => this.handleClick("appointments")}
                />
              ) : (
                ""
                  )}
              
                
              

              {user &&
              user.systemRole === "Employee" &&
              user.sections.includes("Returnproduct") ? (
                <ListItem
                  getClassName={this.getClassName("returnproduct")}
                  url={"/returnproduct"}
                  title={"Trả Đồ"}
                  icon={"ft-activity"}
                  handleClick={() => this.handleClick("returnproduct")}
                />
              ) : user && user.systemRole === "Admin" ? (
                <ListItem
                  getClassName={this.getClassName("returnproduct")}
                  url={"/returnproduct"}
                  title={"Trả Đồ"}
                  icon={"ft-activity"}
                  handleClick={() => this.handleClick("returnproduct")}
                />
              ) : (
                ""
                  )}
              
                   
              {user &&
              user.systemRole === "Employee" &&
              user.sections.includes("Calender") ? (
                <ListItem
                  getClassName={this.getClassName("calender")}
                  url={"/calender"}
                  title={"Lịch"}
                  icon={"ft-calendar"}
                  handleClick={() => this.handleClick("calender")}
                />
              ) : user && user.systemRole === "Admin" ? (
                <ListItem
                  getClassName={this.getClassName("calender")}
                  url={"/calender"}
                  title={"Lịch"}
                  icon={"ft-calendar"}
                  handleClick={() => this.handleClick("calender")}
                />
              ) : (
                ""
                  )}
              
              {user &&
              user.systemRole === "Employee" &&
              user.sections.includes("Reports") ? (
                <ListItem
                  getClassName={this.getClassName("reports")}
                  url={"/reports"}
                  title={"Báo Cáo Thống Kê"}
                  icon={"ft-clipboard"}
                  handleClick={() => this.handleClick("reports")}
                />
              ) : user && user.systemRole === "Admin" ? (
                <ListItem
                  getClassName={this.getClassName("reports")}
                  url={"/reports"}
                  title={"Báo Cáo Thống Kê"}
                  icon={"ft-clipboard"}
                  handleClick={() => this.handleClick("reports")}
                />
              ) : (
                ""
                  )}
                */}
            </ul>
          </div>
        </div>
        <div className="sidebar-background"></div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  active: PropTypes.string,
  changePage: PropTypes.func,
  location: PropTypes.object,
  auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
  active: state.pages.active,
  changePage: state.pages.changePage,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  changePage,
})(Sidebar);
