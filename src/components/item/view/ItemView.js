import React, { Component } from 'react';
import { Col, Label, Panel, Row } from 'react-bootstrap';

import ActionPanel from '../../general/ActionPanel';
import AlignedData from '../../general/AlignedData';
import CopyTableContainer from '../../copy/table/CopyTableContainer';
import I18n, { Translate } from '../../../lib/i18n/i18n';
import { INFORMATION_FIELDS, LABEL_STYLE, PANEL_STYLE } from './constant';
import ProfileStats from '../../general/ProfileStats';
import Reservation from '../../../lib/models/Reservation';
import ReservationList from './ReservationList';

const border = {
  borderRight: '1px #e0e0e0 solid',
};

export default class ItemView extends Component {
  constructor(props) {
    super(props);
    this.getReservations = this.getReservations.bind(this);
    this.renderInformation = this.renderInformation.bind(this);
    this.renderInternalManagement = this.renderInternalManagement.bind(this);
  }

  getReservations() {
    const { copies, reservation } = this.props.data;
    const reservedCopies = copies.filter(copy => copy.isReserved);
    const copyReservations = reservedCopies.map(copy => new Reservation({ copy }));

    return reservation.concat(copyReservations);
  }

  renderInformation() {
    return (
      <section>
        <h4>
          <Translate value="ItemView.information.title" />
        </h4>
        {Object.keys(INFORMATION_FIELDS).map(key => (
          <AlignedData
            key={key}
            label={<Translate value={`ItemView.information.${key}`} />}
            value={this.props.data[INFORMATION_FIELDS[key]] || ''}
          />
        ))}
      </section>
    );
  }

  renderInternalManagement() {
    const status = this.props.data.getStatus().toLowerCase();
    return (
      <section>
        <h4>
          <Translate value="ItemView.internalManagement.title" />
        </h4>
        <AlignedData
          label={<Translate value="ItemView.internalManagement.status" />}
          value={
            <Label bsStyle={LABEL_STYLE[status]}>
              <Translate value={`ItemView.internalManagement.${status}`} />
            </Label>
          }
        />
        <AlignedData
          label={<Translate value="ItemView.internalManagement.category" />}
          value={this.props.data.subject.category.name}
        />
        <AlignedData
          label={<Translate value="ItemView.internalManagement.subject" />}
          value={this.props.data.subject.name}
        />
        <AlignedData
          label={<Translate value="ItemView.internalManagement.storage" />}
          value={this.props.data.storageString}
        />
      </section>
    );
  }

  render() {
    const { actions, data, modal, onReservationDeleted } = this.props;

    return (
      <Row>
        <Col md={10}>
          <Panel
            header={I18n.t('ItemView.title')}
            bsStyle={PANEL_STYLE[data.getStatus()]}
          >
            <h3>{data.name}</h3>
            <Row>
              <Col sm={12} md={6} style={border}>
                {this.renderInformation()}
                <hr/>
                {this.renderInternalManagement()}
              </Col>
              <Col sm={12} md={6}>
                <h4>
                  <Translate value="ItemView.stats.title" />
                </h4>
                <ProfileStats copies={data.copies}/>
              </Col>
            </Row>
            {data.reservation.length > 0 && (
              <ReservationList
                onReservationDeleted={onReservationDeleted}
                reservations={this.getReservations()}
              />
            )}
            <CopyTableContainer copies={data.copies} />
          </Panel>
        </Col>
        <Col md={2}>
          <ActionPanel actions={actions} />
        </Col>
        {modal}
      </Row>
    );
  }
}

ItemView.propTypes = {
  actions: React.PropTypes.array,
  data: React.PropTypes.shape(),
  modal: React.PropTypes.shape(),
  onReservationDeleted: React.PropTypes.func,
};
