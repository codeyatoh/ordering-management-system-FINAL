import React from 'react';
import styles from '../../Modal/OrderModal.module.css';

function OrderViewModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  // Format order type
  const orderTypeLabel = order.order_type === 'dine-in' ? 'Dine-in' : order.order_type === 'take-out' ? 'Take-out' : (order.order_type || 'N/A');

  // Format crew name
  const crewName = (order.first_name && order.last_name)
    ? `${order.first_name} ${order.last_name}`
    : order.crew_name || order.crew_fullname || order.crew_first_name || order.first_name || '';

  // Format items
  const items = order.order_items || order.items || [];

  // Format date
  let dateStr = '';
  if (order.created_at) {
    if (order.created_at.seconds) {
      dateStr = new Date(order.created_at.seconds * 1000).toLocaleString();
    } else if (typeof order.created_at === 'string') {
      dateStr = new Date(order.created_at).toLocaleString();
    }
  }

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-box']} style={{ maxWidth: 600, minHeight: 350, color: '#fff' }}>
        <div className={styles['modal-header']}>
          <div style={{ fontWeight: 700, fontSize: '1.3rem' }}>View</div>
        </div>
        <div className={styles['modal-content']} style={{ alignItems: 'flex-start', color: '#fff', fontSize: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>
            Order #{order.order_id ? String(order.order_id).padStart(3, '0') : ''}
          </div>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontWeight: 500 }}>Date:</span> {dateStr}
          </div>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontWeight: 500 }}>Order Type:</span> {orderTypeLabel}
          </div>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontWeight: 500 }}>Crew:</span> {crewName}
          </div>
          <div style={{ margin: '12px 0 4px 0', fontWeight: 500 }}>Items:</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {items.length === 0 ? (
              <li>No items found.</li>
            ) : (
              items.map((item, idx) => (
                <li key={idx}>
                  {item.name || item.item_name} x{item.quantity} (₱{item.price ? (item.price * (item.quantity || 1)).toFixed(2) : '0.00'})
                </li>
              ))
            )}
          </ul>
          <div style={{ marginTop: 12 }}>
            <div>Total Items: <b>{order.total_items || order.Total_items || items.length}</b></div>
            <div>Total Price: <b>₱{order.total_price || 0}</b></div>
            <div>Order Status: <b>{order.order_status || ''}</b></div>
          </div>
        </div>
        <div className={styles['coffee-modal-footer']} style={{ justifyContent: 'center' }}>
          <button className={styles['coffee-modal-cancel-btn']} onClick={onClose} style={{ minWidth: 90, height: 36, fontSize: 15, padding: '0.3rem 1.2rem' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default OrderViewModal; 