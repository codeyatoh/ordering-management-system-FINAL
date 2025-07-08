import React, { useState, useEffect } from 'react';
import AdminSidebar from '../admin.sidebar';
import './admincrew.css';
import { FaSearch, FaFilter, FaEdit, FaTrash } from 'react-icons/fa';
import MenuAddModal from '../adminmodal/menuAddModal';
import MenuEditModal from '../adminmodal/menuEditModal';
import EditMenu from './editmenu';
import DeleteMenu from './deletemune';
import { db } from '../../../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';

function AdminMenu() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  // Fetch menu items from Firestore
  useEffect(() => {
    const fetchMenu = async () => {
      const menuCol = collection(db, 'menu');
      const menuSnapshot = await getDocs(menuCol);
      const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenuItems(menuList);
    };
    fetchMenu();
  }, []);

  // Utility function to add a menu item
  const addMenuItem = async ({ name, price, category, availability, imageUrl }) => {
    const menuCol = collection(db, 'menu');
    const docRef = await addDoc(menuCol, {
      Product_id: '', // will update after creation
      name,
      price: Number(price),
      category,
      availability: availability === 'Active' || availability === true,
      Imageurl: imageUrl,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    // Set Product_id to the Firestore doc id
    await updateDoc(doc(db, 'menu', docRef.id), { Product_id: docRef.id });
  };

  // Utility function to update a menu item
  const updateMenuItem = async (id, { name, price, category, availability, imageUrl }) => {
    const menuDoc = doc(db, 'menu', id);
    await updateDoc(menuDoc, {
      name,
      price: Number(price),
      category,
      availability: availability === 'Active' || availability === true,
      Imageurl: imageUrl,
      updated_at: serverTimestamp(),
    });
  };

  // Add menu item to Firestore
  const handleAddMenu = async (menuData) => {
    await addMenuItem(menuData);
    // Refresh menu list
    const menuCol = collection(db, 'menu');
    const menuSnapshot = await getDocs(menuCol);
    const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMenuItems(menuList);
  };

  // Edit menu item handler
  const handleEditMenu = async (updatedData) => {
    if (!selectedMenuItem) return;
    await updateMenuItem(selectedMenuItem.id, updatedData);
    // Refresh menu list
    const menuCol = collection(db, 'menu');
    const menuSnapshot = await getDocs(menuCol);
    const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMenuItems(menuList);
    setSelectedMenuItem(null);
    setEditModalOpen(false);
  };

  // Delete menu item handler
  const handleDeleteMenu = async (id) => {
    await deleteDoc(doc(db, 'menu', id));
    // Refresh menu list
    const menuCol = collection(db, 'menu');
    const menuSnapshot = await getDocs(menuCol);
    const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMenuItems(menuList);
    setSelectedMenuItem(null);
    setRemoveModalOpen(false);
  };

  return (
    <div className="adminpanel-root">
      <AdminSidebar />
      <main className="adminpanel-main">
        <div className="crew-header-row">
          <h2 className="crew-title">Menu Management</h2>
        </div>
        <div className="crew-actions-row">
          <button className="crew-add-btn" onClick={() => setAddModalOpen(true)}>Add</button>
          <div className="crew-search-container">
            <div className="crew-search-input-wrapper">
              <FaSearch className="crew-search-icon" />
              <input className="crew-search-input" type="text" placeholder="Search by Name or Category" />
            </div>
            <button className="crew-search-filter-btn">
              <FaFilter />
            </button>
          </div>
        </div>
        <div className="crew-table-container">
          <table className="crew-table">
            <thead>
              <tr>
                <th>Product_id</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Availability</th>
                <th>Images</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item, idx) => (
                <tr key={item.id}>
                  <td className="crew-id">{`Product${(idx + 1).toString().padStart(2, '0')}`}</td>
                  <td className="crew-fname">{item.name}</td>
                  <td className="crew-lname">{item.price}</td>
                  <td className="crew-email">{item.category}</td>
                  <td className="crew-gender">{item.availability ? 'Active' : 'Inactive'}</td>
                  <td className="crew-status">
                    {item.Imageurl ? (
                      <img src={item.Imageurl} alt={item.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                    ) : ''}
                  </td>
                  <td className="crew-created">{item.created_at && item.created_at.toDate ? item.created_at.toDate().toLocaleString() : ''}</td>
                  <td className="crew-created">{item.updated_at && item.updated_at.toDate ? item.updated_at.toDate().toLocaleString() : ''}</td>
                  <td className="crew-actions">
                    <button className="crew-action-btn" onClick={() => { setSelectedMenuItem(item); setEditModalOpen(true); }}><FaEdit /></button>
                    <button className="crew-action-btn" onClick={() => { setSelectedMenuItem(item); setRemoveModalOpen(true); }}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <MenuAddModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddMenu} />
        <MenuEditModal isOpen={editModalOpen} onClose={() => { setEditModalOpen(false); setSelectedMenuItem(null); }} onEdit={handleEditMenu} menuItem={selectedMenuItem} />
        <EditMenu isOpen={editModalOpen} onClose={() => { setEditModalOpen(false); setSelectedMenuItem(null); }} onEdit={handleEditMenu} menuItem={selectedMenuItem} />
        <DeleteMenu isOpen={removeModalOpen} onClose={() => { setRemoveModalOpen(false); setSelectedMenuItem(null); }} onDelete={handleDeleteMenu} menuItem={selectedMenuItem} />
      </main>
    </div>
  );
}

export default AdminMenu;
