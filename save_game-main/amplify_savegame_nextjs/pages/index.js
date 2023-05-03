import Head from "next/head";
import homeStyles from "../styles/Home.module.css";
import userService from "../service/userService";
import Logout from "../components/Logout";

import { useSelector } from "react-redux";

import Link from "next/link";

export default function Home() {
  const isLoggedIn = useSelector((state) => state.userReducer.loggedIn);
  const user = useSelector((state) => state.userReducer.data);

  return (
    <>
      <div>
        {isLoggedIn ? (
          <>
            <div className="grid">
              <span className="txt-white">Welcome {user.username} </span>
              <a href={isLoggedIn ? "game" : "login"} className="join-btn">
                Join Game
              </a>
              <Logout />
            </div>
          </>
        ) : (
          <div className="grid">
            <a href={isLoggedIn ? "game" : "login"} className="join-btn">
              Join Game
            </a>
          </div>
        )}
      </div>
      <div>
        <a className="btn" href="/howtoplay">
          How to play
        </a>
        <a className="btn" href="about">
          About
        </a>
        <a className="btn" href="nfts">
          View NFT's (beta)
        </a>
      </div>
    </>
  );
}
