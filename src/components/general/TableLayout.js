import React, { Component } from 'react';
import { Button, Col, Glyphicon, Row } from 'react-bootstrap';
import FileSaver from 'file-saver';

import Table from './Table';

export default class TableLayout extends Component {
  constructor(props) {
    super(props);

    this.createCSV = this.createCSV.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.renderExportButton = this.renderExportButton.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  createCSV() {
    const { columns, data } = this.props;
    const csvColumns = columns.filter(({ hidden }) => !hidden);
    const header = `${csvColumns.map(column => `"${column.label}"`).join(',')}\r\n`;
    const body = data.map(row =>
      csvColumns.map((column) => {
        if (column.exportDataFormat) {
          return `"${column.exportDataFormat(row[column.dataField], row)}"`;
        }

        if (column.dataFormat) {
          return `"${column.dataFormat(row[column.dataField], row)}"`;
        }

        return `"${row[column.dataField]}"` || '""';
      }).join(',')
    ).join('\r\n');

    return new Blob([`${header}${body}`], { type: 'csv' });
  }

  saveFile() {
    FileSaver.saveAs(this.createCSV(), `${this.props.exportTitle || 'data'}.csv`);
  }

  renderExportButton() {
    return (
      <Button
        bsStyle="primary"
        onClick={this.saveFile}
      >
        <Glyphicon glyph="new-window" style={{ paddingRight: '10px' }} />
        {'Exporter sélection'}
      </Button>
    );
  }

  renderActions() {
    const { actions = [] } = this.props;

    return actions.map(action => (
      <Button
        key={action.name}
        bsStyle={action.bsStyle}
        onClick={action.onClick}
      >
        {action.icon ? (<Glyphicon glyph={action.icon} style={{ paddingRight: '10px' }} />) : null}
        {action.label}
      </Button>
    ));
  }

  render() {
    const { columns, data, exportable, modal, placeholder, title } = this.props;

    return (
      <Row componentClass="section">
        <Col md={12}>
          <Row>
            <Col md={12}>
              <h4>{title}</h4>
              {exportable && this.renderExportButton()}
              {this.renderActions()}
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Table
                columns={columns}
                data={data}
                placeholder={placeholder || 'Aucune donnée'}
                striped
              />
              {modal}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

TableLayout.propTypes = {
  actions: React.PropTypes.array,
  columns: React.PropTypes.array.isRequired,
  data: React.PropTypes.array.isRequired,
  exportable: React.PropTypes.bool,
  exportTitle: React.PropTypes.string,
  modal: React.PropTypes.shape(),
  placeholder: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
};
