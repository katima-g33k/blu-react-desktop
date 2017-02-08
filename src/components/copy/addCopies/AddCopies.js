import React, { Component } from 'react';
import { Col, Panel, Row } from 'react-bootstrap';

import ItemFormContainer from '../../item/form/ItemFormContainer';
import SearchContainer from '../../search/SearchContainer';
import Table from '../../general/Table';

export default class AddCopies extends Component {
  renderSearch() {
    return (
      <SearchContainer
        noHeader
        type="item"
        onRowClick={this.props.openModal}
        onAddButton={this.props.onAddButton}
      />
    );
  }

  renderForm() {
    return (
      <ItemFormContainer
        params={this.props.params}
        onCancel={this.props.onFormCancel}
        onSave={this.props.onFormSave}
      />
    );
  }

  render() {
    return (
      <Panel header="Ajouter des exemplaires">
        <Row>
          <Col md={3}>
            <Table
              columns={this.props.columns}
              data={this.props.data}
              striped
            />
          </Col>
        </Row>
        <Row>
          {this.props.isSearch ? this.renderSearch() : this.renderForm()}
        </Row>
        {this.props.modal}
      </Panel>
    );
  }
}

AddCopies.propTypes = {
  columns: React.PropTypes.array,
  data: React.PropTypes.array,
  isSearch: React.PropTypes.bool,
  modal: React.PropTypes.shape(),
  onAddButton: React.PropTypes.func,
  openModal: React.PropTypes.func,
  onFormSave: React.PropTypes.func,
  onFormCancel: React.PropTypes.func,
  params: React.PropTypes.shape(),
};
