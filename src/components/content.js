import React from "react";
import Canvas from "./canvas";
import './content.scss';

const Content = ({ children }) => {
  return (
    <div className="app-content">
        <Canvas />
        {children}
    </div>
  );
};

export default Content;