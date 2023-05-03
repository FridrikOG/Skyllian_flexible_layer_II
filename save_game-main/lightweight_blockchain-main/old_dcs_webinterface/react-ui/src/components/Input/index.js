/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

export const Input = ({
    value,
    onInput,
    type,
    errorMessage,
    label,
    name,
    htmlId,
    size,
}) => (
        <div className="form-group">
            <TextField
                type={type}
                value={value}
                onChange={onInput}
                name={name}
                id={htmlId}
                label={label}
                size={size}
                variant="outlined"
            />
            <span className="error">{errorMessage}</span>
        </div>
    );

Input.defaultProps = {
    errorMessage: '',
};

Input.propTypes = {
    /* The value provided to the input HTML tag */
    value: PropTypes.string.isRequired,
    onInput: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['text', 'password', 'submit', 'email', 'number']).isRequired,
    errorMessage: PropTypes.string,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    htmlId: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
};

export default Input;
