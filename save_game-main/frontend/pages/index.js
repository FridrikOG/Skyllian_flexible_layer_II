import Head from "next/head";
import homeStyles from "../styles/Home.module.css";
import userService from "../service/userService";
import Logout from "../components/Logout";

import { useSelector } from "react-redux";
import GuardImage from "../core/images/GuardImage";

export default function Home() {
  const isLoggedIn = useSelector((state) => state.userReducer.loggedIn);
  const user = useSelector((state) => state.userReducer.data);

  return (
    <>
      <div>
        <h1 className="title">Safe Game</h1>
        <GuardImage />
      </div>
      {console.log("isLoggedIn", isLoggedIn)}
      {isLoggedIn ? (
        <>
          <div>
            <p> Welcome {user.username} to Save Game!</p>
          </div>
          <div>
            <Logout />
          </div>
        </>
      ) : null}
      <div className="grid">
        <a href={isLoggedIn ? "game" : "login"} className="button">
          Join Game
        </a>
      </div>

      <div className="options"></div>

      <style jsx>{`
        .button {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          position: absolute;
          background: #650419;
          border: 1px solid rgba(0, 0, 0, 0.63);
          box-sizing: border-box;
          font-family: Poppins;
          font-style: normal;
          font-weight: bold;
          font-size: 22px;
          line-height: 43px;
          color: #ffffff;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          color: #ffffff;
          font-family: Original Surfer;
          font-style: normal;
          font-weight: normal;
          font-size: 72px;
          line-height: 90px;
        }

        .title,
        .options {
          text-align: center;
        }

        .options {
        }
      `}</style>
    </>
  );
}
