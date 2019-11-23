import React, { useEffect, useState } from "react";
import { Subject } from "rxjs";

const subject = new Subject();

const initialContext = {
  connected: false,
  subscribe: () => {}
};

const WS_ADDR = process.env.WS_ADDR || "ws://localhost:8000/";

const ws = new WebSocket(WS_ADDR);

const WebSocketContext = React.createContext(initialContext);

const WebSocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    
    ws.onopen = () => {
      setConnected(true);
    };
    // Important!!!
    ws.onmessage = ({ data: msg }) => {
      const { data } = JSON.parse(msg);
      subject.next(data);
    };
    ws.onclose = () => {
      setConnected(false);
    };
    ws.onerror = (event) => {
      console.error("WebSocket error observed:", event);
    };
    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        subscribe: subject.subscribe.bind(subject),
        send: ws.send.bind(ws)
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketProvider, WebSocketContext };