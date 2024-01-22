import React, { useEffect, useState } from "react";
import WaitlistDisplayContainer from "./WaitlistDisplayContainer";
import { userRequset } from "../../api/requestMethods";

import HistoryDateSelection from "./HistoryDateSelection";
import moment from "moment";
import LoadingImage from "../LoadingImage";
import { useAuthContext } from "../../hooks/useAuthContext";
import { catchError } from "../../api/tokenExpire";
import ErrorMessage from "../ErrorMessage";

const History = () => {
  const [loader, setLoader] = useState(true);

  const currentDate = new Date();
  const prevWeekDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - 7
  );
  const [historyData, setHistoryData] = useState([]);
  const [error, setError] = useState("");
  const [toDate, setToDate] = useState(moment(new Date()).format("DD/MM/YYYY"));
  const [fromDate, setFromDate] = useState(
    moment(prevWeekDate).format("DD/MM/YYYY")
  );
  const { dispatch } = useAuthContext();

  const getHistoryList = async (date) => {
    setLoader(true);
    try {
      const responce = await userRequset.get(`/book/history${date}`);
      setHistoryData(responce.data.data.data);
      if (responce.data.data.data.length === 0) {
        setError("There is No History Data Avilable");
      } else {
        setError("");
      }
      setLoader(false);
    } catch (err) {
      setLoader(false);
      catchError(err, dispatch, setError);
    }
  };

  useEffect(() => {
    getHistoryList(`/?from=${fromDate}&to=${toDate}`);
  }, [fromDate, toDate]);

  return (
    <div className="w-full h-auto ">
      <div className="flex justify-center items-center gap-10 mb-10">
        <HistoryDateSelection
          selected={fromDate}
          setSelected={setFromDate}
          prev
        />
        <div className="text-2xl font-semibold ">To</div>
        <HistoryDateSelection selected={toDate} setSelected={setToDate} />
      </div>
      {loader ? (
        <LoadingImage />
      ) : error === "" ? (
        historyData.map((item, ind) => (
          <WaitlistDisplayContainer key={ind} item={item} history />
        ))
      ) : (
        <ErrorMessage error={error} />
      )}
    </div>
  );
};

export default History;
