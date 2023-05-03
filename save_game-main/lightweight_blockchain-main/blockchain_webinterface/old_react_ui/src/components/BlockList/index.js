import React from 'react';
import Table from 'react-bootstrap/Table';
import BlockListItem from '../BlockListItem';

class BlockList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            blocks: [],
            url: '/api/blocks?key=1'
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
                this.setState({ blocks: json.blocks });
            }).catch(e => {
                console.log('error');
            })
    }

    render() {
        const { blocks } = this.state;
        return (
            <div>
                <Table striped className="room-table">
                    <thead>
                        <tr>
                            <th>Previous Hash</th>
                            <th>Writer Signature</th>
                            <th>Writer ID</th>
                            <th>Coordinator ID</th>
                            <th>Winner Number</th>
                            <th>Payload</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blocks.map((b) => (
                            <BlockListItem
                                key={b.hash}
                                previous_hash={b.previous_hash}
                                writer_signature={b.writer_signature}
                                writer_id={b.writer_ID}
                                coordinator_id={b.coordinator_ID}
                                winner_number={b.winner_number}
                                payload={b.payload}
                            />
                        ))}
                    </tbody>
                </Table>
            </div>
        )
    }
}


export default BlockList;
