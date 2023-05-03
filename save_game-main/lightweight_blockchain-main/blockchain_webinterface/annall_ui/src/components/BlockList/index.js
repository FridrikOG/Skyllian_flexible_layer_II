import Reac, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import BlockListItem from "../BlockListItem";
import axios from "axios";

const BlockList = () => {
  const [blocks, setBlocks] = useState([]);
  const [url, setUrl] = useState("api/blocks?key=1");

  const fetchData = async () => {
    try {
      const res = await axios.get(url);
      console.log(res.data);
      setBlocks(res.data);
    } catch (e) {
      console.log("error");
    }
  };

  useEffect(async () => {
    await fetchData();
  }, []);

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
          {blocks
            .sort((a, b) => (a.id < b.id ? 1 : -1))
            .map((b) => (
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
  );
};

export default BlockList;
