import React, { Component, PropTypes } from 'react';
import { Col, Panel, Row } from 'react-bootstrap';

import DuplicateMemberCell from './DuplicateMemberCell';
import I18n from '../../lib/i18n/i18n';
import TableLayout from '../general/TableLayout';

export default class DuplicateMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duplicates: [],
    };
  }

  static propTypes = {
    api: PropTypes.shape(),
  }

  async componentWillMount() {
    try {
      const res = await this.props.api.member.duplicates.list();
      const duplicates = res.reduce((acc, cur) => {
        const duplicate = acc.find(({ email, no }) =>
          email === cur.email || `${no}`.includes(cur.no) || `${cur.no}`.includes(no),
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
    } catch (error) {
      this.setState({ error });
    }
  }

  openMemberModal = (no) => {
    this.setState({ showModal: 'member', currentMember: no });
  }

  setAsOriginal = () => {}

  handleMerge = async (members) => {
    const no = (members.find(({ isOriginal }) => isOriginal) || {}).no;
    const duplicate = (members.find(({ isOriginal }) => !isOriginal) || {}).no;

    if (!no || !duplicate) {
      return;
    }

    try {
      await this.props.api.member.duplicates.merge(duplicate, no);
      const { duplicates } = this.state;
      this.setState({
        duplicates: duplicates.filter(d => d !== members),
      });
    } catch (error) {
      this.setState({ error });
    }
  }

  getColumns = () => ([
    {
      isKey: true,
      dataField: 'member1',
      label: 'Membre 1',
      dataFormat: (_, row) => (
        <DuplicateMemberCell
          {...row[0]}
          onNameClick={this.openMemberModal}
          onOriginalClick={this.setAsOriginal}
        />
      ),
    },
    {
      dataField: 'member2',
      label: 'Membre 2',
      dataFormat: (_, row) => (<DuplicateMemberCell {...row[1]} />),
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
