import React from "react";
import Loader from "../assets/Images/Loader.gif";

const LoadingImage = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[260px] h-[260px] rounded-full overflow-hidden flex items-center shadow-md ">
        <img src={Loader} alt="loader" className="rounded-full  object-cover w-[300px] h-[300px] bg-white   "  />
      </div>
    </div>
  );
};

export default LoadingImage;
