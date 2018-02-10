import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import ActionColumn from './ActionColumn';

export default class Table extends Component {
  static propTypes = {
    data: PropTypes.array,
    columns: PropTypes.array,
    highlight: PropTypes.string,
    placeholder: PropTypes.string,
    options: PropTypes.shape(),
    rowActions: ActionColumn.propTypes.rowActions,
    rowClass: PropTypes.func,
    striped: PropTypes.bool,
  };

  static defaultProps = {
    rowActions: ActionColumn.defaultProps.rowActions,
  };

  getRowActions = (row) => {
    try {
      return this.props.rowActions(row);
    } catch (error) {
      return this.props.rowActions;
    }
  };

  renderColumn = (column) => {
    const formatExtraData = column.formatExtraData;

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
  }

  renderColumns = () => {
    const columns = this.props.columns.map(this.renderColumn);

    if (this.props.rowActions.length) {
      columns.push((
        <ActionColumn
          key="actions"
          rowActions={this.props.rowActions}
        />
      ));
    }

    return columns;
  }

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
