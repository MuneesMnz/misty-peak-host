import React from "react";
import "./spinner.css";

const Spinner = ({ color,width,height }) => {
  return (
    <div className="lds-ring">
      <div
        style={{ borderColor: ` ${color} transparent transparent transparent`,width:width,height:height }}
      ></div>
      <div
        style={{ borderColor: ` ${color} transparent transparent transparent`,width:width,height:height }}
      ></div>
      <div
        style={{ borderColor: ` ${color} transparent transparent transparent`,width:width,height:height }}
      ></div>
      <div
        style={{ borderColor: ` ${color} transparent transparent transparent`,width:width,height:height }}
      ></div>
    </div>
  );
};

export default Spinner;
