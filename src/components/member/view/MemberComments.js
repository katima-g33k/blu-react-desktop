import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Col, Row } from 'react-bootstrap';
import moment from 'moment';

import Button from '../../general/Button';
import { ConfirmModal, InputModal } from '../../general/modals';
import I18n from '../../../lib/i18n';
import TableLayout from '../../general/TableLayout';

export default class MemberComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeComment: null,
      showModal: null,
    };
  }

  static propTypes = {
    comments: PropTypes.array.isRequired,
    delete: PropTypes.func.isRequired,
    insert: PropTypes.func.isRequired,
    no: PropTypes.number.isRequired,
    update: PropTypes.func.isRequired,
  }

  get actions() {
    return [{
      name: 'add',
      bsStyle: 'success',
      icon: 'plus',
      label: 'Ajouter',
      onClick: this.handleNewComment,
    }];
  }

  get columns() {
    return [
      {
        dataField: 'id',
        isKey: true,
        hidden: true,
      },
      {
        dataField: 'comment',
        label: I18n('TableColumns.comment.comment'),
        tdStyle: { whiteSpace: 'normal' },
      },
      {
        dataField: 'updatedAt',
        label: I18n('TableColumns.comment.date'),
        dataFormat: date => moment(date).format('LL'),
        width: '130px',
      },
      {
        dataField: 'action',
        label: 'Actions',
        dataAlign: 'center',
        width: '100px',
        dataFormat: this.renderRowActions,
      },
    ];
  }

  resetState = () => this.setState({
    activeComment: null,
    showModal: null,
  });

  handleCancel = () => {
    this.resetState();
  }

  handleButtonClick = (actionData) => {
    this.setState(actionData);
  }

  handleNewComment = () => {
    this.setState({ showModal: 'input' });
  }

  handleDelete = () => {
    this.props.delete(this.state.activeComment);
    this.resetState();
  }

  handleSave = (event, comment) => {
    if (this.state.activeComment) {
      this.props.update(this.state.activeComment.id, comment);
    } else {
      this.props.insert(this.props.no, comment);
    }

    this.resetState();
  };

  renderModal = () => {
    const { activeComment, showModal } = this.state;

    switch (showModal) {
      case 'input':
        return (
          <InputModal
            message="Entrer le commentaire"
            title={activeComment ? 'Modifier un commentaire' : 'Ajouter un commentaire'}
            textarea
            value={activeComment ? activeComment.comment : ''}
            onSave={this.handleSave}
            onCancel={this.handleCancel}
          />
        );
      case 'confirm':
        return (
          <ConfirmModal
            message={`Souhaitez-vous vraiment supprimer ce commentaire : "${activeComment.comment}"`}
            title="Supprimer un commentaire"
            onConfirm={this.handleDelete}
            onCancel={this.handleCancel}
            confirmationStyle="danger"
          />
        );
      default:
        return null;
    }
  }

  renderRowActions = (actions, activeComment) => (
    <ButtonGroup>
      <Button
        actionData={{ activeComment, showModal: 'input' }}
        glyph="pencil"
        onClick={this.handleButtonClick}
      />
      <Button
        actionData={{ activeComment, showModal: 'confirm' }}
        bsStyle="danger"
        glyph="trash"
        onClick={this.handleButtonClick}
      />
    </ButtonGroup>
  )

  render() {
    return (
      <Row>
        <Col>
          <TableLayout
            actions={this.actions}
            columns={this.columns}
            data={this.props.comments}
            placeholder={I18n('MemberView.comment.none')}
            title={I18n('MemberView.comment.title')}
          />
        </Col>
        {this.renderModal()}
      </Row>
    );
  }
}
