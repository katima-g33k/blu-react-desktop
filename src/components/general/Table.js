import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { Button } from '../general';

export default class Table extends Component {
  static propTypes = {
    data: PropTypes.array,
    columns: PropTypes.array,
    highlight: PropTypes.string,
    placeholder: PropTypes.string,
    options: PropTypes.shape(),
    rowClass: PropTypes.func,
    rowActions: PropTypes.arrayOf(PropTypes.shape({
      bsStyle: PropTypes.string,
      glyph: PropTypes.string,
      onClick: PropTypes.func,
    })),
    striped: PropTypes.bool,
  };

  static defaultProps = {
    rowActions: [],
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
      columns.push(this.renderActionColumn());
    }

    return columns;
  }

  renderActionColumn = () => this.renderColumn({
    dataAlign: 'center',
    dataField: 'action',
    dataFormat: (column, row) => (
      <ButtonGroup>
        {this.props.rowActions.map(action => (
          <Button
            {...action}
            actionData={row}
            key={action.onClick}
          />
        ))}
      </ButtonGroup>
    ),
    label: '',
    width: `${this.props.rowActions.length * 50}px`,
  })

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
