import React from "react";
import Link from "next/link";
import Router from "next/router";

export const GoBackButton = ({ path }) => {
  console.log(path);
  return (
    <>
      {path === undefined ? (
        <div className="btn" onClick={() => Router.back()}>
          Back
        </div>
      ) : (
        <Link href={path}>
          <button className="home-btn">Home</button>
        </Link>
      )}
    </>
  );
};
