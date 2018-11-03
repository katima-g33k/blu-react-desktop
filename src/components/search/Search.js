import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Checkbox,
  Col,
  Form,
  FormControl,
  FormGroup,
  Panel,
  Radio,
  Row,
} from 'react-bootstrap';

import './search.css';
import i18n from '../../lib/i18n';
import SearchResults from '../../containers/SearchResultsContainer';

const { Body, Heading } = Panel;

const TYPES = {
  ITEM: 'item',
  MEMBER: 'member',
  PARENT: 'parent',
};

export default class Search extends Component {
  static propTypes = {
    archives: PropTypes.bool.isRequired,
    disableAddButton: PropTypes.bool,
    disableArchive: PropTypes.bool,
    disableTypeSelection: PropTypes.bool,
    isLoading: PropTypes.bool.isRequired,
    noHeader: PropTypes.bool,
    onAddButton: PropTypes.func,
    onArchiveChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onInput: PropTypes.func.isRequired,
    onRowClick: PropTypes.func,
    onSearch: PropTypes.func.isRequired,
    onTypeChange: PropTypes.func.isRequired,
    type: PropTypes.oneOf(Object.values(TYPES)).isRequired,
    value: PropTypes.string.isRequired,
  };

  static defaultProps = {
    onAddButton: null,
    onRowClick: null,
    disableAddButton: false,
    disableArchive: false,
    disableTypeSelection: false,
    noHeader: false,
  };

  static TYPES = TYPES;

  handleOnCancel = (event) => {
    event.preventDefault();
    this.props.onCancel();
  };

  handleOnSearch = (event) => {
    event.preventDefault();
    this.props.onSearch();
  };

  handleOnInput = event => this.props.onInput(event.target.value);

  handleOnTypeChange = event => this.props.onTypeChange(event.target.value);

  renderTypeSelector = type => (
    <Radio
      checked={this.props.type === type}
      key={`radio-${type}`}
      inline
      name="type"
      onChange={this.handleOnTypeChange}
      value={type}
    >
      {i18n(`Search.filters.${type}`)}
    </Radio>
  );

  renderTypeSelection = () => !this.props.disableTypeSelection && (
    <FormGroup>
      {[TYPES.MEMBER, TYPES.ITEM].map(this.renderTypeSelector)}
    </FormGroup>
  );

  renderArchiveCheckbox = () => !this.props.disableArchive && (
    <Checkbox
      checked={this.props.archives}
      onChange={this.props.onArchiveChange}
    >
      {i18n(`Search.filters.archive.${this.props.type}`)}
    </Checkbox>
  );

  renderHeader = () => !this.props.noHeader && (
    <Heading>
      {i18n('Search.title')}
    </Heading>
  );

  render() {
    return (
      <Panel id={this.constructor.name}>
        {this.renderHeader()}
        <Body>
          <Row>
            <Col sm={10} md={10}>
              <Form id="searchForm">
                <FormControl
                  type="search"
                  onChange={this.handleOnInput}
                  value={this.props.value}
                />
                {this.renderTypeSelection()}
                {this.renderArchiveCheckbox()}
                <Button
                  bsStyle={this.props.isLoading ? 'danger' : 'primary'}
                  onClick={!this.props.isLoading ? this.handleOnSearch : this.handleOnCancel}
                  type="submit"
                >
                  {i18n(this.props.isLoading ? 'Search.cancel' : 'Search.title')}
                </Button>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={10}>
              <SearchResults
                disableAddButton={this.props.disableAddButton}
                onAddButton={this.props.onAddButton}
                onRowClick={this.props.onRowClick}
                type={this.props.type}
              />
            </Col>
          </Row>
        </Body>
      </Panel>
    );
  }
}
