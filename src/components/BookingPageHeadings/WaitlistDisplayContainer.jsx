import React, { useState } from "react";
import { userRequset } from "../../api/requestMethods";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import ConformPopUp from "../ConformPopUp";

export const Button = ({ value, green, handleClick }) => {
  return (
    <div
      onClick={handleClick}
      className={`w-[130px] h-[35px] ${
        green ? "bg-secondary max-xl:w-[110px]" : "bg-black"
      }   rounded-full text-white flex justify-center items-center cursor-pointer `}
    >
      {value}
    </div>
  );
};

export const PlaneButton = ({ value }) => {
  return (
    <div className="w-[90%] h-[35px] bg-white border-2 border-borderGray rounded-full text-sm flex justify-center items-center text-secondary font-[500]">
      {value}
    </div>
  );
};

const WaitlistDisplayContainer = ({
  item,
  checkout,
  history,
  getWaitlist,
  getAllWaitList,
  setLoaderMain,
  waitlist,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [popUpaction, setPopUpAction] = useState("");
  const [popUpError, setPopUpError] = useState("");

  const openPopup = (action) => {
    setOpen(true);
    setPopUpAction(action);
  };
  // const handleConform = async () => {
  //   try {
  //     setLoader(true);
  //     const res = await userRequset.get(`/book/confirm/${item._id}`);
  //     console.log(res.data);
  //     setLoaderMain(true);
  //     getWaitlist();
  //     getAllWaitList();
  //     setLoader(false);
  //     setOpen(false);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const deleteCheckin = () => {
    setLoader(true);
    userRequset
      .delete(`/book/booking/${item._id}`)
      .then((res) => {
        console.log(res);
        getWaitlist();
        getAllWaitList();
        setLoader(false);
        setOpen(false);
        setPopUpError("");
      })
      .catch((err) => {
        console.log(err);
        setPopUpError("Something went wrong");
        setLoader(false);
      });
  };
  console.log(moment.utc(item.checkInDate).format());
  return (
    <div
      className={`w-full h-auto p-5 mb-5 bg-white rounded-md shadow-lg max-xl:px-2 ${
        history ? "cursor-pointer" : ""
      } `}
      onClick={() => history && navigate(`/history/${item._id}`)}
    >
      <div className="flex justify-between items-center">
        <div className="text-[20px] text-secondary">
          Name :<span className="text-black"> {item?.name}</span>
        </div>
        {waitlist && (
          <div
            className="w-[80px] h-[32px] bg-red-200 rounded-full cursor-pointer flex justify-center items-center text-sm font-[500] text-red-800"
            onClick={() => openPopup("delete")}
          >
            Delete
          </div>
        )}
      </div>
      <div className="w-full border-b border-textGray my-3"></div>
      <div className="flex  ">
        <div className="flex-[1]">
          <div className=" font-[500] text-secondary">Rooms</div>
        </div>
        <div className="flex-1">
          <div className=" font-[500] text-secondary">Meal Type</div>
        </div>
        <div className="flex-1">
          <div className=" font-[500] text-secondary whitespace-nowrap ">
            Booking Type
          </div>
        </div>
        <div className="flex-1 max-xl:flex-[2]">
          <div className=" font-[500] text-secondary max-xl:ml-2">
            Check IN EXP
          </div>
        </div>
        <div className="flex-1 max-xl:flex-[2]">
          <div className=" font-[500] text-secondary ">Check OUT EXP</div>
        </div>
      </div>
      <div className="flex mt-3 items-center">
        <div className="flex-[1] flex gap-2 flex-wrap">
          {item?.roomNumber?.map((value, ind) => {
            return (
              <div
                key={ind}
                className={` w-10 h-10 flex justify-center items-center bg-secondary  text-[13px] rounded text-white `}
              >
                {value}
              </div>
            );
          })}
        </div>
        <div className="flex-1 mr-1">
          <Button green value={item?.mealPlan} />
        </div>
        <div className="flex-1">
          <Button green value={item?.booking[0].agencyType} />
        </div>
        <div className="flex-1 max-xl:flex-[2]">
          <PlaneButton
            value={`${moment
              .utc(item.checkInDate)
              .format("DD/MM/YY")} | ${moment(item.checkInDate)
              .utc()
              .format("h:mm A")}`}
          />
        </div>
        <div className="flex-1 max-xl:flex-[2]">
          <PlaneButton
            value={`${moment
              .utc(item.checkOutDate)
              .format("DD/MM/YY")} | ${moment(item.checkOutDate)
              .utc()
              .format("h:mm A")}`}
          />
        </div>
      </div>
      {!history && (
        <>
          <div className="w-full border-b border-textGray my-3"></div>
          <div className="flex gap-5 justify-end">
            {checkout ? (
              <Button
                value="CHECK OUT"
                green
                handleClick={() => navigate(`/checkoutconfirm/${item._id}`)}
              />
            ) : (
              <>
                <Button
                  value={item.ischeckedIn ? "Checked In" : "Check In"}
                  green={item.ischeckedIn}
                  handleClick={() =>
                    !item.ischeckedIn && navigate(`/checkin/${item._id}`)
                  }
                />
                <Button
                  value={item.isConfirmed ? "Confirmed" : "Confirm"}
                  green={item.isConfirmed}
                  handleClick={() => !item.isConfirmed && navigate(`/checkinConform/${item._id}`)}
                />
              </>
            )}
          </div>
        </>
      )}
      {open && (
        <ConformPopUp
          setOpen={setOpen}
          handleConfirm={() =>
            popUpaction === "confirm" ? handleConform() : deleteCheckin()
          }
          loader={loader}
          action={popUpaction + " Waitlist Data"}
          error={popUpError}
          setError={setPopUpError}
        />
      )}
    </div>
  );
};

export default WaitlistDisplayContainer;
