import { useEffect, useState, useContext } from "react";
import { WebSocketContext } from "../contexts/WebSocketContext";

export function useWebSocket() {
  const { subscribe } = useContext(WebSocketContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const subscription = subscribe({
      next: (message) => {
        setMessages(messages => [...messages, message]);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [subscribe]);

  return { messages };
}
