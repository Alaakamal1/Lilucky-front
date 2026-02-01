// components/Filter.js
import React from "react";

const Filter = ({ label, options, selected, onChange }) => {
  return (
    <div className="filter">
      <label className="filter-label">
        {label} 
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          className="filter-select"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <style jsx>{`
        .filter {
          margin: 0.5rem 0;
        }
        .filter-label {
          font-weight: 400;
          color:#403C3C;
          
        }
        .filter-select {
          margin: 0rem 0.5rem;
          padding: 0.25rem 1.25rem;
          border-radius: 0.5rem;
          border: 1px solid #F5AFAF;
        }
      `}</style>
    </div>
  );
};

export default Filter;
