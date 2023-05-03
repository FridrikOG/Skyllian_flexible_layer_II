import React from "react";
import Link from "next/link";
import Router from "next/router";

export const GoBackButton = ({ path, title }) => {
  return (
    <>
      {path === undefined ? (
        <div className="btn" onClick={() => Router.back()}>
          Back
        </div>
      ) : (
        <Link href={path}>
          <button className={title === "Home" ? "home-btn" : "btn"}>
            {title}
          </button>
        </Link>
      )}
    </>
  );
};
