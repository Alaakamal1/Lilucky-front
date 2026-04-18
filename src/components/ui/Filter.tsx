// components/Filter.tsx
import React from "react";

const Filter = ({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string | null;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="filter">
      <label className="filter-label">{label}</label>

      <select
        value={selected ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="filter-select"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <style jsx>{`
        .filter {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-label {
          font-weight: 400;
          color: #403C3C;
          font-size: 14px;
        }

        .filter-select {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #f5afaf;
          outline: none;
          background: white;
          font-size: 14px;
          transition: 0.2s;
        }

        .filter-select:focus {
          border-color: #f5afaf;
          box-shadow: 0 0 0 2px rgba(245, 175, 175, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Filter;