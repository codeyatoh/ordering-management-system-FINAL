import React from 'react';
import { HiHome } from 'react-icons/hi';
import { TbCoffee, TbBread } from 'react-icons/tb';

// This component is the sidebar for switching between categories
function Sidebar({ activeCategory, setActiveCategory }) {
  return (
    // Sidebar container
    <aside className="sidebar">
      <div className="menu-header">
        {/* Home icon and menu label */}
        <HiHome className="menu-icon" />
        <span>MENU</span>
      </div>
      <nav className="menu-nav">
        {/* Button to select Coffee category */}
        <button 
          className={`nav-item ${activeCategory === 'coffee' ? 'active' : ''}`}
          onClick={() => setActiveCategory('coffee')}
        >
          <TbCoffee className="nav-icon" />
          <span>Coffee</span>
        </button>
        {/* Button to select Bread & Pastry category */}
        <button 
          className={`nav-item ${activeCategory === 'pastry' ? 'active' : ''}`}
          onClick={() => setActiveCategory('pastry')}
        >
          <TbBread className="nav-icon" />
          <span>Bread & Pastry</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar; 