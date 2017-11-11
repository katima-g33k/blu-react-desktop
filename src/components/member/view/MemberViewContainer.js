import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { ConfirmModal, InformationModal } from '../../general/modals';
import Member from '../../../lib/models/Member';
import MemberView from './MemberView';
import Spinner from '../../general/Spinner';

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

  async componentWillMount() {
    await this.getMember(this.props.params.no);
  }

  async componentWillReceiveProps(props) {
    await this.getMember(props.params.no);
  }

  async getMember(no) {
    try {
      const res = await this.props.api.member.get(no);
      this.setState({ member: new Member(res) });
    } catch (error) {
      this.setState({ error });
    }
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
        onClick: async (event) => {
          event.preventDefault();
          await this.renewAccount();
        },
      },
      {
        label: 'Remettre l\'argent',
        style: 'primary',
        onClick: (event) => {
          event.preventDefault();
          this.setState({ showModal: 'pay' });
        },
      },
      {
        label: 'Imprimer l\'état du compte',
        style: 'primary',
        onClick: (event) => {
          event.preventDefault();
          this.setState({ printReceipt: true });
        },
      },
    ];

    const inactiveActions = [
      {
        label: 'Réactiver le compte',
        style: 'primary',
        onClick: (event) => {
          event.preventDefault();
          this.setState({ showModal: 'reactivate' });
        },
      },
      {
        label: 'Transférer à la BLU',
        style: 'primary',
        onClick: (event) => {
          event.preventDefault();
          this.setState({ showModal: 'transfer' });
        },
      },
    ];

    const adminActions = [
      {
        label: 'Transférer à la BLU',
        style: 'primary',
        onClick: (event) => {
          event.preventDefault();
          this.setState({ showModal: 'transfer' });
        },
      },
      {
        label: 'Supprimer',
        style: 'danger',
        onClick: (event) => {
          event.preventDefault();
          this.setState({ showModal: 'remove' });
        },
        disabled: this.state.member && this.state.member.account.copies.length,
      },
    ];

    const user = JSON.parse(sessionStorage.getItem('user'));

    if (user.isAdmin && this.state.member.account.isActive) {
      return [...generalActions, ...activeActions, ...adminActions];
    }

    return generalActions.concat(
      this.state.member.account.isActive ? activeActions : inactiveActions,
    );
  }

  closeModal = () => {
    this.setState({ error: null, showModal: null });
  }

  remove = async () => {
    try {
      await this.props.api.member.delete(this.state.member.no);
      this.setState({ showModal: 'deleted' });
    } catch (error) {
      this.setState({ error });
    }
  }

  async pay(callback = () => {}) {
    let amount = 0;
    const { member } = this.state;

    try {
      await this.props.api.member.pay(member.no);

      await this.renewAccount();
      member.account.copies.forEach((copy) => {
        if (copy.isSold) {
          amount += +copy.price;
          copy.pay();
        }
      });

      this.setState({ amount, member, showModal: 'paySuccessfull' });
      callback();
    } catch (error) {
      this.setState({ error });
    }
  }

  async renewAccount() {
    const { member } = this.state;

    try {
      await this.props.api.member.renew(member.no);
      member.account.lastActivity = new Date();
      this.setState({ member, showModal: null });
    } catch (error) {
      this.setState({ error, showModal: null });
    }
  }

  transferAccount() {
    const { member } = this.state;

    try {
      this.props.api.member.transfer(member.no);
      member.account.donateAll();
      this.setState({ member, showModal: null });
    } catch (error) {
      this.setState({ error });
    }
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
      case 'remove':
        return (
          <ConfirmModal
            confirmationStyle={'danger'}
            confirmText={'Supprimer'}
            message={'Êtes-vous certain de vouloir supprimer ce compte? Cette action est IRRÉVERSIBLE'}
            onCancel={this.closeModal}
            onConfirm={this.remove}
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
                onClick: async () => {
                  await this.pay(() => this.setState({ printReceipt: true }));
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
        return (
          <InformationModal
            message={`Le montant de ${this.state.amount} $  a été remis avec succès`}
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
                onClick: async () => {
                  this.transferAccount();
                  await this.renewAccount();
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
        {...this.props}
        actions={this.getActions()}
        amount={amount}
        member={member}
        modal={this.getModal()}
        printReceipt={printReceipt}
        onAfterPrint={() => this.setState({ printReceipt: false })}
      />
    ) : (<Spinner />);
  }
}

MemberViewContainer.propTypes = {
  api: React.PropTypes.shape(),
  params: React.PropTypes.shape(),
};
