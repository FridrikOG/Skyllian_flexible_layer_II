import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Redirect } from "react-router-dom";
import userService from "../../services/userService";
import { Link } from "react-router-dom";

const UserRegister = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let registerItems = JSON.parse(localStorage.getItem("registerForm"));
  console.log("Register items ", registerItems);
  if (registerItems === null) {
    let registerItems = {
      username: "",
      displayName: "",
      userPassword: "",
    };
    localStorage.setItem("registerForm", JSON.stringify(registerItems));
  }

  const [username, setUserName] = useState(registerItems.username);
  const [displayName, setDisplayName] = useState(registerItems.displayName);
  const [userPassword, setPassword] = useState(registerItems.userPassword);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    displayName: "",
    userPassword: "",
    serverError: "",
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
    // length of 3
    if (displayName.length < 3) {
      le["displayName"] = " can't be empty";
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
      displayName,
      userPassword,
    };
    if (!username || !userPassword || !displayName)
      // storing new cart
      localStorage.removeItem("registerForm");
    localStorage.setItem("registerForm", JSON.stringify(registerForm));
  });

  const handleOnSubmit = async (e) => {
    // Send to server
    e.preventDefault();
    // If error then we don't dispatch
    if (!validate(username, displayName, userPassword)) return;

    const res = await dispatch(
      userService().register(username, displayName, userPassword)
    );
    if (!res) {
      setServerError("Server error");
    } else {
      navigate("/user/login");
    }
  };
  return (
    <>
      <div>
        {success ? (
          <div> You are logged in now as {username} </div>
        ) : (
          <div>
            <h1>Register!</h1>
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
                displayName
                {errors.displayName}
                <input
                  type="text"
                  value={displayName}
                  name="username"
                  onChange={(e) => setDisplayName(e.target.value)}
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
              <button type="submit">sign up</button>
              <div> {serverError} </div>
            </form>
          </div>
        )}
      </div>
      <Link to="/user/login" className="nav-link">
        I have an account
      </Link>
    </>
  );
};

export default UserRegister;
