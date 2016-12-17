import React, { Component } from 'react';
import { Table as ReactTable } from 'react-bootstrap';

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderColumns = this.renderColumns.bind(this);
    this.renderRows = this.renderRows.bind(this);
  }

  renderRows() {
    if (this.props.data.length === 0) {
      return (
        <tr>
          <td colSpan={this.props.columns.length}>
            Aucun résultat
          </td>
        </tr>
      );
    }

    return this.props.data.map((row) => {
      const columns = this.props.columns;
      const key = columns.filter((column) => column.id)[0].key;
      const cells = columns.map((column) => <td key={column.key}>{row[column.key]}</td>);

      return (
        <tr key={row[key]}>
          {cells}
        </tr>
      );
    });
  }

  renderColumns() {
    return this.props.columns.map((column) => {
      return (<th key={column.key}>{column.label}</th>);
    });
  }

  render() {
    return (
      <ReactTable striped bordered condensed hover>
        <thead>
          <tr>
            {this.renderColumns()}
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody>
      </ReactTable>
    );
  }
}

Table.propTypes = {
  columns: React.PropTypes.array,
  data: React.PropTypes.array,
};
