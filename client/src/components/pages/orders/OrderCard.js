import moment from 'moment';
import React, { useState } from 'react';
import { CallOutline, PersonOutline } from 'react-ionicons';
import { Link } from 'react-router-dom';
import Util from '../../../utils';

const isToday = (someDate) => {
  return moment(someDate).isSame(Date.now(), 'day');
};

function OrderCard({ item }) {
  const totalNotes = item.total_notes ? item.total_notes : 0;
  const incompleteNotes = item.notes
    ? item.notes.filter((i) => i.done == false && i.alter_request == true)
        .length
    : 0;

  let orderStatus = Util.parseOrderStatus(item.status);

  const cardColor = Util.getCardColor(item.status);

  let warningLabel = '';

  if (
    isToday(item?.rentDate) &&
    (item.status == 'ready' || item.status == 'pending')
  )
    warningLabel = 'Lấy Đồ Hôm Nay';
  else if (isToday(item?.returnDate) && item.status == 'active')
    warningLabel = 'Trả Đồ Hôm Nay';

  return (
    <div
      className='mx-sm-0'
      style={{
        paddingLeft: 10,
        paddingRight: 30,
        paddingBottom: 30,
        margin: '0 auto',
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
          className='success p-0'
        >
          <p style={styles.order_number}>{item.orderNumber}</p>
        </Link>
        <div style={styles.inner_container}>
          <div style={styles.contact_block}>
            <PersonOutline
              color={'#1E3C72'}
              title='person'
              height='20px'
              width='20px'
            />
            <div style={styles.contact_text}>{item.customer.name}</div>
          </div>
          <div style={styles.contact_block}>
            <CallOutline
              color={'#1E3C72'}
              title='call'
              height='20px'
              width='20px'
            />
            <div style={styles.contact_text}>{item.customer.contactnumber}</div>
          </div>
          <div style={{ ...styles.contact_block, justifyContent: 'center' }}>
            <div style={styles.order_status}>{orderStatus}</div>
          </div>
        </div>
        <div style={{ margin: '20px 0px' }}>
          <div style={styles.bottom_area}>
            <div style={styles.circled_text}>{totalNotes}</div>
            ghi chú
            <div style={styles.divider} />
            <div style={styles.circled_text}>{incompleteNotes}</div>
            cần làm
          </div>
        </div>
        {(!!warningLabel || item.alteration) && (
          <div
            style={{
              position: 'absolute',
              bottom: -15,
              width: '100%',
              left: 0,
            }}
          >
            <div
              style={{
                ...styles.bottom_warning_label,
                fontSize: warningLabel.length > 15 ? '0.6rem' : '0.9rem',
                margin: '0 10px',
              }}
            >
              {item.alteration && warningLabel ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.4rem', flex: 6 }}>
                    {'Yêu Cầu Cần Xử Lý'}
                  </div>
                  <div style={{ fontSize: '0.4rem', flex: 1 }}>{' | '}</div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      flex: 6,
                      lineHeight: 1,
                    }}
                  >
                    {warningLabel}
                  </div>
                </div>
              ) : (
                warningLabel || 'Yêu Cầu Cần Xử Lý'
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  cardContainer: {
    position: 'relative',
    height: '290px',
    width: '190px',
    borderRadius: 22,
    padding: '10px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  order_number: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.8rem',
    marginTop: '10px',
    cursor: 'pointer',
  },
  inner_container: {
    flex: 1,
    border: '5px solid white',
    borderRadius: 25,
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'column',
  },
  contact_block: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: '5px',
  },
  contact_text: {
    color: 'white',
    marginLeft: '5px',
    fontSize: '0.8rem',
  },
  circled_text: {
    height: '30px',
    width: '30px',
    borderRadius: '15px',
    backgroundColor: 'rgba(255,255,255, 0.5)',
    lineHeight: '15px',
    WebkitTextStroke: '0.5px #1E3C72',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '5px',
    fontSize: '20px',
  },
  bottom_area: {
    fontSize: '0.6rem',
    color: 'white',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  divider: {
    height: '30px',
    width: '2px',
    border: '1.5px solid white',
    borderRadius: '2px',
    margin: '0px 10px',
  },
  order_status: {
    padding: '5px',
    backgroundColor: 'white',
    minWidth: '130px',
    textAlign: 'center',
    color: '#4CA1AF',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '10px',
  },
  bottom_warning_label: {
    position: 'relative',
    textAlign: 'center',
    borderRadius: '10px',
    padding: '4px',
    fontWeight: 'bold',
    color: 'white',
    backgroundImage: 'linear-gradient(to right, #C65D94, #E07C96)',
    fontSize: '0.5rem',
  },
};

export default OrderCard;
