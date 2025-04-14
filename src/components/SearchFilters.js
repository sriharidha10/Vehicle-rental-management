import React, { useState } from 'react';
import '../styles/SearchFilters.css';

const SearchFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    capacity: '',
    fuelType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <div className="search-filters">
      <form onSubmit={handleSubmit}>
        <div className="filter-group">
          <label>Price Range (per hour)</label>
          <div className="price-range">
            <input
              type="range"
              min="0"
              max="5000"
              value={filters.priceRange[1]}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                priceRange: [0, parseInt(e.target.value)]
              }))}
            />
            <span>₹0 - ₹{filters.priceRange[1]}</span>
          </div>
        </div>

        <div className="filter-group">
          <label>Capacity</label>
          <select name="capacity" value={filters.capacity} onChange={handleChange}>
            <option value="">All</option>
            <option value="2">2 Seater</option>
            <option value="4">4 Seater</option>
            <option value="5">5 Seater</option>
            <option value="7">7 Seater</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Fuel Type</label>
          <select name="fuelType" value={filters.fuelType} onChange={handleChange}>
            <option value="">All</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
          </select>
        </div>

        <button type="submit">Apply Filters</button>
      </form>
    </div>
  );
};

export default SearchFilters;