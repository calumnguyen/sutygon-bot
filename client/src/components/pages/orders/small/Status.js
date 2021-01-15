import React from "react";

export default function Status({ title, total, remain }) {
  return (
    <div className="row m-auto w-75">
      <span className={`ml-md-auto col-md-6 col-12 px-0  badge custom_badge ${title}`}  >
        <div className="pt-1 h4 mb-0 font-weight-bold" style={{color:'#fff'}}>{title}</div>
      </span>
      <span className="col-md-3 col-6 px-0 bg-no">
        <div className="text-right"> Pickup</div>
        <div className="ml-1 mt-1"> {total}</div>
      </span>
      <span className="mr-auto col-md-3 col-6 px-0 bg-no">
        <div className="text-left pl-2px">today</div>
        <div className="mt-1 mr-3"> {remain}</div>
      </span>
    </div>
  );
}
