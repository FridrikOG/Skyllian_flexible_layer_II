import React from "react";
import Table from "react-bootstrap/Table";
import PayloadListItem from "../PayloadListItem";

class PayloadList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payloads: [],
      url: "http://localhost:3000/api/payloads?key=1",
    };
  }

  componentDidMount() {
    const { url } = this.state;
    fetch(url)
      .then((response) => {
        console.log("Got aresponse ");
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        this.setState({ payloads: json.payloads });
      })
      .catch((e) => {
        console.log("error");
      });
  }

  render() {
    const { payloads } = this.state;
    console.log("Doing stuff ");
    return (
      <div>
        <Table striped className="room-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Payload</th>
            </tr>
          </thead>
          <tbody>
            {payloads.map((p) => (
              <PayloadListItem key={p.key} id={p.key} payload={p.payload} />
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default PayloadList;
