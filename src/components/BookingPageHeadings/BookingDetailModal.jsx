import moment from "moment";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const RoundedButton = ({ children, green }) => {
  return (
    <div
      className={` px-5 py-4  h-[50px] ${
        green
          ? "bg-secondary text-white "
          : "bg-white text-secondary border border-borderGray  "
      } shadow-md rounded-full flex  justify-around items-center `}
    >
      {children}
    </div>
  );
};

const GreenBox = ({ children }) => {
  return (
    <div className="w-10 h-10 flex justify-center items-center bg-secondary rounded text-white ">
      {children}
    </div>
  );
};
const BookingDetailModal = ({ setModalopen, data, setData }) => {
  const AddOnTotal = data.addOns.reduce(
    (sum, currentValue) => sum + currentValue.amount,
    0
  );
  console.log(AddOnTotal);
  return (
    <div className="fixed w-full h-screen bg-gray-600/60 top-0 left-0 z-[100] flex justify-center items-center">
      <div className="w-[800px] h-[400px] bg-white rounded-xl shadow-md px-10 py-5 overflow-y-scroll">
        <div className="flex justify-between items-center mb-10">
          <h4 className="text-xl font-[500]">
            Room Number :{" "}
            <span className=" text-secondary">{data?.roomNumber}</span>
          </h4>
          <AiOutlineClose
            size={25}
            className="cursor-pointer "
            onClick={() => {
              setModalopen(false);
              setData({});
            }}
          />
        </div>
        <div className="flex gap-7  mb-10">
          <div className="flex-1  flex flex-col gap-2 ">
            <div className="text-textGray text-[15px]">Name</div>
            <div>{data?.name}</div>
          </div>
          <div className="flex-1 flex flex-col gap-1  ">
            <div className="text-textGray text-[15px]">Check In</div>
            <RoundedButton>
              {moment(data?.checkInDate?.slice(0, -1)).format("DD/MM/YYYY")} |{" "}
              {moment(data?.checkInDate?.slice(0, -1)).format("hh:mm A")}
            </RoundedButton>
          </div>
          <div className="flex-1 flex flex-col gap-1  ">
            <div className="text-textGray text-[15px]">Check Out</div>
            <RoundedButton>
              {moment(data?.checkOutDate?.slice(0, -1)).format("DD/MM/YYYY")} |{" "}
              {moment(data?.checkOutDate?.slice(0, -1)).format("hh:mm A")}
            </RoundedButton>
          </div>
        </div>
        <div className="flex  gap-7 mb-10">
          <div className="flex-1  flex flex-col gap-1   ">
            <div className="text-textGray text-[15px]">Meal Plan</div>
            <RoundedButton>{data?.mealPlan}</RoundedButton>
          </div>
          <div className="flex-1 flex flex-col gap-1  ">
            <div className="text-textGray text-[15px]">Room Tariff</div>
            <RoundedButton green>{data?.rmTariff}</RoundedButton>
          </div>
          <div className="flex-1 flex flex-col gap-1  ">
            <div className="text-textGray text-[15px]">Add Ons Bills</div>
            <RoundedButton green>{AddOnTotal}</RoundedButton>
          </div>
        </div>
        <div className="flex gap-7  mb-10">
          <div className="flex-1 flex justify-between items-center ">
            <div>
              <div className="mb-1.5 text-sm text-textGray">Adult</div>
              <GreenBox>{data?.pax[0].adult}</GreenBox>
            </div>
            <div>
              <div className="mb-1.5 text-sm text-textGray">Child</div>
              <GreenBox>{data?.pax[0].child}</GreenBox>
            </div>
            <div>
              <div className="mb-1.5 text-sm text-textGray">Infant</div>
              <GreenBox>{data?.pax[0].infant}</GreenBox>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1  ">
            <div className="text-textGray text-[15px]">Booking Type</div>
            <RoundedButton>{data?.booking[0].agencyType}</RoundedButton>
          </div>
          <div className="flex-1 flex flex-col gap-1  ">
            <div className="text-textGray text-[15px]">Agent Name</div>
            <RoundedButton>{data?.booking[0].agentName}</RoundedButton>
          </div>
        </div>
        <div className="flex gap-7  mb-10">
          <div className="flex-1 flex flex-col gap-1  ">
            <div className="text-textGray text-[15px]">B2B</div>
            <RoundedButton>{data?.booking[0].btb}</RoundedButton>
          </div>
          <div className="flex-1 flex flex-col gap-1  ">
            <div className="text-textGray text-[15px]">B2C</div>
            <RoundedButton>{data?.booking[0].btc}</RoundedButton>
          </div>
          <div className="flex-1 flex flex-col gap-1  ">
            <div className="text-textGray text-[15px]">Tac</div>
            <RoundedButton>{data?.booking[0].tacamount}</RoundedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
