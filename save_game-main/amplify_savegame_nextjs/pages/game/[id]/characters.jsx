import React from "react";
import characterService from "../../../service/characterService";
import cookieService from "../../../service/cookieService";
import { CharacterCard } from "../../../components/CharacterCard";
import { GoBackButton } from "../../../core/buttons/GoBackButton";

const characterSelection = ({ character }) => {
  console.log(character);
  return (
    <>
      <h1 className="txt-white">Select Character </h1>
      <CharacterCard key={character.id} c={character} />
      <GoBackButton path={"/game"} title={"Back"} />
    </>
  );
};

export async function getServerSideProps({ req }) {
  // Source - SSR: https://imgur.com/a/WhqxKNu
  // Extract accestoken from cookie
  const accessToken = cookieService.getAccessToken(req);
  // get all games to join
  const res = await characterService.getAllCharacters(accessToken);

  // extract data from response
  const data = res.data;

  if (res.status === 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  // if (data.hasCharacter) return {props: { userStat: data.userStat, character: data.character, hasCharacter: data.hasCharacter  }} // will be passed to the page component as props
  if (!data.hasCharacter) return { props: { character: data.character } };

  return {
    redirect: {
      permanent: false,
      destination: `error`,
    },
  };
}

export default characterSelection;
