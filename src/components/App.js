import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';

import Header from './Header';
import Sidebar from './Sidebar';

import Admin from './Admin';
import ItemForm from './ItemForm';
import ItemView from './ItemView';
import MemberForm from './MemberForm';
import MemberView from './MemberView';
import Search from './Search';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <header>
          <Header />
        </header>
        <main>
          <Col md={2}>
            <Sidebar />
          </Col>
          <Col sm={12} md={6}>
            <Router history={browserHistory}>
              <Route path="/">
                <IndexRedirect to="/search" />
              </Route>
              <Route path="/search" component={Search} />
              <Route path="/member" component={MemberForm} />
              <Route path="/member/:no" component={MemberView} />
              <Route path="/member/:no/edit" component={MemberForm} />
              <Route path="/item" component={ItemForm} />
              <Route path="/item/:no" component={ItemView} />
              <Route path="/item/:no/edit" component={ItemForm} />
              <Route path="/admin" component={Admin} />
            </Router>
          </Col>
        </main>
      </div>
    );
  }
}
