import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';

import CopyTable from './CopyTable';
import CopyColumns from './columns';
import { ConfirmModal, InformationModal, InputModal, SearchModal } from '../../general/modals';
import Transaction from '../../../lib/models/Transaction';

export default class CopyTableContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCopy: null,
      copies: props.copies,
      error: null,
      showModal: null,
    };

    this.cancelReservation = this.cancelReservation.bind(this);
    this.remove = this.remove.bind(this);
    this.refund = this.refund.bind(this);
    this.reserve = this.reserve.bind(this);
    this.sell = this.sell.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
    this.getModal = this.getModal.bind(this);

    this.columns = CopyColumns.filter((column) => {
      if (this.props.member) {
        return !column.itemOnly;
      }

      return !column.memberOnly;
    });
  }

  static propTypes = {
    api: PropTypes.shape().isRequired,
  }

  componentWillMount() {
    this.columns.find(c => c.dataField === 'priceString').dataFormat = (price, copy) => (
      <Button
        bsStyle="link"
        onClick={() => this.setState({ activeCopy: copy, showModal: 'update' })}
        disabled={copy.isPaid || copy.isSold || copy.isReserved}
      >
        {price}
      </Button>
    );

    this.columns.find(c => c.dataField === 'actions').dataFormat = (cell, copy) => {
      if (copy.isPaid) {
        return '';
      }

      if (copy.isSold) {
        return (
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="cancel">{'Annuler la vente'}</Tooltip>}
          >
            <Button bsStyle="danger" onClick={() => this.refund(copy.id)}>
              <Glyphicon glyph="ban-circle" />
            </Button>
          </OverlayTrigger>
        );
      }

      if (copy.isReserved) {
        return (
          <ButtonGroup>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="cancel">{'Annuler la réservation'}</Tooltip>}
            >
              <Button
                bsStyle="primary"
                onClick={() => this.setState({ activeCopy: copy, showModal: 'cancelReservation' })}
              >
                <Glyphicon glyph="ban-circle" />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="sellParent">{'Vendre à moitié prix'}</Tooltip>}
            >
              <Button
                onClick={() => this.sell(copy, true)}
              >
                {'$'}
              </Button>
            </OverlayTrigger>
          </ButtonGroup>
        );
      }

      return (
        <ButtonGroup>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="reserve">{'Réserver'}</Tooltip>}
          >
            <Button
              bsStyle="primary"
              onClick={() => this.setState({ activeCopy: copy, showModal: 'reserve' })}
            >
              <Glyphicon glyph="user" />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="sellParent">{'Vendre à moitié prix'}</Tooltip>}
          >
            <Button
              onClick={() => this.sell(copy, true)}
            >
              {'$'}
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="sell">{'Vendre à prix régulier'}</Tooltip>}
          >
            <Button
              onClick={() => this.sell(copy)}
              bsStyle="success"
            >
              {'$$'}
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="delete">{'Supprimer de l\'inventaire'}</Tooltip>}
          >
            <Button
              bsStyle="danger"
              onClick={() => this.setState({ activeCopy: copy, showModal: 'remove' })}
            >
              <Glyphicon glyph="trash" />
            </Button>
          </OverlayTrigger>
        </ButtonGroup>
      );
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      activeCopy: null,
      copies: props.copies || [],
      error: null,
      showModal: null,
    });
  }

  async cancelReservation() {
    const { id } = this.state.activeCopy;

    try {
      await this.props.api.member.copy.transaction.delete(id, Transaction.TYPES.RESERVE);
      const { copies } = this.state;
      copies.find(copy => copy.id === id).cancelReservation();
      this.setState({ copies, showModal: null, activeCopy: null });
    } catch (error) {
      this.setState({ error, showModal: null, activeCopy: null });
    }
  }

  async remove() {
    const { id } = this.state.activeCopy;

    try {
      await this.props.api.member.copy.delete(id);
      this.setState({
        copies: this.state.copies.filter(copy => copy.id !== id),
        showModal: null,
        activeCopy: null,
      });
    } catch (error) {
      this.setState({ error, showModal: null, activeCopy: null });
    }
  }

  async refund(id) {
    try {
      await this.props.api.member.copy.transaction.delete(id, Transaction.TYPES.SELL);
      const { copies } = this.state;
      copies.find(copy => copy.id === id).refund();
      this.setState({ copies });
    } catch (error) {
      this.setState({ error });
    }
  }

  async reserve(parent) {
    const { id } = this.state.activeCopy;

    try {
      await this.props.api.member.copy.transaction.insert(parent.no, id, Transaction.TYPES.RESERVE);
      const { copies } = this.state;
      copies.find(copy => copy.id === id).reserve(parent);
      this.setState({ copies, activeCopy: null, showModal: null });
    } catch (error) {
      this.setState({ error, showModal: null, activeCopy: null });
    }
  }

  async sell(copy, halfPrice) {
    const member = this.props.member || copy.member.no;
    const transactionType = Transaction.TYPES[halfPrice ? 'SELL_PARENT' : 'SELL'];

    try {
      await this.props.api.member.copy.transaction.insert(member, copy.id, transactionType);
      const { copies } = this.state;

      if (halfPrice) {
        copies.find(c => c.id === copy.id).sellParent();
      } else {
        copies.find(c => c.id === copy.id).sell();
      }

      this.setState({ copies });
    } catch (error) {
      this.setState({ error });
    }
  }

  updatePrice = async (event, value) => {
    event.preventDefault();

    const { id } = this.state.activeCopy;
    const price = parseInt(value, 10);

    try {
      await this.props.api.member.copy.update(id, price);
      const { copies } = this.state;
      copies.find(copy => copy.id === id).price = price;
      this.setState({ copies, showModal: null, activeCopy: null });
    } catch (error) {
      this.setState({ error, showModal: null, activeCopy: null });
    }
  }

  getModal() {
    const { error, showModal } = this.state;

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
      case 'remove':
        return (
          <ConfirmModal
            message={'Souhaitez-vous vraiment supprimer cet exemplaire ?'}
            title="Supprimer un exemplaire"
            onConfirm={this.remove}
            onCancel={() => this.setState({ activeCopy: null, showModal: null })}
            confirmationStyle="danger"
          />
        );
      case 'cancelReservation':
        return (
          <ConfirmModal
            message={'Souhaitez-vous vraiment annuler cette réservation ?'}
            title="Anuller une réservation"
            onConfirm={this.cancelReservation}
            onCancel={() => this.setState({ activeCopy: null, showModal: null })}
            confirmationStyle="danger"
          />
        );
      case 'update':
        return (
          <InputModal
            message="Entrer le nouveau montant"
            title={'Mettre à jour le prix'}
            type="number"
            value={this.state.activeCopy.price}
            onSave={this.updatePrice}
            onCancel={() => this.setState({ activeCopy: null, showModal: null })}
          />
        );
      case 'reserve':
        return (
          <SearchModal
            {...this.props}
            disableArchive
            onCancel={() => this.setState({ activeCopy: null, showModal: null })}
            onRowClick={this.reserve}
            type="parent"
          />
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <CopyTable
        columns={this.columns}
        data={this.state.copies}
        modal={this.getModal()}
      />
    );
  }
}

CopyTableContainer.propTypes = {
  copies: React.PropTypes.array.isRequired,
  member: React.PropTypes.string,
};
