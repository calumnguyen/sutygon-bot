import React from "react";
import moment from "moment";
import JsBarcode from "jsbarcode";
import { createCanvas } from "canvas";
import Barcode from "react-barcode";

const parseOrderStatus = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "Chưa sẵn sàng";
    case "active":
      return "Đã lấy hàng";
    case "Completed":
      return "Hoàn tất";
    case "overdue":
      return "Trễ hàng";
    case "lost":
      return "Mất";
    case "ready for pickup":
      return "Sẵn sàng";

    default:
      return "";
  }
};

function ReceiptUI({
  paidAmount = 0,
  orderNumber,
  rentDateFrom,
  rentDateTo,
  leaveId,
  insuranceAmount,
  totalAmount,
  product_Array,
  totalWithoutTax,
  taxAmount,
  customerName,
  username,
  orderBarcode,
  refundAmount,
  orderStatus,
}) {
  const renderItem = (item, index) => {
    return (
      <tr key={index}>
        <td style={styles.productDescCell}>{item.title}</td>
        <td style={styles.productDescCell}>{item.color}</td>
        <td style={styles.productDescCell}>{item.barcode}</td>
        <td style={styles.productDescCell}>{item.orderQty || 1}</td>
        <td style={styles.productDescCell}>{item.price}</td>
      </tr>
    );
  };

  console.log(totalAmount, paidAmount);

  return (
    <>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <colgroup>
          <col span="1" style={{ width: "40%" }} />
        </colgroup>
        <tbody>
          <tr>
            <th style={styles.cellBorders}>
              <div
                style={{
                  height: "100px",
                  width: "100px",
                  margin: "25px auto",
                  backgroundColor: "#fa0095",
                }}
              >
                **logo**
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
                MSHĐ: {orderNumber || ""}
              </div>
              <div style={{ padding: "5px 0" }}>
                Trạng thái: {parseOrderStatus(orderStatus)}
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
                KHÁCH HÀNG: {customerName}
              </div>
              <div style={{ fontWeight: "500", padding: "5px 0" }}>
                NGÀY THUÊ:{" "}
                {`${moment(rentDateFrom).format("DD-MM-YYYY")} - ${moment(
                  rentDateTo
                ).format("DD-MM-YYYY")}`}
              </div>
              <div
                style={{
                  fontWeight: "500",
                  padding: "5px 0",
                  color: "#fa0095",
                }}
              >
                {leaveId ? "Khách hàng để lại CMND/BLX" : "Không cọc CMND/BLX"}
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
          {product_Array?.map(renderItem)}
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
                  Tổng giá trị (không cọc)
                </div>
                <div style={{ margin: "auto 0" }}>
                  {totalWithoutTax + taxAmount}
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
                <div style={{ marginRight: "10px" }}>Tiền cọc</div>
                <div style={{ margin: "auto 0" }}>{insuranceAmount}</div>
              </div>
              <div
                style={{
                  padding: "5px 0",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ marginRight: "10px" }}>Đã trả</div>
                <div style={{ margin: "auto 0" }}>{paidAmount}</div>
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
                <div style={{ margin: "auto 0" }}>
                  {refundAmount
                    ? refundAmount < 0
                      ? -refundAmount
                      : 0
                    : parseInt(totalAmount) - parseInt(paidAmount)}
                </div>
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
                  <div>Đã Hoàn tiền{/** todo: Refund amount */}</div>
                  <div>{refundAmount > 0 ? refundAmount : 0}</div>
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
                  <Barcode value={orderBarcode} width={1} height={50} />
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
