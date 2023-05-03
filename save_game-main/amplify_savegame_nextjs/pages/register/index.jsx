import React, { useState } from "react";
import userService from "../../service/userService";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { USER_REGISTER_ACTION } from "../../redux/actions/userActions";

import loginStyles from "../../styles/Login.module.css";
import { HomeButton } from "../../core/buttons/HomeButton";

const Register = (props) => {
  const dispatch = useDispatch();
  const routeHistory = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const [errorMsg, setErrorMsg] = useState({});

  const handleRegister = async () => {
    try {
      const user = await userService.register({
        email,
        password,
        password2,
        firstname,
        lastname,
        username,
      });
      dispatch(USER_REGISTER_ACTION(user));
      routeHistory.push("game");
    } catch (e) {
      console.log(e.response);
      setErrorMsg(e.response.data);
    }
  };

  return (
    <>
      <div className={loginStyles.container}>
        <div className="form-main-outer">
          <div className="form-main-inner">
            <h1> Sign up </h1>
            <div>
              <form>
                <h3>Username</h3>
                {errorMsg.username}
                <input
                  placeholder="Enter your username"
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <h3>First name</h3>
                {errorMsg.firstname}
                <input
                  placeholder="First name"
                  type="text"
                  onChange={(e) => setFirstname(e.target.value)}
                />
                <h3>Last name</h3>
                {errorMsg.lastname}
                <input
                  placeholder="Last name"
                  type="text"
                  onChange={(e) => setLastname(e.target.value)}
                />

                <h3>Email </h3>
                {errorMsg.email}
                <input
                  placeholder="Enter your email address"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />

                <h3>Password</h3>
                {errorMsg.password}
                <input
                  placeholder="Enter your password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <h3>Password</h3>
                {errorMsg.password2}
                <input
                  placeholder="Reenter your password"
                  type="password"
                  onChange={(e) => setPassword2(e.target.value)}
                />

                <br />
                <button
                  className="btn"
                  type="button"
                  value="Login"
                  onClick={handleRegister}
                >
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <HomeButton />
    </>
  );
};

Register.propTypes = {};

export default Register;
