import React, { useState, useEffect } from "react";
import pic from "../pics/bestboss.jpeg";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import userService from "../../services/userService";
import { useDispatch, useSelector } from "react-redux";
import Profile from "../profile";

import { Button } from "react-bootstrap";

const AuthNavBar = (navigate) => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.userReducer.data);
  let [user, setUser] = useState("");
  let [isAuthenticated, setIsAuthenticated] = useState(reduxUser !== undefined);
  // console.log("Redux user ", reduxUser);
  // console.log("Is auth ", isAuthenticated);
  // console.log("The actual fk user  ", user);

  // const fetchUser = async () => {
  //   const userDisp = await dispatch(userService().getUser());
  //   console.log("The user");
  //   const userJson = userDisp;
  //   console.log("is the user logged out ", userDisp);
  //   setIsAuthenticated(true);
  //   localStorage.setItem("user", JSON.stringify(userJson));
  //   setUser(userDisp);

  //   if (userDisp == undefined) {
  //     navigate("user/login");
  //   }
  // };
  // useEffect(() => {
  //   fetchUser();
  // }, []);

  const handleOnLogout = async (e, navigate) => {
    e.preventDefault();
    const userDisp = await dispatch(userService().logout());
    const theUser = await dispatch(userService().getUser());
    console.log("Inside logout  ", theUser);
    if (!theUser) {
      // navigate("/user/login");
      localStorage.remove("user");
      console.log("Logged out ");
    }
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img src={pic} className="logo-picture" alt="logo" />
        <span className="logo-name">Lets play a game</span>
      </div>

      <div>
        <Button onClick={(e) => handleOnLogout(e)} className="nav-link">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AuthNavBar;
