import React from "react";
import Canvas from "./canvas";
import './content.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroadcastTower } from '@fortawesome/free-solid-svg-icons';

const Content = ({ children }) => {
  return (
    <div className="app-content">
        <div className="bottom-bar">
          <input spellCheck={false} className="message-input" type="text"/>
          <div className="send-button">
            <FontAwesomeIcon icon={faBroadcastTower} />
          </div>
        </div>
        <Canvas />
    </div>
  );
};

export default Content;