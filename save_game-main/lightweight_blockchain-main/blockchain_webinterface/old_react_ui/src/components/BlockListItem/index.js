import React from 'react';
import PropTypes from 'prop-types';

export const BlockListItem = ({
    previous_hash, writer_signature, writer_id, coordinator_id, winner_number, payload,
}) => (

        <tr>
            <td>{previous_hash}</td>
            <td>{writer_signature}</td>
            <td>{writer_id}</td>
            <td>{coordinator_id}</td>
            <td>{winner_number}</td>
            <td>{JSON.stringify(payload)}</td>
        </tr>
    );

BlockListItem.defaultProps = {
    previous_hash: '',
    writer_signature: '',
    writer_id: 0,
    coordinator_id: 0,
    winner_number: 0,
    payload: {},
};

BlockListItem.propTypes = {
    previous_hash: PropTypes.string,
    writer_signature: PropTypes.string,
    writer_id: PropTypes.number,
    coordinator_id: PropTypes.number,
    winner_number: PropTypes.number,
    payload: PropTypes.object,
};

export default BlockListItem;
