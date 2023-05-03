import React from 'react';
import PropTypes from 'prop-types';
import Hat from '../../assests/icon-hat.svg';
import Portrait from '../../assests/Portrait_placeholder.png';
// import Verify from '../../components/Verify'

class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { midRef, botRef } = this.props;
        return (
            <div>
                <div className="top_view">
                    <div className="welcome_info">
                        <h1>
                            Your diplomas your way,
                            <br />
                            {' '}
                          securely and consistantly
                        </h1>
                        <div>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Quisque commodo eleifend dolor, et pulvinar quam facilisis vel.
                            Phasellus lobortis, arcu quis condimentum efficitur, nunc
                            justo ultrices eros, eu tincidunt odio enim in neque.
                            Quisque at eros at arcu
                        </div>
                    </div>
                    <img src={Hat} className="welcome_image" alt="hat" />
                </div>

                <div className="mid_view" ref={midRef}>
                    <div className="bottom_left_info">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Quisque commodo eleifend dolor, et pulvinar quam facilisis vel.
                        Phasellus lobortis, arcu quis condimentum efficitur, nunc
                        justo ultrices eros, eu tincidunt odio enim in neque.
                        Quisque at eros at arcu
                    </div>
                    <div className="top_right_info">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Quisque commodo eleifend dolor, et pulvinar quam facilisis vel.
                        Phasellus lobortis, arcu quis condimentum efficitur, nunc
                        justo ultrices eros, eu tincidunt odio enim in neque.
                        Quisque at eros at arcu
                    </div>
                </div>
                <div className="bottom_view" ref={botRef}>
                    <div className="founder">
                        <h1>Founder</h1>
                        <div className="bottom_sub">
                            <div className="image_container">
                                <img src={Portrait} alt="portrait" />
                            </div>
                            <div className="founder_text">
                                <h2>Gísli Hjálmtýsson</h2>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Quisque commodo eleifend dolor, et pulvinar quam facilisis vel.
                                    Phasellus lobortis, arcu quis condimentum efficitur, nunc
                                    justo ultrices eros, eu tincidunt odio enim in neque.
                                    Quisque at eros at arcu
                                </p>

                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Quisque commodo eleifend dolor, et pulvinar quam facilisis vel.
                                    Phasellus lobortis, arcu quis condimentum efficitur, nunc
                                    justo ultrices eros, eu tincidunt odio enim in neque.
                                    Quisque at eros at arcu
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="team">
                        <h1>Dream team</h1>
                        <div>
                            <div className="bottom_sub">
                                <img src={Portrait} alt="portrait" />
                                <div className="team_text">
                                    <h3>Rúnar Bjarkason</h3>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Quisque commodo eleifend dolor,
                                        et pulvinar quam facilisis vel.
                                        Phasellus lobortis, arcu quis condimentum efficitur, nunc
                                        justo ultrices eros, eu tincidunt odio enim in neque.
                                        Quisque at eros at arcu
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="bottom_sub">
                                <img src={Portrait} alt="portrait" />
                                <div className="team_text">
                                    <h3>Steinar Sigurðsson</h3>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Quisque commodo eleifend dolor,
                                        et pulvinar quam facilisis vel.
                                        Phasellus lobortis, arcu quis condimentum efficitur, nunc
                                        justo ultrices eros, eu tincidunt odio enim in neque.
                                        Quisque at eros at arcu
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="bottom_sub">
                                <img src={Portrait} alt="portrait" />
                                <div className="team_text">
                                    <h3>Thorsten Alexander Roloff</h3>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Quisque commodo eleifend dolor,
                                        et pulvinar quam facilisis vel.
                                        Phasellus lobortis, arcu quis condimentum efficitur, nunc
                                        justo ultrices eros, eu tincidunt odio enim in neque.
                                        Quisque at eros at arcu
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

HomeView.defaultProps = {
    midRef: {},
    botRef: {},
};

HomeView.propTypes = {
    midRef: PropTypes.shape(),
    botRef: PropTypes.shape(),
};

export default HomeView;
