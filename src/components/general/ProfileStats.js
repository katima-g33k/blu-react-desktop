import React, { Component, PropTypes } from 'react';
import { Col, Row } from 'react-bootstrap';

import Spinner from './Spinner';
import Transaction, { Type } from '../../lib/Transaction';
import { Translate } from '../../lib/i18n/i18n';

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

export default class ProfileStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copies: props.copies || [],
      stats: null,
    };

    this.getCopies = this.getCopies.bind(this);
    this.getPrice = this.getPrice.bind(this);
    this.calculateStats = this.calculateStats.bind(this);
    this.renderPriceStats = this.renderPriceStats.bind(this);
    this.renderTable = this.renderTable.bind(this);
  }

  componentWillMount() {
    this.setState({ stats: this.calculateStats(this.state.copies) });
  }

  componentWillReceiveProps(props) {
    this.setState({
      copies: props.copies || [],
      stats: this.calculateStats(this.props.copies || []),
    });
  }

  getCopies(copies, filters) {
    return copies.filter(copy => copy.transaction.filter(t => filters.indexOf(t.code) > -1).length);
  }

  getPrice(copies) {
    return copies.reduce((acc, cur) => acc + +cur.price, 0);
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

  renderPriceStats() {
    let numInStock = 0;

    const { copies } = this.state;
    const priceStats = {
      max: {
        all: 0,
        inStock: 0,
      },
      min: {
        all: null,
        inStock: null,
      },
      avg: {
        all: 0,
        inStock: 0,
      },
    };

    copies.forEach((copy) => {
      priceStats.avg.all += copy.price;

      if (copy.price > priceStats.max.all) {
        priceStats.max.all = copy.price;
      }

      if ((!priceStats.min.all && priceStats.min.all !== 0) || copy.price < priceStats.min.all) {
        priceStats.min.all = copy.price;
      }

      if (copy.isAdded) {
        numInStock++;
        priceStats.avg.inStock += copy.price;

        if (copy.price > priceStats.max.inStock) {
          priceStats.max.inStock = copy.price;
        }

        if ((!priceStats.min.inStock && priceStats.min.inStock !== 0) || copy.price < priceStats.min.inStock) {
          priceStats.min.inStock = copy.price;
        }
      }
    });

    if (copies.length > 0) {
      priceStats.avg.all = Math.round(priceStats.avg.all / copies.length);
    } else {
      priceStats.min.all = 0;
    }

    if (numInStock > 0) {
      priceStats.avg.inStock = Math.round(priceStats.avg.inStock / numInStock);
    } else {
      priceStats.min.inStock = 0;
    }

    return (
      <Row>
        <Col md={12}>
          <Row style={{ marginTop: '15px' }}>
            <Col md={12}>
              {`Prix maximum: ${priceStats.max.all}$ (${priceStats.max.inStock}$ en stock)`}
            </Col>
          </Row>
          <Row style={{ marginTop: '15px' }}>
            <Col md={12}>
              {`Prix moyen: ${priceStats.avg.all}$ (${priceStats.avg.inStock}$ en stock)`}
            </Col>
          </Row>
          <Row style={{ marginTop: '15px' }}>
            <Col md={12}>
              {`Prix minimum: ${priceStats.min.all}$ (${priceStats.min.inStock}$ en stock)`}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  renderTable() {
    const { added, sold, toSell, toPay, paid } = this.state.stats;

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
              {added.count} <Translate value="ProfileStats.books" />
              <br/>
              ({added.price} $)
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
              {sold.count} <Translate value="ProfileStats.books" />
              <br/>
              ({sold.price} $)
            </td>
            <td rowSpan={3} style={style.td}>
              {toSell.count} <Translate value="ProfileStats.books" />
              <br/>
              ({toSell.price} $)
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
              {toPay.count} <Translate value="ProfileStats.books" />
              <br/>
              ({toPay.price} $)
            </td>
            <td style={style.td}>
              {paid.count} <Translate value="ProfileStats.books" />
              <br/>
              ({paid.price} $)
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    const { stats } = this.state;
    const { priceStats } = this.props;

    return stats ? (
      <Row>
        {priceStats ? (
          <Col md={5}>
            {this.renderPriceStats()}
          </Col>
        ) : null}
        <Col md={priceStats ? 7 : 12}>
          {this.renderTable()}
        </Col>
      </Row>
    ) : (<Spinner />);
  }
}

ProfileStats.propTypes = {
  copies: PropTypes.array,
  priceStats: PropTypes.bool,
};
