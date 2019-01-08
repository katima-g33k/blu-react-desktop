import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Glyphicon } from 'react-bootstrap';

const icons = {
  ADD: 'plus',
  DELETE: 'trash',
  EDIT: 'pencil',
  ITEM: 'book',
  LOGOUT: 'log-out',
  MEMBER: 'user',
  SEARCH: 'search',
  SETTINGS: 'wrench',
};

export default class Icon extends Component {
  static propTypes = {
    icon: PropTypes.oneOf(Object.values(icons)).isRequired,
  };

  static ICONS = icons;

  render() {
    return (
      <Glyphicon glyph={this.props.icon} />
    );
  }
}
