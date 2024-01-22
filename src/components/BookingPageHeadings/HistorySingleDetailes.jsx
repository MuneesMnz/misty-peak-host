import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userRequset } from "../../api/requestMethods";
import CheckinFormHeading from "../checkinForm/CheckinFormHeading";
import moment from "moment";
import LoadingImage from "../LoadingImage";
const RoundedButton = ({ value }) => {
  return (
    <div className="w-full h-[50px] bg-white shadow-md rounded-full flex  justify-around items-center text-secondary">
      {value}
    </div>
  );
};

const HistorySingleDetailes = () => {
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState("");
  const [addOnBills, setaddOnBills] = useState(null);
  const reservationAdvmoney = item?.reservationPayment?.reduce(
    (sum, item) => sum + item.paidMoney,
    0
  );
  let checkinAdvmoney = item?.checkInPayment?.reduce(
    (sum, item) => sum + item.paidMoney,
    0
  );
  let checkoutAdvmoney = item?.checkOutPayment?.reduce(
    (sum, item) => sum + item.paidMoney,
    0
  );
  const getItem = async () => {
    try {
      const res = await userRequset.get("/book/history/");
      const apiItem = await res.data.data.data.find(
        (value) => value._id === id
      );
      setItem(apiItem);
      setLoader(false);
      setError("");
    } catch (err) {
      console.log(err);
      setLoader(false);
      if (err.response.data.status === 404) {
        setError("SomeThing Went Wrong");
      }
    }
  };
  useEffect(() => {
    getItem();
  }, []);
  useEffect(() => {
    if (item.addOns) {
      const addOnBillsAmount = item.addOns;
      let sum = 0;
      addOnBillsAmount.forEach((val) => {
        sum += val.amount;
      });
      setaddOnBills(sum);
    }
  }, [item]);
  console.log(!loader && item?.booking[0]?.platformName);

  if (loader) {
    return (
      <div className="w-full h-[500px]">
        <LoadingImage />
      </div>
    );
  } else {
    if (error === "") {
      return (
        <div className="w-full h-auto p-5 rounded-md bg-white">
          <div className="text-secondary text-xl mb-5">
            Booking ID
            <span className="text-black"> :{item?._id}</span>
          </div>
          <CheckinFormHeading heading={"Customer Details"} />
          <div className="flex justify-between mb-5 ">
            <div className="flex flex-col gap-3 w-[250px] ">
              <div className="h-[90px]">
                <div className=" text-textGray mb-2">NAME</div>
                <div className="uppercase">{item.name}</div>
              </div>
              <div>
                <div className=" text-textGray mb-2">ADDRESS</div>
                <div className=" uppercase mb-2">
                  <span>{item.address[0].address}</span>,{" "}
                  <span>{item.address[0].district}</span>,{" "}
                  <span>{item.address[0].state}</span>,{" "}
                  <div>{item.address[0].zipcode}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-[250px]">
              <div className="h-[90px]">
                <div className=" text-textGray mb-2 ">ROOMS</div>
                <div className="flex gap-3">
                  {item.roomNumber.map((item) => (
                    <div
                      className="w-10 h-10 flex items-center justify-center bg-borderGray rounded cursor-pointer text-sm "
                      key={item}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className=" text-textGray mb-2">MEAL TYPE</div>
                <div className="w-[150px] py-2 h-[40px] bg-white shadow rounded-full flex  justify-around items-center text-secondary">
                  {item.mealPlan}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="h-[90px]">
                <div className=" text-textGray mb-2">CHECKED IN</div>
                <div className="w-[200px] py-2 h-[40px] bg-white shadow rounded-full flex  justify-around items-center">
                  <div className="text-sm text-secondary">
                    {moment(item.checkInDate.slice(0, -1)).format("DD/MM/YYYY")}
                  </div>
                  <div className="border border-r-[1px] border-borderGray h-full"></div>
                  <div className="text-sm text-secondary">
                    {moment(item.checkInDate.slice(0, -1)).format("hh:mm A")}
                  </div>
                </div>
              </div>
              <div>
                <div className=" text-textGray mb-2">CHECKED IN</div>
                <div className="w-[200px] py-2 h-[40px] bg-white shadow rounded-full flex  justify-around items-center">
                  <div className="text-sm text-secondary">
                    {moment(item.checkOutDate.slice(0, -1)).format("DD/MM/YYYY")}
                  </div>
                  <div className="border border-r-[1px] border-borderGray h-full"></div>
                  <div className="text-sm text-secondary">
                    {moment(item.checkOutDate.slice(0, -1)).format("hh:mm A")}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {item.booking[0].agencyType === "B2B" && (
            <>
              <CheckinFormHeading heading={item.booking[0].agencyType} />

              <div className="flex gap-5 items-center mb-10">
                <div className="text-xl">Agent Name</div>
                <div className="flex items-center justify-center rounded-lg shadow w-auto h-auto px-5 py-2 bg-white text-xl ">
                  {item.booking[0].agentName}
                </div>
              </div>
              <div className="flex gap-10 items-center  mb-10 ">
                <div className="flex-1 flex gap-5 items-center">
                  <div className="text-lg">B2B</div>
                  <RoundedButton
                    value={
                      item.booking[0].btb === null ? 0 : item.booking[0].btb
                    }
                  />
                </div>
                <div className="flex-1 flex gap-5 items-center">
                  <div className="text-lg">B2C</div>
                  <RoundedButton
                    value={
                      item.booking[0].btc === null ? 0 : item.booking[0].btc
                    }
                  />
                </div>
                <div className="flex-1 flex gap-5 items-center">
                  <div className="text-lg">TAC</div>
                  <RoundedButton
                    value={
                      item.booking[0].tacamount === null
                        ? 0
                        : item.booking[0].tacamount
                    }
                  />
                </div>
              </div>
            </>
          )}
          {item.booking[0].agencyType === "OTA" && (
            <>
              <CheckinFormHeading heading={item.booking[0].agencyType} />

              <div className="flex gap-5 items-center mb-10">
                <div className="text-xl">Platform Name</div>
                <div className="flex items-center justify-center rounded-lg shadow w-auto h-auto px-5 py-2 bg-white text-xl ">
                  {item.booking[0].platformName}
                </div>
              </div>
              <div className="flex gap-10 items-center  mb-10 ">
                <div className="flex-1 flex gap-5 items-center">
                  <div className="text-lg">B2B</div>
                  <RoundedButton
                    value={
                      item.booking[0].btb === null ? 0 : item.booking[0].btb
                    }
                  />
                </div>
                <div className="flex-1 flex gap-5 items-center">
                  <div className="text-lg">B2C</div>
                  <RoundedButton
                    value={
                      item.booking[0].btc === null ? 0 : item.booking[0].btc
                    }
                  />
                </div>
                <div className="flex-1 flex gap-5 items-center">
                  <div className="text-lg">TAC</div>
                  <RoundedButton
                    value={
                      item.booking[0].tacamount === null
                        ? 0
                        : item.booking[0].tacamount
                    }
                  />
                </div>
              </div>
            </>
          )}
          <CheckinFormHeading heading="Paid Bill" />
          <div className="flex gap-10 items-center  mb-10 ">
            <div className="flex-1 flex gap-5 items-center">
              <div className="text-lg whitespace-nowrap">Room Tariff</div>
              <RoundedButton
                value={item.rmTariff === null ? 0 : item.rmTariff}
              />
            </div>
            <div className="flex-1 flex gap-5 items-center">
              <div className="text-lg">credit</div>
              <RoundedButton
                value={
                  item.booking[0].credit === null ? 0 : item.credit
                }
              />
            </div>
            <div className="flex-1 flex gap-5 items-center">
              <div className="text-lg whitespace-nowrap">Add On</div>
              <RoundedButton value={addOnBills} />
            </div>
          </div>
          <CheckinFormHeading heading="Payment Details" />
          <div className="flex gap-10 items-center  mb-10 ">
            <div className="flex-1 flex gap-3 items-center">
              <div className="text-lg whitespace-nowrap">Booking Payment</div>
              <RoundedButton
                value={reservationAdvmoney === null ? 0 : reservationAdvmoney}
              />
            </div>
            <div className="flex-1 flex gap-3 items-center">
              <div className="text-lg whitespace-nowrap">Checkin Payment</div>
              <RoundedButton
                value={checkinAdvmoney === null ? 0 : checkinAdvmoney}
              />
            </div>
            <div className="flex-1 flex gap-3 items-center">
              <div className="text-lg whitespace-nowrap">Checkout payment </div>
              <RoundedButton value={checkoutAdvmoney} />
            </div>
          </div>
          <div className="flex gap-10 items-center  mb-10 ">
            <div className="flex-1 flex gap-5 items-center">
              <div className="text-lg whitespace-nowrap">Total Amount</div>
              <RoundedButton
                value={item.totalBill === null ? 0 : item.totalBill}
              />
            </div>
            <div className="flex-1 flex gap-5 items-center">
              <div className="text-lg">Discount</div>
              <RoundedButton
                value={item.discount === null ? 0 : item.discount}
              />
            </div>
            <div className="flex-1 flex gap-5 items-center">
              <div className="text-lg whitespace-nowrap">Final Amount</div>
              <RoundedButton value={item.finalBill} />
            </div>
          </div>
          {item.remarks !== "" && (
            <>
              <CheckinFormHeading heading="Remark" />
              <div className=" w-full h-auto p-3 bg-borderGray rounded-md">
                {item.remarks}
              </div>
            </>
          )}
        </div>
      );
    } else {
      return <div>{error}</div>;
    }
  }
};

export default HistorySingleDetailes;
