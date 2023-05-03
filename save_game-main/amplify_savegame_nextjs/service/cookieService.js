import cookie from "cookie";

const cookieService = () => {
  const getAccessToken = (req) => {
    const cookies = cookie.parse(req.headers.cookie ?? "");
    const access = cookies.access ?? false;

    return access;
  };

  return { getAccessToken };
};

export default cookieService();
