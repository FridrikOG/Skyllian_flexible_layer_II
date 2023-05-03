import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import QRCode from 'qrcode.react';
import { getPayloads } from '../../actions/payloadActions';

function boolFormatter(cell, row, rowIndex, formatExtraData) {
    if (formatExtraData[cell]) {
        return (<CheckCircleIcon className="true_icon" />);
    }
    return (<CloseIcon className="false_icon" />);
}

const columns = [{
    dataField: 'file_name',
    text: 'File Name',
    sort: true,
    filter: textFilter(),
}, {
    dataField: 'name',
    text: 'Name',
    sort: true,
    filter: textFilter(),
}, {
    dataField: 'email',
    text: 'Email',
    sort: true,
    filter: textFilter(),
}, {
    dataField: 'ssn',
    text: 'SSN',
    sort: true,
    filter: textFilter(),
}, {
    dataField: 'sent',
    text: 'Sent',
    formatter: boolFormatter,
    formatExtraData: {
        true: true,
        false: false,
    },
}, {
    dataField: 'verified',
    text: 'Verified',
    formatter: boolFormatter,
    formatExtraData: {
        true: true,
        false: false,
    },
}];

class PayloadList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '/api/payloads',
        };
    }

    componentDidMount() {
        const { auth, getPayloadsR } = this.props;
        getPayloadsR(auth);
    }

    onInput(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    onDelete(id) {
        const { url } = this.state;
        const obj = { id };
        fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'DELETE',
            body: JSON.stringify(obj),
        }).catch((e) => {
            console.error(`error${e}`);
        });
    }

    expand() {
        const { payloads } = this.props;
        const nonExpandable = [];
        payloads.forEach((payload) => {
            if (!payload.verified) {
                nonExpandable.push(payload.file_id);
            }
        });
        const expandRow = {
            nonExpandable,
            renderer: (row) => (
                <QRCode value={row.hash} />
            ),
        };
        return expandRow;
    }

    render() {
        const { payloads } = this.props;
        return (
            <div className="payload_list_container">
                <BootstrapTable
                    keyField="file_id"
                    data={payloads}
                    columns={columns}
                    // selectRow={selectRow}
                    bordered={false}
                    hover
                    filter={filterFactory()}
                    expandRow={this.expand()}
                />
            </div>
        );
    }
}

PayloadList.defaultProps = {
    payloads: [],
};

PayloadList.propTypes = {
    auth: PropTypes.string.isRequired,
    payloads: PropTypes.arrayOf(
        PropTypes.shape(),
    ),
    getPayloadsR: PropTypes.func.isRequired,
};

const mapStateToProps = (reduxStoreState) => ({
    auth: reduxStoreState.auth.user_id,
    payloads: reduxStoreState.payloads,
});
export default connect(mapStateToProps, { getPayloadsR: getPayloads })(PayloadList);
