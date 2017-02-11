import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    };

    this.renderColumns = this.renderColumns.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({ data: props.data });
  }

  renderColumns() {
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
          key={column.dataField + index}
        >
          {column.label}
        </TableHeaderColumn>
      );
    });
  }

  render() {
    return (
      <BootstrapTable
        condensed
        striped={this.props.striped}
        data={this.state.data}
        options={{
          ...this.props.options,
          noDataText: this.props.placeholder,
        }}
        trClassName={this.props.rowClass}
      >
        {this.renderColumns()}
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
