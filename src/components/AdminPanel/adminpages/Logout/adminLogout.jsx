import React from 'react';
import './adminLogout.css';
import { signOut } from 'firebase/auth';
import { auth } from '../../../../firebase';
import { useNavigate } from 'react-router-dom';

function AdminLogout({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal-box">
        <div className="logout-modal-title">Logout</div>
        <div className="logout-modal-message">
          You are going to log out your account.<br />Are you sure?
        </div>
        <div className="logout-modal-actions">
          <button className="logout-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="logout-modal-confirm" onClick={handleLogout}>Log out</button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogout;
