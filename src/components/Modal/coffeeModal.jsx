import React, { useState, useEffect } from 'react';
import styles from './OrderModal.module.css';
import { handleQuantityChange, handleAddOrder } from '../../handlers/modalHandlers';

function CoffeeModal({ isOpen, onClose, item, quantities, onAddOrder, onCancelOrder }) {
  if (!isOpen || !item) return null;

  const sizeOptions = [
    { label: 'Regular', value: 'regular', addOn: 0 },
    { label: 'Medium', value: 'medium', addOn: 10 },
    { label: 'Large', value: 'large', addOn: 20 },
  ];

  // Track quantity for each size, initialize from prop
  const [localQuantities, setLocalQuantities] = useState(quantities || { regular: 1, medium: 0, large: 0 });

  useEffect(() => {
    setLocalQuantities(quantities || { regular: 1, medium: 0, large: 0 });
  }, [quantities, item]);

  // Handler imports
  const quantityChange = handleQuantityChange(setLocalQuantities);
  const addOrder = handleAddOrder(onAddOrder, item, localQuantities, onClose);

  // Calculate total cost for all selected sizes
  const totalCost = sizeOptions.reduce(
    (sum, opt) => sum + (item.price + opt.addOn) * (localQuantities[opt.value] || 0),
    0
  );

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-box']}>
        <div className={styles['modal-header']}>
          <div className={styles['coffee-modal-header-content']}>
            <img src={item.Imageurl || item.image} alt={item.name} className={styles['coffee-modal-img']} />
            <div className={styles['coffee-modal-info']}>
              <div className={styles['coffee-modal-title']}>{item.name}</div>
              <div className={styles['coffee-modal-price']}>
                ₱{item.price.toFixed(2)} <span style={{ fontWeight: 400 }}>/ Each</span>
              </div>
              <div className={styles['coffee-modal-total']}>Total Cost: ₱{totalCost}</div>
            </div>
          </div>
          <button className={styles['modal-close-btn']} onClick={onClose}>&times;</button>
        </div>
        <div className={styles['modal-content']} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className={styles['coffee-modal-quantity-label']}>Quantity</div>
          <div className={styles['coffee-modal-size-options']} style={{ width: '100%', justifyContent: 'center' }}>
            {sizeOptions.map(opt => (
              <div key={opt.value} className={styles['coffee-modal-size-option']} style={{ minWidth: 90, margin: '0 10px' }}>
                <div className={styles['coffee-modal-size-label-row']}>
                  <span>{opt.label}</span>
                  {opt.addOn > 0 && <span className={styles['coffee-modal-size-addon']}>+{opt.addOn} peso</span>}
                </div>
                <div className={styles['coffee-modal-quantity-controls']} style={{ marginTop: 6 }}>
                  <button className={styles['icon-btn']} onClick={() => quantityChange(opt.value, -1)} disabled={localQuantities[opt.value] <= 0}>&minus;</button>
                  <span className={styles['coffee-modal-quantity-value']}>{localQuantities[opt.value]}</span>
                  <button className={styles['icon-btn']} onClick={() => quantityChange(opt.value, 1)}>&#43;</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles['coffee-modal-footer']}>
          <button className={styles['coffee-modal-cancel-btn']} onClick={onCancelOrder}>Cancel Order</button>
          <button className={styles['coffee-modal-add-btn']} onClick={addOrder}>Add Order</button>
        </div>
      </div>
    </div>
  );
}

export default CoffeeModal;
