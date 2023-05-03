import React from "react";
import { About } from "../../components/About";
import { GoBackButton } from "../../core/buttons/GoBackButton";
import NFTForm from "../../components/NFTForm";
import NFTViewer from "../../components/NFTViewer";

const about = () => {
  return (
    <>
      <h1 className="txt-white">NFTS</h1>
      <NFTForm />
      <NFTViewer />
      <GoBackButton />
    </>
  );
};

export default about;
