import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAuthLevel } from './actions/authActions';
import { setUserById } from './actions/userActions';
import Login from './components/Login';
import Verify from './components/Verify';
import Navbar from './components/NavBar';
import HomeView from './views/HomeView';
import UserView from './views/UserView';
import AdminView from './views/AdminView';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.midRef = React.createRef();
        this.botRef = React.createRef();
        this.verRef = React.createRef();
    }

    componentDidMount() {
        const { getAuthLevelR } = this.props;
        getAuthLevelR();
    }

    setId() {
        const { auth, setUserByIdR } = this.props;

        if (auth.auth === 'user' || auth.auth === 'admin') {
            setUserByIdR(auth.user_id);
        }
    }

    /* eslint-disable */
    // minus 98 because of the padding at top because of navbar
    scrollToMidRef() {
        window.scrollTo(0, this.midRef.current.offsetTop - 98);
    }
    scrollToBotRef() {
        window.scrollTo(0, this.botRef.current.offsetTop - 98);
    }
    /* eslint-enable */

    render() {
        // const { auth } = this.props;
        this.setId();
        return (
            <div className="bod">
                <Navbar
                    scrollToMidRef={() => this.scrollToMidRef()}
                    scrollToBotRef={() => this.scrollToBotRef()}
                />
                <Login />
                <Verify />
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={(props) => (
                            <HomeView
                                // eslint-disable-next-line react/jsx-props-no-spreading
                                {...props}
                                midRef={this.midRef}
                                botRef={this.botRef}
                                verRef={this.verRef}
                            />
                        )}
                    />
                    <Route exact path="/admin" component={AdminView} />
                    <Route exact path="/user" component={UserView} />
                </Switch>
            </div>
        );
    }
}
App.defaultProps = {
    auth: PropTypes.shape({
        user_id: 0,
    }),
};

App.propTypes = {
    auth: PropTypes.shape({
        user_id: PropTypes.string,
        auth: PropTypes.oneOf(['auth', 'user', 'admin']).isRequired,
    }),
    setUserByIdR: PropTypes.func.isRequired,
    getAuthLevelR: PropTypes.func.isRequired,
};

const mapStateToProps = (reduxStoreState) => ({
    auth: reduxStoreState.auth,
});

export default connect(mapStateToProps, {
    getAuthLevelR: getAuthLevel,
    setUserByIdR: setUserById,
})(App);
