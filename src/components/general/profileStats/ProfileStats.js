// TODO: Optimize
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';

import Spinner from '../Spinner';
import { Translate } from '../../../lib/i18n/i18n';
import { Copy } from '../../../lib/models/index';

import './profileStats.css';

const calculateStats = (copies, callback) => {
  const statistics = {
    accountStats: {
      added: {
        count: 0,
        price: 0,
      },
      sold: {
        count: 0,
        price: 0,
      },
      paid: {
        count: 0,
        price: 0,
      },
      toSell: {
        count: 0,
        price: 0,
      },
      toPay: {
        count: 0,
        price: 0,
      },
    },
    priceStats: {
      max: {
        all: 0,
        inStock: 0,
      },
      min: {
        all: -1,
        inStock: -1,
      },
      avg: {
        all: 0,
        inStock: 0,
      },
    },
  };

  const data = copies.reduce((acc, copy) => {
    const { accountStats, priceStats } = acc;
    const price = +copy.price;

    accountStats.added.count++;
    accountStats.added.price += price;

    if (copy.isAdded) {
      accountStats.toSell.count++;
      accountStats.toSell.price += price;

      priceStats.avg.inStock += price;

      if (price > priceStats.max.inStock) {
        priceStats.max.inStock = price;
      }

      if (priceStats.min.inStock === -1 || price < priceStats.min.inStock) {
        priceStats.min.inStock = price;
      }
    }

    if (copy.isSold) {
      accountStats.sold.count++;
      accountStats.sold.price += price;
      accountStats.toPay.count++;
      accountStats.toPay.price += price;
    }

    if (copy.isPaid) {
      accountStats.sold.count++;
      accountStats.sold.price += price;
      accountStats.paid.count++;
      accountStats.paid.price += price;
    }


    priceStats.avg.all += price;

    if (price > priceStats.max.all) {
      priceStats.max.all = price;
    }

    if (priceStats.min.all === -1 || price < priceStats.min.all) {
      priceStats.min.all = price;
    }

    return { accountStats, priceStats };
  }, statistics);

  const inStock = data.accountStats.toSell.count;

  if (copies.length > 0) {
    data.priceStats.avg.all = Math.round(data.priceStats.avg.all / copies.length);
  } else {
    data.priceStats.min.all = 0;
  }

  if (inStock > 0) {
    data.priceStats.avg.inStock = Math.round(data.priceStats.avg.inStock / inStock);
  } else {
    data.priceStats.min.inStock = 0;
  }

  callback(data);
};

export default class ProfileStats extends Component {
  static propTypes = {
    copies: PropTypes.arrayOf(PropTypes.instanceOf(Copy)),
    priceStats: PropTypes.bool,
  }

  static defaultProps = {
    copies: [],
    priceStats: false,
  }

  state = {
    stats: null,
  }

  componentDidMount = () => {
    calculateStats(this.props.copies || [], stats => this.setState({ stats }));
  }

  componentWillReceiveProps = ({ copies = [] }) => {
    this.setState({ stats: null });
    calculateStats(copies, stats => this.setState({ stats }));
  }

  renderPriceStats = () => {
    const { priceStats } = this.state.stats;

    return (
      <Row>
        <Col md={12}>
          <Row className="price-stat">
            <Col md={12}>
              {`Prix maximum: ${priceStats.max.all}$ (${priceStats.max.inStock}$ en stock)`}
            </Col>
          </Row>
          <Row className="price-stat">
            <Col md={12}>
              {`Prix moyen: ${priceStats.avg.all}$ (${priceStats.avg.inStock}$ en stock)`}
            </Col>
          </Row>
          <Row className="price-stat">
            <Col md={12}>
              {`Prix minimum: ${priceStats.min.all}$ (${priceStats.min.inStock}$ en stock)`}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  renderTable = () => {
    const { added, sold, toSell, toPay, paid } = this.state.stats.accountStats;

    return (
      <table>
        <tbody>
          <tr>
            <td className="title" colSpan={3}>
              <Translate value="ProfileStats.added" />
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              {added.count} <Translate value="ProfileStats.books" />
              <br />
              ({added.price} $)
            </td>
          </tr>
          <tr>
            <td className="title" colSpan={2}>
              <Translate value="ProfileStats.sold" />
            </td>
            <td className="title">
              <Translate value="ProfileStats.toSell" />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              {sold.count} <Translate value="ProfileStats.books" />
              <br />
              ({sold.price} $)
            </td>
            <td rowSpan={3}>
              {toSell.count} <Translate value="ProfileStats.books" />
              <br />
              ({toSell.price} $)
            </td>
          </tr>
          <tr>
            <td className="title">
              <Translate value="ProfileStats.toPay" />
            </td>
            <td className="title">
              <Translate value="ProfileStats.paid" />
            </td>
          </tr>
          <tr>
            <td>
              {toPay.count} <Translate value="ProfileStats.books" />
              <br />
              ({toPay.price} $)
            </td>
            <td>
              {paid.count} <Translate value="ProfileStats.books" />
              <br />
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
      <Row id={this.constructor.name}>
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
