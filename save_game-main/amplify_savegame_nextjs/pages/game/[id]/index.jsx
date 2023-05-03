import React, { useState } from "react";

import characterService from "../../../service/characterService";
import cookieService from "../../../service/cookieService";
import { Game } from "../../../components/Game";
import { UserStat } from "../../../components/UserStat";
import gameService from "../../../service/gameService";
import { GoBackButton } from "../../../core/buttons/GoBackButton";

import gameStyles from "../../../styles/Game.module.css";
import { Character } from "../../../components/Character";

const PlayingGame = ({ userStat, character, hasCharacter, game }) => {
  const [QTA, setQTA] = useState(game.questionToAnswer);
  const [us, setUs] = useState(userStat);

  console.log(QTA);
  console.log(us);
  console.log(character);

  return (
    <div className={gameStyles.container}>
      <Character QTA={QTA} character={character} story={us.game.story} />
      <UserStat userStat={us} />
      <Game game={game} QTA={QTA} setQTA={setQTA} setUs={setUs} us={us} />
      <GoBackButton path="/game" title={"Back"} />
    </div>
  );
};

export async function getServerSideProps({ req, query }) {
  // Source - SSR: https://imgur.com/a/WhqxKNu
  // Extract accestoken from cookie
  const accessToken = cookieService.getAccessToken(req);

  // get all games to join
  const res = await characterService.getAllCharacters(accessToken);

  // extract data from response
  const characterData = res.data;

  if (res.status === 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  if (characterData.hasCharacter) {
    const res = await gameService.getGame(accessToken);
    const gameData = res.data;
    return {
      props: {
        userStat: characterData.userStat,
        character: characterData.character,
        hasCharacter: characterData.hasCharacter,
        game: gameData,
      },
    }; // will be passed to the page component as props
  }

  return {
    redirect: {
      permanent: false,
      destination: `/game/${query.id}/characters`,
    },
  };
}

export default PlayingGame;
