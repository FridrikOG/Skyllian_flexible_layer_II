import React from "react";
import { useSelector } from "react-redux";

export const Character = ({ QTA, character, story }) => {
  console.log(story);

  return (
    <>
      <h1 className="txt-white">{character.name}</h1>
      {story == 1 ? (
        <>
          {QTA === 1 && <img src={"/joel_1.png"} className="charImg" />}
          {QTA === 2 && <img src={"/joel_2.png"} className="charImg" />}
          {QTA === 3 && <img src={"/joel_3.png"} className="charImg" />}
          {QTA === 4 && <img src={"/joel_4.png"} className="charImg" />}
          {QTA === 5 && <img src={"/joel_5.png"} className="charImg" />}
        </>
      ) : (
        <>
          {QTA === 1 && <img src={"/anna_1.png"} className="charImg" />}
          {QTA === 2 && <img src={"/anna_2.png"} className="charImg" />}
          {QTA === 3 && <img src={"/anna_3.png"} className="charImg" />}
          {QTA === 4 && <img src={"/anna_4.png"} className="charImg" />}
          {QTA === 5 && <img src={"/anna_5.png"} className="charImg" />}
        </>
      )}
    </>
  );
};
