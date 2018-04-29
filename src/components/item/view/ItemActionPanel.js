import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ActionPanel from '../../general/ActionPanel';
import I18n from '../../../lib/i18n';
import StatusButton from '../../general/StatusButton';

export default class ItemActionPanel extends Component {
  static propTypes = {
    canDelete: PropTypes.bool.isRequired,
    decreaseStatus: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleReserve: PropTypes.func.isRequired,
    handleUpdateStorage: PropTypes.func.isRequired,
    increaseStatus: PropTypes.func.isRequired,
    isRemoved: PropTypes.bool,
    isValid: PropTypes.bool,
    modify: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired,
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
      customComponent: (
        <StatusButton
          disableLeft={this.props.isRemoved}
          disableRight={this.props.isValid || (!this.props.userIsAdmin && this.props.isRemoved)}
          onClickLeft={this.props.decreaseStatus}
          onClickRight={this.props.increaseStatus}
          status={this.props.status}
        />
      ),
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
