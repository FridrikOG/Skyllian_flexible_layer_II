import React, { useState } from "react";
import gameService from "../service/gameService";

export const Questionaire = () => {
  const [first, setfirst] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  const handleSubmit = async () => {
    if (first === "") return;

    await gameService.sendFeedback(first);
    setIsSubmit(true);
  };

  return (
    <>
      {!isSubmit ? (
        <div>
          <h2 className="txt-white">Got any feedback for us?</h2>
          <input
            value={first}
            onChange={(e) => setfirst(e.target.value)}
            placeholder="Tell us what you think"
          />
          <button
            disabled={first === ""}
            onClick={handleSubmit}
            className="btn"
            type="submit"
            value="button"
          >
            Send in feedback
          </button>
        </div>
      ) : (
        <div>
          <h3 className="txt-white">Thank you for your feedback</h3>
        </div>
      )}
    </>
  );
};
