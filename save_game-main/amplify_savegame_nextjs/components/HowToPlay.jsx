import React from "react";
import Characters from "../components/Characters";
import { GoBackButton } from "../core/buttons/GoBackButton";

import howToPlayStyles from "../styles/HowToPlay.module.css";

const HowToPlay = () => {
  return (
    <>
      <h1 className="txt-white">How To Play</h1>
      <div className={howToPlayStyles.center}>
        <p className="txt-white">
          You will experience 5 different scenarios throughout your life. In
          these scenarios, you have to choose between two decisions! These
          decisions will have a financial and health impact. Surviving puts you
          on the leaderboard where you can see how you stack against others,
          good luck!
        </p>
      </div>

      <br />
      <br />
      <div className={howToPlayStyles.center}>
        <h3 className="txt-white"> Joel</h3>
        <Characters story={1} />
        <h3 className="txt-white"> Anna</h3>
        <Characters story={2} />

        <br />
        <br />

        <h1 className="txt-white"> Free Coffee </h1>
        <img
          src={
            "https://cdn.shopify.com/s/files/1/0348/0436/7419/files/kynningarefni_Kaffibollakort_1f1f6744-092f-4f44-a500-9f1806ea049c_1024x1024.png?v=1641195747"
          }
          className={howToPlayStyles.img}
        />
        <p className={`txt-white ${howToPlayStyles.center}`}>
          When you complete a game you earn a free coffee card at Kaffitar. A
          user will be sent a coffee card to the email connected with the
          account. A user can only receive one coffee card. Have fun!
        </p>
      </div>

      <GoBackButton />
    </>
  );
};

export default HowToPlay;
