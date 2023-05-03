const getBundle = (bundles, bossId) => {
  let ourBoss = {};
  let ret = bundles.filter((el) => el.id.toString() === bossId);
  let first = ret[0];
  return first;
};

const bundleReducer = (state = { bundles: [] }, action) => {
  switch (action.type) {
    case "SET_BUNDLES":
      return {
        bundles: action.payload,
      };
    case "DELETE_BUNDLES":
      return {
        bundles: state.bundles.filter(
          (el) => el.id.toString() !== action.payload.id
        ),
      };
    case "ADD_BUNDLES":
      return {
        bundles: [...state.bundles, action.payload],
      };

    case "EDIT_BUNDLES":
      const filteredbundles = state.bundles.filter(
        (el) => el.id.toString() !== action.payload.id
      );
      return {
        bundles: [...filteredbundles, action.payload],
      };
    default:
      return {
        bundles: state.bundles,
      };
  }
};

export default bundleReducer;
