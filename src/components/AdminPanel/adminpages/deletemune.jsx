import React, { useState } from 'react';
import './admincrew.css';

function DeleteMenu({ isOpen, onClose, onDelete, menuItem }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !menuItem) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await onDelete(menuItem.id);
      setLoading(false);
      onClose();
    } catch (err) {
      setError('Failed to delete menu. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <h2 className="admin-modal-title">Delete Menu</h2>
        <p>Are you sure you want to delete <b>{menuItem.name}</b>?</p>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <div className="admin-modal-actions">
          <button className="admin-modal-cancel-btn" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="admin-modal-update-btn" onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteMenu;
