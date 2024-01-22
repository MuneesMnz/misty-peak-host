import React from "react";

const RadioButtonGroup = ({
  options,
  label,
  selected,
  setSelected,
  purchaceForm,
}) => {
  return (
    <div className="flex items-center mb-5 mt-10 ">
      {label && (
        <label
          className={`flex-1 text-lg ${
            purchaceForm && "font-[500] text-secondary "
          } `}
        >
          {label}{" "}
        </label>
      )}
      <div className="flex-[2] flex justify-start gap-20 w-[600px]">
        {options.map((item, ind) => (
          <div key={ind} className="flex items-center">
            <input
              type="radio"
              id={item.name}
              name={label}
              value={item.value}
              className=" hidden"
              checked={selected === item.value}
              onChange={() => setSelected(item.value)}
            />
            <label
              htmlFor={item.name}
              className={` cursor-pointer flex items-center text-lg mr-4 w-auto px-3 py-1.5 h-auto justify-evenly rounded-md ${
                selected === item.value
                  ? "bg-secondary text-white"
                  : "border-2 border-secondary"
              }`}
            >
              <span>{item.name}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioButtonGroup;
