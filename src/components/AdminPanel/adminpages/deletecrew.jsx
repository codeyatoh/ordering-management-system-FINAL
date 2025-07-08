import React from 'react';

function DeleteCrewModal({ isOpen, onClose, onConfirm, crew }) {
  if (!isOpen) return null;
  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <h2 className="admin-modal-title">Archive Crew</h2>
        <p>Are you sure you want to archive <b>{crew?.firstName} {crew?.lastName}</b>?</p>
        <div className="admin-modal-actions">
          <button className="admin-modal-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="admin-modal-update-btn" onClick={onConfirm}>Archive</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteCrewModal;
