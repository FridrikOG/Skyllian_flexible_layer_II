import React, { useEffect } from "react";
import { useRouter } from "next/router";
import characterService from "../service/characterService";
import charStyles from "../styles/Character.module.css";
import { useState } from "react";

// import charImg from "../public/IMG_4938.png";

export const CharacterCard = ({ c }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleSelectCharacter = async (characterId) => {
    setIsLoading(true);
    // Select character for specific game
    await characterService.selectCharacter(characterId);

    // redirect user back to game after selecting character
    const prevPathStr = router.asPath.split("/");
    prevPathStr.pop();
    const prevPath = prevPathStr.join("/");
    router.push(prevPath);
    setIsLoading(false);
  };
  return (
    <div className={charStyles.characterSelection}>
      <strong>
        <p> {c.name}</p>
        {c.name === "Joel" ? (
          <img src={"/joel_1.png"} className="charImg" />
        ) : (
          <img src={"/anna_1.png"} className="charImg" />
        )}
        {/* <img src={"/IMG_4939.png"} className="charImg" /> */}
        {/* <img src={"/IMG_4940.png"} className="charImg" /> */}
        {/* <img src={"/IMG_4941.png"} className="charImg" /> */}
      </strong>

      <ul className={charStyles.details}>
        <h1> About Joel </h1>
        <p>{c.detail1}</p>
        <h1> More </h1>
        <p>{c.detail2}</p>
      </ul>

      <button
        disabled={isLoading}
        onClick={() => handleSelectCharacter(c.id)}
        className="btn"
      >
        Select
      </button>
    </div>
  );
};
