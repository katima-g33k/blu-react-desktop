import React, { Component } from 'react';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

import CommentColumns from './CommentColumns';
import { ConfirmModal, InputModal } from '../../general/modals';
import MemberComments from './MemberComments';
import HTTP from '../../../lib/HTTP';
import settings from '../../../settings.json';

export default class MemberCommentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: props.comments || [],
      activeComment: null,
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
        width: '100',
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
    const id = this.state.activeComment.id;

    HTTP.post(`${settings.apiUrl}/comment/delete`, { id }, () => {
      const comments = this.state.comments.filter((comment) => {
        return comment.id !== id;
      });

      this.setState({
        comments,
        showModal: null,
        activeComment: null,
      });
    });
  }

  insertComment(value) {
    const url = `${settings.apiUrl}/comment/insert`;
    const data = {
      comment: value,
      member: this.props.member,
    };

    HTTP.post(url, data, (err, res) => {
      if (err) {
        // TODO: display error message
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
        showModal: false,
      });
    });
  }

  saveComment(event, value) {
    event.preventDefault();
    const isUpdate = !!this.state.activeComment;
    return isUpdate ? this.updateComment(value) : this.insertComment(value);
  }

  updateComment(value) {
    const url = `${settings.apiUrl}/comment/update`;
    const data = {
      comment: value,
      id: this.state.activeComment.id,
    };

    HTTP.post(url, data, (err) => {
      if (err) {
        // TODO: display error message
        return;
      }

      const comments = this.state.comments;
      const currentComment = comments.find(comment => comment.id === this.state.activeComment.id);
      currentComment.comment = value;
      currentComment.updatedAt = new Date();

      this.setState({
        comments,
        activeComment: null,
        showModal: false,
      });
    });
  }

  getModal() {
    switch (this.state.showModal) {
      case 'input':
        return (
          <InputModal
            message="Entrer le commentaire"
            title={this.state.activeComment ? 'Modifier un commentaire' : 'Ajouter un commentaire'}
            textarea
            value={this.state.activeComment ? this.state.activeComment.comment : ''}
            onSave={this.saveComment}
            onCancel={() => this.setState({ activeComment: null, showModal: null })}
          />
        );
      case 'confirm':
        return (
          <ConfirmModal
            message={`Souhaitez-vous vraiment supprimer ce commentaire : "${this.state.activeComment.comment}"`}
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
