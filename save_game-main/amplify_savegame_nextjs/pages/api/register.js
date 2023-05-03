import axios from "axios";
import cookie from "cookie";

import uri from "../../config/django";

import helper from "../../service/helper";

export default async (req, res) => {
  const cookies = cookie.parse(req.headers.cookie ?? "");
  const access = cookies.access ?? false;

  try {
    console.log(uri);
    const resp = await axios.post(`${uri}api/user/register/`, req.body);
    // Add cookies to establish agreement
    // params
    // res: response from nextjs to set cookie headers
    // resp: response from django to grab jwt-token from
    helper.addCookies(res, resp.data);

    console.log("200");

    return res.status(200).json(resp.data);
  } catch (e) {
    console.log("400");
    console.log(e.response.data);
    // console.log(e);
    // console.log(e);
    // console.log(e.response);
    // const b = e.response;
    // console.log(e);
    // console.log(e.response.data);
    return res.status(400).json(e.response.data);
  }
};
