import React from "react";
import PropTypes from "prop-types";

export const PayloadListItem = ({ id, payload }) => (
  <tr>
    <td>{id}</td>
    <td>{payload}</td>
    item
  </tr>
);

PayloadListItem.defaultProps = {
  id: "",
  payload: {},
};

PayloadListItem.propTypes = {
  id: PropTypes.string,
  payload: PropTypes.string,
};

export default PayloadListItem;
