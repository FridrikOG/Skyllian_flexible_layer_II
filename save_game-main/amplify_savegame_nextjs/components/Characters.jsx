import React from "react";

import charStyles from "../styles/Character.module.css";

const Characters = ({ story }) => {
  return (
    <div className={charStyles.charactersContainer}>
      {story === 1 && (
        <>
          <img src={"/joel_1.png"} className={charStyles.charactersImg} />
          <img src={"/joel_2.png"} className={charStyles.charactersImg} />
          <img src={"/joel_3.png"} className={charStyles.charactersImg} />
          <img src={"/joel_4.png"} className={charStyles.charactersImg} />
          <img src={"/joel_5.png"} className={charStyles.charactersImg} />
        </>
      )}
      {story === 2 && (
        <>
          <img src={"/anna_1.png"} className={charStyles.charactersImg} />
          <img src={"/anna_2.png"} className={charStyles.charactersImg} />
          <img src={"/anna_3.png"} className={charStyles.charactersImg} />
          <img src={"/anna_4.png"} className={charStyles.charactersImg} />
          <img src={"/anna_5.png"} className={charStyles.charactersImg} />
        </>
      )}
    </div>
  );
};

export default Characters;
