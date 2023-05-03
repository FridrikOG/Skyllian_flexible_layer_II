import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { withRouter } from 'react-router-dom';
import { setLoginModal } from '../../actions/modalActions';
import { setUser } from '../../actions/userActions';
import { getAuthLevel } from '../../actions/authActions';
import { Input } from '../Input';

class Login extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            username: '',
            password: '',
            errors: {
                usernameErrors: '',
                passwordErrors: '',
            },
        };
    }

    onInput(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    async authenticate(e) {
        e.preventDefault();
        const {
            username, password,
        } = this.state;
        const {
            setLoginModalR,
            setUserR,
            getAuthLevelR,
            history,
        } = this.props;
        const errors = {};
        if (username === '') { errors.usernameErrors = 'Username is required'; }
        if (password === '') { errors.passwordErrors = 'Password is required'; }
        const obj = { username, password };
        if (Object.keys(errors).length > 0) {
            /* eslint-disable */
            this.setState({ ...this.state.errors, errors });
            /* eslint-enable */
        } else {
            try {
                await setUserR(obj);
                setLoginModalR(false);
                await getAuthLevelR();
                const { user } = this.props;
                if (user.isadmin) {
                    history.push('/admin');
                } else {
                    history.push('/user');
                }
            } catch (er) {
                errors.passwordErrors = 'Username or password incorrect';
                /* eslint-disable */
                this.setState({ ...this.state.errors, errors });
                /* eslint-enable */
            }
        }
    }

    render() {
        const {
            username, password, errors,
        } = this.state;
        const {
            loginModal, setLoginModalR,
        } = this.props;
        return (
            <Modal
                show={loginModal}
                onHide={() => setLoginModalR(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="login_modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        DCS
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <form onSubmit={(e) => this.authenticate(e)} className="form form-horizontal">
                            <Input
                                type="text"
                                value={username}
                                name="username"
                                htmlId="username"
                                label="Username"
                                size="medium"
                                errorMessage={errors.usernameErrors}
                                onInput={(e) => this.onInput(e)}
                            />
                            <Input
                                type="password"
                                value={password}
                                name="password"
                                htmlId="password"
                                label="Password"
                                size="medium"
                                errorMessage={errors.passwordErrors}
                                onInput={(e) => this.onInput(e)}
                            />
                            <input
                                type="submit"
                                value="Submit"
                                className="btn btn-success"
                            />
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="or_border">
                        <h6>or</h6>
                    </div>

                    <Button
                        as="input"
                        onChange={() => console.log('click')} // get warning if removed
                        type="button"
                        value="Create an account?"
                        variant="link"
                    />
                    <Button
                        as="input"
                        onChange={() => console.log('click')} // get warning if removed
                        type="button"
                        value="Forgot Password?"
                        variant="link"
                    />
                </Modal.Footer>
            </Modal>
        );
    }
}

Login.defaultProps = {
    user: {},
};

Login.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
    loginModal: PropTypes.bool.isRequired,
    user: PropTypes.shape(),
    setLoginModalR: PropTypes.func.isRequired,
    setUserR: PropTypes.func.isRequired,
    getAuthLevelR: PropTypes.func.isRequired,
};

const mapStateToProps = (reduxStoreState) => ({
    loginModal: reduxStoreState.modal.showLoginModal,
    user: reduxStoreState.user.user,
});

export default connect(mapStateToProps, {
    setUserR: setUser,
    setLoginModalR: setLoginModal,
    getAuthLevelR: getAuthLevel,
})(withRouter(Login));
