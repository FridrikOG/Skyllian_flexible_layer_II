import React from "react";
import { useSelector } from "react-redux";

export const UserStat = ({ userStat }) => {
  return (
    <div className="txt-white">
      Health: {userStat.health}
      <br />
      Balance: ${userStat.money}
    </div>
  );
};
