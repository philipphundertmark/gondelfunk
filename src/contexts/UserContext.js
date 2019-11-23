import React, { useState } from "react";

const initialContext = {
  user: null,
  onLogin: () => {},
  onLogout: () => {}
};

const UserContext = React.createContext(initialContext);

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getUser());

  const handleLogin = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

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