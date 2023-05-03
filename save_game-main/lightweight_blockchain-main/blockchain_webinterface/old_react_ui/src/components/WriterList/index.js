import React from 'react';
import Table from 'react-bootstrap/Table';
import WriterListItem from '../WriterListItem';

class WriterList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            writers: [],
            url: '/api/writers?key=1'
        }
    }

    componentDidMount() {
        const { url } = this.state;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`status ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                this.setState({ writers: json.writers });
            }).catch(e => {
                console.log('error');
            })
    }

    render() {
        const { writers } = this.state;
        return (
            <div>
                <Table striped className="room-table">
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>IP Address</th>
                            <th>Port</th>
                        </tr>
                    </thead>
                    <tbody>
                        {writers.map((w) => (
                            <WriterListItem
                                key={w.key}
                                id={w.key}
                                ip={w.ip}
                                port={w.port}
                            />
                        ))}
                    </tbody>
                </Table>
            </div>
        )
    }
}


export default WriterList;
