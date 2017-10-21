import React, { Component, PropTypes } from 'react';
import { Col, Panel, Row } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import moment from 'moment';

import I18n from '../../lib/i18n/i18n';
import DatePicker from '../general/DatePicker';
import Select from '../general/Select';

const semesterList = moment.semester('list');

export default class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: {
        date: moment.semester('start'),
        semester: moment.semester('code'),
      },
      end: {
        date: moment.semester('end'),
        semester: moment.semester('code'),
      },
      data: [],
    };
  }

  static propTypes = {
    api: PropTypes.shape().isRequired,
  }

  componentWillMount() {
    this.getStatistics();
  }

  getStatistics = async () => {
    const { start, end } = this.state;
    const startDate = start.date.format('YYYY-MM-DD');
    const endDate = end.date.format('YYYY-MM-DD');

    try {
      const res = await this.props.api.statistics.byInterval(startDate, endDate);
      this.setState({
        data: Object.keys(res).map(key => ({
          amount: +res[key].amount || 0,
          name: I18n.t(`Admin.statistics.chart.labels.${key}`),
          quantity: +res[key].quantity || 0,
          savings: key === 'soldParent' ? +res[key].savings || 0 : undefined,
        })),
      });
    } catch (error) {
      this.setState({ error });
    }
  }

  onDateChange = (key, date) => {
    this.updateDates(key, date, moment.semester('code', date));
  }

  onSemesterChange = (key, semester) => {
    this.updateDates(key, moment.semester(key, semester), semester);
  }

  updateDates = (key, date, semester) => {
    const data = {};
    data[key] = { date, semester };

    if (key === 'start' && date.isAfter(this.state.end.date)) {
      data.end = { date, semester };
    } else if (key === 'end' && date.isBefore(this.state.start.date)) {
      data.start = { date, semester };
    }

    this.setState({ ...data });
    this.getStatistics();
  }

  render() {
    const { data, start, end } = this.state;
    const semesterListdata = semesterList.map(({ code, name }) => ({
      label: name,
      value: code,
    }));

    return (
      <Panel header={I18n.t('Admin.statistics.title')}>
        <Row>
          <Col sm={12} md={5}>
            <Row>
              <Col md={12}>
                <h4>Par session</h4>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Select
                  data={semesterListdata}
                  label={'Début'}
                  onChange={event => this.onSemesterChange('start', event.target.value)}
                  value={start.semester}
                />
              </Col>
              <Col md={6}>
                <Select
                  data={semesterListdata}
                  label={'Fin'}
                  onChange={event => this.onSemesterChange('end', event.target.value)}
                  value={end.semester}
                />
              </Col>
            </Row>
          </Col>
          <Col sm={12} md={5} smOffset={0} mdOffset={1}>
            <Row>
              <Col md={12}>
                <h4>Par date</h4>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <DatePicker
                  label={'Début'}
                  onChange={date => this.onDateChange('start', date)}
                  value={start.date}
                />
              </Col>
              <Col md={6}>
                <DatePicker
                  label={'Fin'}
                  onChange={date => this.onDateChange('end', date)}
                  value={end.date}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ marginTop: '50px' }}>
          <BarChart
            data={data}
            style={{ margin: 'auto' }}
            height={400}
            width={800}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" name={'Argent'} fill="#A0B389" />
            <Bar dataKey="quantity" name={'Quantité'} fill="#BB7739" />
            <Bar dataKey="savings" name={'Argent épargné'} fill="#336699" />
          </BarChart>
        </Row>
      </Panel>
    );
  }
}
