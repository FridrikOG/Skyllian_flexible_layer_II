import React from "react";
import { Switch, Route } from "react-router-dom";
import PayloadList from "./components/PayloadList";
import WriterList from "./components/WriterList";
import BlockList from "./components/BlockList";
import NavBar from "./components/NavBar";
import CreateNFT from "./components/NftCreator";
import { withRouter } from "react-router-dom";
import "./styles/index.css";

class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <div className="central_container">
          <Switch>
            <Route exact path="/payloadlist" component={PayloadList} />
            <Route exact path="/writerlist" component={WriterList} />
            <Route exact path="/blocklist" component={BlockList} />
            <Route exact path="/create-nft" component={CreateNFT} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
