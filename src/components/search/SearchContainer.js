import React, { Component } from 'react';

import API from '../../lib/API';
import I18n from '../../lib/i18n/i18n';
import Item from '../../lib/models/Item';
import Member from '../../lib/models/Member';
import Search from './Search';
import { SearchColumns } from '../../lib/TableColumns';

export default class SearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      search: '',
      data: [],
      type: props.type || 'member',
      archives: false,
    };

    this.handleArchive = this.handleArchive.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleType = this.handleType.bind(this);
    this.search = this.search.bind(this);

    this.tableOptions = {
      onRowClick: (data) => {
        if (this.props.onRowClick) {
          this.props.onRowClick(data);
        } else {
          location.href = data.no ? `member/view/${data.no}` : `item/view/${data.id}`;
        }
      },
      noDataText: I18n.t('Search.results.none'),
    };
  }

  handleInput(event) {
    this.setState({ search: event.target.value });
  }

  search(event) {
    event.preventDefault();
    this.setState({ isLoading: true });
    const { archives, search, type } = this.state;
    const searchType = type === 'item' ? 'item' : 'member';
    const options = {};

    if (searchType === 'member') {
      options.is_parent = type === 'parent';
      options.deactivated = archives;
    } else {
      options.outdated = archives;
    }

    API[searchType].search(search, options, (err, res) => {
      if (err) {
        // TODO: Display message
        return;
      }

      this.setState({
        data: res.map(row => searchType === 'item' ? new Item(row) : new Member(row)),
        isLoading: false,
      });
    });
  }

  handleType(event) {
    this.setState({
      type: event.target.value,
      data: [],
    });
  }

  handleArchive() {
    this.setState({ archives: !this.state.archives });
  }

  render() {
    const type = this.state.type === 'parent' ? 'member' : this.state.type;

    return (
      <Search
        {...this.props}
        archives={this.state.archives}
        disableTypeSelection={!!this.props.type}
        handleInput={this.handleInput}
        handleType={this.handleType}
        handleArchive={this.handleArchive}
        type={type}
        isLoading={this.state.isLoading}
        handleSearch={this.search}
        columns={SearchColumns[type]}
        data={this.state.data || []}
        search={this.state.search}
        tableOptions={this.tableOptions}
      />
    );
  }
}

SearchContainer.propTypes = {
  disableArchive: React.PropTypes.bool,
  noHeader: React.PropTypes.bool,
  type: React.PropTypes.string,
  onRowClick: React.PropTypes.func,
  onAddButton: React.PropTypes.func,
};
