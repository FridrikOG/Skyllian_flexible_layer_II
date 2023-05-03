import cookie from "cookie";
import { addConfig, removeConfig } from "../../config/cookie";
import cookieService from "../../service/cookieService";

const helper = () => {
  const addCookies = (res, data) => {
    res.setHeader("Set-Cookie", [
      cookie.serialize("access", data.tokens.access, addConfig),
      cookie.serialize("refresh", data.tokens.refresh, addConfig),
    ]);

    return res;
  };

  const removeCookies = (res) => {
    res.setHeader("Set-Cookie", [
      cookie.serialize("access", "", removeConfig),
      cookie.serialize("refresh", "", removeConfig),
    ]);

    return res;
  };

  const getAccessToken = (req) => {
    const cookies = cookie.parse(req.headers.cookie ?? "");
    const access = cookies.access ?? false;

    return access;
  };

  return { addCookies, removeCookies, getAccessToken };
};

export default helper();
