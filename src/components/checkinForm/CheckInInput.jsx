import React, { useEffect, useRef } from "react";

const CheckInInput = ({
  placeholder,
  name,
  value,
  handleChange,
  type,
  error,
  phone,
  maxLength,
  pax,
  ...rest
}) => {
  const handeInputChange = (e) => {
    if (e.target.value.length <= 10) {
      handleChange(e);
    }
  };

  const handlePaxChange = (e) => {
    if (e.target.value.length <= 2) {
      handleChange(e);
    }
  };
  const inputRef = useRef();
  const handleWheel = () => {
    if (type === "number") {
      inputRef.current.blur();
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        className={`w-full px-5 h-[50px] bg-[#ececec] shadow-md  rounded-md outline-none placeholder:text-sm ${
          error && "border border-red-500"
        } `}
        name={name}
        value={value}
        onWheel={handleWheel}
        onChange={
          phone ? handeInputChange : pax ? handlePaxChange : handleChange
        }
        maxLength={maxLength}
        {...rest}
      />
    </>
  );
};

export default CheckInInput;
