import React, { useState } from "react";
import userService from "../../service/userService";
import Router from "next/router";
import { useDispatch } from "react-redux";
import { USER_LOGIN_ACTION } from "../../redux/actions/userActions";
import GuardImage from "../../core/images/GuardImage";

import loginStyles from "../../styles/Login.module.css";
import { HomeButton } from "../../core/buttons/HomeButton";

const Login = () => {
  // Dispatch
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async (e) => {
    console.log("handle login");

    try {
      console.log("before");
      const user = await userService.login(email, password);
      console.log("after");

      console.log(user);
      dispatch(USER_LOGIN_ACTION(user));
      Router.push("game");
    } catch (e) {
      console.log("log in failed");
    }
  };
  return (
    <div className={loginStyles.container}>
      <div className="form-main-outer">
        <div className="form-main-inner">
          <form className={loginStyles.form}>
            <h1> Sign in </h1>
            <h3>Email Id</h3>
            <input
              placeholder="Enter your email address"
              onChange={handleEmailChange}
            />
            <h3>Password</h3>
            <input
              placeholder="Enter your password"
              onChange={handlePasswordChange}
              type="password"
            />

            <br />

            <a href={"reset/password"} id={loginStyles.forgotPwd}>
              Forgot password
            </a>

            <br />
            <button
              className="btn"
              type="button"
              value="Login"
              onClick={handleLogin}
            >
              Login Now
            </button>
          </form>

          <div className={loginStyles.createAccount}>
            <h3>Don't have account yet?</h3>
            <a className="btn" href="register">
              Create Account
            </a>
          </div>
        </div>
        <div id={loginStyles.title}>
          <h1 id="title"> Safe Game </h1>
        </div>
      </div>

      <div className={loginStyles.right}>
        <GuardImage CSSclass={loginStyles.img} />
        <HomeButton />
      </div>
    </div>
  );
};

export default Login;
