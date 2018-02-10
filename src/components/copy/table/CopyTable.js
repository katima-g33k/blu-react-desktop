import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import { formatShortDate } from '../../../lib/dateHelper';
import I18n from '../../../lib/i18n';
import { sortDate, sortNumber } from '../../../lib/sort';
import TableLayout from '../../general/TableLayout';

const FILTERS = ['search', 'added', 'sold', 'paid', 'reserved'];

export default class CopyTable extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    filters: PropTypes.shape({
      added: PropTypes.bool,
      sold: PropTypes.bool,
      paid: PropTypes.bool,
      reserved: PropTypes.bool,
      search: PropTypes.string,
    }).isRequired,
    formatRow: PropTypes.func,
    updateFilter: PropTypes.func.isRequired,
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
    const { added, paid, reserved, search, sold } = this.props.filters;

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
      id: filter,
      label: I18n(`CopyTable.filters.${filter}`),
      onChange: this.props.updateFilter,
      value: this.props.filters[filter],
      type: filter === 'search' ? 'input' : 'checkbox',
    }));
  }

  get columns() {
    return this.props.columns.concat([
      {
        dataField: 'dateAdded',
        label: I18n('TableColumns.memberCopy.added'),
        dataSort: true,
        width: '120px',
        dataFormat: date => formatShortDate(date),
        sortFunc: (a, b, order) => sortDate(a.dateAdded, b.dateAdded, order),
      },
      {
        dataField: 'dateSold',
        label: I18n('TableColumns.memberCopy.sold'),
        dataSort: true,
        width: '120px',
        dataFormat: date => formatShortDate(date),
        sortFunc: (a, b, order) => sortDate(a.dateSold, b.dateSold, order),
      },
      {
        dataField: 'datePaid',
        label: I18n('TableColumns.memberCopy.paid'),
        dataSort: true,
        width: '120px',
        dataFormat: date => formatShortDate(date),
        sortFunc: (a, b, order) => sortDate(a.datePaid, b.datePaid, order),
      },
      {
        dataField: 'priceString',
        label: I18n('TableColumns.memberCopy.price'),
        dataSort: true,
        width: '60px',
        sortFunc: (a, b, order) => sortNumber(a.price, b.price, order),
        dataFormat: (price, copy) => (
          <Button
            bsStyle="link"
            onClick={() => this.setState({ activeCopy: copy, showModal: 'update' })}
            disabled={copy.isPaid || copy.isSold || copy.isReserved}
          >
            {price}
          </Button>
        ),
      },
    ]);
  }

  getRowActions = (copy) => {
    if (copy.isPaid) {
      return [];
    }

    if (copy.isSold) {
      return [
        {
          bsStyle: 'danger',
          glyph: 'ban-circle',
          help: 'Annuler la vente',
          onClick: () => console.log('cancel sell'),
        },
      ];
    }

    if (copy.isReserved) {
      return [
        {
          help: 'Annuler la Réservation',
          bsStyle: 'primary',
          onClick: () => console.log('cancel reservation'),
          glyph: 'ban-circle',
        },
        {
          help: 'Vendre à moitié prix',
          label: '$',
          onClick: () => console.log('sell parent'),
        },
      ];
    }

    return [
      {
        bsStyle: 'primary',
        glyph: 'user',
        help: 'Réserver',
        onClick: () => console.log('reserve'),
      },
      {
        help: 'Vendre à moitié prix',
        label: '$',
        onClick: () => console.log('sell parent'),
      },
      {
        bsStyle: 'success',
        help: 'Vendre',
        label: '$$',
        onClick: () => console.log('sell'),
      },
      {
        bsStyle: 'danger',
        glyph: 'trash',
        help: 'Supprimer',
        onClick: () => console.log('delete'),
      },
    ];
  }

  render() {
    return (
      <TableLayout
        columns={this.columns}
        data={this.filterData()}
        filters={this.filters}
        noStrip
        rowActions={this.getRowActions}
        rowClass={this.props.formatRow}
        title={I18n('MemberView.copies.title')}
      />
    );
  }
}

// {
//   dataField: 'actions',
//     label: '',
//   dataAlign: 'center',
//   width: '175px',
//   dataFormat: (cell, copy) => {
//   if (copy.isPaid) {
//     return '';
//   }
//
//   if (copy.isSold) {
//     return (
//       <OverlayTrigger
//         placement="bottom"
//         overlay={<Tooltip id="cancel">{'Annuler la vente'}</Tooltip>}
//       >
//         <Button bsStyle="danger" onClick={() => this.refund(copy.id)}>
//           <Glyphicon glyph="ban-circle" />
//         </Button>
//       </OverlayTrigger>
//     );
//   }
//
//   if (copy.isReserved) {
//     return (
//       <ButtonGroup>
//         <OverlayTrigger
//           placement="bottom"
//           overlay={<Tooltip id="cancel">{'Annuler la réservation'}</Tooltip>}
//         >
//           <Button
//             bsStyle="primary"
//             onClick={() => this.setState({ activeCopy: copy, showModal: 'cancelReservation' })}
//           >
//             <Glyphicon glyph="ban-circle" />
//           </Button>
//         </OverlayTrigger>
//         <OverlayTrigger
//           placement="bottom"
//           overlay={<Tooltip id="sellParent">{'Vendre à moitié prix'}</Tooltip>}
//         >
//           <Button
//             onClick={() => this.sell(copy, true)}
//           >
//             {'$'}
//           </Button>
//         </OverlayTrigger>
//       </ButtonGroup>
//     );
//   }
//
//   return (
//     <ButtonGroup>
//       <OverlayTrigger
//         placement="bottom"
//         overlay={<Tooltip id="reserve">{'Réserver'}</Tooltip>}
//       >
//         <Button
//           bsStyle="primary"
//           onClick={() => this.setState({ activeCopy: copy, showModal: 'reserve' })}
//         >
//           <Glyphicon glyph="user" />
//         </Button>
//       </OverlayTrigger>
//       <OverlayTrigger
//         placement="bottom"
//         overlay={<Tooltip id="sellParent">{'Vendre à moitié prix'}</Tooltip>}
//       >
//         <Button
//           onClick={() => this.sell(copy, true)}
//         >
//           {'$'}
//         </Button>
//       </OverlayTrigger>
//       <OverlayTrigger
//         placement="bottom"
//         overlay={<Tooltip id="sell">{'Vendre à prix régulier'}</Tooltip>}
//       >
//         <Button
//           onClick={() => this.sell(copy)}
//           bsStyle="success"
//         >
//           {'$$'}
//         </Button>
//       </OverlayTrigger>
//       <OverlayTrigger
//         placement="bottom"
//         overlay={<Tooltip id="delete">{'Supprimer de l\'inventaire'}</Tooltip>}
//       >
//         <Button
//           bsStyle="danger"
//           onClick={() => this.setState({ activeCopy: copy, showModal: 'remove' })}
//         >
//           <Glyphicon glyph="trash" />
//         </Button>
//       </OverlayTrigger>
//     </ButtonGroup>
//   );
// },
// },
