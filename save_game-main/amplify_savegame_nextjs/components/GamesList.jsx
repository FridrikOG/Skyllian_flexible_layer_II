import React, { useEffect } from "react";
import Link from "next/link";
import gameService from "../service/gameService";

export const GamesList = ({
  games,
  title,
  emptyMsg,
  buttonMsg,
  onClickFunc,
  path,
  options,
}) => {
  return (
    <div>
      {games.length >= 0 && (
        <>
          <h1 className="txt-white"> {title} </h1>
          {games.map((g) => {
            return (
              <div key={g.id}>
                {/* {new Date(g.gameStartDate).toDateString()}
                {new Date(g.gameEndDate).toDateString()} */}
                <span className="txt-white">{g.name}</span>
                {options.isStats ? (
                  <div style={{ display: "flex" }}>
                    <Link href={`${path}/${g.id}`}>
                      <button className="btn">{buttonMsg}</button>
                    </Link>
                    <Link href={`game/leaderboard/${g.id}`}>
                      <button className="btn">Leaderboard</button>
                    </Link>
                  </div>
                ) : (
                  <button onClick={() => onClickFunc(g.id)} className="btn">
                    {buttonMsg}
                  </button>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
