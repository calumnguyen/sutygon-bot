import React from "react";

export default function Status({ title, total, remain, reservedStatus }) {
  return (
    <div className="row m-auto">
      <div className={`ml-md-auto rounded shadow-status-1 col-md-4 col-12 px-0  badge ${reservedStatus?reservedStatus:title}`}>
        <div className="pt-1 h4 mb-0 font-weight-400" style={{color:'#253857'}}>{reservedStatus?reservedStatus:title}</div>
      </div>
      <div className="mr-md-auto col-12 col-md-5 rounded bg-no">
        <div className="text-capitalize">{reservedStatus?title:<p></p>}</div>
        <span className="ml-1"> {total}</span>
         <span className="ml-3 mr-3"> {remain}</span>
        {/* <div className="shadow-status-1 row m-auto">
      <span className="col-5 px-0 ml-auto">

        <div className="text-right"> Pickup</div>
        <div className="ml-1"> {total}</div>
      </span>
      <span className="col px-0">
        <div className="text-left pl-2px">today</div>
        <div className="mr-3"> {remain}</div>
      </span>

        </div> */}
      </div>
    </div>
  );
}
