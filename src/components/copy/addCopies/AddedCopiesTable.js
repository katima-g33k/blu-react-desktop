import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';

import i18n from '../../../lib/i18n';
import { Table } from '../../general';
import { Copy } from '../../../lib/models';

export default class AddedCopiesTable extends Component {
  static propTypes = {
    copies: PropTypes.arrayOf(PropTypes.instanceOf(Copy)),
    onRemove: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    copies: [],
  };

  get columns() {
    return [
      {
        dataField: 'id',
        isKey: true,
        hidden: true,
      },
      {
        dataField: 'title',
        label: i18n('AddCopies.table.columns.title'),
        tdStyle: { whiteSpace: 'normal' },
        dataFormat: (cell, { item: { name } }) => name,
      },
      {
        dataField: 'price',
        label: i18n('AddCopies.table.columns.price'),
        width: '40px',
        dataFormat: price => `${price} $`,
      },
      {
        dataField: 'actions',
        label: '',
        dataAlign: 'center',
        width: '100px',
        dataFormat: this.renderActions,
      },
    ];
  }

  renderActions = (cell, copy) => (
    <div>
      <Button
        bsStyle="default"
        onClick={() => this.props.onUpdate(copy)}
      >
        <Glyphicon glyph="pencil" />
      </Button>
      <Button
        bsStyle="danger"
        disabled={!!copy.reservation}
        onClick={() => this.props.onRemove(copy)}
      >
        <Glyphicon glyph="trash" />
      </Button>
    </div>
  );

  render() {
    return (
      <Table
        columns={this.columns}
        data={this.props.copies}
        striped
      />
    );
  }
}
