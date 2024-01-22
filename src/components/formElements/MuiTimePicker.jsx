import React, { useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import moment from "moment";
import { BsClock } from "react-icons/bs";

const MuiTimePicker = ({ selected, setSeleceted }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className=" w-[300px] h-[50px]  bg-white shadow-lg flex justify-between items-center relative rounded-full ">
      <div className="flex-[2] px-5 bg-borderGray h-full flex items-center rounded-l-full">
        {moment(selected).format("hh:mm A")}
      </div>
      <div className="flex-1 flex justify-center items-center bg-secondary h-full rounded-r-full">
        <BsClock
          className="cursor-pointer text-3xl text-white"
          onClick={() => setOpen(!open)}
        />
      </div>
      {open && (
        <div className="absolute bg-white shadow-lg top-[55px]  z-10 rounded-md">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticTimePicker
              value={selected || new Date()}
              onAccept={() => setOpen(false)}
              onChange={(newDate) => {
                setSeleceted(newDate);
              }}
            />
          </LocalizationProvider>
        </div>
      )}
    </div>
  );
};

export default MuiTimePicker;
