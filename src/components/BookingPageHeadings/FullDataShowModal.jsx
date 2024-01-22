import React from "react";
import { IoIosClose } from "react-icons/io";

const FullDataShowModal = ({ children, title, SetOpen }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-gray-800/30 z-[999] flex justify-center items-center  ">
      <div className="w-[1100px] h-[530px] bg-white rounded-xl shadow-lg  relative flex flex-col ">
        <div className="flex justify-between items-center bg-white sticky top-0 px-10 left-0 w-full h-auto rounded-t-xl  shadow-md shadow-slate-150">
          <h1 className="text-2xl my-5">{title}</h1>

          <div
            className="cursor-pointer"
            onClick={() => SetOpen(false)}
          >
            <IoIosClose size={50} />
          </div>
        </div>
        <div className="flex-1 px-10 pt-5 overflow-y-auto mb-5 ">
        {children}
        </div>
      </div>
    </div>
  );
};

export default FullDataShowModal;
