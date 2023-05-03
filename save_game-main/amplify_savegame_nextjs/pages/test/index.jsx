import axios from "axios";
import React, { useState } from "react";
import next from "../../config/next";
import port from "../../config/port";

import furi from "../../config/next";
import cookieService from "../../service/cookieService";
import { Questionaire } from "../../components/Questionaire";

const index = ({ data }) => {
  const [val, setVal] = useState(null);

  const handlePress = async () => {
    const res = await axios.post(`api/test`, { test: "test test hehe" });
    setVal(res.data.d);
  };

  return (
    <div>
      index
      <span> {val} </span>
      <button type="button" onClick={handlePress}>
        Get Data
      </button>
      <Questionaire />
    </div>
  );
};

export const getServerSideProps = async ({ req }) => {
  const accessToken = cookieService.getAccessToken(req);
  return {
    props: {
      data: req.headers,
    },
  };
};

export default index;
