import React, { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";

const CheckinCheckBox = ({ label, handleCheckboxChange }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="relative flex-1 flex items-center gap-2 ">
      <input
        type="checkbox"
        className={` appearance-none w-6 h-6 rounded cursor-pointer ${
          checked ? "bg-secondary" : "bg-borderGray"
        } `}
        checked={checked}
        onChange={(e) => {
          setChecked(!checked);
          handleCheckboxChange(e);
        }}
        id={label}
        value={label}
      />
      <label htmlFor={label} className="cursor-pointer">
        {label}
      </label>
    </div>
  );
};

export default CheckinCheckBox;
