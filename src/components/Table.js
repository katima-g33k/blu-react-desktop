import React, { Component } from 'react';
import { Table as ReactTable } from 'react-bootstrap';

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.style = {
      highlight: {
        backgroundColor: '#FFFF00',
      },
    };

    this.highlightResult = this.highlightResult.bind(this);
    this.renderColumns = this.renderColumns.bind(this);
    this.renderRows = this.renderRows.bind(this);
    this.selectRow = this.selectRow.bind(this);
  }

  selectRow(event) {
    const type = 'member';
    const id = event.target.parentNode.getAttribute('data-id');
    location.href = `${type}/${id}`;
  }

  highlightResult(value) {
    const regex = new RegExp(`(${this.props.highlight})`, 'i');
    return value.split(regex).map((string, index) => {
      if (!regex.test(string)) {
        return string;
      }
      return (<span style={this.style.highlight} key={index}>{string}</span>);
    });
  }

  renderRows() {
    if (this.props.data.length === 0) {
      const style = { textAlign: 'center' };
      return (
        <tr>
          <td colSpan={this.props.columns.length} style={style}>
            {this.props.placeholder}
          </td>
        </tr>
      );
    }

    return this.props.data.map((row) => {
      const columns = this.props.columns;
      const key = columns.filter((column) => column.id)[0].key;
      const cells = columns.map((column) => {
        if (!column.label) {
          return null;
        }

        const value = column.value ? column.value(row[column.key]) : row[column.key];
        return <td key={column.key}>{this.highlightResult(value)}</td>;
      });

      return (
        <tr key={row[key]} data-id={row[key]} onClick={this.selectRow}>
          {cells}
        </tr>
      );
    });
  }

  renderColumns() {
    return this.props.columns.map((column) => {
      return column.label ? (<th key={column.key}>{column.label}</th>) : null;
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
  highlight: React.PropTypes.string,
  placeholder: React.PropTypes.string,
};
