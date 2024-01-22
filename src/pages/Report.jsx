import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PageHeading from "../components/PageHeading";

const Report = () => {
  const navigate = useNavigate();
  const location=useLocation()
  const pathname=location.pathname.split('/')[2]

  return (
    <>
      <PageHeading heading="Reports" />
      <div className="mt-10 w-full flex justify-start gap-10">
        <div
          className={`w-[200px] h-[60px]  rounded-xl cursor-pointer ${
            pathname === "sales"
              ? "text-white bg-secondary "
              : "bg-white text-black"
          } flex justify-center items-center text-xl `}
          onClick={() => navigate("/report/sales")}
        >
          Sales Reports
        </div>
        <div
          className={`w-[200px] h-[60px]  rounded-xl cursor-pointer ${
            pathname === "b2b" ? "text-white bg-secondary " : "bg-white text-black"
          } flex justify-center items-center text-xl `}
          onClick={() => navigate("/report/b2b")}
        >
          B2B Business
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default Report;
