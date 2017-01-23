import React, { Component } from 'react';
import { Button, Col, Glyphicon, Panel, Row } from 'react-bootstrap';
import Search from './Search';
import Table from './Table';
import InputModal from './modals/InputModal';
import HTTP from '../lib/HTTP';
import settings from '../settings.json';

const columns = [
  {
    dataField: 'id',
    isKey: true,
    hidden: true,
  },
  {
    dataField: 'title',
    label: 'Titre',
  },
  {
    dataField: 'price',
    label: 'Prix',
    dataFormat(cell) {
      return `${cell} $`;
    },
  },
];

export default class AddCopies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copies: [],
      isSearch: true,
      showModal: false,
    };

    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.deleteCopy = this.deleteCopy.bind(this);
    this.save = this.save.bind(this);
    this.columns = columns;
    this.columns.push({
      dataField: 'action',
      label: 'Actions',
      dataAlign: 'center',
      dataFormat: (cell, row) => {
        const onClick = (event) => {
          event.preventDefault();
          this.deleteCopy(row.id);
        };
        return !row.reservation ? (
          <Button bsStyle="danger" onClick={onClick}>
            <Glyphicon glyph="trash" />
          </Button>
        ) : null;
      },
    });
  }

  closeModal(state = {}) {
    this.setState({ ...state, item: null, showModal: false });
  }

  openModal(item) {
    this.setState({ item, showModal: true });
  }

  save(event, value) {
    const data = {
      member_no: this.props.params.id,
      item_id: this.state.item.id,
      price: value,
    };

    HTTP.post(`${settings.apiUrl}/copy/insert`, data, (err, res) => {
      if (err) {
        this.closeModal();
        // TODO: Display error message
        return;
      }

      const copies = this.state.copies;
      copies.push({
        id: res.id,
        title: this.state.item.name,
        price: value,
        reservation: res.reservation,
      });

      this.closeModal({ copies });
    });
  }

  deleteCopy(id) {
    HTTP.post(`${settings.apiUrl}/copy/delete`, { id }, (err) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      const copies = this.state.copies.filter((copy) => {
        return copy.id !== id;
      });

      this.setState({ copies });
    });
  }

  renderModal() {
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

  render() {
    return (
      <Panel header="Ajouter des exemplaires">
        <Row>
          <Col md={3}>
             <Table columns={this.columns} data={this.state.copies} striped />
          </Col>
        </Row>
        <Search noHeader type="item" onRowClick={this.openModal} />
        {this.renderModal()}
      </Panel>
    );
  }
}

AddCopies.propTypes = {
  params: React.PropTypes.shape(),
};
