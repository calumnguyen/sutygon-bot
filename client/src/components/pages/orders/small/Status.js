import React from "react";

export default function Status({ title, total, remain }) {
  return (
    <div className="row justify">
      <div className={`d-flex rounded shadow-status-1 col-xl-5 col-sm-10 px-0 pending ${title}`}>
        <div className="m-auto h6 font-weight-400 mb-0" style={{color:'#253857'}}>{title}</div>
      </div>
      <div className="col-sm-10 px-0 col-xl-5 rounded bg-no">
        <div className="small shadow-status-1 row mx-auto">
      <span className="col px-0">
        <div className="text-right"> Pickup</div>
        <div className="ml-1"> {total}</div>
      </span>
      <span className="col px-0">
        <div className="text-left pl-2px">today</div>
        <div className="mr-3"> {remain}</div>
      </span>

        </div>
      </div>
    </div>
  );
}
