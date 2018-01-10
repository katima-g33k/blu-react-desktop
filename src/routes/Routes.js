import React, { Component, PropTypes } from 'react';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';

import AddCopiesContainer from '../components/copy/addCopies/AddCopiesContainer';
import DuplicateMembers from '../components/admin/DuplicateMembers';
import EmployeesTable from '../components/admin/EmployeesTable';
import ItemFormContainer from '../components/item/form/ItemFormContainer';
import ItemList from '../components/admin/ItemList';
import ItemViewContainer from '../components/item/view/ItemViewContainer';
import MemberFormContainer from '../components/member/form/MemberFormContainer';
import MemberViewContainer from '../components/member/view/MemberViewContainer';
import ReservationTableView from '../components/admin/ReservationTableView';
import SearchContainer from '../containers/SearchContainer';
import SettingsView from '../components/general/SettingsView';
import Statistics from '../components/admin/Statistics';
import StorageTableView from '../components/admin/StorageTableView';

export default class Routes extends Component {
  static propTypes = {
    api: PropTypes.shape(),
  }

  componentDidMount() {
    if (/index\.html/.test(browserHistory.getCurrentLocation().pathname)) {
      browserHistory.push('/search');
    }
  }

  render() {
    const { api } = this.props;

    return (
      <Router history={browserHistory}>
        <Route
          component={props => (<SearchContainer {...props} api={api} />)}
          path="/"
        >
          <IndexRedirect to="/search" />
          <Route
            component={props => (<SearchContainer {...props} api={api} />)}
            name="Search"
            path="/search"
          />
        </Route>
        <Route name="Member" path="/member">
          <IndexRedirect to="add" />
          <Route
            component={props => (<MemberViewContainer {...props} api={api} />)}
            name="MemberView"
            path="view/:no"
          />
          <Route
            component={props => (<MemberFormContainer {...props} api={api} />)}
            name="MemberAdd"
            path="add"
          />
          <Route
            component={props => (<MemberFormContainer {...props} api={api} />)}
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
            component={props => (<ItemViewContainer {...props} api={api} />)}
            name="ItemView"
            path="view/:id"
          />
          <Route
            component={props => (<ItemFormContainer {...props} api={api} />)}
            name="ItemAdd"
            path="add"
          />
          <Route
            component={props => (<ItemFormContainer {...props} api={api} />)}
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
          component={props => (<SettingsView {...props} api={api} />)}
          name="settings"
          path="/settings"
        />
      </Router>
    );
  }
}
