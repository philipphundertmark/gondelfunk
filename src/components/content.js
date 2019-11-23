import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroadcastTower, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faLaugh } from '@fortawesome/free-regular-svg-icons';
import Canvas from "./canvas";
import './content.scss';
import { UserContext } from "../contexts/UserContext";
import { WebSocketContext } from "../contexts/WebSocketContext";

const Content = () => {
  const { user, onLogout } = useContext(UserContext);
  const { send } = useContext(WebSocketContext);
  const [replyTo, setReplyTo] = useState(null);
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);

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
      type: "message", 
      from: user.id,
      to: null,
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

  const toggleEmojis = () => {
    setShowEmojis(value => !value);
  }

  const sendEmoji = (emoji) => {
    send({
      type: "emoji", 
      from: user.id,
      emoji
    });
  }

  const handleReplyTo = (userId, message, onDeselect) => {
    console.log(userId, message);
    
    setReplyTo({
      to: userId,
      message
    })
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
          <div className="emoji-button" onClick={toggleEmojis}>
            {showEmojis ? (
              <FontAwesomeIcon icon={faTimes} />
            ) : (
              <FontAwesomeIcon icon={faLaugh} />
            )}
            <ul className={`emoji-list ${showEmojis ? "is-displayed" : ""}`}>
              <li onClick={() => sendEmoji("🚠")}><span role="img" aria-label="emoji">🚠</span></li>
              <li onClick={() => sendEmoji("😎")}><span role="img" aria-label="emoji">😎</span></li>
              <li onClick={() => sendEmoji("🤩")}><span role="img" aria-label="emoji">🤩</span></li>
              <li onClick={() => sendEmoji("🥶")}><span role="img" aria-label="emoji">🥶</span></li>
              <li onClick={() => sendEmoji("🍆")}><span role="img" aria-label="emoji">🍆</span></li>
              <li onClick={() => sendEmoji("🏔")}><span role="img" aria-label="emoji">🏔</span></li>
              <li onClick={() => sendEmoji("🍺")}><span role="img" aria-label="emoji">🍺</span></li>
              <li onClick={() => sendEmoji("💩")}><span role="img" aria-label="emoji">💩</span></li>
            </ul>
          </div>
          
          <div className="bottom-main">
            {replyTo ? (
              <div className="reply-to">Reply to: {replyTo.message}</div>
            ) : null}
            <input placeholder="Funk something" spellCheck={false} value={message} onChange={handleMessageChange} className="message-input" onKeyDown={handleKeyDown}/>
          </div>
          <div className={`send-button ${!message ? "is-disabled" : ""}`} onClick={sendMessage}>
            <FontAwesomeIcon icon={faBroadcastTower} />
          </div>
        </div>

        <Canvas onClick={handleReplyTo} />
    </div>
  );
};

export default Content;