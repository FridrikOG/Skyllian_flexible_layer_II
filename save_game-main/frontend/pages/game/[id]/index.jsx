import React from "react";
import Link from "next/link";
import characterService from "../../../service/characterService";
import cookieService from "../../../service/cookieService";
import { Character } from "../../../components/Character";
import { Game } from "../../../components/Game";
import { UserStat } from "../../../components/UserStat";
import gameService from "../../../service/gameService";
import { GoBackButton } from "../../../core/buttons/GoBackButton";

const PlayingGame = ({ userStat, character, hasCharacter, game }) => {
  // get back userstat
  // Pick a character
  return (
    <div>
      Details of game
      <div>
        You are playing the character:
        <Character c={character} />
      </div>
      <div>
        Game you are playing
        <UserStat userStat={userStat} />
      </div>
      <div>
        <Game game={game} />
      </div>
      <div>
        <GoBackButton path="/game" />
      </div>
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
