import React from 'react';
import styles from './OrderModal.module.css';
import { handleSingleQuantityChange } from '../../handlers/modalHandlers';

function BreadModal({ isOpen, onClose, item, quantity, onQuantityChange, onAddOrder, onCancelOrder }) {
  if (!isOpen || !item) return null;

  const basePrice = item.price;
  const totalCost = basePrice * quantity;

  const quantityChange = handleSingleQuantityChange(onQuantityChange);

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-box']}>
        <div className={styles['modal-header']}>
          <div className={styles['coffee-modal-header-content']}>
            <img src={item.Imageurl || item.image} alt={item.name} className={styles['coffee-modal-img']} />
            <div className={styles['coffee-modal-info']}>
              <div className={styles['coffee-modal-title']}>{item.name}</div>
              <div className={styles['coffee-modal-price']}>
                ₱{basePrice.toFixed(2)} <span style={{ fontWeight: 400 }}>/ Each</span>
              </div>
              <div className={styles['coffee-modal-total']}>Total Cost: ₱{totalCost}</div>
            </div>
          </div>
          <button className={styles['modal-close-btn']} onClick={onClose}>&times;</button>
        </div>
        <div className={styles['modal-content']} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className={styles['coffee-modal-quantity-label']}>Quantity</div>
          <div className={styles['coffee-modal-quantity-controls']}>
            <button className={styles['icon-btn']} onClick={() => quantityChange(-1)} disabled={quantity <= 1}>&minus;</button>
            <span className={styles['coffee-modal-quantity-value']}>{quantity}</span>
            <button className={styles['icon-btn']} onClick={() => quantityChange(1)}>&#43;</button>
          </div>
        </div>
        <div className={styles['coffee-modal-footer']}>
          <button className={styles['coffee-modal-cancel-btn']} onClick={onCancelOrder}>Cancel Order</button>
          <button className={styles['coffee-modal-add-btn']} onClick={onAddOrder}>Add Order</button>
        </div>
      </div>
    </div>
  );
}

export default BreadModal;
