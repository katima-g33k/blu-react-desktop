import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    };

    this.renderColumns = this.renderColumns.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({ data: props.data });
  }

  renderFooter() {
    return this.props.footer ? (
      <tfoot>
        <tr>{this.props.footer}</tr>
      </tfoot>
    ) : null;
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
          dataField={column.dataField}
          dataSort={column.dataSort}
          isKey={column.isKey}
          key={column.dataField + index}
          dataFormat={column.dataFormat}
          formatExtraData={formatExtraData}
          hidden={column.hidden}
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
        striped
        data={this.state.data}
        options={this.props.options}
        noDataText={this.props.placeholder}
      >
        {this.renderColumns()}
      </BootstrapTable>
    );
  }
}

Table.propTypes = {
  actions: React.PropTypes.shape(),
  columns: React.PropTypes.array,
  data: React.PropTypes.array,
  highlight: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  footer: React.PropTypes.shape(),
  options: React.PropTypes.shape(),
};
