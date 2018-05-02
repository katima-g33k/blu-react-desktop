import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Checkbox,
  Col,
  FormControl,
  FormGroup,
  Panel,
  Radio,
  Row,
} from 'react-bootstrap';

import './search.css';
import I18n from '../../lib/i18n';
import SearchResults from '../../containers/SearchResultsContainer';

const TYPES = {
  ITEM: 'item',
  MEMBER: 'member',
  PARENT: 'parent',
};

export default class Search extends Component {
  static propTypes = {
    archives: PropTypes.bool.isRequired,
    cancelSearch: PropTypes.func.isRequired,
    disableAddButton: PropTypes.bool,
    disableArchive: PropTypes.bool,
    disableTypeSelection: PropTypes.bool,
    handleArchive: PropTypes.func.isRequired,
    handleInput: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    handleType: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    noHeader: PropTypes.bool,
    onRowClick: PropTypes.func,
    type: PropTypes.oneOf(Object.values(TYPES)).isRequired,
    value: PropTypes.string.isRequired,
  }

  static defaultProps = {
    disableAddButton: false,
    disableArchive: false,
    disableTypeSelection: false,
    noHeader: false,
    onRowClick: undefined,
  }

  static TYPES = TYPES

  renderSearchForm = () => (
    <form id="searchForm">
      <FormControl
        type="search"
        onChange={this.props.handleInput}
        value={this.props.value}
      />
      {this.renderTypeSelection()}
      {this.renderArchiveCheckbox()}
      <Button
        bsStyle={this.props.isLoading ? 'danger' : 'primary'}
        onClick={!this.props.isLoading ? this.props.handleSearch : this.props.cancelSearch}
        type="submit"
      >
        {I18n(this.props.isLoading ? 'Search.cancel' : 'Search.title')}
      </Button>
    </form>
  )

  renderTypeSelection = () => {
    if (this.props.disableTypeSelection) {
      return null;
    }

    return (
      <FormGroup>
        <Radio
          name="type"
          value={TYPES.MEMBER}
          inline
          checked={this.props.type === TYPES.MEMBER}
          onChange={this.props.handleType}
        >
          {I18n('Search.filters.member')}
        </Radio>
        <Radio
          name="type"
          value={TYPES.ITEM}
          inline
          checked={this.props.type === TYPES.ITEM}
          onChange={this.props.handleType}
        >
          {I18n('Search.filters.item')}
        </Radio>
      </FormGroup>
    );
  }

  renderArchiveCheckbox = () => {
    if (this.props.disableArchive) {
      return null;
    }

    return (
      <Checkbox
        onChange={this.props.handleArchive}
        checked={this.props.archives}
      >
        {I18n(`Search.filters.archive.${this.props.type}`)}
      </Checkbox>
    );
  }

  render() {
    return (
      <Panel
        id={this.constructor.name}
        header={this.props.noHeader ? null : I18n('Search.title')}
      >
        <Row>
          <Col sm={10} md={10}>
            {this.renderSearchForm()}
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={10}>
            <SearchResults
              disableAddButton={this.props.disableAddButton}
              onRowClick={this.props.onRowClick}
            />
          </Col>
        </Row>
      </Panel>
    );
  }
}
