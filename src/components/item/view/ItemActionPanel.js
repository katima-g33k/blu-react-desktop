import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ActionPanel from '../../general/ActionPanel';
import I18n from '../../../lib/i18n';
import StatusButton from '../../../containers/StatusButtonContainer';

export default class ItemActionPanel extends Component {
  static propTypes = {
    canDelete: PropTypes.bool.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleReserve: PropTypes.func.isRequired,
    handleUpdateStorage: PropTypes.func.isRequired,
    modify: PropTypes.func.isRequired,
    userIsAdmin: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    isRemoved: false,
    isValid: true,
  }

  getActions = () => [
    ...this.actions,
    ...(this.props.userIsAdmin ? this.adminActions : []),
  ]

  actions = [
    {
      label: I18n('ItemView.actions.modify'),
      onClick: this.props.modify,
    },
    {
      customComponent: (<StatusButton />),
    },
    {
      label: I18n('ItemView.actions.storage'),
      onClick: this.props.handleUpdateStorage,
    },
    {
      label: I18n('ItemView.actions.reserve'),
      onClick: this.props.handleReserve,
    },
  ];

  adminActions = [{
    disabled: this.props.canDelete,
    label: I18n('ItemView.actions.delete'),
    onClick: this.props.handleDelete,
    style: 'danger',
  }];

  render() {
    return (<ActionPanel actions={this.getActions()} />);
  }
}
