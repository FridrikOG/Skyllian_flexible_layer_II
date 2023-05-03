const addConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  sameSite: "strict",
  path: "/",
};

const removeConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  sameSite: "strict",
  maxAge: new Date(0),
  path: "/",
};

export { removeConfig, addConfig };
