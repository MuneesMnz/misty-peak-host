import React from "react";
import "../../App.css";
import FormErrorMessage from "../FormErrorMessage";

const TextInput = ({
  label,
  type,
  placeholder,
  name,
  value,
  handleChange,
  error,
  ...rest
}) => {
  const d = true;
  return (
    <div className="flex mb-5 ">
      {label && (
        <label
          htmlFor={name}
          className="flex-1 font-[500] text-secondary text-lg  capitalize mt-3"
        >
          {label}
        </label>
      )}
      <div className="flex-[2] flex flex-col ">
        <input
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          className={`w-[500px] h-[50px] shadowNormal placeholder:text-sm
           px-6 bg-borderGray outline-none  rounded-md max-xl:w-full ${
             error ? "border border-red-500" : ""
           }  `}
          value={value}
          onChange={(e) => handleChange(e, type)}
          {...rest}
        />
        {error && <FormErrorMessage error={error} />}
      </div>
    </div>
  );
};

export default TextInput;
