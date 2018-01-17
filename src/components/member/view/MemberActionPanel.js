import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ActionPanel from '../../general/ActionPanel';
import I18n from '../../../lib/i18n';

export default class MemberActionPanel extends Component {
  static propTypes = {
    addCopies: PropTypes.func.isRequired,
    canDelete: PropTypes.bool.isRequired,
    delete: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    modify: PropTypes.func.isRequired,
    pay: PropTypes.func.isRequired,
    printReceipt: PropTypes.func.isRequired,
    reactivate: PropTypes.func.isRequired,
    renew: PropTypes.func.isRequired,
    transfer: PropTypes.func.isRequired,
    userIsAdmin: PropTypes.bool.isRequired,
  }

  generalActions = [{
    label: I18n('MemberView.actions.modifier'),
    onClick: this.props.modify,
  }];

  activeActions = [
    {
      label: I18n('MemberView.actions.addCopies'),
      onClick: this.props.addCopies,
    },
    {
      label: I18n('MemberView.actions.renew'),
      onClick: this.props.renew,
    },
    {
      label: I18n('MemberView.actions.pay'),
      onClick: this.props.pay,
    },
    {
      label: I18n('MemberView.actions.printReceipt'),
      onClick: this.props.printReceipt,
    },
  ];

  inactiveActions = [
    {
      label: I18n('MemberView.actions.reactivate'),
      onClick: this.props.reactivate,
    },
    {
      label: I18n('MemberView.actions.transfer'),
      onClick: this.props.transfer,
    },
  ];

  adminActions = [
    {
      label: I18n('MemberView.actions.transfer'),
      onClick: this.props.transfer,
    },
    {
      label: I18n('MemberView.actions.delete'),
      style: 'danger',
      onClick: this.props.delete,
      disabled: this.props.canDelete,
    },
  ];

  getActions = () => {
    if (this.props.userIsAdmin && this.props.isActive) {
      return [
        ...this.generalActions,
        ...this.activeActions,
        ...this.adminActions,
      ];
    }

    return [
      ...this.generalActions,
      ...(this.props.isActive ? this.activeActions : this.inactiveActions),
    ];
  }

  render() {
    return (<ActionPanel actions={this.getActions()} />);
  }
}
