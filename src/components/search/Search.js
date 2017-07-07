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
import Spinner from '../general/Spinner';

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
                value={this.props.value}
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
                  <Translate value={`Search.filters.archive.${this.props.type}`} />
                </Checkbox>
              ) : null}
              <Button
                bsStyle={this.props.isLoading ? 'danger' : 'primary'}
                type="submit"
                onClick={!this.props.isLoading ? this.props.handleSearch : this.props.cancelSearch}
              >
                <Translate value={this.props.isLoading ? 'Search.cancel' : 'Search.title'} />
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
              <Link to={`/${this.props.type}/add`}>
                <Button bsStyle="success">
                  <Glyphicon glyph="plus" /> {'Ajouter'}
                </Button>
              </Link>
            )}
            {this.props.isLoading ? (<Spinner/>) : (
              <Table
                columns={this.props.columns}
                data={this.props.data}
                highlight={this.props.search}
                placeholder={'Aucune donnée'}
                options={this.props.tableOptions}
                striped
                rowClass={() => 'search-result'}
              />
            )}
          </Col>
        </Row>
        {this.props.modal}
      </Panel>
    );
  }
}

Search.propTypes = {
  archives: React.PropTypes.bool,
  cancelSearch: React.PropTypes.func,
  columns: React.PropTypes.array,
  data: React.PropTypes.array,
  disableArchive: React.PropTypes.bool,
  disableTypeSelection: React.PropTypes.bool,
  handleArchive: React.PropTypes.func,
  handleInput: React.PropTypes.func,
  handleSearch: React.PropTypes.func,
  handleType: React.PropTypes.func,
  isLoading: React.PropTypes.bool,
  modal: React.PropTypes.shape(),
  noHeader: React.PropTypes.bool,
  onAddButton: React.PropTypes.func,
  onRowClick: React.PropTypes.func,
  search: React.PropTypes.string,
  tableOptions: React.PropTypes.shape(),
  type: React.PropTypes.string,
  value: React.PropTypes.string,
};
