import React, { useState } from "react";
import PageHeading from "../components/PageHeading";
// import Bookings from "../components/BookingPageHeadings/Booking";
// import Waitlist from "../components/BookingPageHeadings/Waitlist";
// import CheckInOut from "../components/BookingPageHeadings/CheckInOut";
// import History from "../components/BookingPageHeadings/History";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Booking = () => {
  const heading = [
    {
      id: 1,
      title: "Booking",
      route: "booking",
    },
    {
      id: 2,
      title: "Waitlist",
      route: "waitlist",
    },
    {
      id: 3,
      title: "Check Out",
      route: "checkout",
    },
    {
      id: 4,
      title: "History",
      route: "history",
    },
  ];
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.split("/")[2];

  console.log(location.pathname.split("/")[2]);
  return (
    <div>
      <PageHeading heading={"Bookings"} />
      <div className="w-full h-[70px] bg-white py-5 px-14 flex justify-between gap-10 my-8 items-center rounded-lg">
        {heading.map((item, ind) => (
          <div
            key={ind}
            className={`flex-1 w-full border-[2px] border-[#D9D9D9] flex justify-center items-center rounded-lg h-10 cursor-pointer ${
              item.route === pathname
                ? "text-white bg-secondary "
                : "text-black bg-white"
            } `}
            onClick={() => {
              navigate(`${item.route}`);
            }}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Booking;
