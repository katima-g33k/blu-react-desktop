import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

import AddCopies from './AddCopies';
import addCopiesColums from './addCopiesColumns';
import Copy from '../../../lib/models/Copy';
import HTTP from '../../../lib/HTTP';
import InputModal from '../../general/modals/InputModal';
import settings from '../../../settings.json';
import Transaction from '../../../lib/models/Transaction';

export default class AddCopiesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copies: [],
      isSearch: true,
      showModal: false,
    };

    this.deleteCopy = this.deleteCopy.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getModal = this.getModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.save = this.save.bind(this);

    this.columns = addCopiesColums;
    this.columns.find(column => column.dataField === 'actions').dataFormat = (cell, copy) => {
      return !copy.reservation ? (
        <Button
          bsStyle="danger"
          onClick={() => this.deleteCopy(copy.id)}
        >
          <Glyphicon glyph="trash" />
        </Button>
      ) : null;
    };
  }

  deleteCopy(id) {
    HTTP.post(`${settings.apiUrl}/copy/delete`, { id }, (err) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      const copies = this.state.copies.filter((copy) => copy.id !== id);
      this.setState({ copies });
    });
  }

  closeModal(state = {}) {
    this.setState({ ...state, item: null, showModal: false });
  }

  getModal() {
    return this.state.showModal ? (
      <InputModal
        onCancel={this.closeModal}
        onSave={this.save}
        title={this.state.item.name}
        type={'number'}
        message={'Entrer le montant souhaité'}
      />
    ) : null;
  }

  openModal(item) {
    this.setState({ item, showModal: true, isSearch: true });
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

  render() {
    return (
      <AddCopies
        {...this.props}
        columns={this.columns}
        data={this.state.copies}
        isSearch={this.state.isSearch}
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
