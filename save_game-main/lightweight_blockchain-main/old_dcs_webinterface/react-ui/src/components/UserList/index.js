import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { getAllUsers, deleteUser } from '../../actions/userActions';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        const { getAllUsersR, deleteUserR } = this.props;
        // console.log('payloads')
        getAllUsersR();
        this.state = {
            columns: [{
                dataField: 'username',
                text: 'Username',
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
                dataField: 'isadmin',
                text: 'Is admin',
                sort: true,
                filter: textFilter(),
            }, {
                isDummyField: true,
                dataField: 'delete',
                text: 'Delete',
                formatter: this.deleteFormatter,
                formatExtraData: {
                    onDelete: deleteUserR,
                },
            }],
        };
    }

    async componentDidMount() {
        const { getAllUsersR } = this.props;
        await getAllUsersR();
    }

    onInput(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    deleteFormatter(row, formatExtraData) {
        return (
            <Button
                onClick={() => formatExtraData.onDelete(row.user_id)}
                variant="delete"
                className="bg-danger"
            >
                Delete
            </Button>
        );
    }

    render() {
        const { columns } = this.state;
        const { users } = this.props;
        return (
            <div className="payload_list_container">
                <BootstrapTable keyField="user_id" data={users} columns={columns} bordered={false} hover filter={filterFactory()} />
            </div>
        );
    }
}

UserList.defaultProps = {
    users: [],
};

UserList.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.shape(),
    ),
    getAllUsersR: PropTypes.func.isRequired,
    deleteUserR: PropTypes.func.isRequired,
};

const mapStateToProps = (reduxStoreState) => ({
    users: reduxStoreState.user.users,
});
export default connect(mapStateToProps, {
    getAllUsersR: getAllUsers,
    deleteUserR: deleteUser,
})(UserList);
