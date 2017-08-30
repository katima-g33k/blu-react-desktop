import React, { Component, PropTypes } from 'react';
import {
  Checkbox,
  Col,
  ControlLabel,
  FormControl,
  Row,
} from 'react-bootstrap';
import FileSaver from 'file-saver';

import Button from './Button';
import Table from './Table';

const renderOptions = (options) => {
  return options.map((option) => (
    <option
      key={`option${option.value}`}
      value={option.value}
    >
      {option.label}
    </option>
  ));
};

const renderOptgroups = (optgroups) => {
  return optgroups.map((optgroup, index) => (
    <optgroup
      key={`optgroup${index}`}
      label={optgroup.label}
    >
      {renderOptions(optgroup.options)}
    </optgroup>
  ));
};

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
        glyph="new-window"
        label={'Exporter sélection'}
      />
    );
  }

  renderActions() {
    const { actions = [] } = this.props;

    return actions.map(action => (
      <Button
        bsStyle={action.bsStyle}
        key={action.name}
        glyph={action.icon}
        label={action.label}
        onClick={action.onClick}
      />
    ));
  }

  renderFilters() {
    const { filters = [] } = this.props;

    return filters.map((filter) => {
      switch (filter.type) {
        case 'checkbox':
          return (
            <Col md={1}>
              <Checkbox
                key={filter.key}
                onChange={filter.onChange}
                checked={filter.checked}
              >
                {filter.label}
              </Checkbox>
            </Col>
          );
        case 'select':
          return (
            <Col md={2} key={`select${filter.key}`}>
              <Row>
                <Col componentClass={ControlLabel} md={3} style={{ marginTop: '6px' }}>
                  {filter.label}
                </Col>
                <Col md={9}>
                  <FormControl
                    componentClass='select'
                    value={filter.value}
                    onChange={filter.onChange}
                  >
                    {filter.optgroups ? renderOptgroups(filter.optgroups) : renderOptions(filter.options || [])}
                  </FormControl>
                </Col>
              </Row>
            </Col>
          );
        default:
          return null;
      }
    });
  }

  render() {
    const { columns, data, exportable, modal, placeholder, title } = this.props;

    return (
      <Row componentClass="section">
        <Col md={12}>
          <Row>
            <Col md={12}>
              <Row>
                <Col md={12}>
                  <h4>{title}</h4>
                </Col>
              </Row>
              <Row style={{ marginBottom: '10px' }}>
                <Col md={12}>
                  {exportable && this.renderExportButton()}
                  {this.renderActions()}
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  {this.renderFilters()}
                </Col>
              </Row>
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
            </Col>
          </Row>
        </Col>
        {modal}
      </Row>
    );
  }
}

TableLayout.propTypes = {
  actions: PropTypes.array,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  filters: PropTypes.arrayOf(PropTypes.shape()),
  exportable: PropTypes.bool,
  exportTitle: PropTypes.string,
  modal: PropTypes.shape(),
  placeholder: PropTypes.string,
  title: PropTypes.string.isRequired,
};
