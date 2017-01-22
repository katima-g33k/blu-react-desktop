import React, { Component } from 'react';
import { Col, Label, Panel, Row } from 'react-bootstrap';
import { I18n, Translate } from 'react-i18nify';

import moment from 'moment';

import ActionPanel from './ActionPanel';
import AlignedData from './AlignedData';
import CopyTable from './CopyTable';
import HTTP from '../lib/HTTP';
import MemberComments from './MemberComments';
import ProfileStats from './ProfileStats';
import settings from '../settings.json';

const formatDate = (date) => {
  return date ? moment(new Date(date)).format('LL') : '';
};

const border = {
  borderRight: '1px #e0e0e0 solid',
};


export default class MemberView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      member: null,
    };
    this.isActive = this.isActive.bind(this);
    this.rendeGeneralInformation = this.rendeGeneralInformation.bind(this);
    this.renderAddress = this.renderAddress.bind(this);
    this.renderPhones = this.renderPhones.bind(this);
    this.renderAccountState = this.renderAccountState.bind(this);
    this.getDeactivationDate = this.getDeactivationDate.bind(this);
    this.renderStats = this.renderStats.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  componentWillMount() {
    const url = `${settings.apiUrl}/member/select`;
    const data = {
      no: this.props.params.no,
    };

    HTTP.post(url, data, (err, member) => {
      if (member) {
        this.setState({ member });
      }
    });
  }

  isActive() {
    const account = this.state.member.account;
    const limit = moment().subtract(1, 'years');
    return !account || limit.isSameOrBefore(account.last_activity);
  }

  getDeactivationDate(lastActivity) {
    return lastActivity ? formatDate(moment(lastActivity).add(1, 'year')) : '';
  }

  renderAddress() {
    const member = this.state.member;
    const street = member.address;
    const zip = (member.zip || '').replace(/(.{3})(.{3})/, '$1 $2');
    const city = member.city ? member.city.name : '';
    const state = member.city && member.city.state ? member.city.state.code : '';
    const address = street ? `${street}, ${city} (${state}) ${zip}` : '';

    return (
      <AlignedData
        label={<Translate value="MemberView.general.address" />}
        value={address} />
    );
  }

  renderPhones() {
    const member = this.state.member;
    const phones = member.phone || [];

    return phones.map((phone, index) => {
      const number = phone.number.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      const note = phone.note ? `(${phone.note})` : '';
      const label = (
        <span>
          <Translate value="MemberView.general.phone" /> {index + 1}
        </span>
      );

      return (<AlignedData key={index} label={label} value={`${number} ${note}`} />);
    });
  }

  rendeGeneralInformation() {
    const member = this.state.member;
    return (
      <section>
        <h4>
          <Translate value="MemberView.general.title" />
        </h4>
        <AlignedData label={<Translate value="MemberView.general.no" />} value={member.no || ''} />
        {this.renderAddress()}
        <AlignedData label={<Translate value="MemberView.general.email" />} value={member.email || ''} />
        {this.renderPhones()}
      </section>
    );
  }

  renderAccountState() {
    const account = this.state.member ? this.state.member.account || {} : {};
    return (
      <section>
        <h4>
          <Translate value="MemberView.account.title" />
        </h4>
        <AlignedData
          label={<Translate value="MemberView.account.activation" />}
          value={
            <Label bsStyle={this.isActive() ? 'success' : 'danger'}>
              <Translate value={`MemberView.account.${this.isActive() ? 'active' : 'deactivated'}`} />
            </Label>
          }
        />
        <AlignedData
          label={<Translate value="MemberView.account.registration" />}
          value={formatDate(account.registration)}
        />
        <AlignedData
          label={<Translate value="MemberView.account.lastActivity" />}
          value={formatDate(account.last_activity)}
        />
        <AlignedData
          label={<Translate value="MemberView.account.registration" />}
          value={formatDate(this.getDeactivationDate(account.last_activity))}
        />
      </section>
    );
  }

  renderStats() {
    return this.state.member && this.state.member.account ? (
      <section>
        <h4>
          <Translate value="MemberView.stats.title" />
        </h4>
        <ProfileStats copies={this.state.member.account.copies}/>
      </section>
    ) : null;
  }

  renderActions() {
    const actions = [
      {
        label: 'Modifier',
        href: `/member/form/${this.state.member.no}`,
        style: 'primary',
      },
      {
        label: 'Ajouter des livres',
        onClick(event) {
          event.preventDefault();
        },
        style: 'primary',
      },
    ];

    return (<ActionPanel actions={actions} />);
  }

  render() {
    const member = this.state.member;

    return member ? (
      <Row>
        <Col md={10}>
          <Panel
            header={I18n.t('MemberView.title')}
            bsStyle={this.isActive() ? 'default' : 'danger'}
          >
            <h3>{`${member.first_name} ${member.last_name}`}</h3>
            <Row>
              <Col sm={12} md={6} style={border}>{this.rendeGeneralInformation()}</Col>
              <Col sm={12} md={6}>{this.renderAccountState()}</Col>
            </Row>
            <hr/>
            <Row>
              <Col sm={12} md={6} style={border}>{this.renderStats()}</Col>
              <Col sm={12} md={6}>
                <MemberComments
                  member={this.state.member.no}
                  comments={this.state.member.account.comment}
                />
              </Col>
            </Row>
            <hr/>
            <Row>
              <Col md={12}>
                <CopyTable
                  member={this.state.member.no}
                  copies={this.state.member.account.copies}
                />
              </Col>
            </Row>
          </Panel>
        </Col>
        <Col md={2}>{this.renderActions()}</Col>
      </Row>
    ) : null;
  }
}

MemberView.propTypes = {
  params: React.PropTypes.shape(),
};
