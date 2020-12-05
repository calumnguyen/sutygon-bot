import React, { Component } from 'react'
import Modal from 'react-awesome-modal';
// import "../../../custom.css"
import BootstrapTable from 'react-bootstrap-table-next';

export default class Test extends Component {
  state = {
    visible: false
  }

  openModal = (e) => {
    e.preventDefault();
    this.setState({
      visible: true
    });
  }
  closeModal = (e) => {
    e.preventDefault();
    this.setState({
      visible: false
    });
  }
  products = [{
    id: '1',
    prodid: '400',
    price: '100'
  }, {
    id: '2',
    prodid: '300',
    price: '100'
  }, {
    id: '3',
    prodid: <button onClick={(e)=>this.helo(e)}>Hello world</button>,
    price: '100'
  },



  ];
  helo = () =>{
    alert("hello")
  }
  headerSortingClasses = (column, sortOrder, isLastSorting, colIndex) => (
    sortOrder === 'asc' ? 'demo-sorting-asc' : 'demo-sorting-desc'
  );
  columns = [{
    dataField: 'id',
    text: 'Product ID',
    sort: true,
    
  }, {
    dataField: 'prodid',
    text: 'pridyct id',
    sort: true,

  }, {
    dataField: 'price',
    text: 'Product Price',
    sort: true,
  }];

  defaultSorted = [{
    dataField: 'name',
    order: 'desc'
  }];
  render() {
    return (
      <section>
        <h1>React-Modal Examples</h1>
        <input type="button" value="Open" onClick={(e) => this.openModal(e)} />
        <BootstrapTable
          bootstrap4
          keyField="id"
          data={this.products}
          columns={this.columns}
          defaultSortDirection={this.headerSortingClasses}

        />
        <Modal visible={this.state.visible} width="400" height="300" effect="fadeInUp" onClickAway={() => this.closeModal()}>
          <div>
            <h1>Title</h1>
            <p>Some Contents</p>
            <a href="javascript:void(0);" onClick={(e) => this.closeModal(e)}>Close</a>
          </div>
        </Modal>
      </section>
    );
  }
}