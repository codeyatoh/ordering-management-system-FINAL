import React, { useState, useContext } from 'react';
import { TbLogout } from 'react-icons/tb';
import logo from '../../assets/images/logo.png';
import LogoutModal from '../Modal/LogoutModal';
import { handleLogoutOpen, handleLogoutClose, handleLogoutConfirm } from '../../handlers/modalHandlers';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

function Header() {
  // State to show or hide the logout modal
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const { logoutCrew, userType } = useContext(UserContext);

  // Handler functions for opening, closing, and confirming logout
  const openLogout = handleLogoutOpen(setShowLogout);
  const closeLogout = handleLogoutClose(setShowLogout);
  const confirmLogout = handleLogoutConfirm(setShowLogout, () => {
    // Properly logout based on user type
    if (userType === 'crew' && logoutCrew) {
      logoutCrew();
    }
    toast.success('Logged out successfully!');
    navigate('/');
  });

  return (
    // The top header bar of the app
    <header className="header">
      <div className="header-flex">
        {/* Logo on the left */}
        <img src={logo} alt="Logo" className="header-logo" />
        {/* Instructions in the center */}
        <div className="header-center">
          <div className="instructions-box">Instructions:</div>
          <div className="header-guide">Select a category,<br />add items to your order, and review your list on the right</div>
        </div>
        {/* Logout button on the right */}
        <button className="logout-icon-btn" onClick={openLogout}>
          <TbLogout className="logout-icon" />
        </button>
      </div>
      {/* Modal that pops up when you click logout */}
      <LogoutModal isOpen={showLogout} onClose={closeLogout} onLogout={confirmLogout} />
    </header>
  );
}

export default Header; 