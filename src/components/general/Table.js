import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import Logger from '../../lib/Logger';

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.logger = new Logger(this.constructor.name);
    this.logger.trace('constructor()');
  }

  renderColumns = () => {
    this.logger.trace('renderColumns()');
    return this.props.columns.map((column, index) => {
      const formatExtraData = column.formatExtraData;

      if (formatExtraData && formatExtraData.props) {
        formatExtraData.props.forEach((key) => {
          formatExtraData[key] = this.props[key];
        });
      }

      return (
        <TableHeaderColumn
          {...column}
          key={`${column.dataField}${index}`}
        >
          {column.label}
        </TableHeaderColumn>
      );
    });
  }

  render() {
    this.logger.trace('render()');
    const { data, options, placeholder, rowClass, striped } = this.props;
    const columns = this.renderColumns();

    return (
      <BootstrapTable
        condensed
        data={data}
        hover
        options={{
          ...options,
          noDataText: placeholder,
        }}
        striped={striped}
        trClassName={rowClass}
      >
        {columns}
      </BootstrapTable>
    );
  }
}

Table.propTypes = {
  data: React.PropTypes.array,
  columns: React.PropTypes.array,
  highlight: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  options: React.PropTypes.shape(),
  rowClass: React.PropTypes.func,
  striped: React.PropTypes.bool,
};
