const characterReducer = (state = {}, action) => {
  switch (action.type) {
    case "CHARACTER_UPDATE":
      return {
        data: action.payload,
      };
    default:
      return {
        data: state.data,
      };
  }
};

export default characterReducer;
