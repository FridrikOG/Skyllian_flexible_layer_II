import axios from "axios";
import cookie, { serialize } from "cookie";
import helper from "../../service/helper";
import uri from "../../config/django";

export default async (req, res) => {
  // Send request to django backend
  try {
    // Response from backend-django
    const resp = await axios.post(`${uri}api/user/login/`, req.body);
    // Add cookies to establish agreement
    // params
    // res: response from nextjs to set cookie headers
    // resp: response from django to grab jwt-token from
    helper.addCookies(res, resp.data);

    return res.status(200).json(resp.data);
  } catch (e) {
    return res.status(400).json(e.response.data);
  }
};
