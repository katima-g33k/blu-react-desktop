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

import I18n from '../../lib/i18n';
import SearchResults from '../../containers/SearchResultsContainer';

export default class Search extends Component {
  static propTypes = {
    archives: PropTypes.bool.isRequired,
    cancelSearch: PropTypes.func.isRequired,
    disableArchive: PropTypes.bool,
    disableTypeSelection: PropTypes.bool,
    handleArchive: PropTypes.func.isRequired,
    handleInput: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    handleType: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    noHeader: PropTypes.bool,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }

  static defaultProps = {
    disableArchives: false,
    disableTypeSelection: false,
    noHeader: false,
  }

  renderSearchForm = () => (
    <form>
      <FormControl
        type="search"
        onChange={this.props.handleInput}
        value={this.props.value}
      />
      {this.renderTypeSelection()}
      {this.renderArchiveCheckbox()}
      <Button
        bsStyle={this.props.isLoading ? 'danger' : 'primary'}
        type="submit"
        onClick={!this.props.isLoading ? this.props.handleSearch : this.props.cancelSearch}
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
          value="member"
          inline
          checked={this.props.type === 'member'}
          onChange={this.props.handleType}
        >
          {I18n('Search.filters.member')}
        </Radio>
        <Radio
          name="type"
          value="item"
          inline
          checked={this.props.type === 'item'}
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
      <Panel header={this.props.noHeader ? null : I18n('Search.title')}>
        <Row>
          <Col sm={10} md={10}>
            {this.renderSearchForm()}
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={10}>
            <SearchResults />
          </Col>
        </Row>
      </Panel>
    );
  }
}
