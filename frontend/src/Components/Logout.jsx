import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "./Constants/accessTokens";

function Logout() {
     
  let navigate = useNavigate();
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

      const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    setAuthState({ username: "", id: 0, status: false });
    navigate("/login")
  };
  return (
    <>
      <div className="loggedInContainer">
        <h1>{authState.username} </h1>
        {authState.status && <button onClick={logout}> Logout</button>}
      </div>
    </>
  );
}

export default Logout
