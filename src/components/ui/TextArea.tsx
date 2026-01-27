import { TextAreaProps } from "@/src/interfaces/TextAreaProps";
import React from "react";

const TextArea: React.FC<TextAreaProps> = ({ label, value, onChange, placeholder, rows = 4 }) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="block text-primary text-sm font-medium mb-1">{label}</label>
      <textarea
        className="border-primary border-2 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary resize-none" 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
};

export default TextArea;
