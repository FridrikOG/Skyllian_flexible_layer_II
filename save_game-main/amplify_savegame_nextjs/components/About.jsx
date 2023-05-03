import React from "react";

import aboutStyles from "../styles/About.module.css";
import { GoBackButton } from "../core/buttons/GoBackButton";

export const About = () => {
  return (
    <>
      <h1 className="txt-white">About</h1>
      <div className={aboutStyles.center}>
        <p className={`txt-white`}>
          Project created by the FinTech Centre at Reykjavik University with the
          purpose of experimenting with non-fungible tokens (NFT's).
        </p>
      </div>
      <GoBackButton />
    </>
  );
};
