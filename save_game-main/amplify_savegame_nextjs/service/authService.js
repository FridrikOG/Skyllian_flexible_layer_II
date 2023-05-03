import axios from "axios";
import uri from "../config/django";

const authService = () => {
  const setAuthorizationToken = (token) => {
    //
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  };

  const sendRefreshToken = async () => {
    const tokensStr = localStorage.getItem("tokens");
    const tokens = JSON.parse(tokensStr);

    const data = { refresh: tokens.refresh };
    try {
      const response = await axios.post(`${uri}/token/refresh/`, data);

      const { access } = response.data; // get new jwt access token

      setAuthorizationToken(access); // update access token
      const newTokens = {
        refresh: tokens.refresh,
        access,
      };
      localStorage.setItem("tokens", JSON.stringify(newTokens));

      return access;
    } catch (e) {
      return null;
    }
  };

  return {
    setAuthorizationToken,
    sendRefreshToken,
  };
};
export default authService();
