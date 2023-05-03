import React from 'react';
import PropTypes from 'prop-types';

export const WriterListItem = ({
    id, ip, port,
}) => (

        <tr>
            <td>{id}</td>
            <td>{ip}</td>
            <td>{port}</td>
        </tr>
    );

WriterListItem.defaultProps = {
    id: '',
    ip: 0,
    port: 0
};

WriterListItem.propTypes = {
    id: PropTypes.string,
    ip: PropTypes.number,
    port: PropTypes.number
};

export default WriterListItem;
