import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ActionPanel from '../../general/ActionPanel';
import i18n from '../../../lib/i18n';

export default class MemberActionPanel extends Component {
  // eslint-disable-next-line react/sort-comp
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
  };

  generalActions = [{
    label: i18n('MemberView.actions.modify'),
    onClick: this.props.modify,
  }];

  activeActions = [
    {
      label: i18n('MemberView.actions.addCopies'),
      onClick: this.props.addCopies,
    },
    {
      label: i18n('MemberView.actions.renew'),
      onClick: this.props.renew,
    },
    {
      label: i18n('MemberView.actions.pay'),
      onClick: this.props.pay,
    },
    {
      label: i18n('MemberView.actions.printReceipt'),
      onClick: this.props.printReceipt,
    },
  ];

  inactiveActions = [
    {
      label: i18n('MemberView.actions.reactivate'),
      onClick: this.props.reactivate,
    },
    {
      label: i18n('MemberView.actions.transfer'),
      onClick: this.props.transfer,
    },
  ];

  adminActions = [
    {
      label: i18n('MemberView.actions.transfer'),
      onClick: this.props.transfer,
    },
    {
      label: i18n('MemberView.actions.delete'),
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
  };

  render() {
    return (<ActionPanel actions={this.getActions()} />);
  }
}
