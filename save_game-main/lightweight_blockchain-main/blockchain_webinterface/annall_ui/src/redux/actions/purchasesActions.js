export const SET_PURCHASES_ACTION = (data) => ({
  type: "SET_PURCHASES",
  payload: data,
});

export function FETCH_PURCHASES_BY_TELEPHONE_ACTION(id) {
  return {
    type: "GET_SINGLE_BUBBLE",
    payload: id,
  };
}
