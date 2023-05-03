import React from "react";
import Link from "next/link";
import gameService from "../service/gameService";

export const GamesList = ({
  games,
  title,
  emptyMsg,
  buttonMsg,
  onClickFunc,
  path,
}) => {
  return (
    <div>
      {games.length >= 0 && (
        <>
          <h1> {title} </h1>
          {games.map((g) => {
            return (
              <div key={g.id}>
                {g.id}
                {g.name}
                {g.gameStartDate}
                {g.gameEndDate}
                {path === null ? (
                  <button onClick={() => onClickFunc(g.id)} className="btn">
                    {buttonMsg}
                  </button>
                ) : (
                  <Link href={`${path}/${g.id}`}>
                    <button onClick={() => onClickFunc(g.id)} className="btn">
                      {buttonMsg}
                    </button>
                  </Link>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
