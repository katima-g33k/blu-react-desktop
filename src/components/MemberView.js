import React, { Component } from 'react';
import { Col, Label, Panel, Row } from 'react-bootstrap';
import { I18n, Translate } from 'react-i18nify';

import moment from 'moment';

import ActionPanel from './ActionPanel';
import AlignedData from './AlignedData';
import ConfirmModal from './modals/ConfirmModal';
import CopyTable from './CopyTable';
import HTTP from '../lib/HTTP';
import Member from '../lib/models/Member';
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
      showModal: null,
    };

    this.printReceipt = this.printReceipt.bind(this);
    this.rendeGeneralInformation = this.rendeGeneralInformation.bind(this);
    this.renderPhones = this.renderPhones.bind(this);
    this.renderAccountState = this.renderAccountState.bind(this);
    this.renderStats = this.renderStats.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  componentWillMount() {
    const url = `${settings.apiUrl}/member/select`;
    const data = {
      no: this.props.params.no,
    };

    HTTP.post(url, data, (err, res) => {
      if (res) {
        this.setState({ member: new Member(res) });
      }
    });
  }

  printReceipt() {
    this.setState({ showModal: null });
  }

  renderPhones() {
    return this.state.member.phone.map((phone, index) => {
      const label = (
        <span>
          <Translate value="MemberView.general.phone" /> {index + 1}
        </span>
      );

      return (
        <AlignedData
          key={index}
          label={label}
          value={phone.toString()}
        />
      );
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
        <AlignedData label={<Translate value="MemberView.general.address" />} value={member.addressString} />
        <AlignedData label={<Translate value="MemberView.general.email" />} value={member.email || ''} />
        {this.renderPhones()}
      </section>
    );
  }

  renderAccountState() {
    const account = this.state.member.account;
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
        href: `/member/edit/${this.state.member.no}`,
        style: 'primary',
      },
      {
        label: 'Ajouter des livres',
        href: `/member/copies/${this.state.member.no}`,
        style: 'primary',
      },
      {
        label: 'Renouveler le compte',
        style: 'primary',
        onClick: (event) => {
          event.preventDefault();

          const member = this.state.member;
          const data = { no: member.no };

          HTTP.post(`${settings.apiUrl}/member/renew`, data, (err) => {
            if (err) {
              // TODO: display error message
              return;
            }

            member.account.last_activity = moment();
            this.setState({ member });
          });
        },
      },
      {
        label: 'Remettre l\'argent',
        style: 'primary',
        onClick: (event) => {
          // TODO: Display confirmation and Ask for receipt
          event.preventDefault();

          const member = this.state.member;
          const data = { no: member.no };

          HTTP.post(`${settings.apiUrl}/member/renew`, data, (err) => {
            if (err) {
              // TODO: display error message
              return;
            }

            member.account.copies.forEach((copy) => {
              copy.transaction.forEach((transaction) => {
                if (transaction.code === 'SELL' || transaction.code === 'SELL_PARENT') {
                  copy.transaction.push({ code: 'PAY', date: moment().format() });
                }
              });
            });

            this.setState({ member, showModal: 'paySuccessfull' });
          });
        },
      },
    ];

    return (<ActionPanel actions={actions} />);
  }

  render() {
    return this.state.member ? (
      <Row>
        <Col md={10}>
          <Panel
            header={I18n.t('MemberView.title')}
            bsStyle={this.state.member.account.isActive ? 'default' : 'danger'}
          >
            <h3>
              {this.state.member.name}
            </h3>
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
        {this.state.showModal === 'paySuccessfull' ? (
          <ConfirmModal
            cancelText="Non"
            confirmText="Oui"
            message="Le remboursement a été complété, souhaitez-vous imprimer un reçu ?"
            onCancel={() => this.setState({ showModal: null })}
            onConfirm={() => this.printReceipt}
            title="Remboursement réussi"
          />
        ) : null}
      </Row>
    ) : null;
  }
}

MemberView.propTypes = {
  params: React.PropTypes.shape(),
};
