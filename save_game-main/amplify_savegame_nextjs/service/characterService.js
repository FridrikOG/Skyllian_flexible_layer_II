import uri from "../config/django";
import axios from "axios";

const characterService = () => {
  const getAllCharacters = async (accessToken) => {
    const res = await axios.get(`${uri}api/character/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res;
  };
  const selectCharacter = async (characterId) => {
    await axios.post(`${uri}api/character/`, { characterId });
  };
  return { getAllCharacters, selectCharacter };
};

export default characterService();
