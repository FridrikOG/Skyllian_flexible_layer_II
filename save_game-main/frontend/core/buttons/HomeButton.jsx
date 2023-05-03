import React from "react";
import Link from "next/link";
import Router from "next/router";

export const HomeButton = () => {
  return (
    <Link href={"/"}>
      <button className="home-btn">
        <h1>Home Page</h1>
      </button>
    </Link>
  );
};
