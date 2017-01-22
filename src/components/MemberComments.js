import React, { Component } from 'react';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import { I18n, Translate } from 'react-i18nify';

import { CommentColumns } from '../lib/TableColumns';
import { ConfirmModal, InputModal } from './modals';
import HTTP from '../lib/HTTP';
import settings from '../settings.json';
import Table from './Table';

export default class MemberComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: props.comments || [],
      activeComment: null,
      showModal: null,
    };

    this.deleteComment = this.deleteComment.bind(this);
    this.saveComment = this.saveComment.bind(this);

    this.CommentColumns = CommentColumns;
    this.CommentColumns.push({
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

  render() {
    return (
      <section>
        <h4>
          <Translate value="MemberView.comment.title" />
        </h4>
        <Button
          bsStyle='success'
          onClick={() => this.setState({ showModal: 'input' })}
        >
          <Glyphicon glyph='plus' /> {'Ajouter'}
        </Button>
        <Table
          columns={CommentColumns}
          data={this.state.comments}
          placeholder={I18n.t('MemberView.comment.none')}
        />
        {this.state.showModal === 'input' ? (
          <InputModal
            message="Entrer le commentaire"
            title={this.state.activeComment ? 'Modifier un commentaire' : 'Ajouter un commentaire'}
            textarea
            value={this.state.activeComment ? this.state.activeComment.comment : ''}
            onSave={this.saveComment}
            onCancel={() => this.setState({ activeComment: null, showModal: null })}
          />
        ) : null}
        {this.state.showModal === 'confirm' ? (
          <ConfirmModal
            message={`Souhaitez-vous vraiment supprimer ce commentaire : "${this.state.activeComment.comment}"`}
            title="Supprimer un commentaire"
            onConfirm={this.deleteComment}
            onCancel={() => this.setState({ activeComment: null, showModal: null })}
            confirmationStyle="danger"
          />
        ) : null}
      </section>
    );
  }
}

MemberComment.propTypes = {
  comments: React.PropTypes.array,
  member: React.PropTypes.string,
};
