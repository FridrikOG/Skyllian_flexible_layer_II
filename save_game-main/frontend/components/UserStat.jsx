import React from "react";

export const UserStat = ({ userStat }) => {
  return (
    <div>
      {userStat.game.id}
      {userStat.game.name}
      {userStat.game.gameStartDate}
      <br />
      {userStat.game.gameEndDate}
    </div>
  );
};
