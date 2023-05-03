import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import gameService from "../../../service/gameService";
import cookieService from "../../../service/cookieService";
import { GoBackButton } from "../../../core/buttons/GoBackButton";
import Characters from "../../../components/Characters";

const gameStats = ({ stats }) => {
  console.log(stats);
  return (
    <div className="txt-white">
      <h1>Stats </h1>
      {stats.map((s) => {
        return (
          <>
            <Characters story={s.decisionStat.story} />
            <h2>{s.game.name}</h2>
            <div> Health: {s.health}</div>
            <div> Money: ${s.money}</div>
            <div> Score: {s.score}</div>
            <div> Survived: {s.isDead ? "No" : "Yes"} </div>
          </>
        );
      })}
      <GoBackButton />
    </div>
  );
};

export async function getServerSideProps({ req, query }) {
  // Source - SSR: https://imgur.com/a/WhqxKNu
  // Extract accestoken from cookie
  const accessToken = cookieService.getAccessToken(req);
  // get all games to join
  const res = await gameService.viewStats({ accessToken, gameId: query.id });

  // extract data from response
  const data = res.data;

  console.log("data", data);

  if (res.status === 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  if (res.status === 200) {
    return {
      props: {
        stats: data,
      },
    };
  }

  return {
    redirect: {
      permanent: false,
      destination: `error`,
    },
  };
}

export default gameStats;
