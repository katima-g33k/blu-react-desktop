import React, { Component } from 'react';
import PropTypes from 'prop-types';

import I18n from '../../lib/i18n';
import SidebarButton from './SidebarButton';

export default class LogoutButton extends Component {
  static propTypes = {
    onLogout: PropTypes.func.isRequired,
  }

  render() {
    return (
      <SidebarButton
        icon="log-out"
        onClick={this.props.onLogout}
        title={I18n('actions.logout')}
      />
    );
  }
}
