import React, { Component } from 'react';
import PropTypes from 'prop-types';

import i18n from '../../lib/i18n';

import Button from './Button';
import Icon from './Icon';

export default class LogoutButton extends Component {
  static propTypes = {
    onLogout: PropTypes.func.isRequired,
    style: PropTypes.shape(),
  };

  static defaultProps = {
    style: {},
  };

  render() {
    return (
      <Button
        bsStyle="primary"
        glyph={Icon.ICONS.LOGOUT}
        hint={i18n('actions.logout')}
        onClick={this.props.onLogout}
        style={this.props.style}
      />
    );
  }
}
