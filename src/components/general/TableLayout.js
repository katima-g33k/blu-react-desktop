import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';

import Button from './Button';
import ExportButton from './ExportButton';
import Filter from './Filter';
import i18n from '../../lib/i18n';
import Table from './Table';

export default class TableLayout extends Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape()),
    columns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    data: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.shape()),
      PropTypes.shape(),
    ])).isRequired,
    filters: PropTypes.arrayOf(PropTypes.shape()),
    exportable: PropTypes.bool,
    exportTitle: PropTypes.string,
    noStrip: PropTypes.bool,
    placeholder: PropTypes.string,
    rowActions: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.shape()),
      PropTypes.func,
    ]),
    rowClass: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    title: PropTypes.string.isRequired,
  };

  static defaultProps = {
    actions: [],
    filters: [],
    exportable: false,
    exportTitle: '',
    noStrip: false,
    placeholder: i18n('table.placeholder'),
    rowActions: [],
    rowClass: '',
  };

  renderExportButton = () => this.props.exportable && (
    <ExportButton
      columns={this.props.columns}
      data={this.props.data}
      filename={this.props.exportTitle}
    />
  );

  renderAction = action => (
    <Button
      bsStyle={action.bsStyle}
      key={action.name}
      glyph={action.icon}
      label={action.label}
      onClick={action.onClick}
    />
  );

  renderActions = () => this.props.actions.map(this.renderAction);

  renderFilter = filter => (
    <Filter
      {...filter}
      key={filter.id}
    />
  );

  renderFilters = () => this.props.filters.map(this.renderFilter);

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
