import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiSettings, FiLogOut } from "react-icons/fi";
import LogoSvg from "../assets/Images/Logo.svg";
import DashboardSvg from "../assets/icons/Vector.svg";
import BookingSvg from "../assets/icons/checklist-icon.svg";
import PurchaseSvg from "../assets/icons/card.svg";
import ReportSvg from "../assets/icons/report-icon.svg";
import UserSvg from "../assets/icons/galaAdd0.svg";
import ReservationSvg from "../assets/icons/Reservation.svg";
import { userRequset } from "../api/requestMethods";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { dispatch, user } = useAuthContext();

  const navList = [
    {
      name: "Dashboard",
      link: "/",
      icon: DashboardSvg,
      route: "",
    },
    {
      name: "Reservation",
      link: "/reservation",
      icon: ReservationSvg,
      route: "reservation",
    },
    {
      name: "Booking",
      link: "/booking/booking",
      icon: BookingSvg,
      route: "booking",
    },
    {
      name: "Purchase",
      link: "/purchase",
      icon: PurchaseSvg,
      route: "purchase",
    },
    {
      name: "Reports",
      link: "/report/sales",
      icon: ReportSvg,
      route: "report",
    },
    {
      name: "B2B Business",
      link: "/b2b",
      icon: ReportSvg,
      route: "b2b",
    },
    {
      name: "Add User",
      link: "/user",
      icon: UserSvg,
      route: "user",
    },
  ];

  console.log(user.user);

  const handleLogout = () => {
    userRequset
      .get("/user/logout")
      .then((res) => {
        console.log(res);
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const location = useLocation();
  const pathname = location.pathname.split("/")[1];
  console.log("pathname", pathname);

  return (
    <div className="flex flex-col justify-between gap-5 items-start w-full h-full ">
      <div className="w-[170px] h-[140px] mx-auto">
        <img src={LogoSvg} alt="logo" />
      </div>

      <div className="w-full">
        <div className="  text-textGray text-[13px] mb-2">Main Menu</div>
        <div className="flex flex-col items-center ">
          {navList.map((value, index) => (
            <NavLink
              key={index}
              to={value.link}
              className={({ isActive }) =>
                `w-full  rounded-full flex  gap-5 items-center text-center justify-start py-2 px-10 text-[19px] border
                 hover:border-textGray hover:bg-gray-100 ${
                  value.route === pathname
                    ? "border-textGray bg-gray-100 "
                    : "border-white"
                } mb-2  transition-all duration-300 `
              }
            >
              <img src={value.icon} className="w-[20px]" alt="icons" />
              {value.name}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="w-full">
        <div className="  text-textGray text-[13px] mb-2">Actions</div>
        {/* <div className="w-full  rounded-full flex justify-start gap-5 items-center px-[80px] py-2 text-[20px] cursor-pointer bg-secondary text-white capitalize  mb-2  ">
          <div>
            <FiSettings size={17} />
          </div>
          <div> settings</div>
        </div> */}
        <div
          className="w-full rounded-full flex justify-start gap-5 items-center px-[80px] py-2 text-[19px] cursor-pointer border  border-secondary "
          onClick={handleLogout}
        >
          <div>
            <FiLogOut size={17} />
          </div>
          <div>Logout</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
