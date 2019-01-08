import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from './Button';
import Icon from './Icon';

export default class ShortcutButton extends Component {
  static propTypes = {
    hint: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    icon: PropTypes.oneOf(Object.values(Icon.ICONS)),
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.shape(),
  };

  static defaultProps = {
    icon: null,
    label: '',
    style: {},
  };

  handleOnClick = () => this.props.onClick(this.props.href);

  render() {
    return (
      <Button
        glyph={this.props.icon}
        hint={this.props.hint}
        label={this.props.label}
        onClick={this.handleOnClick}
        style={this.props.style}
      />
    );
  }
}
