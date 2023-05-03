import axios from "axios";
import django from "../../config/django";
import cookie from "cookie";
import helper from "../../service/helper";

import NextCors from "nextjs-cors";

export default async (req, res) => {
  // await NextCors(req, res, {
  //   // Options
  //   methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  //   origin: "*",
  //   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  // });

  // res.json({ d: req.body.test });

  // res.setHeader("Access-Control-Allow-Origin", "*");

  const accessToken = helper.getAccessToken(req);

  try {
    // axios.get(`${django}api/game/leaderboard/1/`, {
    //   headers: {
    //     Authorization: `Bearer ${access}`,
    //   },
    // });
    return res.status(200).json({ d: accessToken });
  } catch (e) {
    // console.log(e);
    return res.status(400).json({ d: "error" });
  }
};
