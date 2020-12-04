import React, { Component } from 'react'
import Modal from 'react-awesome-modal';
// import "../../../custom.css"

export default class Test extends Component {
  state={
    visible : false
  }
  
  openModal = (e) => 
  {e.preventDefault();
  this.setState({
    visible : true
  });
  }
  closeModal = (e) => 
   {e.preventDefault();
   this.setState({
    visible : false
   });
   }
   render(){
  return (
      <section>
          <h1>React-Modal Examples</h1>
          <input type="button" value="Open" onClick={(e) => this.openModal(e)} />
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