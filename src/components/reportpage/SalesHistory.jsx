import React, { useEffect, useState } from "react";
import ReportHeading from "./ReportHeading";
import WaitlistDisplayContainer from "../BookingPageHeadings/WaitlistDisplayContainer";
import { userRequset } from "../../api/requestMethods";
import LoadingImage from "../LoadingImage";
import moment from "moment";
import { catchError } from "../../api/tokenExpire";

import ErrorMessage from "../ErrorMessage";
import { useAuthContext } from "../../hooks/useAuthContext";

const SalesHistory = () => {
  
  const currentDate = new Date();
  const prevWeekDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - 7
  );
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);
  const { user, dispatch } = useAuthContext();
  const role = user.user.role;
  const [from, setFrom] = useState(
    moment(role === "gm" ? new Date() : prevWeekDate).format("DD/MM/YYYY")
  );
  const [to, setTo] = useState(moment(new Date()).format("DD/MM/YYYY"));
  const [error, setError] = useState("");

  const getHistoryList = async () => {
    setLoader(true);
    try {
      const responce = await userRequset.get(
        `/book/history/?from=${from}&to=${to}`
      );
      setData(responce.data.data.data);
      setLoader(false);
      if (responce.data.data.data.length > 0) {
        setError("");
      } else {
        setError("There is No Waitlist Data Avilable");
      }
    } catch (err) {
      setLoader(false);
      catchError(err, dispatch, setError);
      console.log(err);
    }
  };

  useEffect(() => {
    getHistoryList();
  }, [from, to]);
  return (
    <div className="mt-10">
      <ReportHeading
        heading={"Sales History"}
        sales
        data={data}
        setFrom={setFrom}
        from={from}
        setTo={setTo}
        to={to}
        getHistoryList={getHistoryList}
      />
      {loader ? (
        <div className="w-full h-[400px]">
          <LoadingImage />
        </div>
      ) : error === "" ? (
        data.map((item, ind) => (
          <WaitlistDisplayContainer key={ind} history item={item} />
        ))
      ) : (
        <ErrorMessage error={error} />
      )}
    </div>
  );
};

export default SalesHistory;
