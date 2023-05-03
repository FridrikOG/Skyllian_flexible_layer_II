import React, { useState } from "react";
import userService from "../../service/userService";
import Router from "next/router";
import { useDispatch } from "react-redux";
import { USER_LOGIN_ACTION } from "../../redux/actions/userActions";

import loginStyles from "../../styles/Login.module.css";
import { HomeButton } from "../../core/buttons/HomeButton";

const Login = () => {
  // Dispatch
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState({});

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async (e) => {
    try {
      const user = await userService.login(email, password);

      dispatch(USER_LOGIN_ACTION(user));
      Router.push("game");
    } catch (e) {
      setErrorMsg(e.response.data);
    }
  };
  return (
    <>
      <div className={loginStyles.container}>
        <div className="form-main-outer">
          <div className="form-main-inner">
            <form>
              <h1> Sign in </h1>
              <h3>Email</h3>
              {errorMsg.email}
              <input
                placeholder="Enter your email address"
                onChange={handleEmailChange}
              />
              <h3>Password</h3>
              {errorMsg.password}
              <input
                placeholder="Enter your password"
                onChange={handlePasswordChange}
                type="password"
              />

              {errorMsg.detail}
              <button
                className="btn"
                type="button"
                value="Login"
                onClick={handleLogin}
              >
                Login
              </button>
            </form>

            <h3>Don't have account yet?</h3>
            <a href="register" className="btn">
              Create Account
            </a>
            <h3>Forgot your password?</h3>
            <a href={"reset/password"} className="btn">
              Reset Password
            </a>
          </div>
        </div>
      </div>
      <HomeButton />
    </>
  );
};

export default Login;
