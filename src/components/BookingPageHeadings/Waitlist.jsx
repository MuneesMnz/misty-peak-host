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

const Waitlist = () => {
  const [waitListData, setWaitListData] = useState([]);
  const [allWaitListDataCount, setAllWaitListDataCount] = useState(0);
  const [allWaitlist, setAllWaitlist] = useState([]);
  const [loader, setLoader] = useState(true);
  const [listPopupopen, setListPopupOpen] = useState(false);
  const [date, setDate] = useState(moment(new Date()).format("DD/MM/YYYY"));
  const [error, setError] = useState("");
  const [errorAllData, setErrorAllData] = useState("");
  const { dispatch } = useAuthContext();

  const getAllWaitList = async () => {
    setLoader(true);
    try {
      const responce = await userRequset.get(`/book/waitinglist/`);
      setAllWaitListDataCount(responce.data.data.data.length);
      setAllWaitlist(responce.data.data.data);
      if (responce.data.data.data.length === 0) {
        setErrorAllData("No Waitlist Data Available");
      } else {
        setErrorAllData("");
      }
      setLoader(false);
    } catch (err) {
      setLoader(false);
      catchError(err, dispatch, setError);
    }
  };
  const getWaitlist = async () => {
    setLoader(true);
    try {
      const responce = await userRequset.get(
        `/book/waitinglist/?from=${date}&to=${date}`
      );
      setWaitListData(responce.data.data.data);
      if (responce.data.data.data.length > 0) {
        setError("");
      } else {
        setError("There is No Waitlist Data Avilable On");
      }
      setLoader(false);
    } catch (err) {
      setLoader(false);
      catchError(err, dispatch, setError);
    }
  };

  useEffect(() => {
    getWaitlist();
    getAllWaitList();
  }, [date]);
  // if (loader) {
  //   return <LoadingImage />;
  // } else {
  return (
    <>
      <DateAndCountHead
        date={date}
        setDate={setDate}
        setOpen={setListPopupOpen}
        count={allWaitListDataCount}
        countHeading="Total Waiting List Data "
      />
      {listPopupopen && (
        <FullDataShowModal title={"Waitlist Data"} SetOpen={setListPopupOpen}>
          {errorAllData === "" ? (
            allWaitlist.map((item, ind) => (
              <WaitlistDisplayContainer
                key={ind}
                item={item}
                getWaitlist={getWaitlist}
                getAllWaitList={getAllWaitList}
                setLoaderMain={setLoader}
                waitlist
              />
            ))
          ) : (
            <ErrorMessage error={errorAllData} />
          )}
        </FullDataShowModal>
      )}

      {loader ? (
        <LoadingImage />
      ) : error === "" ? (
        <div className="w-full h-auto ">
          {waitListData.map((item, ind) => (
            <WaitlistDisplayContainer
              key={ind}
              item={item}
              getWaitlist={getWaitlist}
              setLoaderMain={setLoader}
              waitlist
            />
          ))}
        </div>
      ) : (
        <ErrorMessage error={error} />
      )}
    </>
  );
};

export default Waitlist;
