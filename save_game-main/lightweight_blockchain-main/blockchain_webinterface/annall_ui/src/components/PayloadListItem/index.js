import React from "react";
import PropTypes from "prop-types";

export const PayloadListItem = ({ id, name, type, data }) => (
  <tr>
    <td>{id}</td>
    <td>{name}</td>
    <td>{type}</td>
    <td>{data.domain === undefined ? data.input : data.domain}</td>
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
