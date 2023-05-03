import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Progress extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { progress } = this.props;
        return (
            <div className="ProgressBar">
                <div
                    className="Progress"
                    style={{ width: `${progress}%` }}
                />
            </div>
        );
    }
}

Progress.propTypes = {
    progress: PropTypes.number.isRequired,
};

export default Progress;
