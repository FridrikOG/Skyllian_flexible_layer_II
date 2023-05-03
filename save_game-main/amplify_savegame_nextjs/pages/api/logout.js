import axios from "axios";
import cookie from "cookie";
import helper from "../../service/helper";
import uri from "../../config/django";

/*
 * This sets `cookie` using the `res` object
 */

export default async (req, res) => {
  try {
    await axios.post(`${uri}api/user/logout/`, req.body, {
      headers: {
        Authorization: `Bearer ${req.body.access}`,
      },
    });
    helper.removeCookies(res);

    return res.status(200).json({ baba: uri });
  } catch (e) {
    console.log("Error: s-side");
    console.log(e);
    const response = e;
    return res.status(400).json(e.response.data);
  }
};
