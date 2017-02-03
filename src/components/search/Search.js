import React, { Component } from 'react';
import {
  Button,
  Checkbox,
  Col,
  FormControl,
  FormGroup,
  Glyphicon,
  Panel,
  Radio,
  Row,
} from 'react-bootstrap';
import { Link } from 'react-router';
import Table from '../general/Table.js';
import I18n, { Translate } from '../../lib/i18n/i18n';

export default class Search extends Component {
  render() {
    return (
      <Panel header={this.props.noHeader ? null : I18n.t('Search.title')}>
        <Row>
          <Col sm={10} md={10}>
            <form>
              <FormControl
                type="search"
                onChange={this.props.handleInput}
              />
              {this.props.disableTypeSelection ? null : (
                <FormGroup>
                  <Radio
                    name="type"
                    value="member"
                    inline
                    checked={this.props.type === 'member'}
                    onChange={this.props.handleType}
                  >
                    <Translate value="Search.filters.member" />
                  </Radio>
                  <Radio
                    name="type"
                    value="item"
                    inline
                    checked={this.props.type === 'item'}
                    onChange={this.props.handleType}
                  >
                    <Translate value="Search.filters.item" />
                  </Radio>
                </FormGroup>
              )}
              {!this.props.disableArchive ? (
                <Checkbox
                  onChange={this.props.handleArchive}
                  checked={this.props.archives}
                >
                  <Translate value="Search.filters.archives" />
                </Checkbox>
              ) : null}
              <Button
                bsStyle="primary"
                type="submit"
                disabled={this.props.isLoading}
                onClick={!this.props.isLoading ? this.props.handleSearch : null}
              >
                <Translate value={this.props.isLoading ? 'Search.loading' : 'Search.title'} />
              </Button>
            </form>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={10}>
            <h3>
              <Translate value="Search.results.title" /> ({this.props.data.length})
            </h3>
            {this.props.onAddButton ? (
              <Button
                bsStyle="success"
                onClick={this.props.onAddButton}
              >
                <Glyphicon glyph="plus" /> {'Ajouter'}
              </Button>
            ) : (
              <Link to={`/${this.props.type}`}>
                <Button bsStyle="success">
                  <Glyphicon glyph="plus" /> {'Ajouter'}
                </Button>
              </Link>
            )}
            <Table
              columns={this.props.columns}
              data={this.props.data}
              highlight={this.props.search}
              options={this.props.tableOptions}
              striped
            />
          </Col>
        </Row>
      </Panel>
    );
  }
}

Search.propTypes = {
  disableArchive: React.PropTypes.bool,
  noHeader: React.PropTypes.bool,
  onRowClick: React.PropTypes.func,
  onAddButton: React.PropTypes.func,
  disableTypeSelection: React.PropTypes.bool,
  archives: React.PropTypes.bool,
  handleInput: React.PropTypes.func,
  handleType: React.PropTypes.func,
  handleArchive: React.PropTypes.func,
  type: React.PropTypes.string,
  isLoading: React.PropTypes.bool,
  handleSearch: React.PropTypes.func,
  columns: React.PropTypes.array,
  data: React.PropTypes.array,
  search: React.PropTypes.string,
  tableOptions: React.PropTypes.shape(),
};
