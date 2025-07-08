import React from 'react';
import './adminModal.css';

function RemoveCrewModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ maxWidth: 420 }}>
        <h2 className="admin-modal-title">Remove</h2>
        <div className="admin-modal-message" style={{ textAlign: 'center', margin: '32px 0', fontWeight: 600, fontSize: '1.2rem', color: '#fff' }}>
          Are you sure you want to<br />remove this crew account?
        </div>
        <div className="admin-modal-actions">
          <button type="button" className="admin-modal-cancel-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="admin-modal-update-btn" onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
}

export default RemoveCrewModal;
