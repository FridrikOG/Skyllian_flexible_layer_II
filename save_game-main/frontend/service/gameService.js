import uri from "../config/django";
import axios from "axios";
import authService from "./authService"

const gameService = () => {
  const getAllGames = async (accessToken) => {
      const res = await axios.get(`${uri}api/game/join/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res;

  };

  const joinGame = async (gameId) => {
    await axios.post(`${uri}api/game/join/`, {gameId})
  }

  const getGame = async (accessToken) => {
    const res = await axios.get(`${uri}api/userStat/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res
  }

  const makeDecision = async (value) => {
    const res = await axios.post(`${uri}api/userStat/`, {choice: value})
    return res.data
  }

  const viewStats = async({accessToken, gameId}) => {
    console.log(gameId, accessToken)
    const res = await axios.get(`${uri}api/userStat/history/${gameId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return res
  }

  return { getAllGames, joinGame, getGame,makeDecision, viewStats };
};

export default gameService();
