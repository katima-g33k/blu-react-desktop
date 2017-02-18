import React, { Component } from 'react';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

import { CommentColumns } from '../../../lib/TableColumns';
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
    this.saveComment = this.saveComment.bind(this);
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

  saveComment(event, value) {
    event.preventDefault();
    const isUpdate = !!this.state.activeComment;
    const url = `${settings.apiUrl}/comment/${isUpdate ? 'update' : 'insert'}`;
    const data = { comment: value };

    if (isUpdate) {
      data.id = this.state.activeComment.id;
    } else {
      data.member = this.props.member;
    }

    HTTP.post(url, data, (err, res) => {
      let comments = this.state.comments || [];

      if (isUpdate) {
        comments = comments.map((comment) => {
          if (comment.id === this.state.activeComment.id) {
            return { ...comment, comment: value };
          }
          return comment;
        });
      } else {
        comments.push({
          id: res.id,
          updated_at: new Date(),
          comment: value,
        });
      }

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
