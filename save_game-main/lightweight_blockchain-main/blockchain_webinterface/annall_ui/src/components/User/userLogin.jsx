import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Redirect } from "react-router-dom";
import userService from "../../services/userService";
import { USER_LOGIN_ACTION } from "../../redux/actions/userActions";
// import loggedIn from '../NavBar/index'
import { Link } from "react-router-dom";
const UserLogin = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const registerItems = JSON.parse(localStorage.getItem("loginForm"));
  if (registerItems == null) {
    const loginInfo = {
      name: "",
      userPassword: "",
    };
    localStorage.setItem("loginForm", JSON.stringify(loginInfo));
  }
  console.log("The register form ", registerItems);
  const [username, setUserName] = useState(registerItems.username);
  const [userPassword, setPassword] = useState(registerItems.userPassword);
  const [errors, setErrors] = useState({
    name: "",
    displayName: "",
    userPassword: "",
  });
  const [success, setSuccess] = useState(false);

  const validate = () => {
    let isValid = true;
    const le = { username: "", displayName: "", userPassword: "" };
    // length of 3
    if (username.length < 3) {
      le["username"] = " can't be empty";
      isValid = false;
    }
    // userPassword must be at least 8
    if (userPassword.length < 8) {
      le["userPassword"] = " should be at least 8 in length";
      isValid = false;
    }
    setErrors(le);
    return isValid;
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isAuth = true;
    if (user != null) {
      navigate("/dashboard");
    }
    const registerForm = {
      username,
      userPassword,
    };
    if (!username || !userPassword)
      // storing new cart
      localStorage.removeItem("loginForm");
    localStorage.setItem("loginForm", JSON.stringify(registerForm));
  });

  const handleOnSubmit = async (e) => {
    // Send to server
    e.preventDefault();
    if (!validate(username, userPassword)) return;

    const data = localStorage.getItem("loginForm");
    // login the user, this returns a json token of the user
    const user = await dispatch(userService().login(username, userPassword));
    // Set the user to the local storage
    localStorage.setItem("user", JSON.stringify(user));
    if (user) {
      dispatch(USER_LOGIN_ACTION(user));

      navigate("/dashboard");
    }
  };

  return (
    <div>
      {success ? (
        <div> You are logged in now as {username} </div>
      ) : (
        <div>
          <h1>Login!</h1>
          <form action="" method="get" onSubmit={(e) => handleOnSubmit(e)}>
            <label>
              username
              {errors.name}
              <input
                type="text"
                value={username}
                name="username"
                onChange={(e) => setUserName(e.target.value)}
              />
            </label>
            <label>
              userPassword
              {errors.userPassword}
              <input
                type="text"
                value={userPassword}
                name="userPassword"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="submit">Login</button>
          </form>
        </div>
      )}
      <Link to="/user/register" className="nav-link">
        On second thought let me register instead
      </Link>
    </div>
  );
};

export default UserLogin;
