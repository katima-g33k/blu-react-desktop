import React, { Component } from 'react';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

import CopyTable from './CopyTable';
import CopyColumns from './columns';
import { ConfirmModal, InputModal, SearchModal } from '../../general/modals';
import HTTP from '../../../lib/HTTP';
import settings from '../../../settings.json';
import Transaction from '../../../lib/models/Transaction';

export default class CopyTableContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copies: props.copies,
      showModal: null,
    };

    this.cancelReservation = this.cancelReservation.bind(this);
    this.delete = this.delete.bind(this);
    this.refund = this.refund.bind(this);
    this.renewParentAccount = this.renewParentAccount.bind(this);
    this.reserve = this.reserve.bind(this);
    this.sell = this.sell.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
    this.getModal = this.getModal.bind(this);

    this.columns = CopyColumns.filter(column => this.props.member ? !column.itemOnly : !column.memberOnly);
  }

  componentWillMount() {
    this.columns.find(c => c.dataField === 'priceString').dataFormat = (price, copy) => (
      <Button
        bsStyle="link"
        onClick={() => this.setState({ activeCopy: copy, showModal: 'update' })}
        disabled={copy.isPaid || copy.isSold || copy.isReserved}
      >
        {price}
      </Button>
    );

    this.columns.find(c => c.dataField === 'actions').dataFormat = (cell, copy) => {
      if (copy.isPaid) {
        return '';
      }

      if (copy.isSold) {
        return (
          <Button bsStyle='danger' onClick={() => this.refund(copy.id)}>
            <Glyphicon glyph="ban-circle" />
          </Button>
        );
      }

      if (copy.isReserved) {
        return (
          <ButtonGroup>
            <Button
              bsStyle="primary"
              onClick={() => this.setState({ activeCopy: copy, showModal: 'cancelReservation' })}
            >
              <Glyphicon glyph="ban-circle" />
            </Button>
            <Button
              onClick={() => this.sell(copy, true)}
            >
              {'$'}
            </Button>
          </ButtonGroup>
        );
      }

      return (
        <ButtonGroup>
          <Button
            bsStyle="primary"
            onClick={() => this.setState({ activeCopy: copy, showModal: 'reserve' })}
          >
            <Glyphicon glyph="user" />
          </Button>
          <Button
            onClick={() => this.sell(copy, true)}
          >
            {'$'}
          </Button>
          <Button
            onClick={() => this.sell(copy)}
            bsStyle='success'
          >
            {'$$'}
          </Button>
          <Button
            bsStyle='danger'
            onClick={() => this.setState({ activeCopy: copy, showModal: 'delete' })}
          >
            <Glyphicon glyph="trash" />
          </Button>
        </ButtonGroup>
      );
    };
  }

  cancelReservation() {
    const id = this.state.activeCopy.id;
    const data = {
      copy: id,
      type: Transaction.TYPES.RESERVE,
    };
    HTTP.post(`${settings.apiUrl}/transaction/delete`, data, (err) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      const copies = this.state.copies;
      copies.find(copy => copy.id === id).cancelReservation();
      this.setState({ copies, showModal: null, activeCopy: null });
    });
  }

  delete() {
    const id = this.state.activeCopy.id;

    HTTP.post(`${settings.apiUrl}/copy/delete`, { id }, (err) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      const copies = this.state.copies.filter((copy) => copy.id !== id);
      this.setState({ copies, showModal: null, activeCopy: null });
    });
  }

  refund(id) {
    const data = {
      copy: id,
      type: Transaction.TYPES.SELL,
    };
    HTTP.post(`${settings.apiUrl}/transaction/delete`, data, (err) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      const copies = this.state.copies;
      copies.find(copy => copy.id === id).refund();
      this.setState({ copies });
    });
  }

  renewParentAccount(no) {
    HTTP.post(`${settings.apiUrl}/member/renew`, { no });
  }

  reserve(parent) {
    const id = this.state.activeCopy.id;
    const data = {
      member: parent.no,
      copies: [id],
      type: Transaction.TYPES.RESERVE,
    };
    HTTP.post(`${settings.apiUrl}/transaction/insert`, data, (err) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      this.renewParentAccount(parent.no);

      const copies = this.state.copies;
      copies.find(copy => copy.id === id).reserve(parent);
      this.setState({ copies, activeCopy: null, showModal: null });
    });
  }

  sell(copy, halfPrice) {
    const data = {
      member: this.props.member || copy.member.no,
      copies: [copy.id],
      type: Transaction.TYPES[halfPrice ? 'SELL_PARENT' : 'SELL'],
    };
    HTTP.post(`${settings.apiUrl}/transaction/insert`, data, (err) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      const copies = this.state.copies;

      if (halfPrice) {
        copies.find(c => c.id === copy.id).sellParent();
      } else {
        copies.find(c => c.id === copy.id).sell();
      }

      this.setState({ copies });
    });
  }

  updatePrice(event, value) {
    const price = parseInt(value, 10);
    const id = this.state.activeCopy.id;
    const data = { id, price };

    HTTP.post(`${settings.apiUrl}/copy/update`, data, (err) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      const copies = this.state.copies;
      copies.find(copy => copy.id === id).price = price;
      this.setState({ copies, showModal: null, activeCopy: null });
    });
  }

  getModal() {
    switch (this.state.showModal) {
      case 'delete':
        return (
          <ConfirmModal
            message={'Souhaitez-vous vraiment supprimer cet exemplaire ?'}
            title="Supprimer un exemplaire"
            onConfirm={this.delete}
            onCancel={() => this.setState({ activeCopy: null, showModal: null })}
            confirmationStyle="danger"
          />
        );
      case 'cancelReservation':
        return (
          <ConfirmModal
            message={'Souhaitez-vous vraiment annuler cette réservation ?'}
            title="Anuller une réservation"
            onConfirm={this.cancelReservation}
            onCancel={() => this.setState({ activeCopy: null, showModal: null })}
            confirmationStyle="danger"
          />
        );
      case 'update':
        return (
          <InputModal
            message="Entrer le nouveau montant"
            title={'Mettre à jour le prix'}
            type="number"
            value={this.state.activeCopy.price}
            onSave={this.updatePrice}
            onCancel={() => this.setState({ activeCopy: null, showModal: null })}
          />
        );
      case 'reserve':
        return (
          <SearchModal
            disableArchive
            onCancel={() => this.setState({ activeCopy: null, showModal: null })}
            onRowClick={this.reserve}
            type="parent"
          />
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <CopyTable
        columns={this.columns}
        data={this.state.copies}
        modal={this.getModal()}
      />
    );
  }
}

CopyTableContainer.propTypes = {
  copies: React.PropTypes.array.isRequired,
  member: React.PropTypes.string,
};
