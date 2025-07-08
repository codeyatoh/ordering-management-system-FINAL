import React from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

function SearchAndFilter({ searchTerm, onSearch, filterStatus, onFilter }) {
  return (
    <div className="crew-search-container">
      <div className="crew-search-input-wrapper">
        <FaSearch className="crew-search-icon" />
        <input
          className="crew-search-input"
          type="text"
          placeholder="Search by Name, Email, or Crew ID"
          value={searchTerm}
          onChange={e => onSearch(e.target.value)}
        />
      </div>
      <div className="crew-search-filter-wrapper">
        <select
          className="crew-search-filter-select"
          value={filterStatus}
          onChange={e => onFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <FaFilter className="crew-search-filter-icon" />
      </div>
    </div>
  );
}

export default SearchAndFilter;
