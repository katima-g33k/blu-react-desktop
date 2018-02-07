import React, { Component } from 'react';
import PropTypes from 'prop-types';

import I18n from '../../../lib/i18n';
import TableLayout from '../../general/TableLayout';

const FILTERS = ['search', 'added', 'sold', 'paid', 'reserved'];

export default class CopyTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        added: true,
        sold: true,
        reserved: true,
        paid: true,
        search: '',
      },
    };
  }

  static propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    filters: PropTypes.shape({
      added: PropTypes.bool,
      sold: PropTypes.bool,
      paid: PropTypes.bool,
      reserved: PropTypes.bool,
      search: PropTypes.string,
    }),
    formatRow: PropTypes.func,
  };

  static defaultProps = {
    formatRow: (row, index) => {
      if (row.item && row.item.status && row.item.status.REMOVED) {
        return 'removed';
      }

      if ((row.member && !row.member.account.isActive) ||
        (row.item && row.item.status && row.item.status.OUTDATED)) {
        return 'archived';
      }


      return index % 2 === 0 ? 'striped-row' : '';
    },
  }


  filterData = () => {
    const { added, paid, reserved, search, sold } = this.state.filters;

    return this.props.data.filter((copy) => {
      if ((!sold && copy.isSold) || (!reserved && copy.isReserved) ||
          (!paid && copy.isPaid) || (!added && copy.isAdded)) {
        return false;
      }

      if (search) {
        const regex = new RegExp(search, 'i');
        if (copy.item) {
          const { name, editor } = copy.item;
          return regex.test(name) || regex.test(editor);
        }

        const { name } = copy.member;
        return regex.test(name);
      }

      return true;
    });
  }

  get filters() {
    return FILTERS.map(filter => ({
      label: I18n(`CopyTable.filters.${filter}`),
      onChange: event => this.setState({
        filters: {
          ...this.state.filters,
          [filter]: filter === 'search' ? event.target.value : event.target.checked,
        },
      }),
      value: this.state.filters[filter],
      type: filter === 'search' ? 'input' : 'checkbox',
    }));
  }

  render() {
    return (
      <TableLayout
        columns={this.props.columns}
        data={this.filterData()}
        filters={this.filters}
        noStrip
        rowClass={this.props.formatRow}
        title={I18n('MemberView.copies.title')}
      />
    );
  }
}
