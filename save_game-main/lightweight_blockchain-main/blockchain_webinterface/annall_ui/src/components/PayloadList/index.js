import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import PayloadListItem from "../PayloadListItem";
import axios from "axios";

const PayloadList = () => {
  const [payloads, setPaylods] = useState([]);
  const [url, setUrl] = useState("api/payloads?key=1");

  const fetchData = async () => {
    try {
      const res = await axios.get(url);
      console.log(res.data);
      setPaylods(res.data);
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
            <th>Key</th>
            <th>Name</th>
            <th>Type</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {payloads.map((p) => {
            console.log(p);
            return (
              <PayloadListItem
                key={p.id}
                id={p.id}
                name={p.name}
                type={p.type}
                data={p.data}
                payload={JSON.stringify(p)}
              />
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default PayloadList;
