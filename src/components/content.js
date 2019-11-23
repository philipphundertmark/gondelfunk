import React, { useContext, useState } from "react";
import Canvas from "./canvas";
import './content.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroadcastTower } from '@fortawesome/free-solid-svg-icons';
import { WebSocketContext } from "../contexts/WebSocketContext";

const Content = ({ children }) => {
  const { send } = useContext(WebSocketContext);
  const [message, setMessage] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }

  const sendMessage = () => {
    /**
     * TODO: Send message.
     */
    send(message);
    setMessage("");
  }

  const handleMessageChange = (event) => {
    const { value } = event.target;
    setMessage(value);
  }

  return (
    <div className="app-content">
        <div className="bottom-bar">
          <input spellCheck={false} value={message} onChange={handleMessageChange} className="message-input" onKeyDown={handleKeyDown}/>
          <div className="send-button" onClick={sendMessage}>
            <FontAwesomeIcon icon={faBroadcastTower} />
          </div>
        </div>
        <Canvas />
    </div>
  );
};

export default Content;