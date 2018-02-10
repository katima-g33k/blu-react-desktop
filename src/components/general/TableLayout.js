import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import FileSaver from 'file-saver';

import Button from './Button';
import Checkbox from './Checkbox';
import { createCSV } from '../../lib/csv';
import Input from './Input';
import Table from './Table';

export default class TableLayout extends Component {
  static propTypes = {
    actions: PropTypes.array,
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    filters: PropTypes.arrayOf(PropTypes.shape()),
    exportable: PropTypes.bool,
    exportTitle: PropTypes.string,
    modal: PropTypes.shape(),
    noStrip: PropTypes.bool,
    placeholder: PropTypes.string,
    rowActions: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.shape()),
      PropTypes.func,
    ]),
    rowClass: PropTypes.func,
    title: PropTypes.string.isRequired,
  };

  static defaultProps = {
    actions: [],
    noStrip: false,
    rowClass: () => {},
  }

  saveFile = () => {
    FileSaver.saveAs(createCSV(this.props.columns, this.props.data), `${this.props.exportTitle || 'data'}.csv`);
  }

  renderExportButton = () => (
    <Button
      bsStyle="primary"
      onClick={this.saveFile}
      glyph="new-window"
      label={'Exporter sélection'}
    />
  )

  renderAction = action => (
    <Button
      bsStyle={action.bsStyle}
      key={action.name}
      glyph={action.icon}
      label={action.label}
      onClick={action.onClick}
    />
  )

  renderActions = () => this.props.actions.map(this.renderAction)

  renderFilters = () => {
    const { filters = [] } = this.props;

    return filters.map(filter => (
      <Col key={filter.label} md={2}>
        {filter.type === 'input' ? (
          <Input
            id={filter.id}
            onChange={filter.onChange}
            placeholder={filter.label}
            value={filter.value}
          />
        ) : (
          <Checkbox
            checked={filter.value}
            id={filter.id}
            label={filter.label}
            onChange={filter.onChange}
          />
        )}
      </Col>
    ));
  }

  render() {
    const {
      columns,
      data,
      exportable,
      modal,
      placeholder,
      title,
    } = this.props;

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
                rowActions={this.props.rowActions}
                rowClass={this.props.rowClass}
                striped={!this.props.noStrip}
              />
            </Col>
          </Row>
        </Col>
        {modal}
      </Row>
    );
  }
}
