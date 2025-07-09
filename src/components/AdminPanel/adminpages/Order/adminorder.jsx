import React, { useEffect, useState, useRef } from 'react';
import AdminSidebar from '../../admin.sidebar';
import '../../adminpanel.css';
import './adminorder.css';
import { db } from "../../../../config/firebase";
import { collection, onSnapshot, doc, updateDoc, collection as fbCollection, getDocs } from 'firebase/firestore';
import { FaSearch, FaFilter, FaEye, FaRegCalendarAlt, FaRegClock, FaRegCalendarPlus, FaRegCalendarCheck } from 'react-icons/fa';
import OrderViewModal from '../../adminmodal/orderViewModal';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('created_desc');
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (querySnapshot) => {
      const orderData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Fetched orders:', orderData);
      setOrders(orderData);
    });
    return () => unsubscribe();
  }, []);

  // Fetch menu data on mount
  useEffect(() => {
    async function fetchMenu() {
      try {
        const menuSnapshot = await getDocs(fbCollection(db, 'menu'));
        const menuData = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMenuItems(menuData);
      } catch (err) {
        console.error('Failed to fetch menu data', err);
      }
    }
    fetchMenu();
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

  // Filtered and sorted orders by search (Order ID or Payment ID) and date range
  let filteredOrders = orders.filter(order => {
    const orderId = String(order.order_id || '').toLowerCase();
    const paymentId = String(order.payment_id || '').toLowerCase();
    const matchesSearch =
      orderId.includes(search.toLowerCase()) ||
      paymentId.includes(search.toLowerCase());
    return matchesSearch && isWithinDateRange(order);
  });

  // Sorting logic
  filteredOrders = filteredOrders.slice().sort((a, b) => {
    switch (sortBy) {
      case 'created_desc':
        return (b.created_at?.seconds || new Date(b.created_at).getTime()/1000 || 0) - (a.created_at?.seconds || new Date(a.created_at).getTime()/1000 || 0);
      case 'created_asc':
        return (a.created_at?.seconds || new Date(a.created_at).getTime()/1000 || 0) - (b.created_at?.seconds || new Date(b.created_at).getTime()/1000 || 0);
      case 'price_desc':
        return (b.total_price || 0) - (a.total_price || 0);
      case 'price_asc':
        return (a.total_price || 0) - (b.total_price || 0);
      case 'status_az':
        return String(a.order_status || '').localeCompare(String(b.order_status || ''));
      case 'status_za':
        return String(b.order_status || '').localeCompare(String(a.order_status || ''));
      default:
        return 0;
    }
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

  // Minimalist confirmation modal
  function SendToExecModal({ isOpen, onClose, onSend, filterSummary }) {
    if (!isOpen) return null;
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(34,51,43,0.35)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ background: '#22332B', color: '#DCD7C9', borderRadius: 10, minWidth: 320, maxWidth: '90vw', padding: '32px 24px 20px 24px', boxShadow: '0 2px 16px #0002', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10, textAlign: 'center' }}>
            Send order history for <span style={{ color: '#F2C879' }}>{filterSummary || 'selected range'}</span> to Executive Dashboard?
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 18 }}>
            <button onClick={onSend} style={{ background: '#2d6a4f', color: '#fff', border: 'none', borderRadius: 5, padding: '7px 22px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Yes</button>
            <button onClick={onClose} style={{ background: '#eee', color: '#22332B', border: 'none', borderRadius: 5, padding: '7px 22px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>No</button>
          </div>
        </div>
      </div>
    );
  }

  // Send filtered orders to executive dashboard backend
  const handleSendToExec = async () => {
    const ordersToSend = filteredOrders.filter(order => !order.sentToExec);
    if (ordersToSend.length === 0) {
      toast.info('No new orders to send. All filtered orders already sent.');
      setSendModalOpen(false);
      return;
    }
    let successCount = 0;
    let failCount = 0;
    for (const order of ordersToSend) {
      // Prepare the payload to send to the executive dashboard backend
      // 1. Crew info (all IDs as string)
      const crew = {
        crew_id: String(order.crew_id),
        first_name: String(order.first_name || ''),
        last_name: String(order.last_name || '')
      };
      // 2. Order info (all IDs as string)
      const orderPayload = {
        order_id: String(order.order_id),
        crew_id: String(order.crew_id),
        total_price: order.total_price,
        order_status: order.order_status,
        order_type: order.order_type,
        created_at: order.created_at && order.created_at.seconds ? new Date(order.created_at.seconds * 1000).toISOString() : order.created_at || ''
      };
      // 3. Order items (each with unique order_items_id)
      const order_items = (order.order_items || order.items || []).map((item, idx) => {
        // Try to match by Product_id, fallback to name
        let matchedMenu = null;
        if (item.Product_id) {
          matchedMenu = menuItems.find(menu => menu.Product_id === item.Product_id);
        }
        if (!matchedMenu && item.name) {
          matchedMenu = menuItems.find(menu => menu.name === item.name);
        }
        return {
          order_items_id: `${order.order_id}_${idx}`,
          order_id: String(order.order_id),
          item_name: item.name || item.item_name,
          quantity: item.quantity !== undefined ? item.quantity : 1,
          price: item.price,
          category: matchedMenu ? matchedMenu.category : ''
        };
      });

      // 4. Combine all into a single payload object
      const payload = {
        crew,
        order: orderPayload,
        order_items
      };

      try {
        // Send the payload to the backend using axios
        await axios.post('http://localhost:3030/receive-order', payload);
        // Mark as sent in Firestore
        await updateDoc(doc(db, 'orders', order.id), { sentToExec: true });
        successCount++;
      } catch (err) {
        // Check for duplicate key error (order already exists)
        if (
          err.response &&
          err.response.data &&
          typeof err.response.data === 'string' &&
          err.response.data.includes('duplicate key value violates unique constraint')
        ) {
          await updateDoc(doc(db, 'orders', order.id), { sentToExec: true });
          toast.info(`Order ${order.order_id} already exists in Executive Dashboard.`);
        } else {
          failCount++;
          console.error('Failed to send order', order.order_id, err);
        }
      }
    }
    if (successCount > 0) toast.success(`${successCount} order(s) sent to Executive Dashboard!`);
    if (failCount > 0) toast.error(`${failCount} order(s) failed to send.`);
    setSendModalOpen(false);
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
          {/* Left: Date Filter, Sort, and Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
            <span style={{ display: 'flex', alignItems: 'center', marginRight: 2, color: '#22332B' }}>
              <FaRegCalendarAlt style={{ fontSize: 18, marginRight: 4 }} />
            </span>
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
              style={{ background: 'none', border: 'none', padding: 0, minWidth: 26, minHeight: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              title="Filter"
            >
              <FaFilter style={{ fontSize: 16, color: '#22332B' }} />
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
            {/* Sort By Dropdown (compact) */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ padding: '2px 6px', borderRadius: 4, border: '1px solid #ccc', minWidth: 80, fontSize: 13, height: 28 }}
              title="Sort"
            >
              <option value="created_desc">Sort: Newest</option>
              <option value="created_asc">Sort: Oldest</option>
              <option value="price_desc">Price ⬆</option>
              <option value="price_asc">Price ⬇</option>
              <option value="status_az">Status A-Z</option>
              <option value="status_za">Status Z-A</option>
            </select>
            {/* Search Bar */}
            <div className="order-search-container" style={{ minWidth: 120, maxWidth: 180, flex: 1 }}>
              <div className="order-search-input-wrapper" style={{ fontSize: 13 }}>
                <FaSearch className="order-search-icon" style={{ fontSize: 14 }} />
                <input
                  className="order-search-input"
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ fontSize: 13, padding: '3px 7px', height: 26 }}
                />
              </div>
            </div>
          </div>
          {/* Right: Send button only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              className="order-search-filter-btn"
              onClick={() => setSendModalOpen(true)}
              style={{ background: '#2d6a4f', color: '#fff', fontWeight: 500, padding: '3px 8px', borderRadius: 4, fontSize: 13, minWidth: 0, border: 'none', display: 'flex', alignItems: 'center', gap: 4, height: 28 }}
            >
              <FaRegCalendarCheck style={{ fontSize: 15, marginRight: 2 }} />
              Send to Exec Dashboard
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
        {/* Send to Exec Modal */}
        <SendToExecModal
          isOpen={sendModalOpen}
          onClose={() => setSendModalOpen(false)}
          onSend={handleSendToExec}
          filterSummary={filterSummary || (rangeType === 'custom' && dateRange.start && dateRange.end ? `Custom: ${dateRange.start} to ${dateRange.end}` : rangeType.charAt(0).toUpperCase() + rangeType.slice(1))}
        />
      </main>
    </div>
  );
}

export default AdminOrder;
