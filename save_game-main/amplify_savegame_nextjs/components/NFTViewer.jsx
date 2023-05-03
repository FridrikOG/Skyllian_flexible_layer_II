import React from "react";
import Characters from "./Characters";

const NFTViewer = () => {
  return (
    <>
      <h1 className="txt-white"> NFT Collection</h1>
      <div>
        <Characters story={1} />
        <button className="btn" type="button" value="Login">
          View Collection
        </button>

        <Characters story={2} />
        <button className="btn" type="button" value="Login">
          View Collection
        </button>
      </div>
    </>
  );
};

export default NFTViewer;
