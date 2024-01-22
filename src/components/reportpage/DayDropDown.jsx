import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { BsCalendarDate, BsFillCaretDownFill } from "react-icons/bs";

const DayDropDown = ({ setFrom, setDateselectOpen }) => {
  const containerRef = useRef(null);
  const [open, setOpen] = useState();
  const daysList = ["Today", "Last Week", "Last Month", "Custom"];
  const [day, setDay] = useState("");

  const setDate = (value) => {
    setDay(value);
    setOpen(false);
    switch (value) {
      case "Today":
        setFrom(moment(new Date()).format("DD-MM-YYYY"));
        setDateselectOpen(false);
        break;
      case "Last Week":
        setFrom(moment(new Date()).subtract(1, "week").format("DD-MM-YYYY"));
        console.log(
          moment(new Date()).subtract(1, "week").format("DD-MM-YYYY")
        );
        setDateselectOpen(false);
        break;
      case "Last Month":
        setFrom(moment(new Date()).subtract(1, "month").format("DD-MM-YYYY"));
        setDateselectOpen(false);
        break;
      case "Custom":
        // setFrom(moment(new Date()).format("DD-MM-YYYY"));
        setDateselectOpen(true);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div
      ref={containerRef}
      className="w-[200px] h-[50px] py-2 px-4 flex gap-3 items-center justify-between border border-black rounded-md cursor-pointer relative "
      onClick={() => setOpen(!open)}
    >
      <BsCalendarDate className="text-2xl text-secondary" />
      <div className="text-lg">{day === "" ? "Today" : day}</div>
      <BsFillCaretDownFill className="text-xl" />
      {open && (
        <div className="absolute top-14 right-0 bg-white w-[200px] h-auto shadow-md rounded-md z-10">
          {daysList.map((value) => (
            <div
              key={value}
              className="px-4 h-10 flex items-center justify-center text-lg  hover:bg-gray-100"
              onClick={() => setDate(value)}
            >
              {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DayDropDown;
