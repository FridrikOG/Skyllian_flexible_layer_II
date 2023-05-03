export const USER_LOGIN_ACTION = (data) => ({
  type: "USER_LOGIN",
  payload: data,
});

export const USER_REGISTER_ACTION = (data) => ({
  type: "USER_REGISTER",
  payload: data,
});

export const USER_LOGOUT_ACTION = () => ({
  type: "USER_LOGOUT",
});

export const USER_UPDATE_ACTION = (data) => ({
  type: "USER_UPDATE",
  payload: data,
});

export const USER_SELECT_ACTION = (data) => ({
  type: "USER_SELECT",
  payload: data,
});
