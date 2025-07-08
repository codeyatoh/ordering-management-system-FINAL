// This is the main CoffeeShop page component
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import ProductGrid from './ProductGrid';
import CoffeeModal from '../Modal/coffeeModal';
import BreadModal from '../Modal/breadModal';
import OrderList from './OrderList';
import Receipt from './receipt';
import './CoffeeShop.css';
import { toast } from 'react-toastify';
import { handleCancel, handleRemoveItem, handleAddCoffeeOrder, handleAddBreadOrder, handleAddToCart } from '../../handlers/cartHandlers';
import { db } from '../../firebase';
import { collection, getDocs, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';

function CoffeeShop() {
  // Get the order type (dine-in or take-out) from the previous page
  const location = useLocation();
  const orderType = location.state?.orderType || 'dine-in';

  // State for which category is active (coffee or bread)
  const [activeCategory, setActiveCategory] = useState('coffee');
  // State for the cart (list of items added)
  const [cart, setCart] = useState([]);
  // State for showing/hiding modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCoffeeModalOpen, setIsCoffeeModalOpen] = useState(false);
  const [isBreadModalOpen, setIsBreadModalOpen] = useState(false);
  // State for the currently selected item and its details
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('regular');
  const [selectedQuantities, setSelectedQuantities] = useState({ regular: 1, medium: 0, large: 0 });
  // Add state for showing order confirmation and order number
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  // Add state for customer payment amount
  const [customerPayment, setCustomerPayment] = useState('');
  // Add state for showing receipt
  const [showReceipt, setShowReceipt] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const { crew, userType } = useContext(UserContext);
  const navigate = useNavigate();

  // Fetch menu items from Firestore
  useEffect(() => {
    const menuCol = collection(db, 'menu');
    const unsubscribe = onSnapshot(menuCol, (menuSnapshot) => {
      const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenuItems(menuList);
    });
    return () => unsubscribe();
  }, []);

  // Filter menu items by category and availability
  const filteredItems = menuItems.filter(item => {
    if (!item.category) return false;
    const cat = item.category.toLowerCase();
    if (activeCategory === 'coffee') {
      return cat === 'coffee' && (item.availability === true || item.availability === 'Active');
    } else if (activeCategory === 'pastry') {
      // Show both 'bread' and 'pastry' categories in Bread & Pastry tab
      return (cat === 'bread' || cat === 'pastry') && (item.availability === true || item.availability === 'Active');
    }
    return false;
  });

  // Set up handler functions for cart actions (imported from handlers)
  const cancelOrder = () => {
    setCart([]);
    toast.info('Order cancelled.');
  };
  const removeItem = handleRemoveItem(cart, setCart);
  const addCoffeeOrder = handleAddCoffeeOrder(cart, setCart, menuItems, setIsCoffeeModalOpen);
  const addBreadOrder = handleAddBreadOrder(cart, setCart, selectedItem, selectedQuantity, setIsBreadModalOpen);
  const addToCart = (item) => {
    if (item.category && item.category.toLowerCase() === 'coffee') {
      const cartItem = cart.find(c => c.id === item.id);
      setSelectedItem(item);
      setSelectedQuantities(cartItem?.quantities || { regular: 1, medium: 0, large: 0 });
      setIsCoffeeModalOpen(true);
    } else if (item.category && item.category.toLowerCase() === 'bread') {
      const cartItem = cart.find(c => c.id === item.id);
      setSelectedItem(item);
      setSelectedQuantity(cartItem?.quantity || 1);
      setIsBreadModalOpen(true);
    }
  };

  // This function opens the modal to view/edit a product (coffee or bread)
  const handleViewProduct = (item) => {
    setSelectedItem(item);
    // Find the item in the cart to get the latest quantities
    const cartItem = cart.find(c => c.id === item.id);
    if (item.category && item.category.toLowerCase() === 'coffee') {
      setSelectedQuantities(cartItem?.quantities || { regular: 1, medium: 0, large: 0 });
      setIsCoffeeModalOpen(true);
    } else if (item.category && item.category.toLowerCase() === 'bread') {
      setSelectedQuantity(cartItem?.quantity || 1);
      setIsBreadModalOpen(true);
    } else {
      // fallback: open coffee modal
      setSelectedQuantities(cartItem?.quantities || { regular: 1, medium: 0, large: 0 });
      setIsCoffeeModalOpen(true);
    }
  };

  // Calculate the total price of all items in the cart
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 0) + (item.quantities ? Object.entries(item.quantities).reduce((sum, [size, qty]) => sum + ((item.price + (size === 'medium' ? 10 : size === 'large' ? 20 : 0)) * qty), 0) : 0)), 0);
  };

  // Calculate the total number of items in the cart
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 0) + (item.quantities ? Object.values(item.quantities).reduce((sum, qty) => sum + qty, 0) : 0), 0);
  };

  // Generate a new order number (simple increment or random for demo)
  const generateOrderNumber = () => {
    // For demo: random 4-digit number, in real app use backend or persistent counter
    return String(Math.floor(1 + Math.random() * 9999)).padStart(4, '0');
  };

  // Handler for when checkout is done
  const handleOrderDone = async () => {
    if (cart.length === 0) {
      toast.error('Please add at least one product to the order list.');
      return;
    }
    if (!customerPayment || Number(customerPayment) <= 0) {
      toast.error('Please enter customer payment before completing the order.');
      return;
    }
    if (!crew?.crew_id) {
      toast.error('Crew ID is missing. Please log in again or contact admin.');
      return;
    }
    const newOrderNumber = generateOrderNumber();
    setOrderNumber(newOrderNumber);
    setShowReceipt(true);
    toast.success('Order completed successfully!');
    // Save order to Firestore
    try {
      await addDoc(collection(db, 'orders'), {
        order_id: newOrderNumber,
        crew_id: crew.crew_id,
        total_items: getTotalItems(),
        total_price: getTotalPrice(),
        order_status: 'Completed',
        created_at: serverTimestamp(),
        order_items: cart.map(item => ({
          ...item,
        })),
        payment: {
          cash: Number(customerPayment),
          change: Number(customerPayment) - getTotalPrice(),
        },
        order_type: orderType,
      });
      // Log the raw crew object for debugging
      console.log('Raw crew object:', crew);
      // Prepare crew object (only required fields)
      const crewData = {
        crew_id: String(crew.crew_id),
        first_name: crew.first_name || crew.firstName || 'FirstName',
        last_name: crew.last_name || crew.lastName || 'LastName'
      };
      // Prepare order object (all required fields)
      const orderData = {
        order_id: newOrderNumber,
        crew_id: String(crew.crew_id),
        total_price: getTotalPrice(),
        order_status: 'Completed',
        created_at: new Date().toISOString()
      };
      // Prepare order_items array (one entry per product in cart)
      const orderItems = cart.map(item => ({
        order_id: newOrderNumber,
        item_name: item.name,
        quantity: item.quantity || 1,
        price: item.price
      }));
      // Log the data before sending
      console.log('Sending to backend:', { crew: crewData, order: orderData, order_items: orderItems });
      try {
        const response = await axios.post('http://localhost:3030/receive-order', {
          crew: crewData,
          order: orderData,
          order_items: orderItems
        });
        console.log('Backend response:', response.data);
        toast.success('Order also sent to executive backend!');
      } catch (error) {
        console.error('Error sending to backend:', error.response ? error.response.data : error.message);
        toast.error('Failed to send order to executive backend.');
      }
    } catch (error) {
      toast.error('Failed to save order or send to backend.');
      console.error(error);
    }
    // Do not clear cart yet, needed for receipt
  };

  // Handler to start a new order
  const handleStartNewOrder = () => {
    setShowReceipt(false);
    setOrderNumber(null);
    setCart([]);
    setCustomerPayment('');
    navigate('/dining-location'); // Go to dining location page
  };

  // Format items for receipt
  const getReceiptItems = () => {
    return cart.map(item => {
      if (item.quantities) {
        // Coffee with sizes
        const sizeSummary = Object.entries(item.quantities)
          .filter(([size, qty]) => qty > 0)
          .map(([size, qty]) => `${qty} ${size.charAt(0).toUpperCase() + size.slice(1)}`)
          .join(', ');
        return {
          quantity: Object.values(item.quantities).reduce((a, b) => a + b, 0),
          name: `${item.name} (${sizeSummary})`,
          price: Object.entries(item.quantities).reduce((sum, [size, qty]) => sum + ((item.price + (size === 'medium' ? 10 : size === 'large' ? 20 : 0)) * qty), 0)
        };
      } else {
        // Bread/pastry
        return {
          quantity: item.quantity,
          name: item.name,
          price: item.price * item.quantity
        };
      }
    });
  };

  // Get today's date and time
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB');
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Render the CoffeeShop page
  return (
    <div className="coffee-shop">
      {/* Top header bar - hide when showing receipt */}
      {!showReceipt && <Header />}
      <div className="main-content">
        {/* Sidebar for switching categories */}
        <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        <main className="menu-content">
          {/* Show which category is active */}
          <h2 className="category-title">
            {activeCategory === 'coffee' ? 'Coffee' : 'Bread & Pastry'}
          </h2>
          {/* Show the products for the selected category */}
          <ProductGrid items={filteredItems} onAddToCart={addToCart} onViewProduct={handleViewProduct} />
        </main>
        <OrderList
          cart={cart}
          onEditItem={handleViewProduct}
          onRemoveItem={removeItem}
          customerPayment={customerPayment}
          setCustomerPayment={setCustomerPayment}
          orderType={orderType}
          totalPrice={getTotalPrice()}
          totalItems={getTotalItems()}
          onCancel={cancelOrder}
          onDone={handleOrderDone}
        />
      </div>
      {/* Show receipt after checkout */}
      {showReceipt && (
        <Receipt
          orderNumber={orderNumber}
          date={dateStr}
          time={timeStr}
          items={getReceiptItems()}
          total={getTotalPrice()}
          cash={Number(customerPayment)}
          change={Number(customerPayment) - getTotalPrice()}
          onStartNewOrder={handleStartNewOrder}
          onPrint={() => window.print()}
        />
      )}
      {/* Modal for editing coffee order */}
      <CoffeeModal 
        isOpen={isCoffeeModalOpen} 
        onClose={() => setIsCoffeeModalOpen(false)} 
        item={selectedItem} 
        quantities={selectedQuantities}
        onAddOrder={addCoffeeOrder}
        onCancelOrder={() => {
          setIsCoffeeModalOpen(false);
        }}
      />
      {/* Modal for editing bread order */}
      <BreadModal
        isOpen={isBreadModalOpen}
        onClose={() => setIsBreadModalOpen(false)}
        item={selectedItem}
        quantity={selectedQuantity}
        onQuantityChange={setSelectedQuantity}
        onAddOrder={addBreadOrder}
        onCancelOrder={() => {
          setIsBreadModalOpen(false);
        }}
      />
    </div>
  );
}

export default CoffeeShop; 