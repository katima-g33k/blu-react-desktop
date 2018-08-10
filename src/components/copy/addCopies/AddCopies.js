import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Panel, Row } from 'react-bootstrap';
import { Link } from 'react-router';

import ActionPanel from '../../general/ActionPanel';
import ItemForm from '../../../containers/ItemFormContainer';
import SearchContainer from '../../../containers/SearchContainer';
import Table from '../../general/Table';

export default class AddCopies extends Component {
  renderSearch = () => (
    <SearchContainer
      {...this.props}
      noHeader
      type="item"
      onRowClick={item => this.props.openModal({ item })}
      onAddButton={this.props.onAddButton}
    />
    )

  renderForm = () => {
    const { ean13, onFormCancel, onFormSave, params } = this.props;

    return (
      <ItemForm
        {...this.props}
        ean13={ean13}
        params={params}
        onCancel={onFormCancel}
        onSave={item => onFormSave({ item })}
      />
    );
  }

  render = () => (
    <Row>
      <Col md={10}>
        <Panel header="Ajouter des exemplaires">
          <h2>
            <Link
              to={`/member/view/${this.props.member.no}`}
              style={{ color: '#000', textDecoration: 'none' }}
            >
              {this.props.member.name}
            </Link>
          </h2>
          <Row>
            <Col md={4}>
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
        </Panel>
      </Col>
      <Col md={2}>
        <ActionPanel actions={this.props.actions} />
      </Col>
      {this.props.modal}
    </Row>
    )
}

AddCopies.propTypes = {
  actions: PropTypes.array,
  columns: PropTypes.array,
  data: PropTypes.array,
  ean13: PropTypes.string,
  isSearch: PropTypes.bool,
  member: PropTypes.shape(),
  modal: PropTypes.shape(),
  onAddButton: PropTypes.func,
  openModal: PropTypes.func,
  onFormSave: PropTypes.func,
  onFormCancel: PropTypes.func,
  params: PropTypes.shape(),
};
