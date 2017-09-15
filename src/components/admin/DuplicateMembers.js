import React, { Component, PropTypes } from 'react';
import { Button, Col, Glyphicon, Panel, Row } from 'react-bootstrap';
import moment from 'moment';

import API from '../../lib/API';
import { ConfirmModal, FormModal, InformationModal } from '../general/modals';
import I18n from '../../lib/i18n/i18n';
import TableLayout from '../general/TableLayout';

class Cell extends Component {
  static propTypes = {
    email: PropTypes.string,
    isOriginal: PropTypes.bool,
    onNameClick: PropTypes.func,
    onOriginalClick: PropTypes.func,
    lastActivity: PropTypes.string,
    name: PropTypes.string,
    no: PropTypes.number,
    registration: PropTypes.string,
  }

  handleNameClick = () => this.props.onNameClick(this.props.no)

  handleOriginalClick = () => {
    this.props.onOriginalClick()
  }

  render() {
    const {
      email,
      lastActivity,
      name,
      no,
      registration,
      isOriginal,
    } = this.props;

    return (
      <Row>
        <Col md={12}>
          <Row>
            <Col md={12}>
              <Button
                bsStyle="link"
                onClick={this.onNameClick}
              >
                {name}
              </Button>
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
          {!isOriginal && (
            <Row>
              <Col md={12}>
                <Button
                  bsStyle="primary"
                  onClick={this.handleOriginalClick}
                >
                  {'Marquer comme original'}
                </Button>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    );
  }
}

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

  openMemberModal = (no) => {
    this.setState({ showModal: 'member', currentMember: no });
  }

  setAsOriginal = () => {}

  handleMerge = (members) => {
    const no = (members.find(({ isOriginal }) => isOriginal) || {}).no;
    const duplicate = (members.find(({ isOriginal }) => !isOriginal) || {}).no;

    console.log(no, duplicate);
    if (!no || !duplicate) {
      return;
    }

    // API.member.merge({ no, duplicate }, (error) => {
    //   if (error) {
    //     this.setState({ error });
    //     return;
    //   }

    //   const { duplicates } = this.state;
    //   this.setState({
    //     duplicates: duplicates.filter(d => d !== members),
    //   });
    // });
  }

  getColumns = () => ([
    {
      isKey: true,
      dataField: 'member1',
      label: 'Membre 1',
      dataFormat: (_, row) => (
        <Cell
          {...row[0]}
          onNameClick={this.openMemberModal}
          onOriginalClick={this.setAsOriginal}
        />
      ),
    },
    {
      dataField: 'member2',
      label: 'Membre 2',
      dataFormat: (_, row) => (<Cell {...row[1]} />),
    },
    {
      dataField: 'actions',
      label: 'Actions',
      width: '120px',
      dataFormat: (field, row) => (
        <Button
          bsStyle='danger'
          onClick={() => this.handleMerge(row)}
        >
          <Glyphicon glyph="duplicate" /> {'Fusionner'}
        </Button>
      ),
    },
  ])

  renderModal = () => {
    const { error, showModal } = this.state;

    if (error) {
      return null;
    }

    switch (showModal) {
      case 'member':
      default:
        return null;
    }
  }

  render() {
    return (
      <Panel header={I18n.t('Admin.duplicates.title')}>
        <Row>
          <Col sm={12} md={6}>
            <TableLayout
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