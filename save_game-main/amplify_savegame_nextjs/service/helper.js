import cookie, { serialize } from "cookie";
import { addConfig, removeConfig } from "../config/cookie";
import cookieService from "./cookieService";

const helper = () => {
  const addCookies = (res, data) => {
    res.setHeader("Set-Cookie", [
      serialize("access", data.tokens.access, { path: "/" }),
      serialize("refresh", data.tokens.refresh, { path: "/" }),
    ]);

    return res;
  };

  const removeCookies = (res) => {
    res.setHeader("Set-Cookie", [
      serialize("access", "", { path: "/" }),
      serialize("refresh", "", { path: "/" }),
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
