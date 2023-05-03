import React from "react";
import { HomeButton } from "../../../core/buttons/HomeButton";

const congratulations = (props) => {
  return (
    <div className="form-main-outer">
      <div className="container">
        <h1>Congratulations</h1>
        <p>You have successfully changed password</p>
        <HomeButton />
      </div>
    </div>
  );
};

export default congratulations;
