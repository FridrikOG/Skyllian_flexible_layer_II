import React from "react";
import cookieService from "../../../service/cookieService";
import characterService from "../../../service/characterService";
import { Character } from "../../../components/Character";
import gameService from "../../../service/gameService";
import { GoBackButton } from "../../../core/buttons/GoBackButton";

const gameStats = ({ stats }) => {
  return (
    <div>
      <h1>Stats </h1>
      <div>StatsId: {stats.id}</div>
      <div> GameId: {stats.game.id}</div>
      <div> Health: {stats.health}</div>
      <div> Money: {stats.money}</div>
      <div> isDead: {stats.isDead ? "T" : "F"} </div>
      <div> isPlaying: {stats.isPlaying ? "T" : "F"} </div>
      <GoBackButton />
    </div>
  );
};
export async function getServerSideProps({ req, query }) {
  // Source - SSR: https://imgur.com/a/WhqxKNu
  // Extract accestoken from cookie
  const accessToken = cookieService.getAccessToken(req);
  console.log(query.id);
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
