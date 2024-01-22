import React from "react";
import Navbar from "../general/Navbar";
import Navb from "../general/Nav";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex w-full h-full">
      <div className="flex-1 bg-white h-screen sticky top-0 px-8 py-5">
        <Navbar />
      </div>
      <div className="flex-[4]  bg-lightBlue ">
        <Navb />
        <div className="py-2 px-10 max-xl:px-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home;
