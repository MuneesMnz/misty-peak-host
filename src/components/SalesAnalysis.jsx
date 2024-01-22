import React, { useEffect, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import DayDropDown from "./reportpage/DayDropDown";
import { userRequset } from "../api/requestMethods";
import moment from "moment";
import HistoryDateSelection from "./BookingPageHeadings/HistoryDateSelection";
import ErrorMessage from "./ErrorMessage";
import LoadingImage from "./LoadingImage";
import { catchError } from "../api/tokenExpire";
import { useAuthContext } from "../hooks/useAuthContext";
import Spinner from "./spinner/Spinner";
import LineChart from "./chart/LineChart";

const SalesAnalysis = ({ from, to }) => {
  const { dispatch } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [BookingCount, setBookingCount] = useState(10);
  const [occupancyRate, setOccupancyRate] = useState(0);
  const [revenueCount, setRevenueCount] = useState(0);
  const [chartShow, setChartShow] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [graphDataError, setGraphDataError] = useState("");

  const handleSalesReport = async () => {
    setIsLoading(true);
    try {
      const req = await userRequset.get(
        `/report/bookingsreport?from=${from}&to=${to}`
      );
      const res = await req.data.data;
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
      } else {
        setGraphDataError("No Data Available For Chart");
        console.log("invalid responce");
        setChartShow(false);
      }
      setBookingCount(res.bookings);
      setOccupancyRate(res.occupancyrate);
      setRevenueCount(res.revenue);
      setIsLoading(false);
      setChartShow(false);
    } catch (err) {
      setIsLoading(false);
      catchError(err, dispatch, setError);
    }
  };

  useEffect(() => {
    handleSalesReport();
  }, [from, to, setGraphDataError]);

  const tiles = [
    {
      title: "Bookings",
      value: BookingCount,
    },
    {
      title: "Occupacy Rate",
      value: occupancyRate,
    },
    {
      title: "Revenue",
      value: revenueCount,
    },
  ];

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
      {isLoading ? (
        <div className="h-[300px]">
          <LoadingImage />
        </div>
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <>
          <div className="flex gap-[60px] max-xl:gap-5 my-8 ">
            {tiles.map((item, ind) => (
              <div
                key={ind}
                className="flex-1 min-w-[170px] bg-white h-[130px] rounded-xl border border-[#CFD3D9] p-5 max-xl:px-3 text-center"
              >
                <div className="text-lg text-secondary mb-3 whitespace-nowrap">
                  {item.title}
                </div>
                <div className="text-2xl font-semibold">
                  {item.title === "Revenue" ? "IND " + item.value : item.value}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full h-auto p-5 bg-white mt-10 rounded-xl border-[3px] border-[#DADADA]  ">
            <div className="text-secondary text-xl mb-5">Sales </div>
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

export default SalesAnalysis;
