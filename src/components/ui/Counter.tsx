'use client'
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
interface CounterProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

const Counter = ({ value, onChange, max = 10 }: CounterProps) => {

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  const decrement = () => {
    if (value > 1) onChange(value - 1);
  };

  return (
    <div className="border flex w-25 py-0.2 justify-around rounded-md text-secondary-text">
      <div className="cursor-pointer " onClick={increment}>
        <AddOutlinedIcon className=""/>
      </div>

      <div className="text-xl">{value}</div>

      <div className="cursor-pointer" onClick={decrement}>
        <RemoveOutlinedIcon />
      </div>
    </div>
  );
};
export default Counter;
