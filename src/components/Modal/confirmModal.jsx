import React from 'react';
import styles from './LogoutModal.module.css';

function ConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-box']}>
        <div className={styles['logout-modal-content']}>
          <div className={styles['logout-title-box']}>Confirm Order</div>
          <p className={styles['logout-modal-message']}>
            You are about to complete the order.
          </p>
          <div className={styles['logout-modal-footer']}>
            <button className={styles['logout-modal-cancel-btn']} onClick={onClose}>Cancel</button>
            <button className={styles['logout-modal-logout-btn']} onClick={onConfirm}>Yes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
