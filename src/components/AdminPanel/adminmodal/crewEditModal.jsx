import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './adminModal.css';

function CrewEditModal({ isOpen, onClose, crew, onSave }) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: crew?.firstName || '',
    lastName: crew?.lastName || '',
    email: crew?.email || '',
    password: crew?.password || '',
    status: crew?.status || 'Active',
    gender: crew?.gender || 'Male',
  });

  React.useEffect(() => {
    setForm({
      firstName: crew?.firstName || '',
      lastName: crew?.lastName || '',
      email: crew?.email || '',
      password: crew?.password || '',
      status: crew?.status || 'Active',
      gender: crew?.gender || 'Male',
    });
  }, [crew, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) return;
    if (onSave) onSave(form);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <h2 className="admin-modal-title">{crew ? 'Edit Crew' : 'Add Crew'}</h2>
        <form className="admin-modal-form" onSubmit={handleSubmit}>
          <div className="admin-modal-form-row">
            <div className="admin-modal-form-group">
              <label>First Name *</label>
              <input type="text" className="admin-modal-input" name="firstName" value={form.firstName} onChange={handleChange} />
            </div>
            <div className="admin-modal-form-group">
              <label>Last Name *</label>
              <input type="text" className="admin-modal-input" name="lastName" value={form.lastName} onChange={handleChange} />
            </div>
          </div>
          <div className="admin-modal-form-row">
            <div className="admin-modal-form-group">
              <label>Email *</label>
              <input type="email" className="admin-modal-input" name="email" value={form.email} onChange={handleChange} />
            </div>
            <div className="admin-modal-form-group">
              <label>Password *</label>
              <div className="admin-modal-password-wrapper">
                <input type={showPassword ? 'text' : 'password'} className="admin-modal-input" name="password" value={form.password} onChange={handleChange} />
                <button type="button" className="admin-modal-password-toggle" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
          <div className="admin-modal-form-row">
            <div className="admin-modal-form-group">
              <label>Status *</label>
              <select className="admin-modal-input" name="status" value={form.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="admin-modal-form-group">
              <label>Gender *</label>
              <select className="admin-modal-input" name="gender" value={form.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div className="admin-modal-actions">
            <button type="button" className="admin-modal-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-modal-update-btn">{crew ? 'Update Crew' : 'Add Crew'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrewEditModal;
