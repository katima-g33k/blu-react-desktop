import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { I18n, Translate } from 'react-i18nify';

import Table from '../../general/Table';

export default class MemberComment extends Component {
  render() {
    return (
      <section>
        <h4>
          <Translate value="MemberView.comment.title" />
        </h4>
        <Button
          bsStyle='success'
          onClick={this.props.onAddClick}
        >
          <Glyphicon glyph='plus' /> {'Ajouter'}
        </Button>
        <Table
          columns={this.props.columns}
          data={this.props.data}
          placeholder={I18n.t('MemberView.comment.none')}
          striped
        />
        {this.props.modal}
      </section>
    );
  }
}

MemberComment.propTypes = {
  columns: React.PropTypes.array,
  data: React.PropTypes.array,
  modal: React.PropTypes.shape(),
  onAddClick: React.PropTypes.func,
};
