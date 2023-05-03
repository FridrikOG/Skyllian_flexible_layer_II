import React from "react";
import { useRouter } from "next/router";
import characterService from "../service/characterService";
import charStyles from "../styles/Character.module.css";

export const Character = ({ c }) => {
  const router = useRouter();

  const handleSelectCharacter = async (characterId) => {
    // Select character for specific game
    await characterService.selectCharacter(characterId);

    // redirect user back to game after selecting character
    const prevPathStr = router.asPath.split("/");
    prevPathStr.pop();
    const prevPath = prevPathStr.join("/");
    router.push(prevPath);
  };
  return (
    <div className={charStyles.card}>
      <strong>
        <p> Character {c.id}</p>
      </strong>

      <div>
        <p> {c.name}</p>
      </div>

      <div>
        <p> {c.detail1}</p>
      </div>

      <div>
        <p> {c.detail2}</p>
      </div>
      <button onClick={() => handleSelectCharacter(c.id)} className="btn">
        Select
      </button>
    </div>
  );
};
