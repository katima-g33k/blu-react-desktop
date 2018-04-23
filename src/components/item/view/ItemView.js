import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Label, Panel, Row } from 'react-bootstrap';

import ActionPanel from '../../general/ActionPanel';
import AlignedData from '../../general/AlignedData';
import CopyTable from './ItemCopyTable';
import I18n from '../../../lib/i18n';
import { INFORMATION_FIELDS, LABEL_STYLE, PANEL_STYLE } from './constant';
import ProfileStats from '../../general/ProfileStats';
import Reservation from '../../../lib/models/Reservation';
import ReservationList from './ReservationList';
import { Item } from '../../../lib/models';
import Spinner from '../../general/Spinner';

const border = {
  borderRight: '1px #e0e0e0 solid',
};

export default class ItemView extends Component {
  static propTypes = {
    fetch: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    item: PropTypes.instanceOf(Item).isRequired,
    // onReservationDeleted: PropTypes.func,
  };

  static defaultProps = {
    isLoading: false,
  }

  componentDidMount() {
    this.props.fetch();
  }


  getReservations = () => {
    const { copies, reservation } = this.props.item;
    const reservedCopies = copies.filter(copy => copy.isReserved);
    const copyReservations = reservedCopies.map(copy => new Reservation({ copy }));

    return reservation.concat(copyReservations);
  }

  renderInformation = () => {
    const type = this.props.item.isBook ? 'book' : 'item';
    return (
      <section>
        <h4>{I18n('ItemView.information.title')}</h4>
        {Object.keys(INFORMATION_FIELDS[type]).map((key) => {
          const { item } = this.props;
          const value = item[INFORMATION_FIELDS[type][key]] ? `${item[INFORMATION_FIELDS[type][key]]}` : '';

          return (
            <AlignedData
              key={key}
              label={I18n(`ItemView.information.${key}`)}
              value={value}
            />
          );
        })}
      </section>
    );
  }

  renderInternalManagement = () => {
    const { item } = this.props;
    const status = item.getStatus().toLowerCase();
    return (
      <section>
        <h4>{I18n('ItemView.internalManagement.title')}</h4>
        <AlignedData
          label={I18n('ItemView.internalManagement.status')}
          value={
            <Label bsStyle={LABEL_STYLE[status]}>
              {I18n(`ItemView.internalManagement.${status}`)}
            </Label>
          }
        />
        <AlignedData
          label={I18n('ItemView.internalManagement.category')}
          value={item.subject.category.name}
        />
        <AlignedData
          label={I18n('ItemView.internalManagement.subject')}
          value={item.subject.name}
        />
        <AlignedData
          label={I18n('ItemView.internalManagement.storage')}
          value={item.storageString}
        />
      </section>
    );
  }

  renderReservations = () => {
    if (this.props.item.reservation.length) {
      return (
        <ReservationList
          {...this.props}
          api={{}}
          onReservationDeleted={() => {}}
          reservations={this.getReservations()}
        />
      );
    }

    return null;
  }

  render() {
    const { isLoading, item } = this.props;

    return !isLoading && item.id ? (
      <Row>
        <Col md={10}>
          <Panel
            header={I18n('ItemView.title')}
            bsStyle={PANEL_STYLE[item.getStatus()]}
          >
            <h3>{item.name}</h3>
            <Row>
              <Col sm={12} md={6} style={border}>
                {this.renderInformation()}
                <hr />
                {this.renderInternalManagement()}
              </Col>
              <Col sm={12} md={6}>
                <h4>{I18n('ItemView.stats.title')}</h4>
                <ProfileStats copies={item.copies} priceStats />
              </Col>
            </Row>
            {this.renderReservations()}
            <CopyTable />
          </Panel>
        </Col>
        <Col md={2}>
          <ActionPanel actions={[]} />
        </Col>
      </Row>
    ) : (<Spinner />);
  }
}
