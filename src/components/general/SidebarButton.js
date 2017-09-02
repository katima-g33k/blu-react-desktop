import React, { Component, PropTypes } from 'react';
import { Glyphicon } from 'react-bootstrap';

export default class SidebarButton extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  };

  render() {
    const { icon, onClick, title } = this.props;

    return (
      <p className="menu-button" onClick={onClick}>
        <Glyphicon glyph={icon} /> {title}
      </p>
    );
  }
}
