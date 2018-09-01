import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  browserHistory,
  IndexRedirect,
  Route,
  Router,
} from 'react-router';

import AddCopiesContainer from '../containers/AddCopiesContainer';
import DuplicateMembers from '../containers/DuplicateMembersContainer';
import EmployeesTable from '../containers/EmployeeTableContainer';
import ItemForm from '../containers/ItemFormContainer';
import ItemList from '../containers/ItemListContainer';
import ItemView from '../containers/ItemViewContainer';
import MemberForm from '../containers/MemberFormContainer';
import MemberView from '../containers/MemberViewContainer';
import ReservationManagement from '../containers/ReservationManagementContainer';
import Search from '../containers/SearchContainer';
import SettingsView from '../containers/SettingsViewContainer';
import Statistics from '../containers/StatisticsContainer';
import StorageManagement from '../containers/StorageManagementContainer';

export default class Routes extends Component {
  static propTypes = {
    currentPath: PropTypes.string.isRequired,
    onRouteChange: PropTypes.func.isRequired,
  }

  componentDidMount() {
    if (/index\.html/.test(browserHistory.getCurrentLocation().pathname)) {
      browserHistory.push('/search');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentPath !== nextProps.currentPath) {
      this.props.onRouteChange(nextProps.currentPath);
    }
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route
          component={Search}
          path="/"
        >
          <IndexRedirect to="/search" />
          <Route
            component={Search}
            name="Search"
            path="/search"
          />
        </Route>
        <Route name="Member" path="/member">
          <IndexRedirect to="add" />
          <Route
            component={MemberView}
            name="MemberView"
            path="view/:no"
          />
          <Route
            component={MemberForm}
            name="MemberAdd"
            path="add"
          />
          <Route
            component={MemberForm}
            name="MemberEdit"
            path="edit/:no"
          />
          <Route
            component={AddCopiesContainer}
            name="AddCopies"
            path="copies/:no"
          />
        </Route>
        <Route name="Item" path="/item">
          <IndexRedirect to="add" />
          <Route
            component={ItemView}
            name="ItemView"
            path="view/:id"
          />
          <Route
            component={ItemForm}
            name="ItemAdd"
            path="add"
          />
          <Route
            component={ItemForm}
            name="ItemEdit"
            path="edit/:id"
          />
        </Route>
        <Route name="Admin" path="/admin">
          <Route
            component={EmployeesTable}
            name="employees"
            path="employees"
          />
          <Route
            component={ReservationManagement}
            name="reservations"
            path="reservations"
          />
          <Route
            component={Statistics}
            name="statistics"
            path="statistics"
          />
          <Route
            component={StorageManagement}
            name="storage"
            path="storage"
          />
          <Route
            component={ItemList}
            name="itemList"
            path="item/list"
          />
          <Route
            component={DuplicateMembers}
            name="duplicates"
            path="duplicates"
          />
        </Route>
        <Route
          component={SettingsView}
          name="settings"
          path="/settings"
        />
      </Router>
    );
  }
}
