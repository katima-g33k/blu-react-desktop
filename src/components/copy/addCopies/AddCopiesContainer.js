import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

import AddCopies from './AddCopies';
import addCopiesColums from './addCopiesColumns';
import Copy from '../../../lib/models/Copy';
import { InformationModal, InputModal } from '../../general/modals';
import Item from '../../../lib/models/Item';
import Member from '../../../lib/models/Member';
import Reservation from '../../../lib/models/Reservation';
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
      reservation: null,
      showModal: null,
    };

    this.deleteCopy = this.deleteCopy.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getActions = this.getActions.bind(this);
    this.getModal = this.getModal.bind(this);
    this.onItemScan = this.onItemScan.bind(this);
    this.openInputModal = this.openInputModal.bind(this);
    this.save = this.save.bind(this);
    this.updatePrice = this.updatePrice.bind(this);

    this.columns = addCopiesColums;
    this.columns.find(column => column.dataField === 'actions').dataFormat = (cell, copy) => !copy.reservation && (
    <div>
      <Button
        bsStyle="default"
        onClick={() => this.setState({ copy, showModal: 'input', isSearch: true })}
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
  }

  static propTypes = {
    api: PropTypes.shape().isRequired,
  }

  async componentWillMount() {
    const { no } = this.props.params;

    scanner.addListener('onItemScan', this.onItemScan);

    try {
      const res = await this.props.api.member.getName(no);
      this.setState({ member: new Member({ ...res, no }) });
    } catch (error) {
      this.setState({ error });
    }
  }

  componentWillUnmount() {
    scanner.removeListener('onItemScan', this.onItemScan);
  }

  async deleteCopy(id) {
    try {
      await this.props.api.member.copy.delete(id);
      const copies = this.state.copies.filter(copy => copy.id !== id);
      this.setState({ copies });
    } catch (error) {
      this.setState({ error });
    }
  }

  closeModal(state = {}) {
    this.setState({ ...state, item: null, copy: null, reservation: null, showModal: null });
  }

  getActions() {
    return [{
      label: 'Terminer',
      href: `/member/view/${this.props.params.no}`,
      style: 'primary',
    }];
  }

  getModal() {
    const { copy, error, item, reservation, showModal } = this.state;

    if (error) {
      return (
        <InformationModal
          message={error.message}
          onClick={() => this.setState({ error: null })}
          title={`Erreur ${error.code}`}
        />
      );
    }

    switch (showModal) {
      case 'input':
        return (
          <InputModal
            message={'Entrer le montant souhaité'}
            onCancel={this.closeModal}
            onSave={copy ? this.updatePrice : this.save}
            title={copy ? copy.item.name : item.name}
            type="number"
            value={copy && `${this.state.copy.price}`}
          />
        );
      case 'reservation':
        return (
          <InformationModal
            message={`Cet ouvrage est réservé par ${reservation.parent.name} veuillez le mettre de côté`}
            onClick={this.closeModal}
            title={'Ouvrage réservé'}
          />
        );
      default:
        return null;
    }
  }

  openInputModal(data = {}) {
    this.setState({ ...data, showModal: 'input', isSearch: true });
  }

  async onItemScan(ean13) {
    try {
      const { id } = await this.props.api.item.exists(ean13);

      if (id) {
        const res = this.props.api.item.get(id, { forCopy: true });
        this.setState({ item: new Item(res), showModal: 'input', isSearch: true });
      } else {
        this.setState({ ean13, isSearch: false });
      }
    } catch (error) {
      this.setState({ error });
    }
  }

  async save(event, value) {
    const price = parseInt(value, 10);
    const memberNo = this.props.params.no;
    const itemId = this.state.item.id;

    try {
      const res = await this.props.api.member.copy.insert(memberNo, itemId, price);
      const { id, reservation } = res;
      const { copies, item } = this.state;
      const copy = new Copy({
        id,
        item,
        price,
        transaction: [{
          code: Transaction.TYPES.ADD,
          date: new Date(),
        }],
      });

      if (reservation) {
        copy.reserve(reservation.member);
      }

      copies.push(copy);

      this.closeModal({ copies });

      if (reservation) {
        this.setState({ showModal: 'reservation', reservation: new Reservation({ parent: reservation }) });
      }
    } catch (error) {
      this.closeModal({ error });
    }
  }

  async updatePrice(event, value) {
    const price = parseInt(value, 10);
    const { id } = this.state.copy;

    try {
      await this.props.api.member.copy.update(id, price);
      const { copies } = this.state;
      copies.find(copy => copy.id === id).price = price;
      this.closeModal({ copies });
    } catch (error) {
      this.closeModal({ error });
    }
  }

  render() {
    const { columns, getActions, getModal, props } = this;
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
        openModal={this.openInputModal}
        onFormSave={this.openInputModal}
        onFormCancel={() => this.setState({ isSearch: true })}
      />
    );
  }
}

AddCopiesContainer.propTypes = {
  params: React.PropTypes.shape(),
};
