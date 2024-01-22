import React, { useState } from "react";
import MuiDatePicker from "./MuiDatePicker";

const DatePickerField = ({dateSelected,setDateSelected,dateFormat}) => {
  return (
    <div className="flex items-center my-2  "> 
      <label htmlFor="" className="flex-1 text-lg text-secondary font-[500]">Date</label>
      <div className="flex-[2]">
      <MuiDatePicker selected={dateSelected} setSeleceted={setDateSelected} dateFormat={dateFormat}  />
      </div>
    </div>
  );
};

export default DatePickerField;
