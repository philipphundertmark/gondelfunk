import React from "react";
import iphone from "../assets/iphone.png";
import "./phone.scss";

const Phone = () => {
  return (
    <div className="phone-overlay">
        <img src={iphone} alt="phone" />
    </div>
  );
};

export default Phone;