import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaUtensils, FaClipboardList, FaMoneyCheckAlt, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/images/logo.png';
import './adminpanel.css';
import AdminLogout from './adminpages/Logout/adminLogout';

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutOpen, setLogoutOpen] = useState(false);
  return (
    <aside className="adminpanel-sidebar">
      <img src={logo} alt="Logo" className="adminpanel-logo" />
      <div className="adminpanel-title">Admin Panel</div>
      <nav className="adminpanel-nav">
        <button className={`adminpanel-nav-btn${location.pathname === '/admin' ? ' active' : ''}`} onClick={() => navigate('/admin')}><FaTachometerAlt className="adminpanel-nav-icon" /> Dashboard</button>
        <button className={`adminpanel-nav-btn${location.pathname === '/admin/crew' ? ' active' : ''}`} onClick={() => navigate('/admin/crew')}><FaUsers className="adminpanel-nav-icon" /> Crew</button>
        <button className={`adminpanel-nav-btn${location.pathname === '/admin/menu' ? ' active' : ''}`} onClick={() => navigate('/admin/menu')}><FaUtensils className="adminpanel-nav-icon" /> Menu</button>
        <button className={`adminpanel-nav-btn${location.pathname === '/admin/orders' ? ' active' : ''}`} onClick={() => navigate('/admin/orders')}><FaClipboardList className="adminpanel-nav-icon" /> Orders</button>
        <button className={`adminpanel-nav-btn${location.pathname === '/admin/payments' ? ' active' : ''}`} onClick={() => navigate('/admin/payments')}><FaMoneyCheckAlt className="adminpanel-nav-icon" /> Payments</button>
        <button className="adminpanel-nav-btn logout" onClick={() => setLogoutOpen(true)}><FaSignOutAlt className="adminpanel-nav-icon" /> Logout</button>
      </nav>
      <AdminLogout isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </aside>
  );
}

export default AdminSidebar;
