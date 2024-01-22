import React, { useEffect, useRef, useState } from "react";
import "../../App.css";
import { FaSortDown } from "react-icons/fa";
import FormErrorMessage from "../FormErrorMessage";

const InputAndSelect = ({
  label,
  name,
  type,
  placeholder,
  value,
  handleChange,
  selected,
  setselected,
  list,
  formError,
  ...rest
}) => {
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
    <div className="flex items-center mb-5">
      <label
        htmlFor={name}
        className="flex-1 text-lg text-secondary font-[500] capitalize"
      >
        {label} {selected !== "" && `(${selected})`}
      </label>

      <div className="flex-[2] flex flex-col ">
        <div className="w-[500px] flex h-[50px] shadowNormal rounded-md relative max-xl:w-full ">
          <input
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleChange(e, type)}
            {...rest}
            className={`flex-[5] outline-none px-6 bg-borderGray rounded-l-md ${
              formError.quantity ? "border border-red-500" : ""
            }`}
          />
          <div
            className={`flex-1 border-2 ${
              formError.unit ? "  border-red-500" : "  border-secondary"
            } rounded-md flex justify-center items-center cursor-pointer`}
            onClick={() => setOpen(!open)}
          >
            <FaSortDown size={30} className="mb-3" />
          </div>
          {open && (
            <div
              className="absolute top-14 right-0 w-[200px] max-h-[200px] rounded-md shadow-md z-10 bg-white flex flex-col"
              ref={checkBoxref}
            >
              {list.map((value) => (
                <div
                  className="py-3 px-5 hover:bg-gray-100 cursor-pointer capitalize"
                  key={value}
                  onClick={() => {
                    setselected(value);
                    setOpen(false);
                  }}
                >
                  {value}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-7">
        {formError.quantity && <FormErrorMessage error={formError.quantity} />}
        {formError.unit && <FormErrorMessage error={formError.unit} />}
        </div>
      </div>
    </div>
  );
};

export default InputAndSelect;
