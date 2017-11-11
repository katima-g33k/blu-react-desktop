import React, { Component } from 'react';
import { Checkbox, Col, FormControl, Row } from 'react-bootstrap';
import { I18n, Translate } from 'react-i18nify';

import Table from '../../general/Table';

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

    this.filterData = this.filterData.bind(this);
    this.renderFilters = this.renderFilters.bind(this);
  }

  static formatRow(row, index) {
    if (row.item && row.item.status && row.item.status.REMOVED) {
      return 'removed';
    }

    if ((row.member && !row.member.account.isActive) ||
      (row.item && row.item.status && row.item.status.OUTDATED)) {
      return 'archived';
    }

    return index % 2 === 0 ? 'striped-row' : '';
  }

  filterData() {
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

  renderFilters() {
    const { filters } = this.state;
    const checkboxes = [
      { key: 'added', label: 'En stock' },
      { key: 'sold', label: 'Vendu' },
      { key: 'paid', label: 'Argent remis' },
      { key: 'reserved', label: 'Réservé' },
    ];

    return (
      <Row>
        <Col md={2}>
          <FormControl
            type="text"
            placeholder={'Recherche'}
            onChange={(event) => {
              filters.search = event.target.value;
              this.setState({ filters });
            }}
            value={filters.search}
          />
        </Col>
        {checkboxes.map(({ key, label }) => (
          <Col key={key} md={2}>
            <Checkbox
              onChange={(event) => {
                filters[key] = event.target.checked;
                this.setState({ filters });
              }}
              checked={filters[key]}
            >
              {label}
            </Checkbox>
          </Col>
        ))}
      </Row>
    );
  }

  render() {
    return (
      <section>
        <h4>
          <Translate value="MemberView.copies.title" />
        </h4>
        {this.renderFilters()}
        <Table
          columns={this.props.columns}
          data={this.filterData()}
          highlight={this.state.filters.search}
          options={{
            defaultSortName: this.props.columns.find(column => column.defaultSort).dataField,
            defaultSortOrder: 'asc',
          }}
          placeholder={I18n.t('MemberView.copies.none')}
          sortable
          rowClass={CopyTable.formatRow}
        />
        {this.props.modal}
      </section>
    );
  }
}

CopyTable.propTypes = {
  columns: React.PropTypes.array.isRequired,
  data: React.PropTypes.array.isRequired,
  modal: React.PropTypes.shape(),
};
