import React, { Component } from 'react';
import { Alert, Col, Label, Panel, Row } from 'react-bootstrap';
import { I18n, Translate } from 'react-i18nify';

import moment from 'moment';

import ActionPanel from '../../general/ActionPanel';
import AlignedData from '../../general/AlignedData';
import CopyTableContainer from '../../copy/table/CopyTableContainer';
import MemberCommentsContainer from './MemberCommentsContainer';
import ProfileStats from '../../general/ProfileStats';

const formatDate = (date) => {
  return date ? moment(new Date(date)).format('LL') : '';
};

const border = {
  borderRight: '1px #e0e0e0 solid',
};

export default class MemberView extends Component {
  constructor(props) {
    super(props);

    this.renderAccountState = this.renderAccountState.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
    this.renderGeneralInformation = this.renderGeneralInformation.bind(this);
    this.renderPhones = this.renderPhones.bind(this);
    this.renderStats = this.renderStats.bind(this);
  }

  renderAccountState() {
    const account = this.props.member.account;
    return (
      <section>
        <h4>
          <Translate value="MemberView.account.title" />
        </h4>
        <AlignedData
          label={<Translate value="MemberView.account.activation" />}
          value={
            <Label bsStyle={account.isActive ? 'success' : 'danger'}>
              <Translate value={`MemberView.account.${account.isActive ? 'active' : 'deactivated'}`} />
            </Label>
          }
        />
        <AlignedData
          label={<Translate value="MemberView.account.registration" />}
          value={formatDate(account.registration)}
        />
        <AlignedData
          label={<Translate value="MemberView.account.lastActivity" />}
          value={formatDate(account.lastActivity)}
        />
        <AlignedData
          label={<Translate value="MemberView.account.registration" />}
          value={formatDate(account.deactivationDate)}
        />
      </section>
    );
  }

  renderAlert() {
    const transfers = this.props.member.account.transfers;
    const dates = transfers.map(date => moment(date).format('LL')).join('');
    return transfers.length > 0 && (
      <Alert bsStyle="warning">
        {`Ce compte a été transféré à la BLU ${transfers.length === 1 ? 'le' : 'les'} ${dates}`}
      </Alert>
    );
  }

  renderGeneralInformation() {
    const member = this.props.member;
    return (
      <section>
        <h4>
          <Translate value="MemberView.general.title" />
        </h4>
        <AlignedData
          label={<Translate value="MemberView.general.no" />}
          value={member.no || ''}
        />
        <AlignedData
          label={<Translate value="MemberView.general.address" />}
          value={member.addressString}
        />
        <AlignedData
          label={<Translate value="MemberView.general.email" />}
          value={member.email || ''}
        />
        {this.renderPhones()}
      </section>
    );
  }

  renderPhones() {
    return this.props.member.phone.map((phone, index) => {
      return (
        <AlignedData
          key={index}
          label={
            <span>
              <Translate value="MemberView.general.phone" /> {index + 1}
            </span>
          }
          value={phone.toString()}
        />
      );
    });
  }

  renderStats() {
    return (
      <section>
        <h4>
          <Translate value="MemberView.stats.title" />
        </h4>
        <ProfileStats copies={this.props.member.account.copies}/>
      </section>
    );
  }

  render() {
    return (
      <Row>
        <Col md={10}>
          <Panel
            header={I18n.t('MemberView.title')}
            bsStyle={this.props.member.account.isActive ? 'default' : 'danger'}
          >
            {this.renderAlert()}
            <h3>
              {this.props.member.name}
            </h3>
            <Row>
              <Col sm={12} md={6} style={border}>{this.renderGeneralInformation()}</Col>
              <Col sm={12} md={6}>{this.renderAccountState()}</Col>
            </Row>
            <hr/>
            <Row>
              <Col sm={12} md={6} style={border}>{this.renderStats()}</Col>
              <Col sm={12} md={6}>
                <MemberCommentsContainer
                  member={this.props.member.no}
                  comments={this.props.member.account.comment}
                />
              </Col>
            </Row>
            <hr/>
            <Row>
              <Col md={12}>
                <CopyTableContainer
                  member={this.props.member.no}
                  copies={this.props.member.account.copies.filter(copy => !copy.isDonated)}
                />
              </Col>
            </Row>
          </Panel>
        </Col>
        <Col md={2}>
          <ActionPanel actions={this.props.actions} />
        </Col>
        {this.props.modal}
      </Row>
    );
  }
}

MemberView.propTypes = {
  actions: React.PropTypes.array,
  member: React.PropTypes.shape(),
  modal: React.PropTypes.shape(),
};
