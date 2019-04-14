
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Link, Route, Redirect , Switch} from 'react-router-dom';
import {Button, AppBar, Toolbar, Typography, IconButton, MenuIcon} from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

import "./sass/style.sass";
// import "bootstrap";

import axios from "axios";

import Sidebar from "react-sidebar";
import Nav from "components/nav";

const mql = window.matchMedia(`(min-width: 1200px)`);

class App extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            files: null,
            sidebarOpen: false,
            sidebarDocked: mql.matches,
            title: "Welcome"
        }
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }

    componentWillMount() {
        axios.get("php/get.php")
        .then(({data}) => this.setState({files:data}));
        mql.addListener(this.mediaQueryChanged);
      }

      componentWillUnmount() {

        this.state.mql.removeListener(this.mediaQueryChanged);
      }

      onSetSidebarOpen(open) {
        this.setState({ sidebarOpen: open });
      }

      mediaQueryChanged() {
        this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
      }

      setTitle(title){
          this.setState({
              title: title
          })
      }

    render() {
        const files = this.state.files;
        const title = this.state.title

        return (
            <Router>
                <Sidebar
                    sidebar={<nav>{[<h1 className="text-center" key="title">Sidebar</h1>, files && files.map(file => (
                        <Link key={file} to={"/f"+file} onClick={() => {
                            this.setTitle(file.substr(file.lastIndexOf("/") + 1));
                            this.onSetSidebarOpen(false);
                        }}>
                        {file}
                        </Link>
                    ))]}</nav>}
                    open={this.state.sidebarOpen}
                    docked={this.state.sidebarDocked}
                    onSetOpen={this.onSetSidebarOpen}
                  >
                  <content>
                      <Nav title={title} menuClick={() => this.onSetSidebarOpen(true)}/>
                      <Switch>
                        <Route
                        path="/f/:file*" component={(props) => <File onClick={() => this.onSetSidebarOpen(true)} {...props}/>}
                        />
                      </Switch>
                  </content>
                </Sidebar>
            </Router>
        );
    }
}

const File = ( props ) => (
    <div style={{
        height: "100%",
        width: "100%",
        flex:1,
        display: "flex",
        flexDirection: "column"
    }}>
        <iframe style={{
            height: "100%"
        }} src={"/"+props.match.params.file}>
        </iframe>
    </div>
);

ReactDOM.render(<App/>, document.getElementById("app"));
