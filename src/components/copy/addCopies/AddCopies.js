import React, { Component } from 'react';
import { Col, Panel, Row } from 'react-bootstrap';

import ItemForm from '../../item/form/ItemForm';
import SearchContainer from '../../search/SearchContainer';
import Table from '../../general/Table';

export default class AddCopies extends Component {
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
          {this.props.isSearch ? (
            <SearchContainer
              noHeader
              type="item"
              onRowClick={this.props.openModal}
              onAddButton={this.props.onAddButton}
            />
          ) : (<ItemForm />)}
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
};
