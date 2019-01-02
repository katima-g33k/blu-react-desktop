import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';

import { calculateStats } from '../../lib/helpers/profileStats';
import i18n from '../../lib/i18n';
import { Copy } from '../../lib/models';

import Spinner from './Spinner';

const styles = {
  priceStats: {
    marginBottom: 15,
  },
  table: {
    borderCollapse: 'collapse',
    margin: 'auto',
  },
  td: {
    borderColor: '#000000',
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 15,
    textAlign: 'center',
  },
};

export default class ProfileStats extends Component {
  static propTypes = {
    copies: PropTypes.arrayOf(PropTypes.instanceOf(Copy)),
    priceStats: PropTypes.bool,
  };

  static defaultProps = {
    copies: [],
    priceStats: false,
  };

  state = {
    stats: null,
  };

  componentDidMount() {
    this.calculateStats(this.props.copies);
  }

  componentWillReceiveProps(nextProps) {
    this.calculateStats(nextProps.copies);
  }

  calculateStats = copies => this.setStats(calculateStats(copies));

  setStats = stats => this.setState({ stats });

  renderPriceStatBlock = (key) => {
    const {
      all: total,
      inStock,
    } = this.state.stats.priceStats[key];

    return (
      <Row style={styles.priceStats}>
        <Col md={12}>
          {i18n(`ProfileStats.${key}Price`, { inStock, total })}
        </Col>
      </Row>
    );
  };

  renderPriceStats = () => this.props.priceStats && (
    <Row>
      <Col md={12}>
        {this.renderPriceStatBlock('max')}
        {this.renderPriceStatBlock('avg')}
        {this.renderPriceStatBlock('min')}
      </Col>
    </Row>
  );

  renderTitleCell = (key, colSpan = 1) => (
    <td colSpan={colSpan} style={styles.td}>
      {i18n(`ProfileStats.${key}`)}
    </td>
  );

  renderContentCell = ({ count, price }, colSpan = 1, rowSpan = 1) => (
    <td colSpan={colSpan} rowSpan={rowSpan} style={styles.td}>
      {i18n('ProfileStats.books', { count })}
      <br />
      {i18n('ProfileStats.price', { price })}
    </td>
  );

  renderTable = () => {
    const {
      added,
      paid,
      sold,
      toSell,
      toPay,
    } = this.state.stats.accountStats;

    return (
      <table style={styles.table}>
        <tbody>
          <tr>
            {this.renderTitleCell('added', 3)}
          </tr>
          <tr>
            {this.renderContentCell(added, 3)}
          </tr>
          <tr>
            {this.renderTitleCell('sold', 2)}
            {this.renderTitleCell('toSell')}
          </tr>
          <tr>
            {this.renderContentCell(sold, 2)}
            {this.renderContentCell(toSell, 1, 3)}
          </tr>
          <tr>
            {this.renderTitleCell('toPay')}
            {this.renderTitleCell('paid')}
          </tr>
          <tr>
            {this.renderContentCell(toPay)}
            {this.renderContentCell(paid)}
          </tr>
        </tbody>
      </table>
    );
  };

  render() {
    return this.state.stats ? (
      <Row>
        <Col md={12}>
          {this.renderPriceStats()}
          <Row>
            <Col md={12}>
              {this.renderTable()}
            </Col>
          </Row>
        </Col>
      </Row>
    ) : (<Spinner />);
  }
}
