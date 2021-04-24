import React from "react";
import moment from "moment";
import Barcode from "react-barcode";
import Util from "../utils";

const getItemsArray = (productArray, order, discountsArray, chargesArray) => {
  const itemsArray = [...productArray];

  if (order.extraDays) {
    itemsArray.push({
      title: "Extra Days",
      price: order.extraDaysAmount,
      orderQty: " ",
    });
  }

  if (order.coupon_code) {
    itemsArray.push({
      title: `Coupon code: ${order.coupon_code}`,
      price: `- ${order.discount_amount}`,
      orderQty: " ",
    });
  }

  if (discountsArray)
    discountsArray.forEach((discount) => {
      itemsArray.push({
        title: discount.name,
        price: `- ${discount.amount}`,
        orderQty: " ",
      });
    });

  if (chargesArray)
    chargesArray.forEach((charge) => {
      itemsArray.push({
        title: charge.name,
        price: `${charge.amount}`,
        orderQty: " ",
      });
    });

  itemsArray.push({
    title: `Tax: ${order.taxper}%`,
    price: order.tax,
    orderQty: " ",
  });

  return itemsArray;
};

function ReceiptUI({
  order,
  product_Array,
  username,
  refundAmount,
  previouslyPaid = 0,
  currentlyPaid = 0,
  discountsArray,
  chargesArray,
}) {
  let totalWithoutIns = 0;
  let remainingAmount = 0;

  if (refundAmount) {
    if (refundAmount < 0) remainingAmount = -refundAmount;
  } else {
    if (order?.total) remainingAmount += parseInt(order?.total);
    if (previouslyPaid) remainingAmount -= parseInt(previouslyPaid);
    if (currentlyPaid) remainingAmount -= parseInt(currentlyPaid);
  }

  if (order?.total) totalWithoutIns += parseInt(order.total);
  // if (order?.discount_amount)
  //   totalWithoutIns += parseInt(order.discount_amount);
  if (order?.insuranceAmt) totalWithoutIns -= parseInt(order.insuranceAmt);

  const renderItem = (item, index) => {
    return (
      <tr key={index}>
        <td style={styles.productDescCell}>{item.title}</td>
        <td style={styles.productDescCell}>
          {item.color
            ? `${item.color}${item.size ? `| ${item.size}` : ""}`
            : ""}
        </td>
        <td style={styles.productDescCell}>{item.barcode}</td>
        <td style={styles.productDescCell}>{item.orderQty || 1}</td>
        <td style={styles.productDescCell}>{item.price}</td>
      </tr>
    );
  };

  return (
    <>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <colgroup>
          <col span="1" style={{ width: "40%" }} />
        </colgroup>
        <tbody>
          <tr>
            <th style={styles.cellBorders}>
              <img
                style={{
                  height: "150px",
                  width: "150px",
                  margin: "auto",
                }}
                src={require("../assets/img/receipt-logo.png")}
              />
            </th>
            <th
              colSpan="4"
              style={{
                textAlign: "left",
                ...styles.cellBorders,
                padding: "0 20px",
              }}
            >
              <h1 style={{ fontWeight: "600" }}>
                HOÁ ĐƠN <br /> KHÁCH HÀNG
              </h1>
            </th>
          </tr>
          <tr>
            <th
              style={{
                textAlign: "left",
                ...styles.headingPadding,
                ...styles.cellBorders,
              }}
            >
              <div style={{ fontWeight: "500", padding: "5px 0" }}>
                MSHĐ: {order?.orderNumber || ""}
              </div>
              <div style={{ padding: "5px 0" }}>
                Trạng thái: {Util.parseOrderStatus(order?.status)}
              </div>
            </th>
            <th
              colSpan="4"
              style={{
                textAlign: "left",
                ...styles.cellBorders,
                padding: "0 20px",
              }}
            >
              <div style={{ fontWeight: "500", padding: "5px 0" }}>
                KHÁCH HÀNG: {order?.customer?.name}
              </div>
              <div style={{ fontWeight: "500", padding: "5px 0" }}>
                NGÀY THUÊ:{" "}
                {`${moment(order?.rentDate).format("DD-MM-YYYY")} - ${moment(
                  order?.returnDate
                ).format("DD-MM-YYYY")}`}
              </div>
              <div
                style={{
                  fontWeight: "500",
                  padding: "5px 0",
                  color: "#fa0095",
                }}
              >
                {order?.leaveId
                  ? "Khách hàng để lại CMND/BLX"
                  : "Không cọc CMND/BLX"}
              </div>
            </th>
          </tr>
          <tr>
            <th style={styles.cellBorders}>
              <div style={styles.itemNameHeading}>Tên giao dịch</div>
            </th>
            <th style={styles.cellBorders}>
              <div style={styles.itemNameHeading}>Màu/Size</div>
            </th>
            <th style={styles.cellBorders}>
              <div style={styles.itemNameHeading}>ID</div>
            </th>
            <th style={styles.cellBorders}>
              <div style={styles.itemNameHeading}>SL</div>
            </th>
            <th style={styles.cellBorders}>
              <div style={styles.itemNameHeading}>Giá</div>
            </th>
          </tr>
          {getItemsArray(
            product_Array,
            order,
            discountsArray,
            chargesArray
          )?.map(renderItem)}
          <tr style={{ paddingTop: "10px" }}>
            <th
              style={{
                textAlign: "left",
                ...styles.headingPadding,
                borderBottom: "1px solid #ddd",
              }}
            >
              <div
                style={{
                  padding: "5px 0",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ marginRight: "10px" }}>
                  Tổng giá trị (không cọc) -
                </div>
                <div style={{ margin: "auto 0" }}>{totalWithoutIns}</div>
              </div>
              <div
                style={{
                  padding: "5px 0",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ marginRight: "10px" }}>Tiền cọc</div>
                <div style={{ margin: "auto 0" }}>{order?.insuranceAmt}</div>
              </div>
              {/* {order?.coupon_code && (
                <>
                  <div
                    style={{
                      padding: "5px 0",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ marginRight: "10px" }}>Coupon Code:</div>
                    <div style={{ margin: "auto 0" }}>{order?.coupon_code}</div>
                  </div>
                  <div
                    style={{
                      padding: "5px 0",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ marginRight: "10px" }}>Discount Amount:</div>
                    <div style={{ margin: "auto 0" }}>
                      {order?.discount_amount}
                    </div>
                  </div>
                </>
              )} */}
              {/* {previouslyPaid ? (
                <div
                  style={{
                    padding: "5px 0",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ marginRight: "10px" }}>Previously paid</div>
                  <div style={{ margin: "auto 0" }}>{previouslyPaid}</div>
                </div>
              ) : (
                <></>
              )} */}
              <div
                style={{
                  padding: "5px 0",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ marginRight: "10px" }}>Đã trả</div>
                <div style={{ margin: "auto 0" }}>
                  {parseInt(currentlyPaid) + parseInt(previouslyPaid)}
                </div>
              </div>
              <div
                style={{
                  padding: "5px 0",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ marginRight: "10px" }}>Số tiền cần trả</div>
                <div style={{ margin: "auto 0" }}>{remainingAmount}</div>
              </div>
            </th>
            <th
              colSpan="4"
              style={{
                verticalAlign: "bottom",
                textAlign: "left",
                padding: "0 0 5px 20px",
                borderBottom: "1px solid #ddd",
              }}
            >
              {refundAmount && (
                <>
                  <div>Đã Hoàn tiền: {refundAmount > 0 ? refundAmount : 0}</div>
                </>
              )}
            </th>
          </tr>
          <tr>
            <td style={styles.cellBorders} colSpan="5">
              <div
                style={{
                  ...styles.rowDiv,
                  padding: "10px 20px",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ margin: "10px", textAlign: "center" }}>
                  <div>NGƯỜI LÀM HOÁ ĐƠN</div>
                  <div>{username || ""}</div>
                </div>
                <div style={{ margin: "10px", textAlign: "center" }}>
                  <div>Hoá đơn in:</div>
                  <div>{moment(new Date()).format("DD-MM-YYYY")}</div>
                </div>
                <div
                  style={{
                    border: "1.5px solid #fa0095",
                    margin: "10px",
                    height: "100%",
                    minWidth: "100px",
                    alignSelf: "center",
                  }}
                >
                  <Barcode value={order?.orderNumber} width={1} height={50} />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

const styles = {
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
  },
  itemName: {
    flex: 3,
    borderRight: "1.5px solid black",
    display: "flex",
    alignItems: "center",
  },
  padding30: { paddingLeft: 30 },
  itemNameText: { fontWeight: "500", padding: "5px 0" },
  itemDescText: {
    fontWeight: "500",
    padding: "5px 0",
    borderRight: "1.5px solid black",
    textAlign: "center",
  },
  itemDescHeading: {
    fontWeight: "500",
    padding: "5px 0",
    borderRight: "1.5px solid black",
    textAlign: "center",
    fontWeight: "bold",
  },
  itemNameHeading: { fontWeight: "bold", padding: "5px 0" },
  itemNameHeadingDiv: {
    flex: 3,
    borderRight: "1.5px solid black",
    display: "flex",
    alignItems: "center",
  },
  rowDiv: {
    display: "flex",
    flexDirection: "row",
  },
  dataPadding: { padding: "0 5px" },
  headingPadding: { padding: "0 20px" },
  cellBorders: {
    border: "1px solid #ddd",
  },
  productDescCell: {
    borderRight: "1px solid #ddd",
    textAlign: "center",
    padding: "10px 0",
  },
};

export default ReceiptUI;
