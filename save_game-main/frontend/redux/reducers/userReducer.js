const userReducer = (state = {}, action) => {
  switch (action.type) {
    case "USER_LOGIN":
      return {
        data: action.payload,
        loggedIn: true,
        selectedUser: state.selectedUser,
      };
    case "USER_LOGOUT":
      return {
        loggedIn: false,
      };
    case "USER_REGISTER":
      return {
        data: action.payload,
        loggedIn: true,
        selectedUser: state.selectedUser,
      };
    case "USER_UPDATE":
      return {
        data: action.payload,
        loggedIn: true,
        selectedUser: state.selectedUser,
      };
    case "USER_SELECT":
      return {
        loggedIn: state.loggedIn,
        data: state.data,
        // selected
        selectedUser: action.payload,
      };
    default:
      return {
        loggedIn: state.loggedIn,
        data: state.data,
        selectedUser: state.selectedUser,
      };
  }
};

export default userReducer;
