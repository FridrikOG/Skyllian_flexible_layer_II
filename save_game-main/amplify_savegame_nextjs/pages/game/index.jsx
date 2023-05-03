import React, { useState } from "react";

import { GamesList } from "../../components/GamesList";

import gameService from "../../service/gameService";
import cookieService from "../../service/cookieService";
import { GoBackButton } from "../../core/buttons/GoBackButton";

import router from "next/router";

const Game = ({ games }) => {
  //
  const [currGames, setCurrGames] = useState(games.filter((g) => g.isPlaying));
  const [playedGames, setPlayedGames] = useState(
    games.filter((g) => g.isFinished)
  );
  const [otherGames, setOtherGames] = useState(
    games.filter((g) => !g.isFinished && !g.isPlaying)
  );

  const [isInGame, setIsInGame] = useState(
    games.filter((g) => g.isPlaying).length !== 0
  );

  const handleJoinGame = async (gameId) => {
    await gameService.joinGame(gameId);
    router.push(`/game/${gameId}`);
  };

  return (
    <>
      {isInGame ? (
        <>
          <GamesList
            games={currGames}
            title={"Currently Playing"}
            buttonMsg="Play"
            onClickFunc={handleJoinGame}
            path={"/game"}
            options={{}}
          />
          <GamesList
            games={otherGames}
            title={"Other Games"}
            buttonMsg="Must finish ongoing games first"
            onClickFunc={() => alert("Finish ongoing matches first")}
            path={null}
            options={{}}
          />
        </>
      ) : (
        <GamesList
          games={otherGames}
          title={"Games To Play"}
          buttonMsg="Join"
          path={"/game"}
          onClickFunc={handleJoinGame}
          options={{}}
        />
      )}
      <GamesList
        games={playedGames}
        title={"Games Already Played"}
        buttonMsg="View Stats"
        onClickFunc={() => {}}
        path={"/game/stats"}
        options={{ isStats: true }}
      />
      <GoBackButton path={"/"} title={"Home"} />
    </>
  );
};

export async function getServerSideProps({ req }) {
  // Source - SSR: https://imgur.com/a/WhqxKNu
  // Extract accestoken from cookie
  const accessToken = cookieService.getAccessToken(req);

  // // get all games to join
  const res = await gameService.getAllGames(accessToken);

  // // extract data from response
  const data = res.data;

  if (res.status === 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: { games: data.lis }, // will be passed to the page component as props
  };
}

export default Game;
