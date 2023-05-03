import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Redirect } from "react-router-dom";
import userService from "../../services/userService";
import { USER_LOGIN_ACTION } from "../../redux/actions/userActions";

const UserLogout = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const fetchUser = async () => {
    const res = await dispatch(userService().logout());

    const userDisp = await dispatch(userService().getUser());

    console.log("I should be no thing ", userDisp);

    console.log("Res in fetch user ", res);
    if (res) {
      console.log("Logout success");
    } else {
      console.log("Logout failed");
    }
    localStorage.removeItem("user");
    navigate("");
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div>
      <div> You logged out </div>
    </div>
  );
};

export default UserLogout;
