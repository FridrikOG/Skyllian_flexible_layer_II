import axios from "axios";

import authService from "./authService";

import furi from "../config/next";
import buri from "../config/django";

const userService = () => {
  const __saveToLocalStorage = (response) => {
    const { tokens } = response.data;
    const accessToken = tokens.access;
    const user = response.data;

    localStorage.setItem("tokens", JSON.stringify(tokens));
    localStorage.setItem("user", JSON.stringify(user));
    authService.setAuthorizationToken(accessToken);
  };

  const __removeCachedUserData = () => {
    authService.setAuthorizationToken(); // deletes bearer token from default axios settings
    localStorage.removeItem("tokens");
    localStorage.removeItem("user");
  };

  const register = async ({
    email,
    password,
    password2,
    firstname,
    lastname,
    username,
  }) => {
    /* This function uses /api/logout.js to remove cookies  */

    // request to register with user credentials

    const res = await axios.post(`api/register/`, {
      email,
      password,
      password2,
      firstname,
      lastname,
      username,
    });

    __saveToLocalStorage(res);

    // assign user data to variable and return to component
    const user = res.data;
    return user;
  };

  const login = async (email, password) => {
    /* This function uses /api/login.js to ADD cookies  */
    const res = await axios.post(`api/login/`, {
      email,
      password,
    });

    __saveToLocalStorage(res);
    // assign user data to variable and return to component
    const user = res.data;
    return user;
  };

  const logout = async () => {
    /* This function uses /api/logout.js to REMOVE cookies  */

    const tokensStr = localStorage.getItem("tokens");
    const tokens = JSON.parse(tokensStr);

    try {
      // request to login with user credentials
      const res = await axios.post(`api/logout/`, tokens);
    } catch (e) {
      // Service or user input failed
      // TODO: Add all exception cases
      // Basis exception s.t
      // throw new Error(e.response);
    }

    __removeCachedUserData();
  };

  const requestChangePassword = async ({ email, setMsg }) => {
    try {
      const res = await axios.post(`${buri}api/user/requestResetEmail/`, {
        email,
      });
      setMsg(res.data.success);
    } catch (e) {
      const res = e.response;
      if (res.status === 400) return setMsg(res.data.error);
      setMsg("Unknown error occured resetting password");
    }
  };

  const checkChangePassword = async ({ uidb64, token }) => {
    try {
      const res = await axios.get(
        `${buri}api/user/passwordReset/${uidb64}/${token}/`
      );
      return res;
    } catch (e) {
      return e.response;
    }
  };

  const changePassword = async ({ uidb64, token, password }) => {
    try {
      // await axios.get(`${buri}api/user/passwordResetComplete/`);
      const res = await axios.patch(`${buri}api/user/passwordResetComplete/`, {
        uidb64,
        token,
        password,
      });
      return res.data;
    } catch (e) {
      // console.log(e);
    }
  };

  return {
    register,
    login,
    logout,
    requestChangePassword,
    changePassword,
    checkChangePassword,
  };
};

export default userService();
