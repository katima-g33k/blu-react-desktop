import React, { Component } from 'react';

import API from '../../../lib/API';
import { ConfirmModal, InformationModal } from '../../general/modals';
import Member from '../../../lib/models/Member';
import MemberView from './MemberView';
import Spinner from '../../general/Spinner';
import Transaction from '../../../lib/models/Transaction';

export default class MemberViewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      member: null,
      showModal: null,
    };

    this.getActions = this.getActions.bind(this);
    this.getModal = this.getModal.bind(this);
    this.pay = this.pay.bind(this);
    this.printReceipt = this.printReceipt.bind(this);
    this.renewAccount = this.renewAccount.bind(this);
    this.transferAccount = this.transferAccount.bind(this);
  }

  componentWillMount() {
    API.member.select(this.props.params.no, (err, res) => {
      if (err) {
        // TODO: Display message
        return;
      }

      this.setState({ member: new Member(res) });
    });
  }

  printReceipt() {
    const { no } = this.props.params;
    const { amount } = this.state;

    window.open(`/member/receipt/${no}/${amount}`, '_blank').focus();
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
        onClick: event => {
          event.preventDefault();
          this.renewAccount();
        },
      },
      {
        label: 'Remettre l\'argent',
        style: 'primary',
        onClick: event => {
          event.preventDefault();
          this.setState({ showModal: 'pay' });
        },
      },
      {
        label: 'Imprimer l\'état du compte',
        style: 'primary',
        onClick: event => {
          event.preventDefault();
          this.printReceipt();
        },
      },
    ];

    const inactiveActions = [
      {
        label: 'Réactiver le compte',
        style: 'primary',
        onClick: event => {
          event.preventDefault();
          this.setState({ showModal: 'reactivate' });
        },
      },
      {
        label: 'Transférer à la BLU',
        style: 'primary',
        onClick: event => {
          event.preventDefault();
          this.setState({ showModal: 'transfer' });
        },
      },
    ];

    return generalActions.concat(this.state.member.account.isActive ? activeActions : inactiveActions);
  }

  pay(callback = () => {}) {
    let amount = 0;
    const { member } = this.state;

    API.member.pay(member.no, (err) => {
      if (err) {
        // TODO: display error message
        return;
      }

      this.renewAccount();
      member.account.copies.forEach((copy) => {
        if (copy.isSold) {
          amount += +copy.price;
          copy.pay();
        }
      });

      this.setState({ amount, member, showModal: 'paySuccessfull' });
      callback();
    });
  }

  renewAccount() {
    const { member } = this.state;

    API.member.renew(member.no, (err) => {
      if (err) {
        // TODO: display error message
        return;
      }

      member.account.lastActivity = new Date();
      this.setState({ member });
    });
  }

  transferAccount() {
    const member = this.state.member;
    const copies = member.account.getAddedCopies();
    copies.push(...member.account.getSoldCopies());

    const copyIDs = copies.map(copy => copy.id);

    API.transaction.insert(member.no, copyIDs, Transaction.TYPES.DONATE, (err) => {
      if (err) {
        // TODO: display error message
        return;
      }

      member.account.donateAll();
      this.setState({ member });
    });
  }

  getModal() {
    switch (this.state.showModal) {
      case 'pay':
        return (
          <ConfirmModal
            customActions={[
              {
                label: 'Annuler',
                onClick: () => this.setState({ showModal: null }),
              },
              {
                label: 'Imprimer un reçu',
                onClick: () => {
                  this.pay(this.printReceipt);
                },
              },
              {
                label: 'Remettre l\'argent',
                onClick: this.pay,
              },
            ]}
            message="Souhaitez-vous imprimer un reçu lors de la remise d'argent ?"
            title="Remise d'argent"
          />
        );
      case 'paySuccessfull':
        const { amount } = this.state;
        return (
          <InformationModal
            message={`Le montant de ${amount} $  a été remis avec succès`}
            onClick={() => this.setState({ amount: 0, showModal: null })}
            title="Argent remis"
          />
        );
      case 'reactivate':
        return (
          <ConfirmModal
            customActions={[
              {
                label: 'Annuler',
                onClick: () => this.setState({ showModal: null }),
              },
              {
                label: 'Transférer et Réactiver',
                onClick: () => {
                  this.transferAccount();
                  this.renewAccount();
                },
              },
              {
                label: 'Réactiver',
                onClick: this.renewAccount,
              },
            ]}
            message="Attention, vous êtes sur le point de réactiver le compte. Souhaitez-vous transférer son contenu à la BLU avant la réactivation ?" // eslint-disable-line
            title="Réactivation du compte"
          />
        );
      case 'transfer':
        return (
          <ConfirmModal
            cancelText="Non"
            confirmText="Oui"
            message="Souhaitez-vous transférer le contenu du compte à la BLU ?"
            onCancel={() => this.setState({ showModal: null })}
            onConfirm={this.transferAccount}
            title="Transfert à la BLU"
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
