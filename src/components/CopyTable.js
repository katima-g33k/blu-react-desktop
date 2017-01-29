import React, { Component } from 'react';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import { I18n, Translate } from 'react-i18nify';

import { CopyColumns } from '../lib/TableColumns';
import { ConfirmModal, InputModal, SearchModal } from './modals';
import HTTP from '../lib/HTTP';
import settings from '../settings.json';
import Table from './Table';
import Transaction from '../lib/models/Transaction';

export default class CopyTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copies: props.copies,
      showModal: null,
    };

    this.cancelReservation = this.cancelReservation.bind(this);
    this.delete = this.delete.bind(this);
    this.formatRow = this.formatRow.bind(this);
    this.refund = this.refund.bind(this);
    this.reserve = this.reserve.bind(this);
    this.sell = this.sell.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
    this.renderModals = this.renderModals.bind(this);

    this.columns = CopyColumns.filter(column => this.props.member ? !column.itemOnly : !column.memberOnly);
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
              bsStyle='success'
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
            bsStyle='success'
            onClick={() => this.sell(copy, true)}
          >
            {'$'}
          </Button>
          <Button
            onClick={() => this.sell(copy)}
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

  formatRow(row, index) {
    if (row.item && row.item.status && row.item.status.REMOVED) {
      return 'removed';
    }

    if ((row.member && !row.member.account.isActive) ||
        (row.item && row.item.status && row.item.status.OUTDATED)) {
      return 'archived';
    }

    // Striped
    return index % 2 === 0 ? 'striped-row' : '';
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
    const id = this.state.activeCopy.id;
    const data = { id, price: value };

    HTTP.post(`${settings.apiUrl}/copy/update`, data, (err) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      const copies = this.state.copies;
      copies.find(copy => copy.id === id).price = value;
      this.setState({ copies, showModal: null, activeCopy: null });
    });
  }

  renderModals() {
    return (
      <div>
        {this.state.showModal === 'delete' ? (
          <ConfirmModal
            message={'Souhaitez-vous vraiment supprimer cet exemplaire ?'}
            title="Supprimer un exemplaire"
            onConfirm={this.delete}
            onCancel={() => this.setState({ activeCopy: null, showModal: null })}
            confirmationStyle="danger"
          />
        ) : null}
        {this.state.showModal === 'cancelReservation' ? (
          <ConfirmModal
            message={'Souhaitez-vous vraiment annuler cette réservation ?'}
            title="Anuller une réservation"
            onConfirm={this.cancelReservation}
            onCancel={() => this.setState({ activeCopy: null, showModal: null })}
            confirmationStyle="danger"
          />
        ) : null}
        {this.state.showModal === 'update' ? (
          <InputModal
            message="Entrer le nouveau montant"
            title={'Mettre à jour le prix'}
            type="number"
            value={this.state.activeCopy.price}
            onSave={this.updatePrice}
            onCancel={() => this.setState({ activeCopy: null, showModal: null })}
          />
        ) : null}
        {this.state.showModal === 'reserve' ? (
          <SearchModal
            disableArchive
            onCancel={() => this.setState({ activeCopy: null, showModal: null })}
            onRowClick={this.reserve}
            type="parent"
          />
        ) : null}
      </div>
    );
  }

  render() {
    return (
      <section>
        <h4>
          <Translate value="MemberView.copies.title" />
        </h4>
        <Table
          columns={this.columns}
          data={this.state.copies}
          placeholder={I18n.t('MemberView.copies.none')}
          sortable
          rowClass={this.formatRow}
        />
        {this.renderModals()}
      </section>
    );
  }
}

CopyTable.propTypes = {
  copies: React.PropTypes.array.isRequired,
  member: React.PropTypes.string,
};
