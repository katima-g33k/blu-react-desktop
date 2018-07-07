import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';

import AddCopiesContainer from '../components/copy/addCopies/AddCopiesContainer';
import DuplicateMembers from '../components/admin/DuplicateMembers';
import EmployeesTable from '../components/admin/EmployeesTable';
import ItemForm from '../containers/ItemFormContainer';
import ItemList from '../components/admin/ItemList';
import ItemView from '../containers/ItemViewContainer';
import MemberForm from '../containers/MemberFormContainer';
import MemberView from '../containers/MemberViewContainer';
import ReservationTableView from '../components/admin/ReservationTableView';
import Search from '../containers/SearchContainer';
import SettingsView from '../containers/SettingsViewContainer';
import Statistics from '../components/admin/Statistics';
import StorageTableView from '../components/admin/StorageTableView';

export default class Routes extends Component {
  static propTypes = {
    api: PropTypes.shape().isRequired,
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
    const { api } = this.props;

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
            component={props => (<AddCopiesContainer {...props} api={api} />)}
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
            component={props => (<EmployeesTable {...props} api={api} />)}
            name="employees"
            path="employees"
          />
          <Route
            component={props => (<ReservationTableView {...props} api={api} />)}
            name="reservations"
            path="reservations"
          />
          <Route
            component={props => (<Statistics {...props} api={api} />)}
            name="statistics"
            path="statistics"
          />
          <Route
            component={props => (<StorageTableView {...props} api={api} />)}
            name="storage"
            path="storage"
          />
          <Route
            component={props => (<ItemList {...props} api={api} />)}
            name="itemList"
            path="item/list"
          />
          <Route
            component={props => (<DuplicateMembers {...props} api={api} />)}
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
