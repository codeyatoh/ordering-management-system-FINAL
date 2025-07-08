import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../admin.sidebar';
import '../../adminpanel.css';
import './adminorder.css';
import { db } from '../../../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { FaSearch, FaFilter, FaEye } from 'react-icons/fa';

function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (querySnapshot) => {
      const orderData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(orderData);
    });
    return () => unsubscribe();
  }, []);

  // Filtered orders by search (Order ID or Payment ID)
  const filteredOrders = orders.filter(order => {
    const orderId = String(order.order_id || '').toLowerCase();
    const paymentId = String(order.payment_id || '').toLowerCase();
    return (
      orderId.includes(search.toLowerCase()) ||
      paymentId.includes(search.toLowerCase())
    );
  });

  return (
    <div className="adminpanel-root">
      <AdminSidebar />
      <main className="adminpanel-main">
        <div className="order-header-row">
          <h2 className="order-title">Orders Management</h2>
        </div>
        <div className="order-actions-row">
          <div className="order-search-container">
            <div className="order-search-input-wrapper">
              <FaSearch className="order-search-icon" />
              <input
                className="order-search-input"
                type="text"
                placeholder="Search by Order ID or Payment ID"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="order-search-filter-btn">
              <FaFilter />
            </button>
          </div>
        </div>
        <div className="order-table-container">
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Crew ID</th>
                <th>Total Items</th>
                <th>Total Price</th>
                <th>Order status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center' }}>No orders found.</td></tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.order_id ? String(order.order_id).padStart(4, '0') : ''}</td>
                    <td>{order.crew_id ? String(order.crew_id).padStart(4, '0') : ''}</td>
                    <td>{order.total_items || 0}</td>
                    <td>₱{order.total_price || 0}</td>
                    <td>{order.order_status || ''}</td>
                    <td>{order.created_at ? new Date(order.created_at.seconds * 1000).toLocaleString() : ''}</td>
                    <td><button className="order-action-btn"><FaEye /></button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminOrder;
