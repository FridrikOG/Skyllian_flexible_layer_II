const userStatReducer = (state = {}, action) => {
  switch (action.type) {
    case "USERSTAT_UPDATE":
      return {
        data: action.payload,
      };
    default:
      return {
        data: state.data,
      };
  }
};

export default userStatReducer;
