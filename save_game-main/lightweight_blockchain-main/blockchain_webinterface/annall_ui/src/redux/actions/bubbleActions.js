export const SET_BUBBLES_ACTION = (data) => ({
  type: "SET_BUBBLES",
  payload: data,
});

export function FETCH_BUBBLE_BY_ID_ACTION(id) {
  return {
    type: "GET_SINGLE_BUBBLE",
    payload: id,
  };
}
