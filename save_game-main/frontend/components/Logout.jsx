import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import { USER_LOGOUT_ACTION } from "../redux/actions/userActions";
import userService from "../service/userService";

const Logout = (props) => {
  const dispatch = useDispatch();
  const routeHistory = useRouter();
  const handleLogout = async () => {
    await userService.logout();
    dispatch(USER_LOGOUT_ACTION());
    routeHistory.push("/");
  };
  return (
    <button className="btn" onClick={handleLogout}>
      {" "}
      Logout
    </button>
  );
};

export default Logout;
