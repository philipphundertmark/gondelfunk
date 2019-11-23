import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroadcastTower, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Canvas from "./canvas";
import './content.scss';
import { UserContext } from "../contexts/UserContext";
import { WebSocketContext } from "../contexts/WebSocketContext";

const Content = () => {
  const { user, onLogout } = useContext(UserContext);
  const { send } = useContext(WebSocketContext);
  const [message, setMessage] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }

  const sendMessage = () => {
    console.log("Send message");
    if (!message) {
      return;
    }
    send({
      userId: user.id,
      message
    });
    setMessage("");
  }

  const handleMessageChange = (event) => {
    const { value } = event.target;
    setMessage(value);
  }

  const handleLogout = () => {
    onLogout();
  }

  return (
    <div className="app-content">
        <div className="top-bar">
          <h3>Gondelfunk</h3>
          <div className="logout" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </div>
        </div>

        <div className="bottom-bar">
          <input spellCheck={false} value={message} onChange={handleMessageChange} className="message-input" onKeyDown={handleKeyDown}/>
          <div className={`send-button ${!message ? "is-disabled" : ""}`} onClick={sendMessage}>
            <FontAwesomeIcon icon={faBroadcastTower} />
          </div>
        </div>

        <Canvas />
    </div>
  );
};

export default Content;