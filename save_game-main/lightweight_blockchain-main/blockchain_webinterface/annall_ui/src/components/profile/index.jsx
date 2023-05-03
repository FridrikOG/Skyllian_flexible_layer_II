import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Redirect } from "react-router-dom";
import userReducer from "../../redux/reducers/userReducers";
import userService from "../../services/userService";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const user = localStorage.getItem("user");
  // console.log("user ", user);
  // const userInfo = await dispatch(userService().getUser());
  // console.log("User info ", userInfo);

  const user = JSON.parse(localStorage.getItem("user"));

  console.log("here is the user ", user);
  return (
    <div>
      User profile
      {user.username}
      {user.displayName}
      {user.avatar}
    </div>
  );
};

export default Profile;
