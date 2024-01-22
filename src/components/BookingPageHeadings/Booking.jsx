import React, { useEffect, useState } from "react";
import BookingDisplayContainer from "./BookingDisplayContainer";
import { userRequset } from "../../api/requestMethods";
import LoadingImage from "../LoadingImage";
import { useAuthContext } from "../../hooks/useAuthContext";
import { catchError } from "../../api/tokenExpire";
import ErrorMessage from "../ErrorMessage";
import moment from "moment";
import HistoryDateSelection from "./HistoryDateSelection";

const Bookings = () => {
  const [data, setData] = useState([]);
  const [SRP, setSRP] = useState([]);
  const [DWP, setDWP] = useState([]);
  const [DMP, setDMP] = useState([]);
  const [DED, setDED] = useState([]);
  const [DHG, setDHG] = useState([]);
  const [SHG, setSHG] = useState([]);
  const [date, setDate] = useState(moment(new Date()).format("DD-MM-YYYY"));
  const [isLoaded, setIsLoader] = useState(false);
  const [error, setError] = useState("");
  const { dispatch } = useAuthContext();
  const getRooms = async () => {
    setIsLoader(false);
    try {
      const responce = await userRequset.get(`/room/${date}`);
      setData(responce.data.data.rooms);
      console.log(responce.data.data.rooms);
    } catch (err) {
      setIsLoader(true);
      catchError(err, dispatch, setError);
    }
  };

  useEffect(() => {
    getRooms();
  }, [date]);

  useEffect(() => {
    if (data.length > 0) {
      const srpdata = data.filter((room) => room.roomTypeCode === "SRP");
      setSRP(srpdata);
      const dwpdata = data.filter((room) => room.roomTypeCode === "DWP");
      setDWP(dwpdata);
      const dmpdata = data.filter((room) => room.roomTypeCode === "DMP");
      setDMP(dmpdata);
      const deddata = data.filter((room) => room.roomTypeCode === "DED");
      setDED(deddata);
      const dhgdata = data.filter((room) => room.roomTypeCode === "DHG");
      setDHG(dhgdata);
      const shgdata = data.filter((room) => room.roomTypeCode === "SHG");
      setSHG(shgdata);
      setIsLoader(true);
    }
  }, [data]);

  // if (isLoaded) {
  //   if (error === "") {
  return (
    <>
      <div className="mb-10 flex justify-center">
        <HistoryDateSelection selected={date} setSelected={setDate} />
      </div>
      {isLoaded ? (
        error === "" ? (
          <div className="mb-5">
            <div className="flex justify-between items-center">
              <div className="my-2 flex gap-5">
                <div className="flex gap-1 items-center">
                  <div className="w-4 h-4 bg-none border rounded bg-white border-secondary "></div>
                  <div>Available</div>
                </div>

                <div className="flex gap-1 items-center">
                  <div className="w-4 h-4  border rounded bg-secondary border-secondary "></div>
                  <div>Booked</div>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-4 h-4 bg-red-600 border rounded "></div>
                  <div>on duty</div>
                </div>
              </div>
              <div className="text-sm">* AC Available Rooms</div>
            </div>

            <div className="w-full h-auto p-10 bg-white mt-5 rounded-lg flex flex-col gap-14">
              <BookingDisplayContainer data={SRP} getRooms={getRooms} />
              <BookingDisplayContainer data={SHG} getRooms={getRooms} />
            </div>
            <div className="w-full h-auto p-10 bg-white rounded-lg flex flex-col gap-14 mt-10">
              <BookingDisplayContainer data={DWP} getRooms={getRooms} />
              <BookingDisplayContainer data={DMP} getRooms={getRooms} />
              <BookingDisplayContainer data={DED} getRooms={getRooms} />
              <BookingDisplayContainer data={DHG} getRooms={getRooms} />
            </div>
          </div>
        ) : (
          <ErrorMessage error={error} />
        )
      ) : (
        <LoadingImage />
      )}
    </>
  );
  //   } else {
  //     return ;
  //   }
  // } else {
  //   return ;
  // }
};

export default Bookings;
