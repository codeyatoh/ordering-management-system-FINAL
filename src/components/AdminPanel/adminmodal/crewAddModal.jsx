import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './adminModal.css';

function CrewAddModal({ isOpen, onClose, onAdd }) {
  const [showPassword, setShowPassword] = useState(false);
  if (!isOpen) return null;
  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <h2 className="admin-modal-title">Add Crew</h2>
        <form className="admin-modal-form">
          <div className="admin-modal-form-row">
            <div className="admin-modal-form-group">
              <label>First Name *</label>
              <input type="text" className="admin-modal-input" />
            </div>
            <div className="admin-modal-form-group">
              <label>Last Name *</label>
              <input type="text" className="admin-modal-input" />
            </div>
          </div>
          <div className="admin-modal-form-row">
            <div className="admin-modal-form-group">
              <label>Email *</label>
              <input type="email" className="admin-modal-input" />
            </div>
            <div className="admin-modal-form-group">
              <label>Password *</label>
              <div className="admin-modal-password-wrapper">
                <input type={showPassword ? 'text' : 'password'} className="admin-modal-input" />
                <button type="button" className="admin-modal-password-toggle" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
          <div className="admin-modal-form-row">
            <div className="admin-modal-form-group">
              <label>Status *</label>
              <select className="admin-modal-input" defaultValue="Active">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="admin-modal-form-group">
              <label>Gender *</label>
              <select className="admin-modal-input" defaultValue="Male">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div className="admin-modal-actions">
            <button type="button" className="admin-modal-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-modal-update-btn">Add Crew</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrewAddModal;
