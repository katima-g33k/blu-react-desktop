import React, { Component } from 'react';
import { browserHistory } from 'react-router';

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
      error: null,
      member: null,
      printReceipt: false,
      showModal: null,
    };

    this.getActions = this.getActions.bind(this);
    this.getMember = this.getMember.bind(this);
    this.getModal = this.getModal.bind(this);
    this.pay = this.pay.bind(this);
    this.renewAccount = this.renewAccount.bind(this);
    this.transferAccount = this.transferAccount.bind(this);
  }

  componentWillMount() {
    this.getMember(this.props.params.no);
  }

  componentWillReceiveProps(props) {
    this.getMember(props.params.no);
  }

  getMember(no) {
    API.member.select(no, (error, res) => {
      if (error) {
        this.setState({ error });
        return;
      }

      this.setState({ member: new Member(res) });
    });
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
          this.setState({ printReceipt: true });
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

    const adminActions = [
      {
        label: 'Transférer à la BLU',
        style: 'primary',
        onClick: event => {
          event.preventDefault();
          this.setState({ showModal: 'transfer' });
        },
      },
      {
        label: 'Supprimer',
        style: 'danger',
        onClick: event => {
          event.preventDefault();
          this.setState({ showModal: 'delete' });
        },
        disabled: this.state.member && this.state.member.account.copies.length,
      },
    ];

    const user = JSON.parse(sessionStorage.getItem('user'));

    if (user.isAdmin && this.state.member.account.isActive) {
      return [...generalActions, ...activeActions, ...adminActions];
    }

    return generalActions.concat(this.state.member.account.isActive ? activeActions : inactiveActions);
  }

  closeModal = () => {
    this.setState({ error: null, showModal: null });
  }

  delete = () => {
    API.member.delete(this.state.member.no, (error) => {
      if (error) {
        this.setState({ error });
        return;
      }

      this.setState({ showModal: 'deleted' });
    });
  }

  pay(callback = () => {}) {
    let amount = 0;
    const { member } = this.state;

    API.member.pay(member.no, (error) => {
      if (error) {
        this.setState({ error });
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

    API.member.renew(member.no, (error) => {
      if (error) {
        this.setState({ error });
        return;
      }

      member.account.lastActivity = new Date();
      this.setState({ member });
    });
  }

  transferAccount() {
    const member = this.state.member;
    const copies = [...member.account.getAddedCopies(), ...member.account.getSoldCopies()];
    const copyIDs = copies.map(copy => copy.id);

    API.transaction.insert(member.no, copyIDs, Transaction.TYPES.DONATE, (error) => {
      if (error) {
        this.setState({ error });
        return;
      }

      member.account.donateAll();
      this.setState({ member, showModal: null });
    });
  }

  getModal() {
    const { error, showModal } = this.state;

    if (error) {
      return (
        <InformationModal
          message={error.message}
          onClick={() => this.setState({ error: null })}
          title={`Erreur ${error.code}`}
        />
      );
    }

    switch (showModal) {
      case 'delete':
        return (
          <ConfirmModal
            confirmationStyle={'danger'}
            confirmText={'Supprimer'}
            message={'Êtes-vous certain de vouloir supprimer ce compte? Cette action est IRRÉVERSIBLE'}
            onCancel={this.closeModal}
            onConfirm={this.delete}
            title={'Suppression d\'un compte'}
          />
        );
      case 'deleted':
        return (
          <InformationModal
            message={'Le compte a été supprimé.'}
            onClick={() => browserHistory.push('/search')}
            title="Compte supprimé"
          />
        );
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
                  this.pay(() => this.setState({ printReceipt: true }));
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
                bsStyle: 'danger',
                label: 'Transférer et Réactiver',
                onClick: () => {
                  this.transferAccount();
                  this.renewAccount();
                },
              },
              {
                bsStyle: 'primary',
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
    const { amount, member, printReceipt } = this.state;

    return member ? (
      <MemberView
        actions={this.getActions()}
        amount={amount}
        member={member}
        modal={this.getModal()}
        printReceipt={printReceipt}
        onAfterPrint={() => this.setState({ printReceipt: false })}
      />
    ) : (<Spinner/>);
  }
}

MemberViewContainer.propTypes = {
  params: React.PropTypes.shape(),
};
