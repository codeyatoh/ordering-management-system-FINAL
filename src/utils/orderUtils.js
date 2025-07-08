// src/utils/orderUtils.js
// Utility functions for order summary formatting

export function getCoffeeSummary(item) {
  // Calculate total quantity and price from quantities object
  const sizeOptions = [
    { label: 'Regular', value: 'regular', addOn: 0 },
    { label: 'Medium', value: 'medium', addOn: 10 },
    { label: 'Large', value: 'large', addOn: 20 },
  ];
  let totalQty = 0;
  let totalPrice = 0;
  let sizeStrs = [];
  sizeOptions.forEach(opt => {
    const qty = item.quantities?.[opt.value] || 0;
    if (qty > 0) {
      totalQty += qty;
      totalPrice += (item.price + opt.addOn) * qty;
      sizeStrs.push(`${qty} ${opt.label}`);
    }
  });
  const sizeStr = sizeStrs.length > 0 ? sizeStrs.join(', ') : '0 cup';
  return `₱${totalPrice} — ${totalQty} cup${totalQty !== 1 ? 's' : ''} (${sizeStr})`;
}

export function getPastrySummary(item) {
  return `₱${item.price * item.quantity} — ${item.quantity} pcs`;
}

// Group by name for coffee, aggregate sizes and quantities
export function groupCartItems(cart) {
  const grouped = {};
  cart.forEach(item => {
    const key = item.name;
    if (!grouped[key]) {
      grouped[key] = { ...item, totalQty: 0, totalPrice: 0, sizes: {} };
    }
    grouped[key].totalQty += item.quantity;
    grouped[key].totalPrice += item.price * item.quantity;
    if (item.sizeLabel) {
      grouped[key].sizes[item.sizeLabel] = (grouped[key].sizes[item.sizeLabel] || 0) + item.quantity;
    }
  });
  return Object.values(grouped);
} 