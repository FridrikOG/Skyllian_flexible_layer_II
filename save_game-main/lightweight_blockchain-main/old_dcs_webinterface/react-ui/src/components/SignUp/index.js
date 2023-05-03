import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { addUser, getAllUsers } from '../../actions/userActions';
import { Input } from '../Input';

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            username: '',
            password: '',
            name: '',
            email: '',
            ssn: '',
            isAdmin: true,
            errors: {
                usernameErrors: '',
                passwordErrors: '',
                nameErrors: '',
                emailErrors: '',
                ssnErrors: '',
            },
        };
    }

    onInput(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    addUser(e) {
        e.preventDefault();
        const {
            username, password, name, email, ssn, isAdmin,
        } = this.state;
        const { addUserR, getAllUsersR } = this.props;
        const errors = {};
        if (username === '') { errors.usernameErrors = 'Username is required'; }
        if (password === '') { errors.passwordErrors = 'Password is required'; }
        if (name === '') { errors.nameErrors = 'Password is required'; }
        if (email === '') { errors.emailErrors = 'Password is required'; }
        if (ssn === '') { errors.ssnErrors = 'Password is required'; }
        const obj = {
            username, password, name, email, ssn, isAdmin,
        };
        if (Object.keys(errors).length > 0) {
            /* eslint-disable */
            this.setState({ ...this.state.errors, errors });
            /* eslint-enable */
        } else {
            addUserR(obj);
            getAllUsersR();
        }
    }

    render() {
        const {
            username, password, errors, name, email, ssn, isAdmin,
        } = this.state;
        return (
            <form onSubmit={(e) => this.addUser(e)} className="form signUpContainer">
                <div>
                    <Input
                        type="text"
                        value={username}
                        name="usr"
                        htmlId="usr"
                        label="Username"
                        size="small"
                        errorMessage={errors.usernameErrors}
                        onInput={(e) => this.onInput(e)}
                    />
                    <Input
                        type="text"
                        value={password}
                        name="pword"
                        htmlId="pword"
                        label="Password"
                        size="small"
                        errorMessage={errors.passwordErrors}
                        onInput={(e) => this.onInput(e)}
                    />
                    <Input
                        type="text"
                        value={name}
                        name="name"
                        htmlId="name"
                        label="Full name"
                        size="small"
                        errorMessage={errors.nameErrors}
                        onInput={(e) => this.onInput(e)}
                    />
                </div>
                <div>
                    <Input
                        type="email"
                        value={email}
                        name="email"
                        htmlId="email"
                        label="Email"
                        size="small"
                        errorMessage={errors.emailErrors}
                        onInput={(e) => this.onInput(e)}
                    />
                    <Input
                        type="number"
                        value={ssn}
                        name="ssn"
                        htmlId="ssn"
                        label="SSN"
                        size="small"
                        errorMessage={errors.ssnErrors}
                        onInput={(e) => this.onInput(e)}
                    />
                    <div className="signUpFormRightLower">
                        <FormControlLabel
                            value="isadmin"
                            control={(
                                <Checkbox
                                    size="small"
                                    label="Is admin"
                                    checked={isAdmin}
                                    onChange={(e) => this.setState({ isAdmin: e.target.checked })}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            )}
                            label="Is admin"
                            labelPlacement="start"
                        />
                        <input
                            type="submit"
                            value="Submit"
                            className="btn btn-primary"
                            style={{ float: 'right', marginTop: '10' }}
                        />
                    </div>
                </div>
            </form>
        );
    }
}

SignUp.propTypes = {
    addUserR: PropTypes.func.isRequired,
    getAllUsersR: PropTypes.func.isRequired,
};

export default connect(null, { addUserR: addUser, getAllUsersR: getAllUsers })(SignUp);
