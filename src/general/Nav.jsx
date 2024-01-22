import React from "react";
import { FiBell, FiChevronDown } from "react-icons/fi";
import Search from "../assets/icons/search.svg";
import Profile from "../assets/icons/profile.svg";
import { useAuthContext } from "../hooks/useAuthContext";

const Navb = () => {
  const {user}=useAuthContext()
  return (
    <div className=" sticky top-0 w-full flex justify-end gap-5 items-center  h-[80px] px-10  z-[99] bg-lightBlue">
      {/* <div className="flex items-center gap-2 w-[350px] h-12 p-2 bg-white rounded-md border border-borderGray">
        <img src={Search} className="w-[20px] h-[22px]" />
        <input
          type="text"
          placeholder="Search"
          className="w-full h-full box-border px-3 outline-none placeholder:text-textGray"
        />
      </div>

      <div className="w-10 h-10 rounded-full bg-white flex justify-center items-center relative  cursor-pointer ">
        <FiBell size={20} />
        <div className="w-3 h-3 rounded-full bg-red-600 absolute top-0 right-0 "></div>
      </div> */}
      <div className="flex px-5 items-center gap-5 cursor-pointer">
        <img
          src={Profile}
          className="w-10 h-10 rounded-full object-cover"
          alt=""
        />
        <div className="text-[18px]  capitalize ">{user.user.name}</div>
        <FiChevronDown size={20} />
      </div>
    </div>
  );
};

export default Navb;
