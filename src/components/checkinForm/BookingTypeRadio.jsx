import React, { useState } from "react";

const BookingTypeRadio = ({ data, selected, setSelected }) => {
  return (
    <div className="flex justify-between">
      {data.map((item, ind) => (
        <div key={ind}>
          <input
            type="radio"
            id={item}
            name={item}
            value={item}
            checked={selected === item}
            onChange={() => setSelected(item)}
            className="hidden"
          />
          <label
            htmlFor={item}
            className="flex gap-3 items-center cursor-pointer"
          >
            <div
              className={`w-7 h-7 rounded ${
                selected === item ? "bg-secondary" : " bg-borderGray"
              } `}
            ></div>
            <div className="text-lg">{item}</div>
          </label>
        </div>
      ))}
    </div>
  );
};

export default BookingTypeRadio;
