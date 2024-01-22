import moment from "moment";
import React from "react";

const PageHeading = ({ heading}) => {
  return (
    <div className="flex flex-col mb-5">
      <div className="text-[34px] capitalize">{heading}</div>
    </div>
  );
};

export default PageHeading;
