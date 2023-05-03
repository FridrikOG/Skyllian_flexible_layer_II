import buri from "../config/django";
import axios from "axios";
import authService from "./authService";

const gameService = () => {
  const getAllGames = async (accessToken) => {
    const res = await axios.get(`${buri}api/game/join/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res;
  };

  const joinGame = async (gameId) => {
    await axios.post(`${buri}api/game/join/`, { gameId });
  };

  const getGame = async (accessToken) => {
    const res = await axios.get(`${buri}api/userStat/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res;
  };

  const makeDecision = async (value) => {
    const res = await axios.post(`${buri}api/userStat/`, { choice: value });
    return res.data;
  };

  const viewStats = async ({ accessToken, gameId }) => {
    const res = await axios.get(`${buri}api/userStat/history/${gameId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res;
  };

  const leaderBoard = async ({ accessToken, gameId }) => {
    const res = await axios.get(`${buri}api/game/leaderboard/${gameId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res;
  };

  const sendFeedback = async (feedback) => {
    await axios.post(`${buri}api/feedback/`, { description: feedback });
  };

  return {
    getAllGames,
    joinGame,
    getGame,
    makeDecision,
    viewStats,
    leaderBoard,
    sendFeedback,
  };
};

export default gameService();
