import React from 'react'
import HistoryDateSelection from './HistoryDateSelection'

const DateAndCountHead = ({date,setDate,count,setOpen,countHeading}) => {
  return (
    <div className="mb-10 flex  justify-around relative ">
        <HistoryDateSelection selected={date} setSelected={setDate} />
        <div className="flex items-center gap-2">
          <span>{countHeading+" "} :</span>
          <div
            onClick={() => setOpen(true)}
            className="w-[40px] h-[40px] rounded-full border border-secondary
           shadow-md bg-white font-[500] flex justify-center items-center cursor-pointer"
          >
            {count}
          </div>
        </div>
      </div>
  )
}

export default DateAndCountHead
