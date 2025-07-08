import axios from 'axios';

// ============================================================================
// EXAMPLES OF HOW TO SEND DATA VIA AXIOS TO MATCH YOUR MIGRATION SCHEMA
// ============================================================================

// Base URL for your backend
const BASE_URL = 'http://localhost:3030';

// ============================================================================
// 1. CREW TABLE EXAMPLES
// ============================================================================

/**
 * Example: Create a new crew member
 */
export const createCrewExample = async () => {
  const crewData = {
    crew_id: "CRW001",
    first_name: "Juan",
    last_name: "Dela Cruz",
    email: "juan.delacruz@example.com",
    gender: "Male",
    status: true,
    hire_date: "2024-06-01T09:00:00Z"
  };

  try {
    const response = await axios.post(`${BASE_URL}/crew`, crewData);
    console.log('Crew created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating crew:', error);
    throw error;
  }
};

/**
 * Example: Update crew member
 */
export const updateCrewExample = async (crewId) => {
  const updatedData = {
    first_name: "Juan Updated",
    last_name: "Dela Cruz Updated",
    email: "juan.updated@example.com",
    status: false
  };

  try {
    const response = await axios.put(`${BASE_URL}/crew/${crewId}`, updatedData);
    console.log('Crew updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating crew:', error);
    throw error;
  }
};

/**
 * Example: Get all crew members
 */
export const getCrewExample = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/crew`);
    console.log('All crew:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting crew:', error);
    throw error;
  }
};

// ============================================================================
// 2. ORDERS TABLE EXAMPLES
// ============================================================================

/**
 * Example: Create a new order (without items)
 */
export const createOrderExample = async () => {
  const orderData = {
    order_id: "ORD001",
    crew_id: "CRW001",
    total_price: 150.50,
    order_status: "pending",
    created_at: new Date().toISOString()
  };

  try {
    const response = await axios.post(`${BASE_URL}/orders`, orderData);
    console.log('Order created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Example: Create order with items in one request (RECOMMENDED)
 */
export const createOrderWithItemsExample = async () => {
  const orderData = {
    order_id: "ORD002",
    crew_id: "CRW001",
    total_price: 200.00,
    order_status: "pending",
    created_at: new Date().toISOString(),
    order_items: [
      {
        item_name: "Coffee (Regular)",
        quantity: 2,
        price: 50.00
      },
      {
        item_name: "Burger",
        quantity: 1,
        price: 100.00
      }
    ]
  };

  try {
    const response = await axios.post(`${BASE_URL}/orders`, orderData);
    console.log('Order with items created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating order with items:', error);
    throw error;
  }
};

/**
 * Example: Update order status
 */
export const updateOrderStatusExample = async (orderId) => {
  const updateData = {
    order_status: "completed"
  };

  try {
    const response = await axios.put(`${BASE_URL}/orders/${orderId}`, updateData);
    console.log('Order status updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// ============================================================================
// 3. ORDER_ITEMS TABLE EXAMPLES
// ============================================================================

/**
 * Example: Add item to existing order
 */
export const addOrderItemExample = async () => {
  const orderItemData = {
    order_id: "ORD001",
    item_name: "Soda",
    quantity: 1,
    price: 20.00
  };

  try {
    const response = await axios.post(`${BASE_URL}/order-items`, orderItemData);
    console.log('Order item added:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding order item:', error);
    throw error;
  }
};

/**
 * Example: Update order item quantity
 */
export const updateOrderItemExample = async (itemId) => {
  const updateData = {
    quantity: 3,
    price: 60.00
  };

  try {
    const response = await axios.put(`${BASE_URL}/order-items/${itemId}`, updateData);
    console.log('Order item updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating order item:', error);
    throw error;
  }
};

// ============================================================================
// 4. COMPLETE ORDER FLOW EXAMPLE (FROM COFFEE SHOP)
// ============================================================================

/**
 * Example: Complete order flow from coffee shop
 * This matches how your CoffeeShop component should send data
 */
export const completeOrderFlowExample = async (cart, crew, orderId) => {
  // Calculate total price
  const totalPrice = cart.reduce((total, item) => {
    if (item.quantities) {
      // Coffee with sizes
      return total + Object.entries(item.quantities).reduce((sum, [size, qty]) => {
        const addOn = size === 'medium' ? 10 : size === 'large' ? 20 : 0;
        return sum + ((item.price + addOn) * qty);
      }, 0);
    } else {
      // Bread/pastry
      return total + (item.price * item.quantity);
    }
  }, 0);

  // Format cart items for backend
  const orderItems = cart.map(item => {
    if (item.quantities) {
      // Handle coffee with different sizes
      const sizeOptions = [
        { label: 'Regular', value: 'regular', addOn: 0 },
        { label: 'Medium', value: 'medium', addOn: 10 },
        { label: 'Large', value: 'large', addOn: 20 },
      ];
      
      const items = [];
      sizeOptions.forEach(opt => {
        const qty = item.quantities[opt.value] || 0;
        if (qty > 0) {
          items.push({
            item_name: `${item.name} (${opt.label})`,
            quantity: qty,
            price: item.price + opt.addOn
          });
        }
      });
      return items;
    } else {
      // Handle bread/pastry items
      return [{
        item_name: item.name,
        quantity: item.quantity,
        price: item.price
      }];
    }
  }).flat();

  // Prepare order data
  const orderData = {
    order_id: orderId,
    crew_id: crew.crew_id,
    total_price: totalPrice,
    order_status: 'pending',
    created_at: new Date().toISOString(),
    order_items: orderItems
  };

  try {
    const response = await axios.post(`${BASE_URL}/orders`, orderData);
    console.log('Complete order sent to backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending complete order:', error);
    throw error;
  }
};

// ============================================================================
// 5. ERROR HANDLING UTILITY
// ============================================================================

/**
 * Utility function to handle Axios errors
 */
export const handleAxiosError = (error) => {
  if (error.response) {
    // Server responded with error status
    console.error('Server error:', error.response.status, error.response.data);
    return {
      type: 'server_error',
      status: error.response.status,
      message: error.response.data.message || 'Server error occurred'
    };
  } else if (error.request) {
    // Request was made but no response received
    console.error('Network error:', error.request);
    return {
      type: 'network_error',
      message: 'Network error - please check your connection'
    };
  } else {
    // Something else happened
    console.error('Error:', error.message);
    return {
      type: 'unknown_error',
      message: error.message || 'An unknown error occurred'
    };
  }
};

// ============================================================================
// 6. USAGE EXAMPLES
// ============================================================================

/**
 * Example of how to use these functions in your components
 */
export const usageExamples = {
  // In your CoffeeShop component:
  coffeeShopOrder: async (cart, crew) => {
    try {
      const orderId = String(Math.floor(1 + Math.random() * 9999)).padStart(4, '0');
      const result = await completeOrderFlowExample(cart, crew, orderId);
      console.log('Order completed successfully:', result);
      return result;
    } catch (error) {
      const errorInfo = handleAxiosError(error);
      console.error('Order failed:', errorInfo);
      throw errorInfo;
    }
  },

  // In your Admin panel:
  adminCreateCrew: async (crewData) => {
    try {
      const result = await createCrewExample(crewData);
      console.log('Crew created successfully:', result);
      return result;
    } catch (error) {
      const errorInfo = handleAxiosError(error);
      console.error('Crew creation failed:', errorInfo);
      throw errorInfo;
    }
  }
}; 