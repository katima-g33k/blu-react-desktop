import React, { Component } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { Translate } from '../../lib/i18n/i18n';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillMount() {
    this.setState({ page: location.pathname.split('/')[1] });
  }

  handleSelect(event) {
    this.setState({ activeKey: event });
  }

  render() {
    return (
      <Nav bsStyle="pills" stacked activeKey={this.state.page}>
        <NavItem eventKey='search' href="/search">
          <Translate value="Sidebar.search" />
        </NavItem>
        <NavItem eventKey='item' href="/item/add">
          <Translate value="Sidebar.item" />
        </NavItem>
        <NavItem eventKey='member' href="/member/add">
          <Translate value="Sidebar.member" />
        </NavItem>
        <NavItem eventKey='admin' href="/admin">
          <Translate value="Sidebar.admin" />
        </NavItem>
      </Nav>
    );
  }
}
