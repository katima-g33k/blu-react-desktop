import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Comment } from '../../../lib/models';
import I18n from '../../../lib/i18n';
import { TableLayout } from '../../general';

export default class MemberComment extends Component {
  static propTypes = {
    comments: PropTypes.arrayOf(PropTypes.instanceOf(Comment)),
    onDelete: PropTypes.func.isRequired,
    onInsert: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    comments: [],
  };

  get actions() {
    return [{
      name: 'add',
      bsStyle: 'success',
      icon: 'plus',
      label: I18n('actions.add'),
      onClick: this.props.onInsert,
    }];
  }

  // eslint-disable-next-line class-methods-use-this
  get columns() {
    return [
      {
        dataField: 'id',
        hidden: true,
        isKey: true,
      },
      {
        dataField: 'comment',
        label: I18n('TableColumns.comment.comment'),
        tdStyle: { whiteSpace: 'normal' },
      },
      {
        dataField: 'updatedAt',
        dataFormat: date => moment(date).format('LL'),
        label: I18n('TableColumns.comment.date'),
        width: '130px',
      },
    ];
  }

  get rowActions() {
    return [
      {
        glyph: 'pencil',
        onClick: this.props.onUpdate,
      },
      {
        bsStyle: 'danger',
        glyph: 'trash',
        onClick: this.props.onDelete,
      },
    ];
  }

  render() {
    return (
      <TableLayout
        actions={this.actions}
        columns={this.columns}
        data={this.props.comments}
        placeholder={I18n('MemberView.comment.none')}
        rowActions={this.rowActions}
        title={I18n('MemberView.comment.title')}
      />
    );
  }
}
