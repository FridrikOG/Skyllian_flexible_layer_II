const getBoss = (purchases, bossId) => {
  let ourBoss = {};
  let ret = purchases.filter((el) => el.id.toString() === bossId);
  let first = ret[0];
  return first;
};

const purchasesReducer = (state = { purchases: [] }, action) => {
  switch (action.type) {
    case "SET_PURCHASES":
      return {
        purchases: action.payload,
      };
    case "DELETE_PURCHASES":
      return {
        purchases: state.purchases.filter(
          (el) => el.id.toString() !== action.payload.id
        ),
      };
    case "ADD_PURCHASES":
      return {
        purchases: [...state.purchases, action.payload],
      };

    case "EDIT_PURCHASES":
      const filteredpurchases = state.purchases.filter(
        (el) => el.id.toString() !== action.payload.id
      );
      return {
        purchases: [...filteredpurchases, action.payload],
      };

    case "GET_SINGLE_PURCHASE":
      return {
        purchases: action.payload,
      };
    default:
      return {
        purchases: state.purchases,
      };
  }
};

export default purchasesReducer;
