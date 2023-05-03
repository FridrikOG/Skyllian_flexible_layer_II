import React, { useState, useEffect } from "react";
import gameService from "../service/gameService";
import Countdown from "./Countdown";

export const Game = ({ game }) => {
  // option - which answer is user answering - choice
  const [option, setOption] = useState(null);

  const [isLocked, setIsLocked] = useState(game.canMakeDecision);

  const [timeUntil, setTimeUntil] = useState(game.timeUntil);

  // has user finished?
  const [isFinished, setIsFinished] = useState(game.isGameDone);
  const [QTA, setQTA] = useState(game.questionToAnswer);

  const handleNext = async () => {
    // Handles answering the question

    // If timeUntil has not reached 0 we can not answer
    if (isLocked) return;
    if (option === null) return;
    const data = await gameService.makeDecision(option);
    console.log(data.canMakeDecision);
    setIsLocked(game.canMakeDecision);
    setTimeUntil(data.timeUntil);
    setIsFinished(data.isGameDone);
    setQTA(data.questionToAnswer);
    setOption(null);
  };

  const handleValueChange = (e) => {
    // e - event
    if (isLocked) return;
    setOption(e.target.value);
  };

  useEffect(() => {
    console.log("refresh page - QTA");
  }, [QTA]);

  useEffect(() => {}, [timeUntil]);

  return (
    <div>
      {isFinished ? (
        <> You have finished game </>
      ) : (
        <>
          <br />
          <br />
          Question Number: {QTA}
          <br />
          <br />
          <div>
            <Countdown
              initDays={0}
              initHours={0}
              initMinutes={0}
              initSeconds={timeUntil}
              setIsLocked={setIsLocked}
              isLocked={isLocked}
            />
          </div>
          <div onChange={handleValueChange}>
            {game.QA[`answer${QTA}`].map((q) => {
              return (
                <span key={q}>
                  <input
                    checked={q == option}
                    value={q}
                    type="radio"
                    name="q"
                  />
                  {q}
                </span>
              );
            })}
            <button
              disabled={option === null || isLocked}
              className={isLocked ? "btn-disabled" : "btn"}
              type="button"
              onClick={() => handleNext()}
            >
              {isLocked ? "Locked" : "Next"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
