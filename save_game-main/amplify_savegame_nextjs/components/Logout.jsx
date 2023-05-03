import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import { USER_LOGOUT_ACTION } from "../redux/actions/userActions";
import userService from "../service/userService";
import { useState } from "react";

const Logout = (props) => {
  const dispatch = useDispatch();
  const routeHistory = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;
    setIsLoading(true);
    dispatch(USER_LOGOUT_ACTION());
    routeHistory.push("/");
    await userService.logout();
    setIsLoading(false);
  };
  return (
    <button disabled={isLoading} className="btn" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
