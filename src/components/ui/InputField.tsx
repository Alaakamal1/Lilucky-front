import { InputFieldProps } from "@/src/interfaces/InputFieldProps";

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, onBlur, type = "text", placeholder  }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-primary text-sm font-medium mb-1">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onBlur={onBlur}
        className={`
                w-full
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
      />
    </div>
  );
};

export default InputField;
