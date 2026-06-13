import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange, location, onLocationChange, onManualSearch, loading, sortBy, onSortChange }) => {
  const locations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"];
  
  return (
    <div className="container-fluid px-0">
      <div className="row g-0">
        <div className="col-md-4 pe-md-2 mb-3 mb-md-0">
          <label className="form-label fw-semibold">Medicine Name</label>
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="e.g., Zolgensma, Myalept"
            value={searchTerm}
            onChange={onSearchChange}
            style={{ backgroundColor: 'var(--code-bg)', color: 'var(--text-h)', borderColor: 'var(--border)' }}
          />
        </div>
        <div className="col-md-3 pe-md-2 mb-3 mb-md-0">
          <label className="form-label fw-semibold">Location</label>
          <select className="form-select form-select-lg" value={location} onChange={onLocationChange} style={{ backgroundColor: 'var(--code-bg)', color: 'var(--text-h)', borderColor: 'var(--border)' }}>
            <option value="">All Locations</option>
            {locations.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <div className="col-md-2 pe-md-2 mb-3 mb-md-0">
          <label className="form-label fw-semibold invisible d-none d-md-block">Action</label>
          <button className="btn btn-primary w-100 py-2" onClick={onManualSearch} disabled={loading || !searchTerm}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold invisible d-none d-md-block">Sort By</label>
          <select className="form-select form-select-lg" value={sortBy} onChange={onSortChange} style={{ backgroundColor: 'var(--code-bg)', color: 'var(--text-h)', borderColor: 'var(--border)' }}>
            <option value="name">Sort by: Name</option>
            <option value="price_low">Sort by: Price (Low to High)</option>
            <option value="price_high">Sort by: Price (High to Low)</option>
            <option value="stock">Sort by: Stock Availability</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;