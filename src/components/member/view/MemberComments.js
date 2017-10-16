import React, { Component, PropTypes } from 'react';
import { ButtonGroup, Col, Row } from 'react-bootstrap';
import { I18n } from 'react-i18nify';

import API from '../../../lib/API';
import Button from '../../general/Button';
import CommentColumns from './CommentColumns';
import { ConfirmModal, InformationModal, InputModal } from '../../general/modals';
import TableLayout from '../../general/TableLayout';

export default class MemberComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeComment: null,
      comments: props.comments,
      error: null,
      showModal: null,
    };

    this.columns = CommentColumns.concat([{
      dataField: 'action',
      label: 'Actions',
      dataAlign: 'center',
      width: '100px',
      dataFormat: this.renderRowActions,
    }]);

    this.actions = [{
      name: 'add',
      bsStyle: 'success',
      icon: 'plus',
      label: 'Ajouter',
      onClick: this.handleNewComment,
    }];
  }

  static propTypes = {
    comments: PropTypes.array.isRequired,
    member: PropTypes.string,
  }

  static defaultProps = {
    comments: [],
  }

  componentWillReceiveProps = (nextProps) => {
    this.resetState(nextProps.comments);
  }

  resetState = (comments = this.state.comments) => {
    this.setState({
      activeComment: null,
      comments,
      error: null,
      showModal: null,
    });
  }

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
    const { id } = this.state.activeComment;

    API.comment.delete(id, (error) => {
      if (error) {
        this.setState({ error, activeComment: null, showModal: null });
        return;
      }

      this.setState({
        activeComment: null,
        comments: this.state.comments.filter(comment => comment.id !== id),
        showModal: null,
      });
    });
  }

  handleInsert = (value) => {
    API.comment.insert(this.props.member, value, (error, res) => {
      if (error) {
        this.setState({ error, activeComment: null, showModal: null });
        return;
      }

      const comments = this.state.comments || [];

      comments.push({
        id: res.id,
        updatedAt: new Date(),
        comment: value,
      });

      this.resetState(comments);
    });
  }

  handleSave = (event, value) => {
    if (this.state.activeComment) {
      return this.handleUpdate(value);
    }

    return this.handleInsert(value);
  };

  handleUpdate = (value) => {
    API.comment.update(this.state.activeComment.id, value, (error) => {
      if (error) {
        this.setState({ error, activeComment: null, showModal: null });
        return;
      }

      const comments = this.state.comments;
      const currentComment = comments.find(comment => comment.id === this.state.activeComment.id);

      currentComment.comment = value;
      currentComment.updatedAt = new Date();

      this.setState({
        comments,
        activeComment: null,
        showModal: null,
      });
    });
  }

  renderModal = () => {
    const { activeComment, error, showModal } = this.state;

    if (error) {
      return (
        <InformationModal
          message={error.message}
          onClick={this.resetState}
          title={`Erreur ${error.code}`}
        />
      );
    }

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
            data={this.state.comments}
            placeholder={I18n.t('MemberView.comment.none')}
            striped
            title={I18n.t('MemberView.comment.title')}
          />
        </Col>
        {this.renderModal()}
      </Row>
    );
  }
}
