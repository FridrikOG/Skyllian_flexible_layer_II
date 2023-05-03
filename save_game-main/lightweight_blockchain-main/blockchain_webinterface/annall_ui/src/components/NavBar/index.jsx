import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "../../styles/index.css";

const CustomNavbar = () => {
  return (
<<<<<<< HEAD
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
      <Navbar.Brand style={{ cursor: "pointer" }} className="px-5">
        Lightweight Blockchain
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          <button
            className={selected === 1 ? `${selectedClass} px-5` : notSelected}
            value="Payload List"
            onClick={() => onButtonPress("/payloadlist", 1)}
          >
            Payload List
          </button>

          <button
            className={selected === 2 ? `${selectedClass} px-5` : notSelected}
            value="Writer List"
            onClick={() => onButtonPress("/writerlist", 2)}
          >
            Writer List
          </button>

          <button
            className={selected === 3 ? `${selectedClass} px-5` : notSelected}
            value="Block List"
            onClick={() => onButtonPress("/blocklist", 3)}
          >
            Block List
          </button>

          <button
            className={selected === 4 ? `${selectedClass} px-5` : notSelected}
            value="Node System"
            onClick={() => onButtonPress("/nftsystem", 4)}
          >
            NFT system
          </button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
=======
    <div>
      <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
        <Navbar.Brand style={{ cursor: "pointer" }}>
          Lightweight Blockchain
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto ">
            <a href="/payloadlist"> Payload List</a>
            <a href="/writerlist"> Writer List</a>
            <a href="/blocklist"> Block List</a>
            <a href="/nodeSystem"> Node system</a>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
>>>>>>> parent of 311f0bf66 (commit)
  );
};

export default CustomNavbar;
