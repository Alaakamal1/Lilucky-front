'use client'
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import { useState } from "react";
const Counter = () => {
  const [num, setNum] = useState<number>(1);
  const increment = (n: number) => {
    if(n < 10 ) setNum(n + 1);}
  const decrement = (n: number) => {
    if(n > 1) setNum(n - 1);
  }
  return (
    <>
      <div className="border flex w-30 py-1 justify-around rounded-md">
        <div className="cursor-pointer" onClick={() => increment(num)}>
          <AddOutlinedIcon/>
        </div>
        <div className="text-xl">
        {num}
        </div>
        <div className=" cursor-pointer" onClick={() => decrement(num)}>
          <RemoveOutlinedIcon />
        </div>
      </div>
    </>
  );
};

export default Counter;
