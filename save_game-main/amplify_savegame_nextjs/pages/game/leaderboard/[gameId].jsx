import React from "react";
import gameService from "../../../service/gameService";
import cookieService from "../../../service/cookieService";
import { GoBackButton } from "../../../core/buttons/GoBackButton";
import Characters from "../../../components/Characters";

const gameStats = ({ userStats }) => {
  console.log(userStats);
  return (
    <div className="txt-white">
      <h1>Stats </h1>
      <Characters story={userStats[0].game.story} />
      <table>
        <tr>
          <th>#</th>
          <th>Username</th>
          <th>Score</th>
        </tr>
        {userStats.map((stats, idx) => {
          return (
            <>
              <tr>
                <td>{idx + 1}</td>
                <td>{stats.user.username}</td>
                <td>{stats.score}</td>
              </tr>
            </>
          );
        })}
      </table>
      <GoBackButton />
    </div>
  );
};

export async function getServerSideProps({ req, query }) {
  // Source - SSR: https://imgur.com/a/WhqxKNu
  // Extract accestoken from cookie
  const accessToken = cookieService.getAccessToken(req);
  // get all games to join
  const res = await gameService.leaderBoard({
    accessToken,
    gameId: query.gameId,
  });

  // extract data from response
  const data = res.data;

  if (res.status === 401) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  if (res.status === 200) {
    return {
      props: {
        userStats: data.userStats,
      },
    };
  }

  return {
    redirect: {
      permanent: false,
      destination: `error`,
    },
  };
}

export default gameStats;
