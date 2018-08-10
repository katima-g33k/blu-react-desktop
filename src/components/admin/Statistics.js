/* eslint react/sort-comp: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Panel,
  Row,
} from 'react-bootstrap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import moment from 'moment';

import { DatePicker, SemesterSelector } from '../general';
import i18n from '../../lib/i18n';

const CHART_HEIGHT = 400;
const CHART_WIDTH = 800;
const BARS = ['amount', 'quantity', 'savings'];
const BAR_COLORS = {
  amount: '#A0B389',
  quantity: '#BB7739',
  savings: '#336699',
};

const styles = {
  amountDueMessage: {
    marginTop: '15px',
  },
  chartContainer: {
    marginTop: '50px',
  },
  chart: {
    margin: 'auto',
  },
};

export default class Statistics extends Component {
  static propTypes = {
    amountDue: PropTypes.number,
    dataByInterval: PropTypes.shape(),
    fetchAmountDue: PropTypes.func.isRequired,
    fetchByInterval: PropTypes.func.isRequired,
  }

  static defaultProps = {
    amountDue: 0,
    dataByInterval: {
      added: {
        amount: 0,
        quantity: 0,
      },
      paid: {
        amount: 0,
        quantity: 0,
      },
      sold: {
        amount: 0,
        quantity: 0,
      },
      soldParent: {
        amount: 0,
        quantity: 0,
        savings: 0,
      },
    },
  }

  state = {
    dueDate: moment(),
    endDate: moment.semester('end'),
    endSemester: moment.semester('code'),
    startDate: moment.semester('start'),
    startSemester: moment.semester('code'),
  };

  componentDidMount() {
    this.props.fetchAmountDue(this.state.dueDate);
    this.props.fetchByInterval(this.state.startDate, this.state.endDate);
  }

  get formattedAmountDue() {
    return `${this.props.amountDue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ').replace('.00', '')} $`;
  }

  get dataByInterval() {
    return Object.keys(this.props.dataByInterval).map((key) => {
      const { amount, quantity, savings } = this.props.dataByInterval[key];

      return {
        amount: +amount || 0,
        name: i18n(`Admin.statistics.chart.labels.${key}`),
        quantity: +quantity || 0,
        savings: key === 'soldParent' ? +savings || 0 : undefined,
      };
    });
  }

  get formattedDueDate() {
    return moment(this.state.dueDate).format('LL');
  }

  onDateChange = (key, date) => this.updateDates(key, date, moment.semester('code', date))

  onStartDateChange = date => this.onDateChange('start', date)

  onEndDateChange = date => this.onDateChange('end', date)

  onStartSemesterChange = (event, semester) => this.updateDates('start', moment.semester('start', semester), semester);

  onEndSemesterChange = (event, semester) => this.updateDates('end', moment.semester('end', semester), semester)

  updateDates = (key, date, semester) => {
    const state = {
      ...this.state,
      [`${key}Date`]: date,
      [`${key}Semester`]: semester,
    };

    if (key === 'start' && date.isAfter(this.state.endDate)) {
      state.endDate = date;
      state.endSemester = semester;
    } else if (key === 'end' && date.isBefore(this.state.startDate)) {
      state.startDate = date;
      state.startSemester = semester;
    }

    this.setState(state);
    this.props.fetchByInterval(state.startDate, state.endDate);
  }

  updateAmountDue = (dueDate) => {
    this.setState({ dueDate });
    this.props.fetchAmountDue(dueDate);
  }

  renderBars = () => BARS.map(bar => (
    <Bar
      dataKey={bar}
      key={bar}
      name={i18n(`Admin.statistics.chart.labels.${bar}`)}
      fill={BAR_COLORS[bar]}
    />
  ))

  render() {
    return (
      <Panel header={i18n('Admin.statistics.title')}>
        <Row>
          <Col md={12}>
            <h3>{i18n('Admin.statistics.amountDue.title')}</h3>
            <DatePicker
              label={i18n('Admin.statistics.amountDue.datePickerLabel')}
              onChange={this.updateAmountDue}
              value={this.state.dueDate}
            />
            <p style={styles.amountDueMessage}>
              {i18n('Admin.statistics.amountDue.message.1', { date: this.formattedDueDate })}
              <b>{this.formattedAmountDue}</b>
              {i18n('Admin.statistics.amountDue.message.2')}
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h3>{i18n('Admin.statistics.byInterval.title')}</h3>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={5}>
            <Row>
              <Col md={12}>
                <h4>{i18n('Admin.statistics.byInterval.semester.title')}</h4>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <SemesterSelector
                  label={i18n('general.dateLabel.start')}
                  onChange={this.onStartSemesterChange}
                  value={this.state.startSemester}
                />
              </Col>
              <Col md={6}>
                <SemesterSelector
                  label={i18n('general.dateLabel.end')}
                  onChange={this.onEndSemesterChange}
                  value={this.state.endSemester}
                />
              </Col>
            </Row>
          </Col>
          <Col
            md={5}
            mdOffset={1}
            sm={12}
            smOffset={0}
          >
            <Row>
              <Col md={12}>
                <h4>{i18n('Admin.statistics.byInterval.date.title')}</h4>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <DatePicker
                  label={i18n('general.dateLabel.start')}
                  onChange={this.onStartDateChange}
                  value={this.state.startDate}
                />
              </Col>
              <Col md={6}>
                <DatePicker
                  label={i18n('general.dateLabel.end')}
                  onChange={this.onEndDateChange}
                  value={this.state.endDate}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={styles.chartContainer}>
          <BarChart
            data={this.dataByInterval}
            style={styles.chart}
            height={CHART_HEIGHT}
            width={CHART_WIDTH}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            {this.renderBars()}
          </BarChart>
        </Row>
      </Panel>
    );
  }
}
