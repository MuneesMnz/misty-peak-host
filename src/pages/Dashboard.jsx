import React, { useEffect, useState } from "react";
import PageHeading from "../components/PageHeading";
import CurrentAnalysis from "../components/CurrentAnalysis";
import SalesAnalysis from "../components/SalesAnalysis";
import { userRequset } from "../api/requestMethods";
import LoadingImage from "../components/LoadingImage";
import moment from "moment";
import { useAuthContext } from "../hooks/useAuthContext";
import { catchError } from "../api/tokenExpire";
import ErrorMessage from "../components/ErrorMessage";
import HistoryDateSelection from "../components/BookingPageHeadings/HistoryDateSelection";
import DayDropDown from "../components/reportpage/DayDropDown";

const Dashboard = () => {
  const [Analysis, setAnalysis] = useState("current");
  const [from, setFrom] = useState(moment(new Date()).format("DD-MM-YYYY"));
  const [dateSelectOpen, setDateselectOpen] = useState(false);
  const [to, setTo] = useState(moment(new Date()).format("DD-MM-YYYY"));

  console.log("to",to);

  return (
    <>
      <PageHeading heading={"Dashboard"} />
      <div className="flex justify-between items-center">
        <div className="flex my-5 gap-5  ">
          <div
            onClick={() => setAnalysis("current")}
            className={`w-[180px]  px-3 py-2   text-center ${
              Analysis === "current"
                ? "text-white bg-secondary"
                : "text-secondary bg-white"
            }  rounded-xl cursor-pointer`}
          >
            Current Analysis
          </div>
          <div
            onClick={() => setAnalysis("sales")}
            className={`w-[180px] px-3 py-2   text-center  ${
              Analysis === "sales"
                ? "text-white bg-secondary"
                : "text-secondary bg-white"
            } rounded-xl cursor-pointer`}
          >
            Sales Analysis
          </div>
        </div>
        <DayDropDown setFrom={setFrom} setDateselectOpen={setDateselectOpen} />
      </div>
      <div className="flex gap-10 justify-end mb-5">
        {dateSelectOpen && (
          <div className="flex justify-center items-center gap-4">
            <HistoryDateSelection
              selected={from}
              setSelected={setFrom}
              left={"left-[-120px]"}
            />
            <div className="text-2xl font-semibold ">To</div>
            <HistoryDateSelection
              selected={to}
              setSelected={setTo}
              left={"left-[-120px]"}
            />
          </div>
        )}
      </div>
      <div>
        {Analysis === "current" ? (
          <CurrentAnalysis from={from} to={to} />
        ) : (
          <SalesAnalysis from={from} to={to} />
        )}
      </div>
    </>
  );
};

export default Dashboard;
