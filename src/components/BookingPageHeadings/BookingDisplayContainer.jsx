import { useState } from "react";
import ConformPopUp from "../ConformPopUp";
import { userRequset } from "../../api/requestMethods";
import BookingDetailModal from "./BookingDetailModal";

const BookingDisplayContainer = ({
  data,
  selectingRoom,
  setSelectedRooms,
  getRooms,
  selectRoom,
}) => {
  const lastIndex = data.length - 1;
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalopen] = useState(false);
  const [modaldata, setModalData] = useState({});
  const [id, setId] = useState("");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  console.log("modaldata", data);

  const openMethed = (id) => {
    setId(id);
    setOpen(true);
  };

  const handleModal = (data, roomNo) => {
    setModalopen(true);
    setModalData({ ...data, roomNumber: roomNo });
    console.log("open model");
  };

  const occupancy = data.filter(
    (item) => item.availability === "Booked"
  ).length;
  const vaccent = data.filter((item) => item.availability !== "Booked").length;

  const handleconform = () => {
    setLoader(true);
    userRequset
      .patch(`/room/${id}`)
      .then((res) => {
        setError("");
        setOpen(false);
        getRooms();
        setLoader(false);
      })
      .catch((err) => {
        setError("Something went wrong");
        console.log(err);
        setLoader(false);
      });
  };
  // console.log(selectingRoom);
  return (
    <div className="flex flex-col gap-1 relative  ">
      <div className={`${selectRoom ? "text-2xl" : "text-3xl"}`}>
        {data[0]?.roomType}
      </div>
      <div className="flex justify-between w-full h-[30px] items-center">
        <div className="">
          <div className="text-textGray text-[17px] ">
            Rooms from {data[0]?.roomNumber}-{data[lastIndex]?.roomNumber}
          </div>
        </div>
        <div className="flex ">
          <div className="flex gap-5">
            <div className="w-[180px] bg-secondary h-[35px] rounded-full flex justify-center items-center text-white cursor-pointer text-[15px] ">
              Total Occupancy : {occupancy}
            </div>
            <div className="w-[180px] bg-secondary h-[35px] rounded-full flex justify-center items-center text-white cursor-pointer text-[15px] ">
              Vacant Rooms : {vaccent}
            </div>
          </div>
        </div>
      </div>
      <div className="border border-t-2 border-textGray mt-2 rounded-full"></div>
      <div className="flex gap-10 flex-wrap">
        {data?.map((value, ind) =>
          //room selecting area while reservation
          selectingRoom ? (
            <div
              key={ind}
              onClick={() => {
                if (
                  value.availability === "Available" ||
                  value.availability === "Engaged"
                ) {
                  if (selectingRoom.includes(value.roomNumber)) {
                    const roomdata = selectingRoom.filter(
                      (val) => val !== value.roomNumber
                    );
                    setSelectedRooms(roomdata);
                  } else {
                    setSelectedRooms((prev) => [...prev, value.roomNumber]);
                  }
                }
              }}
              className={`my-5 w-10 h-10 flex justify-center items-center   text-[12px] rounded ${
                // value.availability === "Engaged" ||
                value.availability === "Booked"
                  ? " cursor-not-allowed"
                  : "cursor-pointer"
              } ${
                value.availability === "Booked"
                  ? "bg-secondary text-white"
                  : selectingRoom.includes(value.roomNumber)
                  ? "bg-black/60 text-white bg-none"
                  : value.availability === "Engaged"
                  ? "bg-red-600 text-white"
                  : "bg-white border border-secondary"
              } `}
            >
              {value.IsACAvailable ? value.roomNumber + "*" : value.roomNumber}
            </div>
          ) : (
            //this for booking detailes area
            <div
              onClick={() => {
                value.availability === "Engaged" && openMethed(value._id);
                value.availability === "Booked" &&
                  handleModal(value.bookedData[0], value.roomNumber);
              }}
              key={ind}
              className={`my-5 w-10 h-10 flex justify-center items-center   text-[12px] rounded cursor-pointer ${
                value.availability === "Engaged"
                  ? "bg-red-600 text-white"
                  : value.availability === "Booked"
                  ? "bg-secondary text-white"
                  : "border border-secondary"
              } `}
            >
              {value.IsACAvailable ? value.roomNumber + "*" : value.roomNumber}
            </div>
          )
        )}
        {open && (
          <ConformPopUp
            setOpen={setOpen}
            handleConfirm={handleconform}
            loader={loader}
            action="Change to Available"
            error={error}
            setError={setError}
          />
        )}
        {modalOpen && (
          <BookingDetailModal
            setModalopen={setModalopen}
            data={modaldata}
            setData={setModalData}
          />
        )}
      </div>
    </div>
  );
};

export default BookingDisplayContainer;
