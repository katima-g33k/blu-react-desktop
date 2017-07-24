import React, { Component } from 'react';
import { Col, Panel, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import moment from 'moment';

import I18n from '../../lib/i18n/i18n';
import API from '../../lib/API';

const semesterList = moment.semester('list');

export default class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment.semester('start'),
      endDate: moment.semester('end'),
      data: [],
    };

    this.getStatistics = this.getStatistics.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  componentWillMount() {
    this.getStatistics();
  }

  getStatistics() {
    const { startDate, endDate } = this.state;
    API.statistics.byInterval(startDate.toDate(), endDate.toDate(), (err, res) => {
      if (err) {
        return;
      }

      this.setState({
        data: Object.keys(res).map(key => ({
          amount: +res[key].amount || 0,
          name: I18n.t(`Admin.statistics.chart.labels.${key}`),
          quantity: +res[key].quantity || 0,
          savings: key === 'soldParent' ? +res[key].savings || 0 : undefined,
        })),
      });
    });
  }

  onDateChange(key, date) {
    const data = {};
    data[key] = date;
    this.setState({ ...data });
    this.getStatistics();
  }

  render() {
    const { startDate, endDate } = this.state;

    return (
      <Panel header={I18n.t('Admin.statistics.title')}>
        <Row>
          <Col sm={12} md={6}>
            <p>Par session</p>
            <label>
              Début
            </label>
            <select>
              {semesterList.map(({ code, name }) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
            <label>
              Fin
            </label>
            <select>
              {semesterList.map(({ code, name }) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            <p>Par date</p>
            <label>
              Début
            </label>
            <DatePicker
              onChange={date => this.onDateChange('startDate', date)}
              selected={startDate}
            />
            <label>
              Fin
            </label>
            <DatePicker
              onChange={date => this.onDateChange('endDate', date)}
              selected={endDate}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6}>
            <BarChart width={800} height={400} data={this.state.data}>
              <XAxis dataKey="name"/>
              <YAxis/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
              <Legend />
              <Bar dataKey="amount" name={'Argent'} fill="#A0B389" />
              <Bar dataKey="quantity" name={'Quantité'} fill="#BB7739" />
              <Bar dataKey="savings" name={'Argent épargné'} fill="#336699" />
            </BarChart>
          </Col>
        </Row>
      </Panel>
    );
  }
}
