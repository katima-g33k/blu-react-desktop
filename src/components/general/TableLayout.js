import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import FileSaver from 'file-saver';

import Button from './Button';
import Checkbox from './Checkbox';
import { createCSV } from '../../lib/csv';
import I18n from '../../lib/i18n';
import Input from './Input';
import Table from './Table';

export default class TableLayout extends Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape()),
    columns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    filters: PropTypes.arrayOf(PropTypes.shape()),
    exportable: PropTypes.bool,
    exportTitle: PropTypes.string,
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
    filters: [],
    exportable: false,
    exportTitle: '',
    noStrip: false,
    placeholder: I18n('table.placeholder'),
    rowActions: [],
    rowClass: () => {},
  }

  getFileName = () => `${this.props.exportTitle || I18n('table.defaultFileName')}.csv`

  saveFile = () => {
    FileSaver.saveAs(createCSV(this.props.columns, this.props.data), this.getFileName());
  }

  renderExportButton = () => {
    if (this.props.exportable) {
      return (
        <Button
          bsStyle="primary"
          glyph="new-window"
          label={I18n('table.export')}
          onClick={this.saveFile}
        />
      );
    }

    return null;
  }

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
    return (
      <Row componentClass="section">
        <Col md={12}>
          <Row>
            <Col md={12}>
              <Row>
                <Col md={12}>
                  <h4>{this.props.title}</h4>
                </Col>
              </Row>
              <Row style={{ marginBottom: '10px' }}>
                <Col md={12}>
                  {this.renderExportButton()}
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
                columns={this.props.columns}
                data={this.props.data}
                placeholder={this.props.placeholder}
                rowActions={this.props.rowActions}
                rowClass={this.props.rowClass}
                striped={!this.props.noStrip}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
