import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Label,
  Panel,
  Row,
} from 'react-bootstrap';

import ActionPanel from '../../../containers/ItemActionPanelContainer';
import AlignedData from '../../general/AlignedData';
import CopyTable from './ItemCopyTable';
import i18n from '../../../lib/i18n';
import { INFORMATION_FIELDS, LABEL_STYLE, PANEL_STYLE } from './constant';
import ProfileStats from '../../../containers/ProfileStatsContainer';
import ReservationList from '../../../containers/ReservationListContainer';
import { Item } from '../../../lib/models';
import Spinner from '../../general/Spinner';

const { Body, Heading } = Panel;

const border = {
  borderRight: '1px #E0E0E0 solid',
};

export default class ItemView extends Component {
  static propTypes = {
    fetch: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    item: PropTypes.instanceOf(Item).isRequired,
  };

  static defaultProps = {
    isLoading: false,
  };

  componentDidMount() {
    this.props.fetch();
  }

  getReservations = () => [
    ...this.props.item.reservation,
    // TODO: Uncomment when copy reservations are fixed
    // ...this.props.item.copies.reduce((reservedCopies, copy) => (copy.isReserved ? [
    //   ...reservedCopies,
    //   new Reservation(copy),
    // ] : reservedCopies), []),
  ];

  renderInformationBlock = (key) => {
    const { item } = this.props;
    const { type } = item;
    const value = item[INFORMATION_FIELDS[type][key]] ? `${item[INFORMATION_FIELDS[type][key]]}` : '';

    return (
      <AlignedData
        key={key}
        label={i18n(`ItemView.information.${key}`)}
        value={value}
      />
    );
  };

  renderInformation = () => {
    const { type } = this.props.item;
    return (
      <section>
        <h4>{i18n('ItemView.information.title')}</h4>
        {Object.keys(INFORMATION_FIELDS[type]).map(this.renderInformationBlock)}
      </section>
    );
  };

  renderInternalManagement = () => {
    const { item } = this.props;
    const status = item.getStatus().toLowerCase();
    return (
      <section>
        <h4>{i18n('ItemView.internalManagement.title')}</h4>
        <AlignedData
          label={i18n('ItemView.internalManagement.status')}
          value={(
            <Label bsStyle={LABEL_STYLE[status]}>
              {i18n(`ItemView.internalManagement.${status}`)}
            </Label>
          )}
        />
        <AlignedData
          label={i18n('ItemView.internalManagement.category')}
          value={item.subject.category.name}
        />
        <AlignedData
          label={i18n('ItemView.internalManagement.subject')}
          value={item.subject.name}
        />
        <AlignedData
          label={i18n('ItemView.internalManagement.storage')}
          value={item.storageString}
        />
      </section>
    );
  };

  renderReservations = () => {
    const reservations = this.getReservations();

    if (reservations.length) {
      return (
        <ReservationList reservations={reservations} />
      );
    }

    return null;
  };

  render() {
    const { isLoading, item } = this.props;

    return !isLoading && item.id ? (
      <Row>
        <Col md={10}>
          <Panel bsStyle={PANEL_STYLE[item.getStatus()]}>
            <Heading>
              {i18n('ItemView.title')}
            </Heading>
            <Body>
              <h3>{item.name}</h3>
              <Row>
                <Col sm={12} md={6} style={border}>
                  {this.renderInformation()}
                  <hr />
                  {this.renderInternalManagement()}
                </Col>
                <Col sm={12} md={6}>
                  <h4>{i18n('ItemView.stats.title')}</h4>
                  <ProfileStats priceStats />
                </Col>
              </Row>
              {this.renderReservations()}
              <CopyTable />
            </Body>
          </Panel>
        </Col>
        <Col md={2}>
          <ActionPanel />
        </Col>
      </Row>
    ) : (<Spinner />);
  }
}
