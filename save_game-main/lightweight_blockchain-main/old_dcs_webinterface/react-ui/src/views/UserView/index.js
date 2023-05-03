import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { StylesProvider } from '@material-ui/core/styles';
import Upload from '../../components/Upload';
import PayloadList from '../../components/PayloadList';

class UserView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { auth } = this.props;
        if (auth === 'user') {
            return (
                <StylesProvider injectFirst>
                    <div className="my_container user_container">
                        <Accordion className="my_accordian">
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Files</Typography>
                                <Typography className="expand_title">Upload new file</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Upload />
                            </AccordionDetails>
                        </Accordion>
                        <PayloadList />
                    </div>
                </StylesProvider>
            );
        }
        return (<></>);
    }
}

UserView.propTypes = {
    auth: PropTypes.oneOf(['auth', 'user', 'admin']).isRequired,
};

const mapStateToProps = (reduxStoreState) => ({
    auth: reduxStoreState.auth.auth,
});

export default connect(mapStateToProps)(UserView);
