import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { UserStat } from "./UserStat";
import { Blood } from "./Blood";

import goStyles from "../styles/GameOver.module.css";
import { Questionaire } from "./Questionaire";
import Characters from "./Characters";
import { GoBackButton } from "../core/buttons/GoBackButton";

export const GameOver = () => {
  const userStat = useSelector((state) => state.userStatReducer.data);

  const [isWinner, setIsWinner] = useState(
    userStat.money !== 0 && parseInt(userStat.health) !== 0
  );

  useEffect(() => {
    setIsWinner(userStat.money !== 0 && parseInt(userStat.health) !== 0);
  }, [userStat.money, userStat.health]);

  return (
    <div className="txt-white gameover">
      <Characters story={userStat.name === "Anna" ? 2 : 1} />
      <UserStat userStat={userStat} />

      {isWinner ? (
        <>
          <h1>Congratulations you won!</h1>
        </>
      ) : (
        <>
          <h1>You lost!</h1>
        </>
      )}
      <Questionaire />

      <GoBackButton path={"/"} title={"Home"} />
    </div>
  );
};
