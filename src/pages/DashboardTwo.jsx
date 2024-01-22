import React, { useEffect, useState } from "react";
import PageHeading from "../components/PageHeading";
import CurrentAnalysis from "../components/CurrentAnalysis";
import SalesAnalysis from "../components/SalesAnalysis";
import { tokenValid, userRequset } from "../api/requestMethods";
import LoadingImage from "../components/LoadingImage";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const Dashboard = () => {
  const [Analysis, setAnalysis] = useState("current");
  const [checkinCount, setCheckinCount] = useState(null);
  const [checkOutCount, setCheckOutCount] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [TodayAmount, setTodayAmount] = useState(0);
  const [weekAmount, setWeekAmount] = useState(0);

  const [loader, setLoader] = useState(false);
  const getCheckinData = async () => {
    try {
      const res = await userRequset.get("/book/waitinglist");
      setCheckinCount(res.data.count);
    } catch (err) {
      console.log(err);
    }
  };
  const getCheckoutData = async () => {
    try {
      const res = await userRequset.get("/book/checkoulIst");
      setCheckOutCount(res.data.count);
    } catch (err) {
      console.log(err);
    }
  };
  const getRoomData = async () => {
    try {
      const res = await userRequset.get("/room");
      setRoomData(res.data.data.rooms);
    } catch (err) {
      console.log(err);
    }
  };
  const getHistory = async () => {
    try {
      const res = await userRequset.get("/book/history");
      setHistoryData(res.data.data.data);
      setLoader(true);
    } catch (err) {
      setLoader(true);
      console.log(err);
    }
  };
  useEffect(() => {
    getCheckinData();
    getCheckoutData();
    getRoomData();
    getHistory();
  }, []);

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
    console.log("a");
  }, [historyData]);

  if (loader) {
    if (historyData.length > 0) {
      return (
        <div>
          <PageHeading
            heading={"Dashboard"}
            time={"10:20 AM"}
            date={"10/07/23"}
          />
          <div className="flex my-6 gap-5  ">
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
          <div>
            {Analysis === "current" ? (
              <CurrentAnalysis
                checkin={checkinCount}
                checkout={checkOutCount}
                roomData={roomData}
                TodayAmount={TodayAmount}
                weekAmount={weekAmount}
              />
            ) : (
              <SalesAnalysis />
            )}
          </div>
        </div>
      );
    } else {
      return <div>Something went wrong</div>;
    }
  } else {
    return (
      <div className="h-[500px]">
        <LoadingImage />
      </div>
    );
  }
};

export default Dashboard;
