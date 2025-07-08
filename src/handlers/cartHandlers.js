// src/handlers/cartHandlers.js
// Handler functions for cart operations in the CoffeeShop

import axios from "axios";

// Handles clearing the cart
export const handleCancel = (setCart) => () => setCart([]);

// Handles removing an item from the cart
export const handleRemoveItem = (cart, setCart) => (item) => {
  setCart(cart.filter(cartItem => cartItem.id !== item.id));
};

// Handles adding or updating a coffee order in the cart, and removes it if all sizes are zero
export const handleAddCoffeeOrder = (cart, setCart, coffeeItems, setIsCoffeeModalOpen) => (id, newQuantities) => {
  setCart(prevCart => {
    const idx = prevCart.findIndex(item => item.id === id);
    let updatedCart;
    if (idx !== -1) {
      // Replace quantities for this coffee
      const updated = [...prevCart];
      updated[idx] = { ...updated[idx], quantities: newQuantities };
      updatedCart = updated;
    } else {
      // Add new coffee item
      const coffee = coffeeItems.find(c => c.id === id);
      updatedCart = [...prevCart, { ...coffee, quantities: newQuantities }];
    }
    // Remove any coffee item with all quantities zero
    return updatedCart.filter(item => {
      if (item.quantities) {
        const total = Object.values(item.quantities).reduce((sum, q) => sum + q, 0);
        return total > 0;
      }
      return true;
    });
  });
  setIsCoffeeModalOpen(false);
};

// Handles adding or updating a bread order in the cart
export const handleAddBreadOrder = (cart, setCart, selectedItem, selectedQuantity, setIsBreadModalOpen) => () => {
  setCart(prevCart => {
    const idx = prevCart.findIndex(item => item.id === selectedItem.id);
    if (idx !== -1) {
      // Update existing bread item
      const updated = [...prevCart];
      updated[idx] = { ...updated[idx], quantity: selectedQuantity };
      return updated;
    } else {
      // Add new bread item
      return [...prevCart, { ...selectedItem, quantity: selectedQuantity }];
    }
  });
  setIsBreadModalOpen(false);
};

// Handles adding to cart for both coffee and bread
export const handleAddToCart = (cart, setCart, setIsCoffeeModalOpen, setSelectedItem, setSelectedQuantities) => (item) => {
  if (item.id >= 1 && item.id <= 6) {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setIsCoffeeModalOpen(true);
      setSelectedItem(existing);
      setSelectedQuantities(existing.quantities || { regular: 1, medium: 0, large: 0 });
      return;
    }
    setCart([...cart, { ...item, quantities: { regular: 1, medium: 0, large: 0 } }]);
  } else {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  }
};

// Handles opening the product modal for editing (coffee or bread)
export const handleViewProduct = (setSelectedItem, setSelectedQuantities, setIsCoffeeModalOpen, setSelectedQuantity, setIsBreadModalOpen) => (item) => {
  setSelectedItem(item);
  if (item.id <= 6) { // coffee
    setSelectedQuantities(item.quantities || { regular: 1, medium: 0, large: 0 });
    setIsCoffeeModalOpen(true);
  } else { // bread/pastry
    setSelectedQuantity(item.quantity || 1);
    setIsBreadModalOpen(true);
  }
};

async function handlePlaceOrder(orderData) {
  try {
    // 1. Save to Firebase (your existing logic)
    const firebaseOrder = await saveOrderToFirebase(orderData); // your function
    // 2. Success feedback (optional)
    alert("Order placed!");
  } catch (error) {
    console.error("Order failed:", error); 
    alert("Order failed. Please try again.");
  }
} 