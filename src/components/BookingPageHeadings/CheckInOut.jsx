import React, { useEffect, useState } from "react";
import WaitlistDisplayContainer from "./WaitlistDisplayContainer";
import { userRequset } from "../../api/requestMethods";
import LoadingImage from "../LoadingImage";
import { catchError } from "../../api/tokenExpire";
import { useAuthContext } from "../../hooks/useAuthContext";
import ErrorMessage from "../ErrorMessage";
import HistoryDateSelection from "./HistoryDateSelection";
import moment from "moment";
import { IoIosClose } from "react-icons/io";
import FullDataShowModal from "./FullDataShowModal";
import DateAndCountHead from "./DateAndCountHead";

const CheckInOut = () => {
  const [checkoutData, setCheckOutData] = useState([]);
  const [checkoutDataCount, setCheckOutDataCount] = useState(0);
  const [allCheckoutData, setAllCheckOutData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [listPopupopen, setListPopupOpen] = useState(false);
  const [date, setDate] = useState(moment(new Date()).format("DD/MM/YYYY"));
  const [error, setError] = useState("");
  const { dispatch } = useAuthContext();
  const getAllCheckOutList = async () => {
    setLoader(true);
    try {
      const responce = await userRequset.get(`/book/checkoulIst/`);
      setCheckOutDataCount(responce.data.data.data.length);
      setAllCheckOutData(responce.data.data.data);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      catchError(err, dispatch, setError);
    }
  };
  const getCheckoutList = async () => {
    setLoader(true);
    try {
      const responce = await userRequset.get(
        `/book/checkoulIst/?from=${date}&to=${date}`
      );
      setCheckOutData(responce.data.data.data);
      if (responce.data.data.data.length > 0) {
        setError("");
      } else {
        setError("There is No Check out Data Avilable");
      }
      setLoader(false);
    } catch (err) {
      setLoader(false);
      catchError(err, dispatch, setError);
    }
  };
  useEffect(() => {
    getCheckoutList();
    getAllCheckOutList();
  }, [date]);
  // if (loader) {
  //   return <LoadingImage />;
  // } else {
  return (
    <>
      <DateAndCountHead date={date} setDate={setDate} countHeading={"Total Check Out"} count={checkoutDataCount} setOpen={setListPopupOpen} />
      {listPopupopen && (
        <FullDataShowModal title={"Check Out Data"} SetOpen={setListPopupOpen}>
          {allCheckoutData.map((item, ind) => (
            <WaitlistDisplayContainer key={ind} item={item} checkout />
          ))}
        </FullDataShowModal>
      )}
      {loader ? (
        <LoadingImage />
      ) : error === "" ? (
        <div className="w-full h-auto ">
          {checkoutData.map((item, ind) => (
            <WaitlistDisplayContainer key={ind} item={item} checkout />
          ))}
        </div>
      ) : (
        <ErrorMessage error={error} />
      )}
    </>
  );
};

export default CheckInOut;
