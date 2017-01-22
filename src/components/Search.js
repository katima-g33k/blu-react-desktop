import React, { Component } from 'react';
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
import HTTP from '../lib/HTTP';
import Table from './Table.js';
import I18n, { Translate } from '../lib/i18n/i18n';
import { SearchColumns } from '../lib/TableColumns';
import settings from '../settings.json';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      search: '',
      data: [],
      type: props.type || 'member',
      archives: false,
    };
    this.search = this.search.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleType = this.handleType.bind(this);
    this.handleArchive = this.handleArchive.bind(this);
  }

  handleInput(event) {
    this.setState({ search: event.target.value });
  }

  search(event) {
    event.preventDefault();
    this.setState({ isLoading: true });
    const data = {
      search: this.state.search,
      deactivated: this.state.archives,
      is_parent: this.state.type === 'parent',
    };
    const searchType = this.state.type === 'item' ? 'item' : 'member';

    HTTP.post(`${settings.apiUrl}/${searchType}/search`, data, (err, res) => {
      if (res) {
        this.setState({
          data: res,
          isLoading: false,
        });
      }
    });
  }

  handleType(event) {
    const type = event.target.value;
    this.setState({
      type,
      data: [],
    });
  }

  handleArchive() {
    this.setState({ archives: !this.state.archives });
  }

  render() {
    const tableOptions = {
      onRowClick: (data) => {
        if (this.props.onRowClick) {
          this.props.onRowClick(data);
        } else {
          location.href = data.no ? `member/${data.no}` : `item/${data.id}`;
        }
      },
      noDataText: I18n.t('Search.results.none'),
    };

    return (
      <Panel header={this.props.noHeader ? null : I18n.t('Search.title')}>
        <Row>
          <Col sm={10} md={10}>
            <form>
              <FormControl
                type="search"
                onChange={this.handleInput}
              />
              {this.props.type ? null : (
                <FormGroup>
                  <Radio
                    name="type"
                    value="member"
                    inline
                    checked={this.state.type === 'member'}
                    onChange={this.handleType}
                  >
                    <Translate value="Search.filters.member" />
                  </Radio>
                  <Radio
                    name="type"
                    value="item"
                    inline
                    checked={this.state.type === 'item'}
                    onChange={this.handleType}
                  >
                    <Translate value="Search.filters.item" />
                  </Radio>
                </FormGroup>
              )}
              {!this.props.disableArchive ? (
                <Checkbox
                  onChange={this.handleArchive}
                  checked={this.state.archives}
                >
                  <Translate value="Search.filters.archives" />
                </Checkbox>
              ) : null}
              <Button
                bsStyle="primary"
                type="submit"
                disabled={this.state.isLoading}
                onClick={!this.state.isLoading ? this.search : null}
              >
                <Translate value={this.state.isLoading ? 'Search.loading' : 'Search.title'} />
              </Button>
            </form>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={10}>
            <h3>
              <Translate value="Search.results.title" /> ({this.state.data.length})
            </h3>
            <Table
              columns={SearchColumns[this.state.type === 'parent' ? 'member' : this.state.type]}
              data={this.state.data}
              highlight={this.state.search}
              options={tableOptions}
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
  type: React.PropTypes.string,
  onRowClick: React.PropTypes.func,
};
