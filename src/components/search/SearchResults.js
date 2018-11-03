import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Glyphicon,
} from 'react-bootstrap';

import i18n from '../../lib/i18n';
import SearchColumns from '../../lib/TableColumns';
import { Spinner, Table } from '../general';

export default class Search extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    disableAddButton: PropTypes.bool,
    highlight: PropTypes.string,
    isLoading: PropTypes.bool,
    onAddButton: PropTypes.func,
    onRowClick: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  };

  static defaultProps = {
    disableAddButton: false,
    highlight: '',
    isLoading: false,
    onAddButton() {},
  };

  rowClass = () => 'searchActions-result';

  renderAddButton = () => !this.props.disableAddButton && (
    <Button
      bsStyle="success"
      onClick={this.props.onAddButton}
    >
      <Glyphicon glyph="plus" /> {i18n('Search.results.addButton')}
    </Button>
  );

  renderResults = () => (!this.props.isLoading ? (
    <Table
      columns={SearchColumns[this.props.type]}
      data={this.props.data}
      highlight={this.props.highlight}
      placeholder={i18n('Search.results.none')}
      options={{ onRowClick: this.props.onRowClick }}
      rowClass={this.rowClass}
      striped
    />
  ) : (<Spinner />));

  render() {
    return (
      <div>
        <h3>{i18n('Search.results.title', { num: this.props.data.length })}</h3>
        {this.renderAddButton()}
        {this.renderResults()}
      </div>
    );
  }
}
