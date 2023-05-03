import axios from "axios";
import cookie from "cookie";

import uri from "../../config/django";

import helper from "./helper";

export default async (req, res) => {
  const cookies = cookie.parse(req.headers.cookie ?? "");
  const access = cookies.access ?? false;

  console.log("HALLO");
  console.log(req.body);
  try {
    console.log(uri)
    const resp = await axios.post(`${uri}api/user/register/`, req.body);

    console.log("one");

    // Add cookies to establish agreement
    // params
    // res: response from nextjs to set cookie headers
    // resp: response from django to grab jwt-token from
    helper.addCookies(res, resp.data);
    console.log("zero");

    return res.status(200).json({ data: resp.data });
  } catch (e) {
    // console.log(e);
    // console.log(e);
    console.log(e.response);
    // console.log(e);
    // console.log(e.response.data);
    return res.status(400).json({ err: {} });
  }
};
