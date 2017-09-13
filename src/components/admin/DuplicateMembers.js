import React, { Component, PropTypes } from 'react';
import { Col, Panel, Row } from 'react-bootstrap';
import moment from 'moment';

import API from '../../lib/API';
import { ConfirmModal, FormModal, InformationModal } from '../general/modals';
import I18n from '../../lib/i18n/i18n';
import TableLayout from '../general/TableLayout';

const Cell = ({ email, lastActivity, name, no, registration }) => (
  <Row>
    <Col md={12}>
      <Row>
        <Col md={12}>
          {name}
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {no}
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {email}
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {`Inscription: ${moment(registration).format('YYYY-MM-DD')}`}
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {`Dernière activité: ${moment(lastActivity).format('YYYY-MM-DD')}`}
        </Col>
      </Row>
    </Col>
  </Row>
);

Cell.propTypes = {
  email: PropTypes.string,
  lastActivity: PropTypes.string,
  name: PropTypes.string,
  no: PropTypes.number,
  registration: PropTypes.string,
};

const columns = [
  {
    isKey: true,
    dataField: 'member1',
    label: 'Membre 1',
    dataFormat: (_, row) => (<Cell {...row[0]} />),
  },
  {
    dataField: 'member2',
    label: 'Membre 2',
    dataFormat: (_, row) => (<Cell {...row[1]} />),
  },
];

export default class DuplicateMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duplicates: [],
    };
  }

  componentWillMount() {
    API.member.duplicates((error, res) => {
      if (error) {
        this.setState({ error });
        return;
      }

      const duplicates = res.reduce((acc, cur) => {
        const duplicate = acc.find(({ email, no }) =>
          email === cur.email || `${no}`.includes(cur.no) || `${cur.no}`.includes(no)
        );

        if (duplicate) {
          duplicate.members.push(cur);
        } else {
          acc.push({
            no: cur.no,
            email: cur.email,
            members: [cur],
          });
        }

        return acc;
      }, []).filter(({ members }) => members.length > 1).map(({ members }) => members);

      this.setState({ duplicates });
    });
  }

  getColumns = () => {
    return columns;
  }

  getTableActions = () => {
    return [];
  }

  renderModal = () => {
    return null;
  }

  render() {
    return (
      <Panel header={I18n.t('Admin.duplicates.title')}>
        <Row>
          <Col sm={12} md={6}>
            <TableLayout
              actions={this.getTableActions()}
              columns={this.getColumns()}
              data={this.state.duplicates}
              placeholder={'Aucun duplicat détecté'}
              title={'Liste des comptes de membre dupliqués'}
            />
          </Col>
        </Row>
        {this.renderModal()}
      </Panel>
    );
  }
}
