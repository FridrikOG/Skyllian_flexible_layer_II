import { useHistory } from "react-router";

import axios from "axios";
import { useDispatch } from "react-redux";

import config from "../config";

import { USER_LOGIN_ACTION } from "../redux/actions/userActions";

const userService = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  const register =
    (username, displayName, userPassword) => async (dispatch, getState) => {
      const data = {
        username: username,
        displayName: displayName,
        password: userPassword,
      };
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          displayName: displayName,
          password: userPassword,
        }),
      };
      const res = await fetch("http://localhost:4567/register", requestOptions);
      if (!res.ok) {
        return false;
      }
      return res;
    };
  // `${config.externals.config.apiURL}/register`
  const saveToLocalStorage = (response) => {
    const { tokens } = response.data;
    const accessToken = tokens.access;
    const user = response.data;

    localStorage.setItem("tokens", JSON.stringify(tokens));
    localStorage.setItem("user", JSON.stringify(user));
    // authService.setAuthorizationToken(accessToken);
  };

  const login = (username, userPassword) => async (dispatch, getState) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: userPassword,
      }),
      credentials: "include",
    };
    const res = await fetch(
      "http://localhost:4567/login/password",
      requestOptions
    );
    if (!res.ok) {
      return {};
    }
    const resJson = res.json();
    dispatch(USER_LOGIN_ACTION(resJson));

    return resJson;
  };

  const getUser = () => async (dispatch, getState) => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };
    const res = await fetch("http://localhost:4567/user/info", requestOptions);
    if (!res.ok) {
      return {};
    }
  };

  const logout = () => async (dispatch, getState) => {
    console.log("Inside logout ");
    const requestOptions = {
      method: "POST",
      credentials: "include",
    };
    const res = await fetch("http://localhost:4567/logout", requestOptions);
    console.log("The in logout service  ", res);
    if (!res.ok) {
      return {};
    }

    return true;
  };

  return {
    register,
    login,
    getUser,
    logout,
  };
};

export default userService;
