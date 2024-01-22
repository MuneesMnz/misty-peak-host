import React, { useEffect, useState } from "react";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import moment from "moment";
import { BsCalendarEvent  } from "react-icons/bs";
import "../../App.css";

const MuiDatePicker = ({ selected, setSeleceted, dateFormat }) => {
  const [date, setDate] = useState(dayjs(new Date()));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSeleceted(moment(new Date(date)).format(dateFormat));
  }, [date]);

  return (
    <div className=" w-[500px] h-[50px]  bg-white shadow-lg flex justify-between items-center relative rounded-full shadowNormal  max-xl:w-full">
      <div className="flex-[3] px-7 bg-borderGray h-full flex items-center rounded-l-full">
        {moment.utc(selected).format("DD/MM/YYYY")}
      </div>
      <div className="flex-1 flex justify-center items-center bg-secondary h-full rounded-r-full">
        <BsCalendarEvent
          className="cursor-pointer text-2xl text-white"
          onClick={() => setOpen(!open)}
        />
      </div>
      {open && (
        <div className="absolute bg-white shadow-lg top-[55px] right-5  z-10 rounded-md">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={date || dayjs(new Date())}
              onChange={(newDate) => {
                setDate(newDate);
                setOpen(!open);
              }}
            />
          </LocalizationProvider>
        </div>
      )}
    </div>
  );
};

export default MuiDatePicker;
