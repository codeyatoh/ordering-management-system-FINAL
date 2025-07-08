import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../admin.sidebar';
import '../../adminpanel.css';
import './adminpayment.css';
import { db } from '../../../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaSearch, FaFilter } from 'react-icons/fa';

function AdminPayment() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      const querySnapshot = await getDocs(collection(db, 'payments'));
      const paymentData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPayments(paymentData);
    };
    fetchPayments();
  }, []);

  // Filtered payments by search (Order ID or Payment ID)
  const filteredPayments = payments.filter(payment => {
    const paymentId = String(payment.payment_id || '').toLowerCase();
    const orderId = String(payment.order_id || '').toLowerCase();
    return (
      paymentId.includes(search.toLowerCase()) ||
      orderId.includes(search.toLowerCase())
    );
  });

  return (
    <div className="adminpanel-root">
      <AdminSidebar />
      <main className="adminpanel-main">
        <div className="payment-header-row">
          <h2 className="payment-title">Payment Management</h2>
        </div>
        <div className="payment-actions-row">
          <div className="payment-search-container">
            <div className="payment-search-input-wrapper">
              <FaSearch className="payment-search-icon" />
              <input
                className="payment-search-input"
                type="text"
                placeholder="Search by Order ID or Payment ID"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="payment-search-filter-btn">
              <FaFilter />
            </button>
          </div>
        </div>
        <div className="payment-table-container">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Amount Paid</th>
                <th>Change Given</th>
                <th>Payment Status</th>
                <th>Paid At</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No payments found.</td></tr>
              ) : (
                filteredPayments.map(payment => (
                  <tr key={payment.id}>
                    <td>{payment.payment_id ? String(payment.payment_id).padStart(5, '0') : ''}</td>
                    <td>{payment.order_id ? String(payment.order_id).padStart(5, '0') : ''}</td>
                    <td>₱{payment.amount_paid || 0}</td>
                    <td>₱{payment.change_given || 0}</td>
                    <td>{payment.status || ''}</td>
                    <td><b>{payment.paid_at ? new Date(payment.paid_at.seconds * 1000).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' — ' + new Date(payment.paid_at.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</b></td>
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

export default AdminPayment; 