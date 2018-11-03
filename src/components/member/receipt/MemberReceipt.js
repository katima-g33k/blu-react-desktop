import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import moment from 'moment';

import { AlignedData } from '../../general';
import { formatLongDate } from '../../../lib/dateHelper';
import i18n from '../../../lib/i18n';
import { Member } from '../../../lib/models';
import MemberReceiptTable from './MemberReceiptTable';

export default class MemberReceipt extends Component {
  static propTypes = {
    amount: PropTypes.number,
    member: PropTypes.instanceOf(Member).isRequired,
    onAfterPrint: PropTypes.func,
  };

  static defaultProps = {
    amount: 0,
    onAfterPrint() {},
  };

  componentDidMount() {
    window.print();
    this.props.onAfterPrint();
  }

  get authorisationOption() {
    return {
      amount: this.props.amount,
      date: formatLongDate(new Date()),
      name: this.props.member.name,
    };
  }

  renderField = (key, label, value) => (
    <AlignedData
      className="userdata"
      key={key}
      label={label || i18n(`MemberReceipt.accountInfo.${key}`)}
      value={value || this.props.member[key]}
    />
  );

  renderPhone = (phone, index) => phone.number && this.renderField(
    phone.number, i18n('MemberReceipt.accountInfo.phone', { index: index + 1 }), phone.toString(),
  );

  renderPhones = () => this.props.member.phone.map(this.renderPhone);

  render() {
    return (
      <div id="receipt">
        <h2>{i18n('MemberReceipt.title')}</h2>
        <p className="semester">
          {moment.semester()}
        </p>
        <Row>
          <Col md={4}>
            <section>
              <h3>{i18n('MemberReceipt.accountInfo.title')}</h3>
              {this.renderField('name')}
              {this.renderField('no')}
              {this.renderField('addressString')}
              {this.renderField('email')}
              {this.renderPhones()}
            </section>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h3>{i18n('MemberReceipt.subtitle')}</h3>
            <MemberReceiptTable copies={this.props.member.account.copies} />
          </Col>
        </Row>
        <Row className="note">
          <Col md={12}>
            {i18n('MemberReceipt.note')}
          </Col>
        </Row>
        <Row className="authorisation">
          <Row>
            <Col md={12}>
              {i18n('MemberReceipt.authorisation.message', this.authorisationOption)}
            </Col>
          </Row>
          <Row className="signature">
            {i18n('MemberReceipt.authorisation.signature')}
          </Row>
        </Row>
        <Row className="conditions">
          <Col md={12}>
            {i18n('MemberReceipt.conditions')}
          </Col>
        </Row>
      </div>
    );
  }
}
