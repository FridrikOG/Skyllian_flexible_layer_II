const tokenReducer = (state = {}, action) => {
  switch (action.type) {
    case "TOKEN_CREATE":
      return {
        tokens: action.payload,
      };
    default:
      return {
        tokens: state.tokens,
      };
  }
};

export default tokenReducer;
