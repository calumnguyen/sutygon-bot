import React, { useState } from "react";
import OrderCard from "./OrderCard";
import SearchFilterOption from "./small/SearchFilterOption";

const filtersList = [
  {
    name: "Lấy Hàng Hôm Nay",
    value: "pickup",
    backgroundColorFrom: "#348F50",
    backgroundColorTo: "#56b4d3",
  },
  {
    name: "Trả Hàng Hôm Nay",
    value: "return",
    backgroundColorFrom: "#FEAC5E",
    backgroundColorTo: "#C779D0",
  },
  {
    name: "Có Yêu Cầu",
    value: "alteration",
    backgroundColorFrom: "#6441A5",
    backgroundColorTo: "#2a0845",
  },
  {
    name: "Đang Xử Lý",
    value: "pending",
    backgroundColorFrom: "#4ca1af",
    backgroundColorTo: "#c4e0e5",
  },
  {
    name: "Sẵn Sàng Để Lấy",
    value: "ready",
    backgroundColorFrom: "#136a8a",
    backgroundColorTo: "#267871",
  },
  {
    name: "Đang Sử Dụng",
    value: "active",
    backgroundColorFrom: "#3a7bd5",
    backgroundColorTo: "#3a6073",
  },
  {
    name: "Hoàn Tất",
    value: "completed",
    backgroundColorFrom: "#b24592",
    backgroundColorTo: "#f15f79",
  },
  {
    name: "Trễ Hẹn Trả Đồ",
    value: "overdue",
    backgroundColorFrom: "#ff5f6d",
    backgroundColorTo: "#ffc371",
  },
  {
    name: "Mất",
    value: "lost",
    backgroundColorFrom: "#603813",
    backgroundColorTo: "#b29f94",
  },
  {
    name: "Hủy Đồ",
    value: "cancelled",
    backgroundColorFrom: "#e96443",
    backgroundColorTo: "#904e95",
  },
];

function OrdersList({ rentproducts }) {
  let list = rentproducts;

  /** Filters */
  const [textQuery, setTextQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState([]);

  if (textQuery) {
    list = list?.filter(
      (item) =>
        item.orderNumber?.includes(textQuery) ||
        item.customer?.name?.toLowerCase().includes(textQuery.toLowerCase()) ||
        item.customer?.contactnumber.includes(textQuery)
    );
  }

  if (statusFilters.length) {
    list = list?.filter((item) => statusFilters.includes(item.status));
  }

  return (
    <>
      <input
        type="text"
        value={textQuery}
        onChange={(e) => setTextQuery(e.target.value)}
        className="form-control"
        style={{ backgroundColor: "white" }}
      />
      <div className="row">
        {filtersList.map((filter, index) => (
          <SearchFilterOption
            filters={statusFilters}
            setFilters={setStatusFilters}
            key={index}
            filterDisplayName={filter.name}
            filterValue={filter.value}
            filterBGColorFrom={filter.backgroundColorFrom}
            filterBGColorTo={filter.backgroundColorTo}
          />
        ))}
      </div>
      {list?.length ? (
        <div className="row">
          {list.map((item, index) => (
            <OrderCard key={item.id} key={index} index={index} item={item} />
          ))}
        </div>
      ) : (
        <div>Chưa có đơn hàng nào</div>
      )}
    </>
  );
}

export default OrdersList;
