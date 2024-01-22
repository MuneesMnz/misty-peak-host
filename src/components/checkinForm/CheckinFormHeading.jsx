import React from "react";

const CheckinFormHeading = ({ heading }) => {
  return (
    <>
      <div className="text-sm text-textGray mb-2   ">{heading}</div>
      <hr className="mb-5" />
    </>
  );
};

export default CheckinFormHeading;
