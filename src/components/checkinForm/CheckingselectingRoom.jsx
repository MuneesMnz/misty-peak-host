import React, { useEffect, useState } from "react";
import { userRequset } from "../../api/requestMethods";
import BookingDisplayContainer from "../BookingPageHeadings/BookingDisplayContainer";
import { FiX } from "react-icons/fi";
import LoadingImage from "../LoadingImage";
import moment from "moment";
import HistoryDateSelection from "../BookingPageHeadings/HistoryDateSelection";
import ErrorMessage from "../ErrorMessage";

const CheckingselectingRoom = ({ setOpen, setRoomNumber, date }) => {
  const [loader, setLoader] = useState(true);
  const [data, setData] = useState([]);
  const [SRP, setSRP] = useState([]);
  const [SRPRoom, setSRPRoom] = useState([]);
  const [DWP, setDWP] = useState([]);
  const [DWPRoom, setDWPRoom] = useState([]);
  const [DMP, setDMP] = useState([]);
  const [DMPRoom, setDMPRoom] = useState([]);
  const [DED, setDED] = useState([]);
  const [DEDRoom, setDEDRoom] = useState([]);
  const [DHG, setDHG] = useState([]);
  const [DHGRoom, setDHGRoom] = useState([]);
  const [SHG, setSHG] = useState([]);
  const [SHGRoom, setSHGRoom] = useState([]);
  const [isLoaded, setIsLoader] = useState(false);
  const [error, setError] = useState("");
  const selectDate = moment(new Date(date)).format("DD-MM-YYYY");
  console.log(selectDate);
  const getRooms = async () => {
    setLoader(true);
    try {
      const responce = await userRequset.get(`/room/${selectDate}`);
      setError("");
      setData(responce.data.data.rooms);
      setLoader(false);
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
      setLoader(false);
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

  const submitRooms = () => {
    let select = [
      ...SRPRoom,
      ...DWPRoom,
      ...DMPRoom,
      ...DEDRoom,
      ...DHGRoom,
      ...SHGRoom,
    ];

    setRoomNumber(select);
    setOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 bg-gray-500/30 w-full h-screen flex justify-center items-center z-[100] ">
      <div className="w-[75%] h-[580px] rounded-lg  bg-white text-black overflow-y-scroll relative  ">
        <div className="sticky top-0 left-0 w-full h-auto px-10 py-5 bg-white shadow-lg mb-5 z-[999] ">
          <div className="flex justify-between items-start mb-5 ">
            <div>
              <div className="text-3xl font-[500]">Select Rooms</div>
              <div className="text-sm mt-2">* AC Available Rooms</div>
            </div>

            <div className="w-[200px] h-[55px] shadow-lg rounded-md flex justify-center items-center text-lg font-[600] text-secondary mr-5">
              {selectDate}
            </div>
            {/* <HistoryDateSelection selected={date} left={"-left-[120px]"} /> */}

            <div
              className=" text-3xl cursor-pointer "
              onClick={() => setOpen(false)}
            >
              <FiX />
            </div>
          </div>
          <div className="flex gap-5">
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
        </div>
        {loader ? (
          <LoadingImage />
        ) : error === "" ? (
          <div className="w-full h-auto flex flex-col gap-5 px-10 ">
            <BookingDisplayContainer
              data={SRP}
              loader={isLoaded}
              selectingRoom={SRPRoom}
              setSelectedRooms={setSRPRoom}
              selectRoom
            />
            <BookingDisplayContainer
              data={DWP}
              loader={isLoaded}
              selectingRoom={DWPRoom}
              setSelectedRooms={setDWPRoom}
              selectRoom
            />
            <BookingDisplayContainer
              data={DMP}
              loader={isLoaded}
              selectingRoom={DMPRoom}
              setSelectedRooms={setDMPRoom}
              selectRoom
            />
            <BookingDisplayContainer
              data={DED}
              loader={isLoaded}
              selectingRoom={DEDRoom}
              setSelectedRooms={setDEDRoom}
              selectRoom
            />
            <BookingDisplayContainer
              data={DHG}
              loader={isLoaded}
              selectingRoom={DHGRoom}
              setSelectedRooms={setDHGRoom}
              selectRoom
            />
            <BookingDisplayContainer
              data={SHG}
              loader={isLoaded}
              selectingRoom={SHGRoom}
              setSelectedRooms={setSHGRoom}
              selectRoom
            />
          </div>
        ) : (
          <div className="my-5">
            <ErrorMessage error={error} />
          </div>
        )}
        <div className=" sticky bottom-0 right-0 w-full flex gap-5 pb-5 pt-2 shadow-lg px-10 justify-end bg-white left-0 box-border">
          <div
            onClick={() => setOpen(false)}
            className="w-[100px] h-[40px] rounded-md flex items-center justify-center bg-borderGray cursor-pointer"
          >
            Close
          </div>
          <div
            onClick={submitRooms}
            className="w-[100px] h-[40px] rounded-md flex items-center justify-center text-white bg-secondary cursor-pointer"
          >
            Submit
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckingselectingRoom;
