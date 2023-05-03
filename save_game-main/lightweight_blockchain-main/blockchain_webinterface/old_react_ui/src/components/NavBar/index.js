import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { withRouter } from "react-router-dom";
import "../../styles/index.css";

class NavBar extends React.Component {
  render() {
    console.log("Navbar firing off ");
    const { history } = this.props;
    return (
      <div>
        <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
          <Navbar.Brand
            style={{ cursor: "pointer" }}
            onClick={() => history.push(`/`)}
          >
            Lightweight Blockchain
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto ">
              <Nav.Link onClick={() => history.push(`/payloadlist`)}>
                Payload List
              </Nav.Link>
              <Nav.Link onClick={() => history.push(`/writerlist`)}>
                Writer List
              </Nav.Link>
              <Nav.Link onClick={() => history.push(`/blocklist`)}>
                Block List
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default withRouter(NavBar);
