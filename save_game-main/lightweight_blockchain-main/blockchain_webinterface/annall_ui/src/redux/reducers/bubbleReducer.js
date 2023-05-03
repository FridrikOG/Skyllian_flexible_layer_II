const getBoss = (bosses, bossId) => {
  let ourBoss = {};
  let ret = bosses.filter((el) => el.id.toString() === bossId);
  let first = ret[0];
  return first;
};

const bubbleReducer = (state = { bosses: [] }, action) => {
  switch (action.type) {
    case "SET_BUBBLES":
      return {
        bosses: action.payload,
      };
    case "DELETE_BUBBLES":
      return {
        bosses: state.bosses.filter(
          (el) => el.id.toString() !== action.payload.id
        ),
      };
    case "ADD_BUBBLES":
      return {
        bosses: [...state.bosses, action.payload],
      };

    case "EDIT_BUBBLES":
      const filteredBosses = state.bosses.filter(
        (el) => el.id.toString() !== action.payload.id
      );
      return {
        bosses: [...filteredBosses, action.payload],
      };

    case "GET_SINGLE_BUBBLE":
      return {
        bosses: action.payload,
      };
    default:
      return {
        bosses: state.bosses,
      };
  }
};

export default bubbleReducer;
