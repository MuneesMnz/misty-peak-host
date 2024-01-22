import React, { useEffect, useRef, useState } from "react";
import { FaSortDown } from "react-icons/fa";
import "../../App.css";

const SelectBox = ({ label, data, value, setValue, error }) => {
  const [open, setOpen] = useState(false);

  const checkBoxref = useRef(null);

  useEffect(() => {
    const HandleOutside = (event) => {
      if (checkBoxref.current && !checkBoxref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", HandleOutside);
    return () => {
      document.removeEventListener("mousedown", HandleOutside);
    };
  }, []);
  return (
    <div className="flex  mb-5 ">
      <label className="flex-1 capitalize text-secondary font-[500] text-lg mt-3">
        {label}
      </label>
      <div className="flex-[2] relative flex flex-col ">
        <div
          className={`w-[500px] h-[50px] bg-white shadowNormal rounded-md max-xl:w-full text-gary flex justify-between
          items-center cursor-pointer px-10  ${error ? "border border-red-500":""} `}
          onClick={() => setOpen(!open)}
        >
          <div className=" capitalize">
            {value === "" ? "Choose one" : value}
          </div>
          <div className="mb-3">
            <FaSortDown size={30} />
          </div>
          {open && (
            <div
              className="w-[400px] max-h-[200px] overflow-y-scroll  absolute top-[60px] left-5  bg-white rounded-md shadow-md z-[10]"
              ref={checkBoxref}
            >
              {data.map((value) => {
                return (
                  <div
                    className="py-3 px-5 hover:bg-gray-100 cursor-pointer capitalize"
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
        {error && <div className="mt-3 text-red-500 text-sm ">{error}</div>}
      </div>
    </div>
  );
};

export default SelectBox;
