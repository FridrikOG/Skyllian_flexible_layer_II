import axios from "axios";
import cookie from "cookie";
import helper from "./helper";
import uri from "../../config/django";

/**
 * This sets `cookie` using the `res` object
 */

export default async (req, res) => {
  // We also have access to the tokens in the header
  const access = helper.getAccessToken(req);
  try {
    await axios.post(`${uri}api/user/logout/`, req.body, {
      headers: {
        Authorization: `Bearer ${req.body.access}`,
      },
    });
    // Remove agreement
    helper.removeCookies(res);

    return res.status(200).json({ baba: "a" });
  } catch (e) {
    console.log(e);
    return res.status(e).json({ response: e.response });
  }
};
