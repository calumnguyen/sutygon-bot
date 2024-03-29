import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { changePage } from '../../actions/pages';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListItem from './smallComponents/ListItem';
import ListCustomItem from './smallComponents/ListCustomItem';
import List from './data';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { setToggleStatus } from '../../actions/custom';

class Sidebar extends Component {
  componentDidMount() {
    this.props.changePage(this.props.location.pathname.replace('/', ''));
  }
  getClassName = (name) => {
    const { pathname } = this.props.location;
    let { active } = this.props;

    const path = pathname.split('/');
    const activepath = active.split('/');

    if (activepath[0] === path[1]) {
      active = path[1];
    }

    if (active === name) {
      return 'open';
    } else {
      return '';
    }
  };

  handleClick = (name) => {
    this.props.changePage(name);
    this.props.setToggleStatus(false);
  };
  render() {
    const { user } = this.props.auth;
    const list = List.getList(user);
    return (
      <>
        <div
          data-active-color='white'
          data-background-color='purple-bliss'
          className={`sidebar-desktop app-sidebar`}
        >
          <div className='sidebar-header'>
            <div className='logo'>
              <Link to='/dashboard'>
                <div className='text-center align-middle mt-n4 mb-n4'>
                  <img
                    alt={'Sutygon-bot'}
                    src={process.env.PUBLIC_URL + '/assets/img/logo.png'}
                    height={120}
                    width={120}
                  />
                </div>
              </Link>
            </div>
          </div>
          <div className='sidebar-content'>
            <div className='nav-container'>
              <ul
                id='main-menu-navigation'
                data-menu='menu-navigation'
                data-scroll-to-active='true'
                className='navigation navigation-main'
              >
                <ListItem
                  getClassName={this.getClassName('dashboard')}
                  url={'/dashboard'}
                  title={'Trang chủ'}
                  icon={'ft-home'}
                  handleClick={() => this.handleClick('dashboard')}
                />

                <DragDropContext
                  onDragEnd={(param) => {
                    const srcI = param.source.index;
                    const desI = param.destination?.index;
                    if (desI || desI == 0) {
                      list.splice(desI, 0, list.splice(srcI, 1)[0]);
                      List.saveList(list, user);
                    }
                  }}
                >
                  <Droppable droppableId='droppable-1'>
                    {(provided, _) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {list &&
                          list.map((item, i) => (
                            <Draggable
                              key={item.id}
                              draggableId={'draggable-' + item.id}
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
              </ul>
            </div>
          </div>
          <div className='sidebar-background'></div>
        </div>
        {/* Sidebar for mobile */}
        <div
          data-active-color='white'
          data-background-color='purple-bliss'
          data-image={process.env.PUBLIC_URL + '/assets/img/sidebar-bg/01.jpg'}
          className={`sidebar-mobiles app-sidebar ${
            this.props.toggleBarStatus ? '' : 'hide-sidebar'
          }`}
        >
          <div className='sidebar-header'>
            <div className='logo'>
              <Link to='/dashboard'>
                <div className='text-center align-middle mt-n4 mb-n4'>
                  <img
                    alt={'Sutygon-bot'}
                    src={process.env.PUBLIC_URL + '/assets/img/logo.png'}
                    height={120}
                    width={120}
                  />
                </div>
              </Link>
            </div>
          </div>
          <div className='sidebar-content'>
            <div className='nav-container'>
              <ul
                id='main-menu-navigation'
                data-menu='menu-navigation'
                data-scroll-to-active='true'
                className='navigation navigation-main'
              >
                <ListItem
                  getClassName={this.getClassName('dashboard')}
                  url={'/dashboard'}
                  title={'Trang chủ'}
                  icon={'ft-home'}
                  handleClick={() => this.handleClick('dashboard')}
                />

                <DragDropContext
                  onDragEnd={(param) => {
                    const srcI = param.source.index;
                    const desI = param.destination?.index;
                    if (desI || desI == 0) {
                      list.splice(desI, 0, list.splice(srcI, 1)[0]);
                      List.saveList(list, user);
                    }
                  }}
                >
                  <Droppable droppableId='droppable-1'>
                    {(provided, _) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {list &&
                          list.map((item, i) => (
                            <Draggable
                              key={item.id}
                              draggableId={'draggable-' + item.id}
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
              </ul>
            </div>
          </div>
          <div className='sidebar-background'></div>
        </div>
      </>
    );
  }
}

Sidebar.propTypes = {
  active: PropTypes.string,
  changePage: PropTypes.func,
  location: PropTypes.object,
  auth: PropTypes.object,
  setToggleStatus: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  active: state.pages.active,
  changePage: state.pages.changePage,
  auth: state.auth,
  toggleBarStatus: state.custom.toggleStatus,
});

export default connect(mapStateToProps, {
  changePage,
  setToggleStatus,
})(Sidebar);
