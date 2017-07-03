import React, { Component } from 'react';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

import API from '../../../lib/API';
import CommentColumns from './CommentColumns';
import { ConfirmModal, InformationModal, InputModal } from '../../general/modals';
import MemberComments from './MemberComments';

export default class MemberCommentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeComment: null,
      comments: props.comments || [],
      error: null,
      showModal: null,
    };

    this.columns = CommentColumns;
    this.deleteComment = this.deleteComment.bind(this);
    this.getModal = this.getModal.bind(this);
    this.insertComment = this.insertComment.bind(this);
    this.saveComment = this.saveComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
  }

  componentWillMount() {
    if (this.columns[this.columns.length - 1].dataField !== 'action') {
      this.columns.push({
        dataField: 'action',
        label: 'Actions',
        dataAlign: 'center',
        width: '100px',
        dataFormat: (cell, row) => {
          return (
            <ButtonGroup>
              <Button
                onClick={() => this.setState({ activeComment: row, showModal: 'input' })}
              >
                <Glyphicon glyph="pencil" />
              </Button>
              <Button
                bsStyle="danger"
                onClick={() => this.setState({ activeComment: row, showModal: 'confirm' })}
              >
                <Glyphicon glyph="trash" />
              </Button>
            </ButtonGroup>
          );
        },
      });
    }
  }

  deleteComment(event) {
    event.preventDefault();
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

  insertComment(value) {
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

      this.setState({
        comments,
        activeComment: null,
        showModal: null,
      });
    });
  }

  saveComment(event, value) {
    event.preventDefault();
    const isUpdate = !!this.state.activeComment;
    return isUpdate ? this.updateComment(value) : this.insertComment(value);
  }

  updateComment(value) {
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

  getModal() {
    const { activeComment, error, showModal } = this.state;

    if (error) {
      return (
        <InformationModal
          message={error.message}
          onClick={() => this.setState({ error: null })}
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
            onSave={this.saveComment}
            onCancel={() => this.setState({ activeComment: null, showModal: null })}
          />
        );
      case 'confirm':
        return (
          <ConfirmModal
            message={`Souhaitez-vous vraiment supprimer ce commentaire : "${activeComment.comment}"`}
            title="Supprimer un commentaire"
            onConfirm={this.deleteComment}
            onCancel={() => this.setState({ activeComment: null, showModal: null })}
            confirmationStyle="danger"
          />
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <MemberComments
        columns={this.columns}
        data={this.state.comments}
        modal={this.getModal()}
        onAddClick={() => this.setState({ showModal: 'input' })}
      />
    );
  }
}

MemberCommentContainer.propTypes = {
  comments: React.PropTypes.array,
  member: React.PropTypes.string,
};
