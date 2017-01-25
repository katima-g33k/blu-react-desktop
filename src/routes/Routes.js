import React, { Component } from 'react';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';

import AddCopies from '../components/AddCopies';
import Admin from '../components/Admin';
import ItemForm from '../components/ItemForm';
import ItemView from '../components/ItemView';
import MemberForm from '../components/MemberForm';
import MemberView from '../components/MemberView';
import Search from '../components/Search';

const lang = 'fr';
const i18n = {
  fr: {
    AddItem: '/ouvrage/nouveau',
    AddMember: '/membre/nouveau',
    AddCopies: '/membre/exemplaires/:no',
    Admin: '/admin',
    EditItem: '/ouvrage/modifier/:id',
    EditMember: '/membre/modifier/:no',
    ItemView: '/ouvrage/:id',
    MemberView: '/membre/:no',
    Search: '/recherche',
  },
  en: {
    AddItem: '/item/add',
    AddMember: '/member/add',
    AddCopies: '/member/copies/:no',
    Admin: '/admin',
    EditItem: '/item/edit/:id',
    EditMember: '/member/edit/:no',
    ItemView: '/item/:id',
    MemberView: '/member/:no',
    Search: '/search',
  },
};
const routes = {
  addMember: {
    path: i18n[lang].AddMember,
    component: MemberForm,
  },
  memberView: {
    path: i18n[lang].MemberView,
    component: MemberView,
  },
  search: {
    path: i18n[lang].Search,
    component: Search,
  },
};

export default class Routes extends Component {
  constructor() {
    super();
    this.getRoutes = this.getRoutes.bind(this);
  }

  getRoutes() {
    return Object.keys(routes).map(key => (
      <Route
        key={key}
        path={routes[key].path}
        component={routes[key].component}
      />
    ));
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Search}>
          <IndexRedirect to="/search" />
          <Route
            name="Search"
            path="/search"
            component={Search}
          />
        </Route>
        <Route name="Member" path="/member">
          <Route name="MemberView" path=":no" component={MemberView} />
          <Route name="MemberAdd" path="add" component={MemberForm} />
          <Route name="MemberEdit" path="edit/:no" component={MemberForm} />
          <Route name="AddCopies" path="copies/:no" component={AddCopies} />
        </Route>
        <Route name="Item" path="/item">
          <Route name="ItemView" path=":id" component={ItemView} />
          <Route name="ItemAdd" path="add" component={ItemForm} />
          <Route name="ItemEdit" path="edit/:id" component={ItemForm} />
        </Route>
        <Route name="Admin" path="/admin" component={Admin} />
      </Router>
    );
  }
}
