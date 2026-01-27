import { DropdownProps } from "@/src/interfaces/DropdownProps";
const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onChange, disabled=false }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-primary text-sm font-medium mb-1">{label}</label>}
      <select
        disabled={disabled}
        value={value}
        onChange={onChange}
        className={`w-full
                h-11
                px-4
                rounded-xl
                border-2
                border-primary-hover
                focus:border-primary
                focus:outline-none
                placeholder-gray-400
                text-secondary-text
                transition
                duration-200`}
      >
        <option value="">اختر...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
