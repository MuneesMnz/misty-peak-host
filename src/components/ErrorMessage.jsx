import React from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const ErrorMessage = ({ error }) => {
  const { dispatch } = useAuthContext();

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };
  return (
    <div className="w-full h-[150px] flex flex-col justify-center items-center rounded-md  bg-white shadow-md">
      <div className="text-secondary font-semibold text-3xl">{error}</div>
      {/* {error !== "There is No Waitlist Data Avilable" && (
        <div
          className="w-[150px] h-[40px] bg-secondary text-white rounded-md mt-5 flex justify-center items-center cursor-pointer text-xl"
          onClick={handleLogout}
        >
          Logout
        </div>
      )} */}
    </div>
  );
};

export default ErrorMessage;
