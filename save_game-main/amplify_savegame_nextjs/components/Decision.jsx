import React from "react";
import gameStyles from "../styles/Game.module.css";

export const Decision = ({ QTA, game, option, handleValueChange }) => {
  return (
    <>
      <h1 className="txt-white">What do you do?</h1>
      {game.QA[`answer${QTA}`].map((q, idx) => {
        return (
          <div
            className={gameStyles.choice}
            key={idx}
            onClick={() => handleValueChange(idx)}
          >
            <p
              className={
                idx === option ? gameStyles.answerSelected : gameStyles.answer
              }
            >
              {idx} - {q}
            </p>
          </div>
        );
      })}
    </>
  );
};
