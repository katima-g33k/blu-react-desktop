import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

import AddCopies from './AddCopies';
import addCopiesColums from './addCopiesColumns';
import Copy from '../../../lib/models/Copy';
import HTTP from '../../../lib/HTTP';
import InputModal from '../../general/modals/InputModal';
import settings from '../../../settings.json';
import Transaction from '../../../lib/models/Transaction';
import Member from '../../../lib/models/Member';

export default class AddCopiesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copies: [],
      isSearch: true,
      showModal: false,
      member: new Member({ no: this.props.params.no }),
    };

    this.deleteCopy = this.deleteCopy.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getActions = this.getActions.bind(this);
    this.getModal = this.getModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.save = this.save.bind(this);
    this.updatePrice = this.updatePrice.bind(this);

    this.columns = addCopiesColums;
    this.columns.find(column => column.dataField === 'actions').dataFormat = (cell, copy) => {
      return !copy.reservation && (
        <div>
          <Button
            bsStyle="default"
            onClick={() => this.openModal({ copy })}
          >
            <Glyphicon glyph="pencil" />
          </Button>
          <Button
            bsStyle="danger"
            onClick={() => this.deleteCopy(copy.id)}
          >
            <Glyphicon glyph="trash" />
          </Button>
        </div>
      );
    };
  }

  componentWillMount() {
    const no = this.props.params.no;
    HTTP.post(`${settings.apiUrl}/member/getName`, { no }, (err, res) => {
      if (err) {
        // TODO: Display erorr message
        return;
      }

      this.setState({ member: new Member({ no, ...res }) });
    });
  }

  deleteCopy(id) {
    HTTP.post(`${settings.apiUrl}/copy/delete`, { id }, (err) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      const copies = this.state.copies.filter(copy => copy.id !== id);
      this.setState({ copies });
    });
  }

  closeModal(state = {}) {
    this.setState({ ...state, item: null, copy: null, showModal: false });
  }

  getActions() {
    return [{
      label: 'Terminer',
      href: `/member/view/${this.props.params.no}`,
      style: 'primary',
    }];
  }

  getModal() {
    const isCopy = this.state.copy;

    return this.state.showModal && (
      <InputModal
        message={'Entrer le montant souhaité'}
        onCancel={this.closeModal}
        onSave={isCopy ? this.updatePrice : this.save}
        title={isCopy ? this.state.copy.item.name : this.state.item.name}
        type="number"
        value={isCopy && this.state.copy.price}
      />
    );
  }

  openModal(data = {}) {
    this.setState({ ...data, showModal: true, isSearch: true });
  }

  save(event, value) {
    const price = parseInt(value, 10);
    const data = {
      member_no: this.props.params.no,
      item_id: this.state.item.id,
      price,
    };

    HTTP.post(`${settings.apiUrl}/copy/insert`, data, (err, res) => {
      if (err) {
        this.closeModal();
        // TODO: Display error message
        return;
      }

      const copies = this.state.copies;
      const copy = new Copy({
        id: res.id,
        item: this.state.item,
        price,
        transaction: [{
          code: Transaction.TYPES.ADD,
          date: new Date(),
        }],
      });

      if (res.reservation) {
        copy.reserve(res.reservation.member);
      }

      copies.push(copy);

      this.closeModal({ copies });
    });
  }

  updatePrice(event, value) {
    const price = parseInt(value, 10);
    const currentCopy = this.state.copy;
    const data = {
      id: currentCopy.id,
      price,
    };

    HTTP.post(`${settings.apiUrl}/copy/update`, data, (err) => {
      if (err) {
        this.closeModal();
        // TODO: Display error message
        return;
      }

      const copies = this.state.copies;
      copies.find(copy => copy.id === currentCopy.id).price = price;
      this.closeModal({ copies });
    });
  }

  render() {
    return (
      <AddCopies
        {...this.props}
        actions={this.getActions()}
        columns={this.columns}
        data={this.state.copies}
        isSearch={this.state.isSearch}
        member={this.state.member}
        modal={this.getModal()}
        onAddButton={() => this.setState({ isSearch: false })}
        openModal={this.openModal}
        onFormSave={this.openModal}
        onFormCancel={() => this.setState({ isSearch: true })}
      />
    );
  }
}

AddCopiesContainer.propTypes = {
  params: React.PropTypes.shape(),
};
