import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Col,
  Label,
  Panel,
  Row,
} from 'react-bootstrap';

import { AlignedData, Spinner } from '../../general';
import CopyTable from './MemberCopyTable';
import { formatLongDate } from '../../../lib/dateHelper';
import i18n from '../../../lib/i18n';
import { Member } from '../../../lib/models';
import MemberActionPanel from '../../../containers/MemberActionPanelContainer';
import MemberComments from '../../../containers/MemberCommentContainer';
import MemberReceipt from '../receipt/MemberReceipt';
import ParentLogo from './ParentLogo';
import ProfileStats from '../../../containers/ProfileStatsContainer';

const { Body, Heading, Title } = Panel;
const styles = {
  alert: {
    marginBottom: 0,
  },
  border: {
    borderRight: '1px #E0E0E0 solid',
  },
};

export default class MemberView extends Component {
  static propTypes = {
    amount: PropTypes.number,
    fetch: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    member: PropTypes.instanceOf(Member).isRequired,
    isPrinting: PropTypes.bool,
    onAfterPrint: PropTypes.func.isRequired,
  };

  static defaultProps = {
    amount: 0,
    isLoading: false,
    isPrinting: false,
  };

  componentDidMount() {
    this.props.fetch();
  }

  renderParentLogo = () => this.props.member.isParent && (<ParentLogo />);

  renderAccountState = () => {
    const { account } = this.props.member;
    return (
      <section>
        <h4>{i18n('MemberView.account.title')}</h4>
        <AlignedData
          label={i18n('MemberView.account.activation')}
          value={(
            <Label bsStyle={account.isActive ? 'success' : 'danger'}>
              {i18n(`MemberView.account.${account.isActive ? 'active' : 'deactivated'}`)}
            </Label>
          )}
        />
        <AlignedData
          label={i18n('MemberView.account.registration')}
          value={formatLongDate(account.registration)}
        />
        <AlignedData
          label={i18n('MemberView.account.lastActivity')}
          value={formatLongDate(account.lastActivity)}
        />
        <AlignedData
          label={i18n('MemberView.account.deactivation')}
          value={formatLongDate(account.deactivationDate)}
        />
      </section>
    );
  };

  renderAlert = () => {
    const { transfers } = this.props.member.account;
    const dates = transfers.map(date => formatLongDate(date)).join(', ');

    if (transfers.length) {
      return (
        <Alert bsStyle="warning" style={styles.alert}>
          {i18n('MemberView.transferAlert', { dates })}
        </Alert>
      );
    }

    return null;
  };

  renderPhone = (phone, index) => {
    if (phone.id) {
      return (
        <AlignedData
          key={`phone-${phone.id}`}
          label={i18n('MemberView.general.phone', { index: index + 1 })}
          value={phone.toString()}
        />
      );
    }

    return null;
  };

  renderPhones = () => this.props.member.phone.map(this.renderPhone);

  renderGeneralInformation = () => (
    <section>
      <h4>{i18n('MemberView.general.title')}</h4>
      <AlignedData
        label={i18n('MemberView.general.no')}
        value={`${this.props.member.no}`}
      />
      <AlignedData
        label={i18n('MemberView.general.address')}
        value={this.props.member.addressString}
      />
      <AlignedData
        label={i18n('MemberView.general.email')}
        value={this.props.member.email}
      />
      {this.renderPhones()}
    </section>
  );

  renderStats = () => (
    <section>
      <h4>{i18n('MemberView.stats.title')}</h4>
      <ProfileStats />
    </section>
  );

  renderReceipt = () => {
    if (this.props.isPrinting) {
      return (
        <Col md={12}>
          <MemberReceipt
            amount={this.props.amount}
            member={this.props.member}
            onAfterPrint={this.props.onAfterPrint}
          />
        </Col>
      );
    }

    return null;
  };

  render() {
    const {
      isLoading,
      member: {
        account: { isActive },
        name,
      },
    } = this.props;

    return !isLoading ? (
      <Row>
        <Col md={10}>
          <Panel bsStyle={isActive ? 'default' : 'danger'}>
            <Heading>
              <Title>
                {i18n('MemberView.title')}
              </Title>
            </Heading>
            {this.renderAlert()}
            <Body>
              <h3>{name} {this.renderParentLogo()}</h3>
              <Row>
                <Col sm={12} md={6} style={styles.border}>{this.renderGeneralInformation()}</Col>
                <Col sm={12} md={6}>{this.renderAccountState()}</Col>
              </Row>
              <hr />
              <Row>
                <Col sm={12} md={6} style={styles.border}>{this.renderStats()}</Col>
                <Col sm={12} md={6}>
                  <MemberComments />
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={12}>
                  <CopyTable />
                </Col>
              </Row>
            </Body>
          </Panel>
        </Col>
        <Col md={2}>
          <MemberActionPanel />
        </Col>
        {this.renderReceipt()}
      </Row>
    ) : (<Spinner />);
  }
}
