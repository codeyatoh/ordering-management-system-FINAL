import React, { useState, useEffect } from 'react';
import AdminSidebar from '../admin.sidebar';
import '../adminpanel.css';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';
import { db } from '../../../firebase';
import { collection, getDocs, query, where, Timestamp, onSnapshot } from 'firebase/firestore';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Admindashboard() {
  const [filter, setFilter] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let unsubscribe;
    async function fetchOrders() {
      setLoading(true);
      let start, end;
      const now = new Date();
      if (filter === 'day') {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      } else if (filter === 'week') {
        const day = now.getDay();
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - day) + 1);
      } else if (filter === 'month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      }
      const q = query(
        collection(db, 'orders'),
        where('created_at', '>=', Timestamp.fromDate(start)),
        where('created_at', '<', Timestamp.fromDate(end))
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        setOrders(snapshot.docs.map(doc => doc.data()));
        setLoading(false);
      });
    }
    fetchOrders();
    return () => unsubscribe && unsubscribe();
  }, [filter]);

  // Aggregate sales by hour for 'day', by day for 'week', by day for 'month'
  let labels = [];
  let todayData = [];
  if (filter === 'day') {
    labels = ['10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'];
    todayData = Array(labels.length).fill(0);
    orders.forEach(order => {
      if (order.created_at && order.total_price) {
        const date = order.created_at.toDate();
        const hour = date.getHours();
        let idx = hour - 10;
        if (idx >= 0 && idx < labels.length) {
          todayData[idx] += order.total_price;
        }
      }
    });
  } else if (filter === 'week') {
    labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    todayData = Array(labels.length).fill(0);
    orders.forEach(order => {
      if (order.created_at && order.total_price) {
        const date = order.created_at.toDate();
        const day = date.getDay();
        todayData[day] += order.total_price;
      }
    });
  } else if (filter === 'month') {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    labels = Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`);
    todayData = Array(daysInMonth).fill(0);
    orders.forEach(order => {
      if (order.created_at && order.total_price) {
        const date = order.created_at.toDate();
        const day = date.getDate() - 1;
        todayData[day] += order.total_price;
      }
    });
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Sales',
        data: todayData,
        backgroundColor: '#222',
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      }
    ],
  };

  // Summary cards
  const totalSales = orders.reduce((a, b) => a + (b.total_price || 0), 0);
  const orderItemsCount = orders.reduce((sum, order) => sum + (order.total_items || 0), 0);
  const customerCount = orders.length; // 1 order = 1 customer

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 11, weight: '400' },
          color: '#666',
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `₱${context.parsed.y.toLocaleString()}`;
          },
        },
        backgroundColor: '#fff',
        titleColor: '#222',
        bodyColor: '#222',
        borderColor: '#eee',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#aaa', font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#f2f2f2' },
        ticks: {
          color: '#aaa',
          font: { size: 11 },
          callback: function(value) {
            return `₱${value / 1000}K`;
          },
        },
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="adminpanel-root">
      <AdminSidebar />
      <main className="adminpanel-main" style={{ background: '#fafbfc' }}>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: 16, alignItems: 'center' }}>
          <button onClick={() => setFilter('day')} className={filter === 'day' ? 'active' : ''} style={{ fontSize: 13, padding: '4px 14px', borderRadius: 6, border: '1px solid #eee', background: filter === 'day' ? '#f5f5f5' : '#fff', color: '#222' }}>Today</button>
          <button onClick={() => setFilter('week')} className={filter === 'week' ? 'active' : ''} style={{ fontSize: 13, padding: '4px 14px', borderRadius: 6, border: '1px solid #eee', background: filter === 'week' ? '#f5f5f5' : '#fff', color: '#222' }}>This Week</button>
          <button onClick={() => setFilter('month')} className={filter === 'month' ? 'active' : ''} style={{ fontSize: 13, padding: '4px 14px', borderRadius: 6, border: '1px solid #eee', background: filter === 'month' ? '#f5f5f5' : '#fff', color: '#222' }}>This Month</button>
          {/* Date and Time Display */}
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: '8px 16px', fontSize: 18, fontWeight: 500, color: '#222' }}>
              <FaRegCalendarAlt style={{ marginRight: 8, fontSize: 20 }} />
              {new Date(selectedDate).toLocaleDateString('en-GB')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: '8px 16px', fontSize: 18, fontWeight: 500, color: '#222' }}>
              <FaRegClock style={{ marginRight: 8, fontSize: 20 }} />
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: 18 }}>
          <div style={{ flex: 1, background: '#fff', borderRadius: 6, padding: 10, boxShadow: 'none', border: '1px solid #f2f2f2', minWidth: 0 }}>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 400 }}>Total Sales</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#222' }}>₱{totalSales.toLocaleString()}</div>
            <div style={{ color: '#4caf50', fontSize: 11, fontWeight: 400 }}>▲ +5%</div>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 6, padding: 10, boxShadow: 'none', border: '1px solid #f2f2f2', minWidth: 0 }}>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 400 }}>Order Items</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#222' }}>{orderItemsCount.toLocaleString()}</div>
            <div style={{ color: '#4caf50', fontSize: 11, fontWeight: 400 }}>▲ +5%</div>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 6, padding: 10, boxShadow: 'none', border: '1px solid #f2f2f2', minWidth: 0 }}>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 400 }}>Total Customer Count</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: '#222' }}>{customerCount.toLocaleString()}</div>
            <div style={{ color: '#4caf50', fontSize: 11, fontWeight: 400 }}>▲ +5%</div>
          </div>
        </div>
        {/* Order / Sales Bar Chart - full width */}
        <div style={{ background: '#fff', borderRadius: 6, padding: 12, border: '1px solid #f2f2f2', boxShadow: 'none', minHeight: 0, marginBottom: 0, marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 500, fontSize: 14, color: '#222' }}>Order / Sales</span>
            <div style={{ marginLeft: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#222' }}><span style={{ width: 10, height: 10, background: '#222', display: 'inline-block', borderRadius: 2 }}></span> Today</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#222' }}><span style={{ width: 10, height: 10, background: '#ff9800', display: 'inline-block', borderRadius: 2 }}></span> Yesterday</span>
            </div>
          </div>
          <div style={{ height: 260, width: '100%' }}>
            <Bar data={data} options={options} />
          </div>
        </div>
        {/* Top Products Today and Pie Chart in one row below chart */}
        {/* Removed Top Products and Pie Chart section as requested */}
      </main>
    </div>
  );
}

export default Admindashboard; 