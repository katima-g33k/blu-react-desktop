import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import I18n from '../../lib/i18n/i18n';
import { InformationModal } from '../general/modals';
import Item from '../../lib/models/Item';
import Logger from '../../lib/Logger';
import Member from '../../lib/models/Member';
import Search from './Search';
import { SearchColumns } from '../../lib/TableColumns';

export default class SearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      archives: false,
      data: [],
      error: null,
      isLoading: false,
      search: '',
      type: props.type || 'member',
    };

    this.logger = new Logger(this.constructor.name);
    this.logger.trace('constructor()');

    this.cancelSearch = this.cancelSearch.bind(this);
    this.getModal = this.getModal.bind(this);
    this.handleArchive = this.handleArchive.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleType = this.handleType.bind(this);
    this.search = this.search.bind(this);

    this.tableOptions = {
      onRowClick: (data) => {
        if (this.props.onRowClick) {
          this.props.onRowClick(data);
        } else {
          browserHistory.push(data.no ? `member/view/${data.no}` : `item/view/${data.id}`);
        }
      },
      noDataText: I18n.t('Search.results.none'),
    };
  }

  getModal() {
    this.logger.trace('getModal()');

    const { error } = this.state;

    return error && (
      <InformationModal
        message={error.message}
        onClick={() => this.setState({ error: null })}
        title={`Erreur ${error.code}`}
      />
    );
  }

  cancelSearch(event) {
    event.preventDefault();
    this.logger.trace('cancelSearch()');
    this.setState({ isLoading: false, data: [] });
  }

  handleInput(event) {
    this.logger.trace('handleInput()');
    this.setState({ search: event.target.value });
  }

  async search(event) {
    event.preventDefault();
    this.logger.trace('search()');

    this.setState({ isLoading: true, search: this.state.search.trim() });
    const { archives, search, type } = this.state;
    const searchType = type === 'item' ? 'item' : 'member';

    try {
      const res = await this.props.api[searchType].search(search, archives, type === 'parent');
      const Instance = searchType === 'item' ? Item : Member;

      this.setState({
        data: res.map(row => new Instance(row)),
        isLoading: false,
      });
    } catch (error) {
      this.setState({ error, isLoading: false });
    }
  }

  handleType(event) {
    this.logger.trace('handleType()');
    this.setState({
      type: event.target.value,
      data: [],
    });
  }

  handleArchive() {
    this.logger.trace('handleArchive()');
    this.setState({ archives: !this.state.archives });
  }

  render() {
    this.logger.trace('render()');
    const type = this.state.type === 'parent' ? 'member' : this.state.type;

    return (
      <Search
        {...this.props}
        archives={this.state.archives}
        cancelSearch={this.cancelSearch}
        columns={SearchColumns[type]}
        data={this.state.data || []}
        disableTypeSelection={!!this.props.type}
        handleArchive={this.handleArchive}
        handleInput={this.handleInput}
        handleSearch={this.search}
        handleType={this.handleType}
        isLoading={this.state.isLoading}
        modal={this.getModal()}
        search={this.state.search}
        tableOptions={this.tableOptions}
        type={type}
        value={this.state.search}
      />
    );
  }
}

SearchContainer.propTypes = {
  api: React.PropTypes.shape(),
  disableArchive: React.PropTypes.bool,
  noHeader: React.PropTypes.bool,
  onAddButton: React.PropTypes.func,
  onRowClick: React.PropTypes.func,
  type: React.PropTypes.string,
};
