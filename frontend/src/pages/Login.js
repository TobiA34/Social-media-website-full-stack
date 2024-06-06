import React, { useState,useContext } from 'react'
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {AuthContext} from '../helpers/AuthContext'

 function Login() {

const [username, setUsername] = useState("");
const [password, setPassword] = useState("")

const {setAuthState} = useContext(AuthContext)
const navigate = useNavigate()
const login = () => {
  const data = { username: username, password: password };
  axios.post("http://localhost:3001/auth/login", data).then((response) => {
    if (response.data.error){
      alert(response.data.error);
    } else {
         localStorage.setItem("accessToken", response.data);
         setAuthState(true);
         navigate("/")
    }
  });
};



  return (
    <div className="container d-flex flex-column vh-100 justify-content-center align-items-center">
      <Card className="p-5 rounded w-75">
        <h1 className="my-5 text-center">Login</h1>
        <form>
          <div data-mdb-input-init class="form-outline mb-4">
            <input
              type="email"
              id="form2Example1"
              placeholder="Username"
              class="form-control"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
          </div>

          <div data-mdb-input-init class="form-outline mb-4">
            <input
              type="password"
              id="form2Example2"
              class="form-control"
              placeholder="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>

          <button
            type="button"
            data-mdb-button-init
            data-mdb-ripple-init
            class="btn btn-primary btn-block mb-4"
            onClick={login}
          >
            login
          </button>

          <div class="text-center">
            <p>
              Not a member?{" "}
              <Link to="/regstration" href="#!">
                Register
              </Link>
            </p>
            <p>or sign up with:</p>
            <button
              type="button"
              data-mdb-button-init
              data-mdb-ripple-init
              class="btn btn-link btn-floating mx-1"
            >
              <i class="fab fa-facebook-f"></i>
            </button>

            <button
              type="button"
              data-mdb-button-init
              data-mdb-ripple-init
              class="btn btn-link btn-floating mx-1"
            >
              <i class="fab fa-google"></i>
            </button>

            <button
              type="button"
              data-mdb-button-init
              data-mdb-ripple-init
              class="btn btn-link btn-floating mx-1"
            >
              <i class="fab fa-twitter"></i>
            </button>

            <button
              type="button"
              data-mdb-button-init
              data-mdb-ripple-init
              class="btn btn-link btn-floating mx-1"
            >
              <i class="fab fa-github"></i>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Login
