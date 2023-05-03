const determineEnvironment = () => {
  switch (process.env.NODE_ENV) {
    case "development":
      return "http://localhost:4567";
    case "production":
      return "";
    default:
      return null;
  }
};

module.exports = {
  externals: {
    config: {
      apiURL: determineEnvironment(),
    },
  },
};
