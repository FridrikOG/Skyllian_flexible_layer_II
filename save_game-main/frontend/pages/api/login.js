import axios from "axios";
import cookie from "cookie";
import helper from "./helper";
import uri from "../../config/django";

export default async (req, res) => {
  console.log("heidi");
  const cookies = cookie.parse(req.headers.cookie ?? "");
  const access = cookies.access ?? false;

  // Send request to django backend
  try {
    // Response from backend-django
    const resp = await axios.post(`${uri}api/user/login/`, req.body);
    // Add cookies to establish agreement
    // params
    // res: response from nextjs to set cookie headers
    // resp: response from django to grab jwt-token from
    helper.addCookies(res, resp.data);

    return res.status(200).json({ data: resp.data });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ data: e.response });
  }
};
