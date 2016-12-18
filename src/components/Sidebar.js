import React, { Component } from 'react';
import { Nav, NavItem } from 'react-bootstrap';

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
        <NavItem eventKey='search' title="search" href="/search">Recherche</NavItem>
        <NavItem eventKey='item' href="/item">Ouvrage</NavItem>
        <NavItem eventKey='member' href="/member">Membre</NavItem>
        <NavItem eventKey='admin' href="/admin">Admin</NavItem>
      </Nav>
    );
  }
}
