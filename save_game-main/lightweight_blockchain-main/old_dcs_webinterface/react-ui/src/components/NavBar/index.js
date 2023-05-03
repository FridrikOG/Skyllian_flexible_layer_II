import React from 'react';
import PropTypes from 'prop-types';
import Navbar from 'react-bootstrap/Navbar';
import { connect } from 'react-redux';
import Nav from 'react-bootstrap/Nav';
import { withRouter } from 'react-router-dom';
import { logoutUser } from '../../actions/userActions';
import { deleteAuthLevel } from '../../actions/authActions';
import { setLoginModal, setVerifyModal } from '../../actions/modalActions';
import Logo from '../../assests/logo.svg';

class NavBar extends React.Component {
    onLogout() {
        const {
            logoutUserR,
            history,
            deleteAuthLevelR,
        } = this.props;
        logoutUserR();
        deleteAuthLevelR();
        history.push('/');
    }

    render() {
        const {
            history,
            setVerifyModalR,
            setLoginModalR,
            scrollToMidRef,
            scrollToBotRef,
            authLevel,
        } = this.props;
        return (
            <Navbar collapseOnSelect expand="md" variant="dark" className="navbar_container" fixed="top">
                <Navbar.Brand className="navbar_title" style={{ cursor: 'pointer' }} onClick={() => history.push('/')}>
                    <img
                        alt=""
                        src={Logo}
                        className="d-inline-block align-top logo"
                    />
                    {' '}
                    <div>
                        Digital certification service
                    </div>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav bg="primary" className="ml-auto ">
                        <>
                            <Nav.Link className="lesser_links" onClick={() => setVerifyModalR(true)}>Verify</Nav.Link>
                        </>
                        {
                            history.location.pathname === '/'
                                ? (
                                    <>
                                        <Nav.Link className="lesser_links" onClick={() => scrollToMidRef()}>About project</Nav.Link>
                                        <Nav.Link className="lesser_links" onClick={() => scrollToBotRef()}>About us</Nav.Link>
                                    </>
                                )
                                : (
                                    <>
                                    </>
                                )
                        }
                        {
                            authLevel === 'user'
                                ? (
                                    <>
                                        <Nav.Link className="lesser_links" onClick={() => history.push('/user')}>Files</Nav.Link>
                                    </>
                                )
                                : (
                                    <>
                                    </>
                                )
                        }
                        {
                            authLevel === 'admin'
                                ? (
                                    <>
                                        <Nav.Link className="lesser_links" onClick={() => history.push('/admin')}>Users</Nav.Link>
                                    </>
                                )
                                : (
                                    <>
                                    </>
                                )
                        }
                        {
                            authLevel === 'auth'
                                ? (
                                    <>
                                        <Nav.Link className="primary_links" onClick={() => setLoginModalR(true)}>Log In</Nav.Link>
                                    </>
                                )
                                : (
                                    <>
                                        <Nav.Link className="primary_links" onClick={() => this.onLogout()}>Log Out</Nav.Link>
                                    </>
                                )
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

// NavBar.defaultProps = {
//     authLevel: 'auth',
// };

NavBar.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired,
        }),
    }).isRequired,
    authLevel: PropTypes.oneOf(['auth', 'user', 'admin']).isRequired,
    logoutUserR: PropTypes.func.isRequired,
    setLoginModalR: PropTypes.func.isRequired,
    setVerifyModalR: PropTypes.func.isRequired,
    deleteAuthLevelR: PropTypes.func.isRequired,
    scrollToMidRef: PropTypes.func.isRequired,
    scrollToBotRef: PropTypes.func.isRequired,
};

const mapStateToProps = (reduxStoreState) => ({
    authLevel: reduxStoreState.auth.auth,
});

export default connect(mapStateToProps, {
    logoutUserR: logoutUser,
    setLoginModalR: setLoginModal,
    setVerifyModalR: setVerifyModal,
    deleteAuthLevelR: deleteAuthLevel,
})(withRouter(NavBar));
