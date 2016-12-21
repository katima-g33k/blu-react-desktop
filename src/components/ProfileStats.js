import React, { Component } from 'react';
import Transaction, { Type } from '../lib/Transaction';
import { Translate } from '../lib/i18n/i18n';

export default class ProfileStats extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getCopies = this.getCopies.bind(this);
    this.getPrice = this.getPrice.bind(this);
    this.calculateStats = this.calculateStats.bind(this);
  }

  componentWillReceiveProps(props) {
    let copies;
    if (props) {
      if (props.member && props.member.account) {
        copies = props.member.account.copies;
      }

      if (props.item) {
        copies = props.item.copies;
      }
    }

    if (copies) {
      this.setState({
        copies,
        stats: this.calculateStats(copies),
      });
    }
  }

  getCopies(copies, filters) {
    return copies.filter((copy) => {
      return copy.transaction.filter((t) => filters.indexOf(t.code) > -1).length;
    });
  }

  getPrice(copies) {
    let price = 0;
    copies.forEach((copy) => {
      price += +copy.price;
    });
    return price;
  }

  calculateStats(copies) {
    const copiesSold = this.getCopies(copies, Transaction.type.getAllSell());
    const copiesPaid = this.getCopies(copies, [Type.PAY]);
    const stats = {
      added: {
        count: copies.length,
        price: this.getPrice(copies),
      },
      sold: {
        count: copiesSold.length,
        price: this.getPrice(copiesSold),
      },
      paid: {
        count: copiesPaid.length,
        price: this.getPrice(copiesPaid),
      },
      toSell: {},
      toPay: {},
    };

    stats.toSell = {
      count: stats.added.count - stats.sold.count,
      price: stats.added.price - stats.sold.price,
    };

    stats.toPay = {
      count: stats.sold.count - stats.paid.count,
      price: stats.sold.price - stats.paid.price,
    };

    return stats;
  }

  render() {
    const style = {
      table: {
        borderCollapse: 'collapse',
        margin: 'auto',
      },
      td: {
        textAlign: 'center',
        padding: '15px',
        border: '1px #000 solid',
      },
      title: {
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '15px',
        border: '1px #000 solid',
      },
    };
    if (this.state.stats) {
      return (
        <table style={style.table}>
          <tbody>
            <tr>
              <td colSpan={3} style={style.title}>
                <Translate value="ProfileStats.added" />
              </td>
            </tr>
            <tr>
              <td colSpan={3} style={style.td}>
                {this.state.stats.added.count} <Translate value="ProfileStats.books" />
                <br/>
                ({this.state.stats.added.price} $)
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={style.title}>
                <Translate value="ProfileStats.sold" />
              </td>
              <td style={style.title}>
                <Translate value="ProfileStats.toSell" />
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={style.td}>
                {this.state.stats.sold.count} <Translate value="ProfileStats.books" />
                <br/>
                ({this.state.stats.sold.price} $)
              </td>
              <td rowSpan={3} style={style.td}>
                {this.state.stats.toSell.count} <Translate value="ProfileStats.books" />
                <br/>
                ({this.state.stats.toSell.price} $)
              </td>
            </tr>
            <tr>
              <td style={style.title}>
                <Translate value="ProfileStats.toPay" />
              </td>
              <td style={style.title}>
                <Translate value="ProfileStats.paid" />
              </td>
            </tr>
            <tr>
              <td style={style.td}>
                {this.state.stats.toPay.count} <Translate value="ProfileStats.books" />
                <br/>
                ({this.state.stats.toPay.price} $)
              </td>
              <td style={style.td}>
                {this.state.stats.paid.count} <Translate value="ProfileStats.books" />
                <br/>
                ({this.state.stats.paid.price} $)
              </td>
            </tr>
          </tbody>
        </table>
      );
    }

    return null;
  }
}

ProfileStats.propTypes = {
  member: React.PropTypes.shape(),
  item: React.PropTypes.shape(),
};
