import React, { Component } from 'react';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';

import AddCopiesContainer from '../components/copy/addCopies/AddCopiesContainer';
import Admin from '../components/admin/Admin';
import EmployeesTable from '../components/admin/EmployeesTable';
import ItemFormContainer from '../components/item/form/ItemFormContainer';
import ItemList from '../components/admin/ItemList';
import ItemViewContainer from '../components/item/view/ItemViewContainer';
import MemberFormContainer from '../components/member/form/MemberFormContainer';
import MemberViewContainer from '../components/member/view/MemberViewContainer';
import SearchContainer from '../components/search/SearchContainer';
import SettingsView from '../components/general/SettingsView';
import Statistics from '../components/admin/Statistics';

export default class Routes extends Component {
  componentDidMount() {
    if (/index\.html/.test(browserHistory.getCurrentLocation().pathname)) {
      browserHistory.push('/search');
    }
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={SearchContainer}>
          <IndexRedirect to="/search" />
          <Route
            name="Search"
            path="/search"
            component={SearchContainer}
          />
        </Route>
        <Route name="Member" path="/member">
          <IndexRedirect to="add" />
          <Route name="MemberView" path="view/:no" component={MemberViewContainer} />
          <Route name="MemberAdd" path="add" component={MemberFormContainer} />
          <Route name="MemberEdit" path="edit/:no" component={MemberFormContainer} />
          <Route name="AddCopies" path="copies/:no" component={AddCopiesContainer} />
        </Route>
        <Route name="Item" path="/item">
          <IndexRedirect to="add" />
          <Route name="ItemView" path="view/:id" component={ItemViewContainer} />
          <Route name="ItemAdd" path="add" component={ItemFormContainer} />
          <Route name="ItemEdit" path="edit/:id" component={ItemFormContainer} />
        </Route>
        <Route name="Admin" path="/admin">
          <Route name="employees" path="employees" component={EmployeesTable} />
          <Route name="reservations" path="reservations" component={Admin} />
          <Route name="statistics" path="statistics" component={Statistics} />
          <Route name="storage" path="storage" component={Admin} />
          <Route name="itemList" path="item/list" component={ItemList} />
        </Route>
        <Route name="settings" path="/settings" component={SettingsView} />
      </Router>
    );
  }
}
