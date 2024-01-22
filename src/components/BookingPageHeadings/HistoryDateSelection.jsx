import moment from "moment";
import React, { useEffect, useState } from "react";
import { BsCalendarEvent  } from "react-icons/bs";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const HistoryDateSelection = ({ selected, setSelected, prev ,left}) => {
  const [date, setDate] = useState(prev ? dayjs().subtract(7, "day") : dayjs());
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setSelected(moment(new Date(date)).format("DD-MM-YYYY"));
  }, [date]);
  return (
    <div className="w-[200px] h-[50px] bg-white shadow-md rounded-md  cursor-pointer text-lg text-black relative">
      <div
        onClick={() => setOpen(!open)}
        className="flex w-full h-full gap-2 items-center
     justify-center "
      >
        <BsCalendarEvent  className="text-2xl text-secondary " />
        {selected}
      </div>
      {open && (
        <div className={`absolute bg-white shadow-lg top-[75px] ${left&&left}  z-10 rounded-md`}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={date}
              onChange={(newDate) => {
                setDate(newDate);
                setOpen(!open);
              }}
              //   maxDate={dayjs(new Date())}
            />
          </LocalizationProvider>
        </div>
      )}
    </div>
  );
};

export default HistoryDateSelection;
