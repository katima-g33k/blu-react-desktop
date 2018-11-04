import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import Button from './Button';
import I18n from '../../lib/i18n';

const BUTTON_WIDTH = 50;
const DEFAULT_ACTION_COUNT = 4;

export default class Table extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.shape()),
      PropTypes.shape(),
    ])).isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    highlight: PropTypes.string,
    placeholder: PropTypes.string,
    options: PropTypes.shape(),
    rowActions: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.shape({
        bsStyle: PropTypes.string,
        glyph: PropTypes.string,
        onClick: PropTypes.func,
      })),
      PropTypes.func,
    ]),
    rowClass: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    striped: PropTypes.bool,
  };

  static defaultProps = {
    highlight: '',
    placeholder: I18n('table.placeholder'),
    options: {},
    rowActions: [],
    rowClass: '',
    striped: false,
  };

  get actionColumnWidth() {
    let actionCount = this.props.rowActions.length;

    if (typeof this.props.rowActions === 'function') {
      actionCount = DEFAULT_ACTION_COUNT;
    }

    return actionCount * BUTTON_WIDTH;
  }

  getRowActions = (row) => {
    try {
      return this.props.rowActions(row);
    } catch (error) {
      return this.props.rowActions;
    }
  };

  renderColumn = (column) => {
    const { formatExtraData } = column;

    if (formatExtraData && formatExtraData.props) {
      formatExtraData.props.forEach((key) => {
        formatExtraData[key] = this.props[key];
      });
    }

    return (
      <TableHeaderColumn
        {...column}
        key={column.dataField}
      >
        {column.label}
      </TableHeaderColumn>
    );
  };

  renderAssistiveButton = (action, row, key) => (
    <OverlayTrigger
      key={key}
      overlay={<Tooltip id={action.help}>{action.help}</Tooltip>}
      placement="bottom"
    >
      {this.renderActionButton(action, row)}
    </OverlayTrigger>
  );

  renderActionButton = (action, actionData, key) => (
    <Button
      {...action}
      actionData={actionData}
      key={key}
    />
  );

  renderActionButtonGroup = row => this.getRowActions(row).map((action) => {
    const actionKey = action.label || action.glyph;

    if (action.help) {
      return this.renderAssistiveButton(action, row, `${row.id}${actionKey}`);
    }

    return this.renderActionButton(action, row, `${row.id}${actionKey}`);
  });

  renderActionColumn = () => this.renderColumn({
    dataAlign: 'center',
    dataField: 'action',
    dataFormat: (cell, row) => (
      <ButtonGroup>
        {this.renderActionButtonGroup(row)}
      </ButtonGroup>
    ),
    width: `${this.actionColumnWidth}px`,
  });

  renderColumns = () => {
    const columns = this.props.columns.map(this.renderColumn);

    if (this.props.rowActions.length) {
      columns.push(this.renderActionColumn());
    }

    return columns;
  };

  render() {
    return (
      <BootstrapTable
        condensed
        data={this.props.data}
        hover
        options={{
          ...this.props.options,
          noDataText: this.props.placeholder,
        }}
        striped={this.props.striped}
        trClassName={this.props.rowClass}
      >
        {this.renderColumns()}
      </BootstrapTable>
    );
  }
}
