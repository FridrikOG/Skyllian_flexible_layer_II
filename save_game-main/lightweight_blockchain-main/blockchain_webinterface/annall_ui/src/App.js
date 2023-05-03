import React from "react";
import { Routes, Route } from "react-router-dom";

import CustomNavbar from "./components/NavBar";

import BlockList from "./components/BlockList";
import PayloadList from "./components/PayloadList";
import WriterList from "./components/WriterList";
import NFTsystem from "./components/NFTsystem";

const App = () => {
  return (
    <div className="container">
      <div className="content">
        <CustomNavbar />
        <div className="wrapper">
          <Routes>
            <Route path="/writerlist" element={<WriterList />} />
            <Route path="/payloadlist" element={<PayloadList />} />
            <Route path="/blocklist" element={<BlockList />} />
<<<<<<< HEAD
            <Route path="/nftsystem" element={<NFTsystem />} />
=======
            <Route path="/nodeSystem" element={<NodeSystem />} />
>>>>>>> parent of 311f0bf66 (commit)
          </Routes>
        </div>
      </div>
    </div>
  );
};
export default App;
