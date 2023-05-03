import React, { useState, useEffect } from "react";
import gameService from "../service/gameService";
import { Decision } from "./Decision";
import Countdown from "./Countdown";
import gameStyles from "../styles/Game.module.css";
import { useDispatch } from "react-redux";

import { CHARACTER_UPDATE_ACTION } from "../redux/actions/characterActions";
import { USERSTAT_UPDATE_ACTION } from "../redux/actions/userStatActions";

import { GameOver } from "./GameOver";
import { useRouter } from "next/router";

export const Game = ({ game, QTA, setQTA, us, setUs }) => {
  const dispatch = useDispatch();
  // option - which answer is user answering - choice
  const [option, setOption] = useState(null);
  const [isLocked, setIsLocked] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const [timeUntil, setTimeUntil] = useState(game.timeUntil);

  // has user finished?
  const [isFinished, setIsFinished] = useState(game.isGameDone);

  const [isFeedback, setIsFeedback] = useState(false);

  const handleFeedback = () => {
    // false -> show next question
    setIsFeedback(false);
    // Reset this var - s.t it does not have selected value for next question
    setOption(null);

    // Change character after user handles the feedback
    dispatch(CHARACTER_UPDATE_ACTION(QTA));
  };

  const handleNext = async () => {
    // Handles answering the question
    setIsLoading(true);

    // If timeUntil has not reached 0 we can not answer
    if (isLocked) return;
    if (option === null) return;
    if (isLoading) return;

    const data = await gameService.makeDecision(option);

    // user is displayed feedback from the previous question
    setIsFeedback(true);
    // New values set for next question
    setIsLocked(game.canMakeDecision);
    setTimeUntil(data.timeUntil);
    setIsFinished(data.isGameDone);
    setUs(data.game);

    setQTA(data.questionToAnswer);

    if (data.game.isDead) setIsFinished(data.game.isDead);
    dispatch(USERSTAT_UPDATE_ACTION(data.game));
    setIsLoading(false);
  };

  const handleValueChange = (idx) => {
    if (isLocked) return;
    setOption(idx);
  };

  useEffect(() => {}, [QTA]);

  // When the game finishes we change back to first img of character
  if (isFinished) dispatch(CHARACTER_UPDATE_ACTION(1));
  if (isFinished) router.push(`/gameover/${id}`);

  return (
    <>
      {isFinished ? null : (
        <>
          {isFeedback ? (
            <>
              {QTA - 1 !== 0 && (
                <>
                  <h1 className="title">Aftermath {QTA - 1}</h1>
                  <p className={gameStyles.question}>
                    {game.QA[`actualAnswerText${QTA - 1}`][option]}
                  </p>
                  <button
                    className={"btn"}
                    type="button"
                    onClick={() => handleFeedback()}
                  >
                    Next
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <div>
                <h1 className="title">Question {QTA}</h1>
                <p className={gameStyles.question}>
                  {game.QA[`question${QTA}`]}
                </p>
              </div>

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

              <div className={gameStyles.cardContainer}>
                <div className={gameStyles.cardContent}>
                  <Decision
                    QTA={QTA}
                    game={game}
                    option={option}
                    handleValueChange={handleValueChange}
                  />
                </div>
              </div>

              <button
                disabled={option === null || isLocked || isLoading}
                // className={isLocked ? "btn-disabled" : "btn"}
                className={option === null ? "btn-disabled" : "btn"}
                type="button"
                onClick={() => handleNext()}
              >
                {isLocked ? (
                  "Locked"
                ) : (
                  <>{option === null ? "Choose what to do" : "Next"}</>
                )}
              </button>
            </>
          )}
        </>
      )}
    </>
  );
};
