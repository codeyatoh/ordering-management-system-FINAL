import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './admincrew.css';

const CLOUD_NAME = 'dcmvbxxzy';
const UPLOAD_PRESET = 'Ordering_System';

async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  const response = await axios.post(url, formData);
  return response.data.secure_url;
}

function EditMenu({ isOpen, onClose, onEdit, menuItem }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState('Active');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (menuItem) {
      setName(menuItem.name || '');
      setPrice(menuItem.price || '');
      setCategory(menuItem.category || '');
      setAvailability(menuItem.availability ? 'Active' : 'Inactive');
      setImageUrl(menuItem.Imageurl || '');
      setImageFile(null);
    }
  }, [menuItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);
    let finalImageUrl = imageUrl;
    try {
      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile);
      }
      await onEdit({
        name,
        price,
        category,
        availability,
        imageUrl: finalImageUrl,
      });
      setUploading(false);
      onClose();
    } catch (err) {
      setError('Failed to update menu. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <h2 className="admin-modal-title">Edit Menu</h2>
        <form className="admin-modal-form" onSubmit={handleSubmit}>
          <div className="admin-modal-form-row">
            <div className="admin-modal-form-group">
              <label>Product Name *</label>
              <input type="text" className="admin-modal-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="admin-modal-form-group">
              <label>Price *</label>
              <input type="number" className="admin-modal-input" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
          </div>
          <div className="admin-modal-form-row">
            <div className="admin-modal-form-group">
              <label>Category *</label>
              <select className="admin-modal-input" value={category} onChange={e => setCategory(e.target.value)} required>
                <option value="" disabled>Select Category</option>
                <option value="Coffee">Coffee</option>
                <option value="Bread">Bread</option>
              </select>
            </div>
            <div className="admin-modal-form-group">
              <label>Availability *</label>
              <select className="admin-modal-input" value={availability} onChange={e => setAvailability(e.target.value)} required>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="admin-modal-form-row">
            <div className="admin-modal-form-group">
              <label>Images *</label>
              <input type="file" className="admin-modal-input" style={{ padding: 0 }} onChange={e => setImageFile(e.target.files[0])} />
              {imageUrl && !imageFile && (
                <img src={imageUrl} alt="Current" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, marginTop: 8 }} />
              )}
            </div>
            <div className="admin-modal-form-group"></div>
          </div>
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          <div className="admin-modal-actions">
            <button type="button" className="admin-modal-cancel-btn" onClick={onClose} disabled={uploading}>Cancel</button>
            <button type="submit" className="admin-modal-update-btn" disabled={uploading}>{uploading ? 'Updating...' : 'Update Menu'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditMenu;
