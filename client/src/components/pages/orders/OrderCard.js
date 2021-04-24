import moment from "moment";
import React, { useState } from "react";
import { CallOutline, PersonOutline } from "react-ionicons";
import { Link } from "react-router-dom";
import Util from "../../../utils";

const isToday = (someDate) => {
  return moment(someDate).isSame(Date.now(), "day");
};

function OrderCard({ item, index }) {
  const totalNotes = item.total_notes ? item.total_notes : 0;
  const incompleteNotes = item.notes
    ? item.notes.filter((i) => i.done == false && i.alter_request == true)
        .length
    : 0;

  let orderStatus = Util.parseOrderStatus(item.status);

  const cardColor = Util.getCardColor(item.status);

  return (
    // <div className="col-md-5 col-sm-12 col-lg-5 mb-3">
    <div
      className="mx-sm-0"
      style={{
        paddingLeft: 50,
        paddingBottom: 30,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          ...styles.cardContainer,
          backgroundImage: `linear-gradient(to bottom right, ${cardColor.from}, ${cardColor.to})`,
        }}
      >
        <Link
          to={{ pathname: `/orders/vieworder/${item._id}` }}
          className="success p-0"
        >
          <p style={styles.order_number}>{item.orderNumber}</p>
        </Link>
        <div style={styles.inner_container}>
          <div style={styles.contact_block}>
            <PersonOutline
              color={"#301F7E"}
              title="person"
              height="35px"
              width="35px"
            />
            <div style={styles.contact_text}>{item.customer.name}</div>
          </div>
          <div style={styles.contact_block}>
            <CallOutline
              color={"#301F7E"}
              title="call"
              height="35px"
              width="35px"
            />
            <div style={styles.contact_text}>{item.customer.contactnumber}</div>
          </div>
          <div style={{ ...styles.contact_block, justifyContent: "center" }}>
            <div style={styles.order_status}>{orderStatus}</div>
          </div>
        </div>
        <div style={{ margin: "20px 0px" }}>
          <div style={styles.bottom_area}>
            <div style={styles.circled_text}>{totalNotes}</div>
            Ghi Chu
            <div style={styles.divider} />
            <div style={styles.circled_text}>{incompleteNotes}</div>
            Yeu Cau
          </div>
        </div>
        {isToday(item?.rentDate) &&
          item.status?.toLowerCase() !== "completed" && (
            <div style={styles.bottom_warning_label}>Lay Do Hom Nay</div>
          )}
      </div>
    </div>
  );
}

const styles = {
  cardContainer: {
    position: "relative",
    height: "320px",
    width: "220px",
    borderRadius: 25,
    padding: "10px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  order_number: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
    marginTop: "10px",
    cursor: "pointer",
  },
  inner_container: {
    flex: 1,
    border: "8px solid white",
    borderRadius: 25,
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "column",
  },
  contact_block: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "5px",
  },
  contact_text: {
    color: "white",
    marginLeft: "5px",
  },
  circled_text: {
    height: "30px",
    width: "30px",
    borderRadius: "15px",
    backgroundColor: "rgba(255,255,255, 0.5)",
    lineHeight: "15px",
    WebkitTextStroke: "0.5px #301F7E",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "5px",
    fontSize: "20px",
  },
  bottom_area: {
    fontSize: 12,
    color: "white",
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  divider: {
    height: "30px",
    width: "2px",
    border: "1.5px solid white",
    borderRadius: "2px",
    margin: "0px 10px",
  },
  order_status: {
    padding: "10px",
    backgroundColor: "white",
    minWidth: "150px",
    textAlign: "center",
    color: "#4CA1AF",
    fontSize: "1rem",
    fontWeight: "bold",
    borderRadius: "10px",
  },
  bottom_warning_label: {
    position: "absolute",
    bottom: -15,
    left: "50%",
    width: "160px",
    marginLeft: "-80px",
    zIndex: 2,
    textAlign: "center",
    borderRadius: "10px",
    padding: "8px 0px",
    fontWeight: "bold",
    color: "white",
    backgroundImage: "linear-gradient(to right, #C65D94, #E07C96)",
  },
};

export default OrderCard;
