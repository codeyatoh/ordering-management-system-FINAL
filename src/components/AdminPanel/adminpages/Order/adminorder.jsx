import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../admin.sidebar';
import '../../adminpanel.css';
import './adminorder.css';
import { db } from "../../../../config/firebase";
import { collection, onSnapshot } from 'firebase/firestore';
import { FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import OrderViewModal from '../../adminmodal/orderViewModal';

function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 20;
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isDateFiltered, setIsDateFiltered] = useState(false);
  const [rangeType, setRangeType] = useState('today');
  const [filterSummary, setFilterSummary] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (querySnapshot) => {
      const orderData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Fetched orders:', orderData);
      setOrders(orderData);
    });
    return () => unsubscribe();
  }, []);

  // Helper to get date range based on selection
  const getPresetRange = (type) => {
    const today = new Date();
    let start, end;
    switch (type) {
      case 'today':
        start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        end = new Date(start);
        break;
      case 'yesterday':
        start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
        end = new Date(start);
        break;
      case 'last7':
        end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
        break;
      case 'last30':
        end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        start = '';
        end = '';
    }
    return { start, end };
  };

  // Helper to check if order is within date range
  const isWithinDateRange = (order) => {
    if (!isDateFiltered) return true;
    let start, end;
    if (rangeType === 'custom') {
      if (!dateRange.start || !dateRange.end) return true;
      start = new Date(dateRange.start);
      end = new Date(dateRange.end);
    } else {
      const preset = getPresetRange(rangeType);
      if (!preset.start || !preset.end) return true;
      start = preset.start;
      end = preset.end;
    }
    if (!order.created_at) return false;
    let orderDate;
    if (order.created_at.seconds) {
      orderDate = new Date(order.created_at.seconds * 1000);
    } else if (typeof order.created_at === 'string') {
      orderDate = new Date(order.created_at);
    } else {
      return false;
    }
    // Set end to end of day
    end.setHours(23,59,59,999);
    return orderDate >= start && orderDate <= end;
  };

  // Filtered orders by search (Order ID or Payment ID) and date range
  const filteredOrders = orders.filter(order => {
    const orderId = String(order.order_id || '').toLowerCase();
    const paymentId = String(order.payment_id || '').toLowerCase();
    const matchesSearch =
      orderId.includes(search.toLowerCase()) ||
      paymentId.includes(search.toLowerCase());
    return matchesSearch && isWithinDateRange(order);
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="adminpanel-root">
      <AdminSidebar />
      <main className="adminpanel-main">
        <div className="order-header-row">
          <h2 className="order-title">Orders Management</h2>
        </div>
        {/* Custom Range and Search Bar in one row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '8px 0 16px 0', gap: 12, flexWrap: 'wrap' }}>
          {/* Left: Date Filter and Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
            <label style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>Date Filter:</label>
            <select
              value={rangeType}
              onChange={e => {
                setRangeType(e.target.value);
                if (e.target.value !== 'custom') {
                  setDateRange({ start: '', end: '' });
                }
              }}
              style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc' }}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>
            {rangeType === 'custom' && (
              <>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={e => setDateRange(r => ({ ...r, start: e.target.value }))}
                  style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc' }}
                />
                <span>to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={e => setDateRange(r => ({ ...r, end: e.target.value }))}
                  style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc' }}
                />
              </>
            )}
            <button
              className="order-search-filter-btn"
              onClick={() => {
                setIsDateFiltered(true);
                let summary = '';
                switch (rangeType) {
                  case 'today': summary = 'Today'; break;
                  case 'yesterday': summary = 'Yesterday'; break;
                  case 'last7': summary = 'Last 7 Days'; break;
                  case 'last30': summary = 'Last 30 Days'; break;
                  case 'thisMonth': summary = 'This Month'; break;
                  case 'lastMonth': summary = 'Last Month'; break;
                  case 'custom':
                    if (dateRange.start && dateRange.end) {
                      summary = `Custom: ${dateRange.start} to ${dateRange.end}`;
                    } else {
                      summary = 'Custom Range';
                    }
                    break;
                  default: summary = '';
                }
                setFilterSummary(summary ? `Showing orders for: ${summary}` : '');
              }}
              disabled={rangeType === 'custom' && (!dateRange.start || !dateRange.end)}
              style={{ minWidth: 80 }}
            >
              <FaFilter style={{ marginRight: 4 }} /> Filter
            </button>
            {isDateFiltered && (
              <button
                className="order-search-filter-btn"
                onClick={() => {
                  setIsDateFiltered(false);
                  setDateRange({ start: '', end: '' });
                  setRangeType('today');
                  setFilterSummary('');
                }}
                style={{ minWidth: 80, background: '#eee', color: '#22332B' }}
              >
                Clear
              </button>
            )}
            {/* Search Bar */}
            <div className="order-search-container" style={{ minWidth: 180, maxWidth: 260, flex: 1 }}>
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
            </div>
          </div>
          {/* Right: Send button only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              className="order-search-filter-btn"
              style={{ background: '#2d6a4f', color: '#fff', fontWeight: 500, padding: '5px 14px', borderRadius: 4, fontSize: 14, minWidth: 0, border: 'none' }}
              onClick={() => { /* To be implemented */ }}
            >
              Send to Exec
            </button>
          </div>
        </div>
        {/* Filter summary between filter row and table */}
        {isDateFiltered && filterSummary && (
          <div
            style={{
              margin: '0 0 10px 0',
              fontWeight: 500,
              color: '#DCD7C9',
              background: '#22332B',
              borderRadius: 6,
              padding: '7px 18px',
              display: 'inline-block',
              textAlign: 'left',
              minWidth: 0,
              maxWidth: '100%',
            }}
          >
            {filterSummary}
          </div>
        )}
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
              {paginatedOrders.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center' }}>No orders found.</td></tr>
              ) : (
                paginatedOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.order_id ? String(order.order_id).padStart(4, '0') : ''}</td>
                    <td>{order.crew_id ? String(order.crew_id).padStart(4, '0') : ''}</td>
                    <td>{order.total_items || order.Total_items || 0}</td>
                    <td>₱{order.total_price || 0}</td>
                    <td>{order.order_status || ''}</td>
                    <td>{order.created_at ? new Date(order.created_at.seconds * 1000).toLocaleString() : ''}</td>
                    <td>
                      <button className="order-action-btn" onClick={() => { setSelectedOrder(order); setViewModalOpen(true); }}><FaEye /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 16, gap: 12 }}>
            <button
              className="order-search-filter-btn"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              Prev
            </button>
            <span style={{ fontWeight: 600, color: '#22332B' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="order-search-filter-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        )}
        {/* Order View Modal */}
        <OrderViewModal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} order={selectedOrder} />
      </main>
    </div>
  );
}

export default AdminOrder;
