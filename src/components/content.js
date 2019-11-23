import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroadcastTower, faSignOutAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faLaugh } from '@fortawesome/free-regular-svg-icons';
import Canvas from "./canvas";
import './content.scss';
import { UserContext } from "../contexts/UserContext";
import { WebSocketContext } from "../contexts/WebSocketContext";

// Handler to deselect message and stop replying
let quitReply = null;

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
      message,
      ...(replyTo && {to: replyTo.to}) 
    });

    setMessage("");

    setReplyTo(null);
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
      type: "message", 
      from: user.id,
      message: emoji,
      ...(replyTo && {to: replyTo.to}) 
    });

    setReplyTo(null);
  }

  const handleQuitReply = () => {
    setReplyTo(null);
    quitReply();
  }

  const handleReplyTo = (userId, message, onDeselect) => {
    setReplyTo({
      to: userId,
      message
    })

    quitReply = onDeselect;
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
              <li onClick={() => sendEmoji("0x1")}><span role="img" aria-label="emoji">🚠</span></li>
              <li onClick={() => sendEmoji("0x2")}><span role="img" aria-label="emoji">😎</span></li>
              <li onClick={() => sendEmoji("0x3")}><span role="img" aria-label="emoji">🤩</span></li>
              <li onClick={() => sendEmoji("0x4")}><span role="img" aria-label="emoji">🥶</span></li>
              <li onClick={() => sendEmoji("0x5")}><span role="img" aria-label="emoji">🍆</span></li>
              <li onClick={() => sendEmoji("0x6")}><span role="img" aria-label="emoji">🏔</span></li>
              <li onClick={() => sendEmoji("0x7")}><span role="img" aria-label="emoji">🍺</span></li>
              <li onClick={() => sendEmoji("0x8")}><span role="img" aria-label="emoji">💩</span></li>
            </ul>
          </div>
          
          <div className="bottom-main">
            {replyTo ? (
              <div className="reply-to">
                <span className="reply-prefix">Reply to:</span>
                <span className="reply-message">"{replyTo.message}"</span>
                <span className="close-reply" onClick={handleQuitReply}><FontAwesomeIcon icon={faTimes} /></span>
              </div>
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