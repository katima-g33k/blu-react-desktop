import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

import AddCopies from './AddCopies';
import addCopiesColums from './addCopiesColumns';
import API from '../../../lib/API';
import Copy from '../../../lib/models/Copy';
import { InformationModal, InputModal } from '../../general/modals';
import Item from '../../../lib/models/Item';
import Member from '../../../lib/models/Member';
import scanner from '../../../lib/Scanner';
import Transaction from '../../../lib/models/Transaction';

export default class AddCopiesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copies: [],
      ean13: null,
      error: null,
      isSearch: true,
      member: new Member({ no: props.params.no }),
      showModal: false,
    };

    this.deleteCopy = this.deleteCopy.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getActions = this.getActions.bind(this);
    this.getModal = this.getModal.bind(this);
    this.onItemScan = this.onItemScan.bind(this);
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
    const { no } = this.props.params;

    scanner.addListener('onItemScan', this.onItemScan);

    API.member.getName(no, (error, res) => {
      if (error) {
        this.setState({ error });
        return;
      }

      this.setState({ member: new Member({ ...res, no }) });
    });
  }

  componentWillUnmount() {
    scanner.removeListener('onItemScan', this.onItemScan);
  }

  deleteCopy(id) {
    API.copy.delete(id, (error) => {
      if (error) {
        this.setState({ error });
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
    const { copy, error, item, showModal } = this.state;

    if (error) {
      return (
        <InformationModal
          message={error.message}
          onClick={() => this.setState({ error: null })}
          title={`Erreur ${error.code}`}
        />
      );
    }

    return showModal ? (
      <InputModal
        message={'Entrer le montant souhaité'}
        onCancel={this.closeModal}
        onSave={copy ? this.updatePrice : this.save}
        title={copy ? copy.item.name : item.name}
        type="number"
        value={copy && `${this.state.copy.price}`}
      />
    ) : null;
  }

  onItemScan(ean13) {
    API.item.select(ean13, { forCopy: true }, (error, res) => {
      if (error) {
        this.setState({ error });
        return;
      }

      if (res.id) {
        this.openModal({ item: new Item(res) });
      } else {
        this.setState({ ean13, isSearch: false });
      }
    });
  }

  openModal(data = {}) {
    this.setState({ ...data, showModal: true, isSearch: true });
  }

  save(event, value) {
    const price = parseInt(value, 10);
    const memberNo = this.props.params.no;
    const itemId = this.state.item.id;

    API.copy.insert(memberNo, itemId, price, (error, res) => {
      if (error) {
        this.closeModal({ error });
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
    const { id } = this.state.copy;

    API.copy.update(id, price, (error) => {
      if (error) {
        this.closeModal({ error });
        return;
      }

      const { copies } = this.state;
      copies.find(copy => copy.id === id).price = price;
      this.closeModal({ copies });
    });
  }

  render() {
    const { columns, getActions, getModal, openModal, props } = this;
    const { copies, ean13, isSearch, member } = this.state;

    return (
      <AddCopies
        {...props}
        actions={getActions()}
        columns={columns}
        data={copies}
        ean13={ean13}
        isSearch={isSearch}
        member={member}
        modal={getModal()}
        onAddButton={() => this.setState({ isSearch: false })}
        openModal={openModal}
        onFormSave={openModal}
        onFormCancel={() => this.setState({ isSearch: true })}
      />
    );
  }
}

AddCopiesContainer.propTypes = {
  params: React.PropTypes.shape(),
};
