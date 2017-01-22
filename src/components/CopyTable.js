import React, { Component } from 'react';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import { I18n, Translate } from 'react-i18nify';
import moment from 'moment';

import { ItemCopyColumns, MemberCopyColumns } from '../lib/TableColumns';
// import { ConfirmModal, InputModal } from './modals';
import HTTP from '../lib/HTTP';
import settings from '../settings.json';
import Table from './Table';

const getItemCopies = (copies) => {
  return copies.map((copy) => {
    return {
      id: copy.id,
      member: `${copy.member.first_name} ${copy.member.last_name}`,
      price: copy.price,
      added: copy.transaction.filter((t) => t.code === 'ADD'),
      sold: copy.transaction.filter((t) => t.code === 'SELL' || t.code === 'SELL_PARENT'),
      paid: copy.transaction.filter((t) => t.code === 'PAY'),
    };
  });
};

const getMemberCopies = (copies) => {
  return copies.map((copy) => {
    const soldT = copy.transaction.filter((t) => t.code === 'SELL' || t.code === 'SELL_PARENT')[0];
    const sold = soldT ? moment(soldT.date) : null;
    const paidT = copy.transaction.filter((t) => t.code === 'PAY')[0];
    const paid = paidT ? moment(paidT.date) : null;
    return {
      id: copy.id,
      name: copy.item.name,
      editor: copy.item.editor,
      edition: copy.item.edition,
      price: copy.price,
      added: moment(copy.transaction.filter((t) => t.code === 'ADD')[0].date),
      sold,
      paid,
      item: copy.item,
    };
  });
};

export default class CopyTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copies: props.copies,
    };

    this.delete = this.delete.bind(this);
    this.refund = this.refund.bind(this);
    this.sell = this.sell.bind(this);

    this.columns = props.member ? MemberCopyColumns : ItemCopyColumns;
    this.columns.push({
      dataField: 'action',
      label: 'Actions',
      dataAlign: 'center',
      width: '125',
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
              onClick={() => this.delete(row.id)}
            >
              <Glyphicon glyph="trash" />
            </Button>
          </ButtonGroup>
        );
      },
    });
  }

  delete(id) {
    HTTP.post(`${settings.apiUrl}/copy/delete`, { id }, (err) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      const copies = this.state.copies.filter((copy) => {
        return copy.id !== id;
      });

      this.setState({ copies });
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

  render() {
    const copies = this.props.member ? getMemberCopies(this.state.copies) : getItemCopies(this.state.copies);

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
      </section>
    );
  }
}

CopyTable.propTypes = {
  copies: React.PropTypes.array.isRequired,
  member: React.PropTypes.string,
};
