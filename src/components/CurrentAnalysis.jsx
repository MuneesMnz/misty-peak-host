import moment from "moment";
import React, { useEffect, useState } from "react";
import { FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import LineChart from "./chart/LineChart";
import { userRequset } from "../api/requestMethods";
import { catchError } from "../api/tokenExpire";
import { useAuthContext } from "../hooks/useAuthContext";
import LoadingImage from "./LoadingImage";
import ErrorMessage from "./ErrorMessage";
import Spinner from "./spinner/Spinner";

const CurrentAnalysis = ({ from, to }) => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  //states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkinCount, setCheckinCount] = useState(null);
  const [checkOutCount, setCheckOutCount] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [graphDataError, setGraphDataError] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const [TodayAmount, setTodayAmount] = useState(0);
  const [weekAmount, setWeekAmount] = useState(0);
  const [chartShow, setChartShow] = useState(false);
  const [chartData, setChartData] = useState(null);

  //filter for count
  let vacent = roomData.filter((item) => item.availability === "Available");
  let onDuty = roomData.filter((item) => item.availability === "Engaged");
  let occupied = roomData.filter((item) => item.availability === "Booked");


  //finding prsentage from api count
  let vacentPerc = (vacent.length / roomData.length) * 100;
  let occupiedPerc = (occupied.length / roomData.length) * 100;
  let onDutyPerc = (onDuty.length / roomData.length) * 100;

  const handleBookingChartData = async () => {
    setLoading(true);
    setChartShow(true);
    const fromDateFormat = moment(from, "DD-MM-YYYY").format("DD/MM/YYYY");
    const toDateFormat = moment(to, "DD-MM-YYYY").format("DD/MM/YYYY");
    try {
      const req = await userRequset.get(
        `/report/bookingsreport?from=${fromDateFormat}&to=${toDateFormat}`
      );
      const res = await req.data.data;
      // console.log("API Response:", res);
      if (res && res.checkoutdates.length > 0 && res.finalbills.length > 0) {
        setGraphDataError("");
        setChartData({
          labels: res.checkoutdates.map((item) =>
            moment(item).format("MMM DD")
          ),
          datasets: [
            {
              label: "Users Gained",
              data: res.finalbills,
              backgroundColor: ["#EDF3FF"],
              borderColor: "#007942",
              borderWidth: 2,
            },
          ],
        });
        setLoading(false);
        setChartShow(false);
      } else {
        setGraphDataError("No Data Available For Chart");
        console.log("invalid responce");
        setChartShow(false);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const getCheckinData = async () => {
    setLoading(true);
    try {
      const res = await userRequset.get("/book/waitinglist");
      setCheckinCount(res.data.count);
      setLoading(false);
    } catch (err) {
      catchError(err, dispatch, setError);
      setLoading(false);
    }
  };
  const getCheckoutData = async () => {
    setLoading(true);
    try {
      const res = await userRequset.get("/book/checkoulIst");
      setCheckOutCount(res.data.count);
      setLoading(false);
    } catch (err) {
      catchError(err, dispatch, setError);
      setLoading(false);
    }
  };
  const getRoomData = async () => {
    setLoading(true);
    try {
      const res = await userRequset.get(`/room/${to}`);
      setRoomData(res.data.data.rooms);
      setLoading(false);
    } catch (err) {
      catchError(err, dispatch, setError);
      setLoading(false);
    }
  };
  const getHistory = async () => {
    setLoading(true);
    try {
      const res = await userRequset.get("/book/history");
      setHistoryData(res.data.data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      catchError(err, dispatch, setError);
    }
  };

  useEffect(() => {
    handleBookingChartData();
  }, [from, to, setGraphDataError]);
  useEffect(() => {
    getCheckinData();
    getCheckoutData();
    getRoomData();
    getHistory();
  }, [from, to]);

  useEffect(() => {
    let Today = historyData.filter(
      (value) =>
        moment(value.checkOutDate).format("DD/MM/YYYY") ===
        moment(new Date()).format("DD/MM/YYYY")
    );
    let Todaysum = 0;
    if (Today.length > 0) {
      Today.forEach((value) => {
        Todaysum += value.finalBill;
      });
      setTodayAmount(Todaysum);
    }

    let TodayDate = new Date();
    let oneweekAgo = new Date(TodayDate);
    oneweekAgo.setDate(TodayDate.getDate() - 7);
    let week = historyData.filter((value) => {
      const itemData = new Date(value.checkOutDate);
      return itemData >= oneweekAgo && itemData <= TodayDate;
    });
    let Weeksum = 0;
    if (week.length > 0) {
      week.forEach((value) => {
        Weeksum += value.finalBill;
      });
      setWeekAmount(Weeksum);
    }
  }, [historyData]);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        // Additional y-axis options
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
    // title: {
    //   display: true,
    //   text: "Line Chart Title",
    //   font: {
    //     size: 16,
    //   },
    // },
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 5,
        hoverRadius: 7,
        // Customize the data points on the line
        hitRadius: 10, // Increase the hit radius for better hover experience
        hoverBorderWidth: 2, // Border width when hovered
        cursor: "pointer",
      },
      line: {
        tension: 0.3, // Adjust the line curve. Set to 0 for straight lines.
        // Additional line options
      },
    },
  };

  return (
    <>
      {loading ? (
        <LoadingImage />
      ) : error !== "" ? (
        <ErrorMessage error={error} />
      ) : (
        <>
          <div className="flex gap-10 max-xl:gap-5 w-full h-[220px]">
            <div className="bg-white flex-1 rounded-md p-5 max-xl:p-3 flex flex-col justify-between">
              <div className="text-[20px] text-secondary">Reservation</div>
              <div className="flex justify-between ">
                <div>
                  <div className="flex text-textGray gap-1 my-2 items-center  ">
                    <span className="text-sm whitespace-nowrap">Check IN</span>
                    <span>
                      <FiArrowDownLeft className="text-red-700 text-lg" />
                    </span>
                  </div>
                  <div className="text-4xl">{checkinCount}</div>
                </div>
                <div>
                  <div className="flex text-textGray gap-1 my-2 items-center ">
                    <span className="text-sm whitespace-nowrap">Check OUT</span>

                    <span>
                      <FiArrowUpRight className="text-green-700 text-[18px]" />
                    </span>
                  </div>
                  <div className="text-4xl">{checkOutCount}</div>
                </div>
              </div>
              <button
                className="bg-secondary rounded-full w-full py-2 text-white "
                onClick={() => navigate("/booking/waitlist")}
              >
                Check In/Out Page
              </button>
            </div>
            <div className="bg-lightBlue flex-[2] border-[5px] border-white  rounded-md p-5 flex flex-col justify-between">
              <div className="text-[20px] text-secondary">Occupancy</div>
              <div className="flex gap-5">
                <div className="flex-1">
                  <div className="flex  gap-3 items-center mb-5">
                    <div className={`w-3.5 h-3.5 rounded bg-[#09b509]`}></div>
                    <div className="text-sm">Available</div>
                  </div>
                  <div className="text-3xl">{vacent.length}</div>
                </div>
                <div className="flex-1">
                  <div className="flex  gap-3 items-center mb-5">
                    <div className={`w-3.5 h-3.5 rounded bg-[#9DDE69]`}></div>
                    <div className="text-sm">Booked</div>
                  </div>
                  <div className="text-3xl">{occupied.length}</div>
                </div>
                <div className="flex-1">
                  <div className="flex  gap-3 items-center mb-5">
                    <div className={`w-3.5 h-3.5 rounded bg-[#b2c491]`}></div>
                    <div className="text-sm whitespace-nowrap">On Duty</div>
                  </div>
                  <div className="text-3xl">{onDuty.length}</div>
                </div>
              </div>
              <div className="flex gap-5">
                <div
                  style={{ width: `${vacentPerc}%` }}
                  className={`  bg-[#09b509] h-[50px]  rounded-lg `}
                ></div>
                <div
                  style={{ width: `${occupiedPerc}%` }}
                  className={`  bg-[#9DDE69] h-[50px] rounded-lg `}
                ></div>
                <div
                  style={{ width: `${onDutyPerc}%` }}
                  className={`  bg-[#b2c491] h-[50px]  rounded-lg `}
                ></div>
              </div>
            </div>
            <div className="bg-white flex-1 rounded-md p-5 flex flex-col justify-between">
              <div className="text-[22px] text-secondary">Revenue</div>
              <div className="">
                <div className="text-textGray">Today</div>
                <div className="text-2xl mt-2">IND {TodayAmount}</div>
              </div>
              <div className="">
                <div className="text-textGray">Last 7 Days</div>
                <div className="text-2xl mt-2">IND {weekAmount}</div>
              </div>
            </div>
          </div>
          <div className="w-full h-auto p-5 bg-white mt-10 rounded-xl border-[3px] border-[#DADADA]   ">
            <div className="flex gap-5 items-center mb-5">
              <div className="text-secondary text-xl">Booking</div>
              {/* <div className="text-sm  text-textGray flex items-center gap-2">
            <img src={roundArrow} className="w-4" alt="round" />
            <span>Last update 1m ago</span>
          </div> */}
            </div>
            {chartShow ? (
              <div className="flex justify-center p-5">
                <Spinner color={"#007942"} width={"40px"} height={"40px"} />
              </div>
            ) : (
              <>
                {graphDataError !== "" ? (
                  <div className="flex justify-center p-5">
                    {graphDataError}
                  </div>
                ) : (
                  <div className="w-full h-[320px]">
                    <LineChart data={chartData} options={options} />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default CurrentAnalysis;
