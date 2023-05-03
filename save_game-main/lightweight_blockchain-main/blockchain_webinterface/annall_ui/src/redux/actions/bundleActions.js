export const SET_BUNDLES_ACTION = (data) => ({
  type: "SET_BUNDLES",
  payload: data,
});

export function FETCH_BUNDLE_BY_ID_ACTION(id) {
  return {
    type: "FETCH_BUNDLE_BY_ID_ACTION",
    payload: id,
  };
}
