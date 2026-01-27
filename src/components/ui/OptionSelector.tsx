"use client";

interface OptionSelectorProps {
  label?: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
  className?: string;
}

const OptionSelector = ({
  label,
  options,
  selected,
  onSelect,
  className = "",
}: OptionSelectorProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="font-medium">{label}</span>}

      <div className="flex flex-wrap gap-6 justify-center max-md:flex-col m-10">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`
              ${className}
              ${
                selected === option
                  ? " text-primary-text"
                  : "bg-primary-text text-pink-200"
              }
            `}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OptionSelector;