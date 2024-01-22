import React, { useRef, useState } from "react";
import { FaSortDown } from "react-icons/fa";
import FormErrorMessage from "../FormErrorMessage";

const CheckinSelect = ({ value, data, setValue, error }) => {
  const [open, setOpen] = useState(false);
  const checkBoxref = useRef(null);
  return (
    <div
      className={`w-full h-[50px] bg-white shadowNormal rounded-md  text-gary flex justify-between
    items-center cursor-pointer px-10 relative ${error&&  "border border-red-500" }`}
      onClick={() => setOpen(!open)}
    >
      <div>{value === "" ? "Choose one" : value}</div>
      <div>
        <FaSortDown size={25} className="mb-2" />
      </div>
      {open && (
        <div
          className="w-full h-auto absolute top-[60px] left-5  bg-white rounded-md shadow-md z-[10]"
          ref={checkBoxref}
        >
          {data.map((value) => {
            return (
              <div
                className="py-3 px-5 hover:bg-gray-100 cursor-pointer"
                key={value}
                onClick={() => {
                  setValue(value);
                  setOpen(false);
                }}
              >
                {value}
              </div>
            );
          })}
        </div>
      )}
    
    </div>
  );
};

export default CheckinSelect;
