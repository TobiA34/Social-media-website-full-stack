import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  // On component mount, check if there's a token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const username = localStorage.getItem("username");
    const id = localStorage.getItem("id");

    if (token) {
      // If the token exists in localStorage, set the authState accordingly
      setAuthState({
        username: username || "",
        id: id || 0,
        status: true,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
