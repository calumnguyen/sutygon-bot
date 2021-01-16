import React from "react";

export default function Status({ title, total, remain }) {
  return (
    <div className="row m-auto w-75">
      <span className={`shadow-status ml-md-auto col-md-6 col-12 px-0  badge ${title}`}>
        <div className="pt-1 h4 mb-0 font-weight-400" style={{color:'#253857'}}>{title}</div>
      </span>
      <div className="col-6 bg-no">
        <div className="shadow-status row">
      <span className="col-5 px-0 ml-auto">
        <div className="text-right"> Pickup</div>
        <div className="ml-1"> {total}</div>
      </span>
      <span className="mr-auto col-5 px-0">
        <div className="text-left pl-2px">today</div>
        <div className="mr-3"> {remain}</div>
      </span>

        </div>
      </div>
    </div>
  );
}
