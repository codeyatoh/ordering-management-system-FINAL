import React from 'react';
import styles from './LogoutModal.module.css';
import logo from '../../assets/images/logo.png';

function LogoutModal({ isOpen, onClose, onLogout }) {
  if (!isOpen) return null;

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-box']}>
        <div className={styles['logout-modal-content']}>
          <div className={styles['logout-title-box']}>Logout</div>
          <p className={styles['logout-modal-message']}>
            You are going to log out your account.<br />Are you sure?
          </p>
          <div className={styles['logout-modal-footer']}>
            <button className={styles['logout-modal-cancel-btn']} onClick={onClose}>Cancel</button>
            <button className={styles['logout-modal-logout-btn']} onClick={onLogout}>Log out</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal; 