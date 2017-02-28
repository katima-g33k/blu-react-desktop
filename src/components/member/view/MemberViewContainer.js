import React, { Component } from 'react';

import ConfirmModal from '../../general/modals/ConfirmModal';
import HTTP from '../../../lib/HTTP';
import Member from '../../../lib/models/Member';
import MemberView from './MemberView';
import settings from '../../../settings.json';
import Spinner from '../../general/Spinner';
import Transaction from '../../../lib/models/Transaction';

export default class MemberViewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      member: null,
      showModal: null,
    };

    this.getActions = this.getActions.bind(this);
    this.getModal = this.getModal.bind(this);
    this.printReceipt = this.printReceipt.bind(this);
  }

  componentWillMount() {
    const url = `${settings.apiUrl}/member/select`;
    const data = {
      no: this.props.params.no,
    };

    HTTP.post(url, data, (err, res) => {
      if (res) {
        this.setState({ member: new Member(res) });
      }
    });
  }

  printReceipt() {
    this.setState({ showModal: null });
  }

  getActions() {
    const generalActions = [{
      label: 'Modifier',
      href: `/member/edit/${this.state.member.no}`,
      style: 'primary',
    }];

    const activeActions = [
      {
        label: 'Ajouter des livres',
        href: `/member/copies/${this.state.member.no}`,
        style: 'primary',
      },
      {
        label: 'Renouveler le compte',
        style: 'primary',
        onClick: (event) => {
          event.preventDefault();
          this.renewAccount();
        },
      },
      {
        label: 'Remettre l\'argent',
        style: 'primary',
        onClick: (event) => {
          event.preventDefault();

          const member = this.state.member;
          const data = { no: member.no };

          HTTP.post(`${settings.apiUrl}/member/pay`, data, (err) => {
            if (err) {
              // TODO: display error message
              return;
            }

            member.account.copies.forEach(copy => {
              if (copy.isSold) {
                copy.pay();
              }
            });

            this.setState({ member, showModal: 'paySuccessfull' });
          });
        },
      },
    ];

    const inactiveActions = [{
      label: 'Réactiver le compte',
      style: 'primary',
      onClick: (event) => {
        event.preventDefault();

        const member = this.state.member;
        const copies = member.account.getAddedCopies();
        copies.push(...member.account.getSoldCopies());
        const data = {
          copies: copies.map(copy => copy.id),
          member: member.no,
          type: Transaction.TYPES.DONATE,
        };

        HTTP.post(`${settings.apiUrl}/transaction/insert`, data, (err) => {
          if (err) {
            // TODO: display error message
            return;
          }

          member.account.donateAll();
          this.setState({ member });
          this.renewAccount();

        });
      },
    }];

    return generalActions.concat(this.state.member.account.isActive ? activeActions : inactiveActions);
  }

  renewAccount() {
    const member = this.state.member;
    const data = { no: member.no };

    HTTP.post(`${settings.apiUrl}/member/renew`, data, (err) => {
      if (err) {
        // TODO: display error message
        return;
      }

      member.account.lastActivity = new Date();
      this.setState({ member });
    });
  }

  getModal() {
    switch (this.state.showModal) {
      case 'paySuccessfull':
        return (
          <ConfirmModal
            cancelText="Non"
            confirmText="Oui"
            message="Le remboursement a été complété, souhaitez-vous imprimer un reçu ?"
            onCancel={() => this.setState({ showModal: null })}
            onConfirm={this.printReceipt}
            title="Remboursement réussi"
          />
        );
      default:
        return null;
    }
  }

  render() {
    return this.state.member ? (
      <MemberView
        actions={this.getActions()}
        member={this.state.member}
        modal={this.getModal()}
      />
    ) : (<Spinner/>);
  }
}

MemberViewContainer.propTypes = {
  params: React.PropTypes.shape(),
};
