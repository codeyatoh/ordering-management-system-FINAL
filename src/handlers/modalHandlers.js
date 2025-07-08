// src/handlers/modalHandlers.js
// Handler functions for modal operations

import { useState } from 'react';

// Handles opening the remove item modal for a specific item
export const handleRemoveClick = (setItemToRemove, setShowRemove) => (item) => {
  setItemToRemove(item);
  setShowRemove(true);
};
// Handles closing the remove item modal
export const handleCancel = (setShowRemove, setItemToRemove) => () => {
  setShowRemove(false);
  setItemToRemove(null);
};
// Handles confirming the removal of an item from the cart
export const handleConfirm = (itemToRemove, onRemoveItem, setShowRemove, setItemToRemove) => () => {
  if (itemToRemove) onRemoveItem(itemToRemove);
  setShowRemove(false);
  setItemToRemove(null);
};
// Handles incrementing or decrementing the quantity for a given size (for coffee modal)
export const handleQuantityChange = (setLocalQuantities) => (size, delta) => {
  setLocalQuantities((prev) => {
    const newQty = Math.max(0, (prev[size] || 0) + delta);
    return { ...prev, [size]: newQty };
  });
};
// Handles adding or updating the coffee order when the user clicks 'Add Order' (for coffee modal)
export const handleAddOrder = (onAddOrder, item, localQuantities, onClose) => () => {
  onAddOrder(item.id, localQuantities);
  onClose();
};
// Handles incrementing or decrementing a single quantity value (for bread modal)
export const handleSingleQuantityChange = (setQuantity) => (delta) => {
  setQuantity(prev => Math.max(1, prev + delta));
};

// Custom hook for confirm modal logic (open/close/confirm)
export const useConfirmModal = (onDone) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const handleProceed = () => setShowConfirm(true);
  const handleCancel = () => setShowConfirm(false);
  const handleConfirm = () => {
    setShowConfirm(false);
    if (onDone) onDone();
  };
  return { showConfirm, handleProceed, handleCancel, handleConfirm };
};

// Handles opening the logout modal
export const handleLogoutOpen = (setShowLogout) => () => setShowLogout(true);
// Handles closing the logout modal
export const handleLogoutClose = (setShowLogout) => () => setShowLogout(false);
// Handles confirming the logout action
export const handleLogoutConfirm = (setShowLogout, onLogout) => () => {
  setShowLogout(false);
  if (onLogout) onLogout();
}; 