import React, { Component } from 'react';
import { Router, Route, browserHistory, IndexRedirect } from 'react-router';

import AddCopies from '../components/copy/AddCopies';
import Admin from '../components/admin/Admin';
import ItemForm from '../components/item/ItemForm';
import ItemView from '../components/item/ItemView';
import MemberFormContainer from '../components/member/form/MemberFormContainer';
import MemberViewContainer from '../components/member/view/MemberViewContainer';
import Search from '../components/search/Search';

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
    component: MemberFormContainer,
  },
  memberView: {
    path: i18n[lang].MemberView,
    component: MemberViewContainer,
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
          <Route name="MemberView" path=":no" component={MemberViewContainer} />
          <Route name="MemberAdd" path="add" component={MemberFormContainer} />
          <Route name="MemberEdit" path="edit/:no" component={MemberFormContainer} />
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
