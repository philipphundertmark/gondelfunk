import React, { useCallback, useContext, useEffect, useState } from "react";
import { WebSocketContext } from "./WebSocketContext";

const initialContext = {
  user: null,
  onLogin: () => {},
  onLogout: () => {}
};

const UserContext = React.createContext(initialContext);

const generateLocation = (location) => {
  return randomLocation();
};

const randomLocation = () => {
  const x = Math.floor(Math.random() * (WIDTH + 1));
  const y = Math.floor(Math.random() * (HEIGHT + 1));

  return [x, y];
};

const WIDTH = 1600;
const HEIGHT = 3400;

const UserProvider = ({ children }) => {
  const { send } = useContext(WebSocketContext);
  const [currentUser, setCurrentUser] = useState(getUser());
  const [location, setLocation] = useState(generateLocation() || randomLocation());
  const [timer, setTimer] = useState(null);

  const handleLogin = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const startTimer = useCallback(() => {
    const timer = setInterval(() => {
      const locationNew = generateLocation(location);
      setLocation(locationNew);
      send({
        type: "location",
        location: locationNew
      })
    }, 5000);

    setTimer(timer);
  }, [location, send]);

  // useEffect(() => {
  //   startTimer();

  //   return () => {
  //     clearInterval(timer);
  //     setTimer(null);
  //   };
  // }, [startTimer, timer]);

  return (
    <UserContext.Provider
      value={{
        user: currentUser,
        onLogin: handleLogin,
        onLogout: handleLogout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function getUser() {
  const userJson = localStorage.getItem("user");
  return userJson ? JSON.parse(userJson) : null;
}

export { UserProvider, UserContext };