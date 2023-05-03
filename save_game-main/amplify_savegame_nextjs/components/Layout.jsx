import Head from "next/head";
import { useEffect, useState } from "react";
import homeStyles from "../styles/Home.module.css";
import jwtDecode from "jwt-decode";
import authService from "../service/authService";
import { useDispatch, useSelector } from "react-redux";
import { USER_LOGIN_ACTION } from "../redux/actions/userActions";

import { Blood } from "./Blood";
// Here the layout of the website should be inserted
// Nav
// CONTENT
// footer
const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.userReducer.loggedIn);
  const [isLoaded, setIsLoaded] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const refreshToken = async () => {
    const tokensStr = localStorage.getItem("tokens");
    const userStr = localStorage.getItem("user");

    if (tokensStr) {
      const tokens = JSON.parse(tokensStr); //
      const user = JSON.parse(userStr);
      let decoded = jwtDecode(tokens.access);
      let jwtExpiration = decoded.exp; // expiration of jwt token
      let jwtExpiresIn = jwtExpiration * 1000 - Date.now() - 500; // Expiration of jwt-token in milli-seconds

      authService.setAuthorizationToken(tokens.access); // Sets the default axios authorization header to the jwt-token
      dispatch(USER_LOGIN_ACTION(user)); // Put Profile into redux

      if (jwtExpiresIn <= 0) {
        // If jwt is expired we fetch a new one sending a get request with the refresh token as data
        const accessToken = await authService.sendRefreshToken(); // get new access token
        if (!accessToken) userService().logout();
        else {
          decoded = jwtDecode(accessToken); // decode the access token
          jwtExpiration = decoded.exp; // expiration of jwt token
          jwtExpiresIn = jwtExpiration * 1000 - Date.now() - 500; // Expiration of jwt-token in milli-seconds, -500 to send the request right before
        }
      }
      // TODO: change 7 minutes to jwtExpiresIn
      setTimeout(() => {
        refreshToken();
      }, 420000); // 7 minutes
    }
  };

  useEffect(async () => {
    await refreshToken();
    setIsLoaded(true);
  }, []);

  return (
    <>
      {isLoaded && (
        <div>
          <div className="blood">{/* <Blood /> */}</div>
          <div className={homeStyles.container}>
            <h1 className="title"> Safe Game</h1>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
