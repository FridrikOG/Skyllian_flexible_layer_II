import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Redirect } from "react-router-dom";
import userReducer from "../../redux/reducers/userReducers";
import userService from "../../services/userService";
import AuthNavBar from "../authNavBar";
import NavBar from "../NavBar";
import { Button } from "react-bootstrap";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userIsAuth, setUserIsAuth] = useState(true);
  const user = localStorage.getItem("user");

  // WHen the component mounts basically
  useEffect(() => {
    console.log("Component mounted");
    const user = JSON.parse(localStorage.getItem("user"));
    const isAuth = true;
    if (user == null) {
      setUserIsAuth(false);
      navigate("/user/login");
    }
  }, []);

  const getUser = async () => {
    user = await dispatch(userService().getUser());
    localStorage.setItem("user", JSON.stringify(user));
  };
  const handleOnLogout = async (e) => {
    e.preventDefault();
    const userDisp = await dispatch(userService().logout());
    localStorage.removeItem("user");
    navigate("/user/login");
    console.log("Invalid ");
  };
  return (
    <div>
      <AuthNavBar />
      <Button onClick={(e) => handleOnLogout(e)}> </Button>
    </div>
  );
};

export default Dashboard;
