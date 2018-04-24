import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Glyphicon,
} from 'react-bootstrap';

import I18n from '../../lib/i18n';
import { SearchColumns } from '../../lib/TableColumns';
import Spinner from '../general/Spinner';
import Table from '../general/Table.js';

export default class Search extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    highlight: PropTypes.string,
    isLoading: PropTypes.bool,
    onAddButton: PropTypes.func.isRequired,
    onRowClick: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  }

  static defaultProps = {
    highlight: '',
    isLoading: false,
  }

  rowClass = () => 'searchActions-result'

  renderResults = () => (
    <Table
      columns={SearchColumns[this.props.type]}
      data={this.props.data}
      highlight={this.props.highlight}
      placeholder={I18n('Search.results.none')}
      options={{ onRowClick: this.props.onRowClick }}
      rowClass={this.rowClass}
      striped
    />
  )

  render() {
    return (
      <div>
        <h3>{I18n('Search.results.title', { num: this.props.data.length })}</h3>
        <Button
          bsStyle="success"
          onClick={this.props.onAddButton}
        >
          <Glyphicon glyph="plus" /> {I18n('Search.results.addButton')}
        </Button>
        {this.props.isLoading ? (<Spinner />) : this.renderResults()}
      </div>
    );
  }
}
