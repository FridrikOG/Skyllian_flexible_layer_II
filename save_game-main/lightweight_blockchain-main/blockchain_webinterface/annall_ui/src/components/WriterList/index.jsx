import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import WriterListItem from "../WriterListItem";
import axios from "axios";

const WriterList = () => {
  const [writers, setWriters] = useState([]);
  const [url, setUrl] = useState("api/writers?key=1");

  const fetchData = async () => {
    try {
      const res = await axios.get(url);
      console.log(res.data);
      setWriters(res.data);
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
            <th>IP Address</th>
            <th>Port</th>
          </tr>
        </thead>
        <tbody>
          {writers.map((w) => (
            <WriterListItem key={w.id} id={w.id} ip={w.ip} port={w.port} />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default WriterList;
