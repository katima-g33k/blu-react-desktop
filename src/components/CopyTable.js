import React, { Component } from 'react';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import { I18n, Translate } from 'react-i18nify';
import moment from 'moment';

import { ItemCopyColumns, MemberCopyColumns } from '../lib/TableColumns';
import { ConfirmModal, InputModal } from './modals';
import HTTP from '../lib/HTTP';
import settings from '../settings.json';
import Table from './Table';

const formatCopies = (copies) => {
  return copies.map((copy) => {
    const soldT = copy.transaction.filter((t) => t.code === 'SELL' || t.code === 'SELL_PARENT')[0];
    const sold = soldT ? moment(soldT.date) : null;
    const paidT = copy.transaction.filter((t) => t.code === 'PAY')[0];
    const paid = paidT ? moment(paidT.date) : null;
    return {
      id: copy.id,
      price: copy.price,
      added: moment(copy.transaction.filter((t) => t.code === 'ADD')[0].date),
      sold,
      paid,
      name: copy.item ? copy.item.name : null,
      editor: copy.item ? copy.item.editor : null,
      edition: copy.item ? copy.item.edition : null,
      item: copy.item,
      member: copy.member,
    };
  });
};

export default class CopyTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copies: props.copies,
      showModal: null,
    };

    this.delete = this.delete.bind(this);
    this.refund = this.refund.bind(this);
    this.sell = this.sell.bind(this);
    this.updatePrice = this.updatePrice.bind(this);

    this.columns = (props.member ? MemberCopyColumns : ItemCopyColumns).map((column) => {
      if (column.dataField === 'price') {
        column.dataFormat = (cell, row) => {
          return (
            <Button
              bsStyle="link"
              onClick={() => this.setState({ activeCopy: row, showModal: 'update' })}
              disabled={!!row.sold}
            >
              {`${cell} $`}
            </Button>
          );
        };
      }

      return column;
    });
    this.columns.push({
      dataField: 'action',
      label: 'Actions',
      dataAlign: 'center',
      width: '175',
      dataFormat: (cell, row) => {
        if (row.paid) {
          return '';
        }

        if (row.sold) {
          return (
            <Button bsStyle='danger' onClick={() => this.refund(row.id)}>
              <Glyphicon glyph="ban-circle" />
            </Button>
          );
        }

        return (
          <ButtonGroup>
            <Button
              bsStyle="primary"
              onClick={() => {}}
            >
              <Glyphicon glyph="user" />
            </Button>
            <Button
              bsStyle='success'
              onClick={() => this.sell(row, true)}
            >
              {'$'}
            </Button>
            <Button
              onClick={() => this.sell(row)}
            >
              {'$$'}
            </Button>
            <Button
              bsStyle='danger'
              onClick={() => this.setState({ activeCopy: row, showModal: 'delete' })}
            >
              <Glyphicon glyph="trash" />
            </Button>
          </ButtonGroup>
        );
      },
    });
  }

  delete() {
    const id = this.state.activeCopy.id;

    HTTP.post(`${settings.apiUrl}/copy/delete`, { id }, (err) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      const copies = this.state.copies.filter((copy) => {
        return copy.id !== id;
      });

      this.setState({ copies, showModal: null, activeCopy: null });
    });
  }

  refund(id) {
    const data = {
      copy: id,
      type: 'SELL',
    };
    HTTP.post(`${settings.apiUrl}/transaction/delete`, data, (err) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      const copies = this.state.copies.map((c) => {
        if (c.id === id) {
          c.transaction = c.transaction.filter((transaction) => {
            return transaction.code !== 'SELL' && transaction.code !== 'SELL_PARENT';
          });
        }

        return c;
      });

      this.setState({ copies });
    });
  }

  sell(copy, halfPrice) {
    const data = {
      member: this.props.member || copy.member.no,
      copies: [copy.id],
      type: halfPrice ? 'SELL_PARENT' : 'SELL',
    };
    HTTP.post(`${settings.apiUrl}/transaction/insert`, data, (err) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      const copies = this.state.copies.map((c) => {
        if (c.id === copy.id) {
          c.transaction.push({ code: data.type, date: moment() });
        }

        return c;
      });

      this.setState({ copies });
    });
  }

  updatePrice(event, value) {
    const copies = this.state.copies.map((copy) => {
      if (copy.id === this.state.activeCopy.id) {
        copy.price = value;
      }

      return copy;
    });

    this.setState({
      copies,
      showModal: null,
      activeCopy: null,
    });
  }

  render() {
    const copies = formatCopies(this.state.copies);

    return (
      <section>
        <h4>
          <Translate value="MemberView.copies.title" />
        </h4>
        <Table
          columns={this.columns}
          data={copies}
          placeholder={I18n.t('MemberView.copies.none')}
          sortable
        />
        {this.state.showModal === 'delete' ? (
          <ConfirmModal
            message={'Souhaitez-vous vraiment supprimer cet exemplaire ?'}
            title="Supprimer un exemplaire"
            onConfirm={this.delete}
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
      </section>
    );
  }
}

CopyTable.propTypes = {
  copies: React.PropTypes.array.isRequired,
  member: React.PropTypes.string,
};
