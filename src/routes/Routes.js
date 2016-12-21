import React, { Component } from 'react';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';

import Admin from '../components/Admin';
import ItemForm from '../components/ItemForm';
import ItemView from '../components/ItemView';
import MemberForm from '../components/MemberForm';
import MemberView from '../components/MemberView';
import Search from '../components/Search';

export default class Routes extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/">
          <IndexRedirect to="/search" />
        </Route>
        <Route path="/search" component={Search} />
        <Route path="/member" component={MemberForm} />
        <Route path="/member/:no" component={MemberView} />
        <Route path="/member/:no/edit" component={MemberForm} />
        <Route path="/item" component={ItemForm} />
        <Route path="/item/:id" component={ItemView} />
        <Route path="/item/:id/edit" component={ItemForm} />
        <Route path="/admin" component={Admin} />
      </Router>
    );
  }
}
