import React, { Component } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';

import AutoForm from '../AutoForm';

export default class FormModal extends Component {
  render() {
    const { data, onCancel, onSave, schema, title } = this.props;

    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
          <AutoForm
            schema={schema}
            data={data}
            onCancel={onCancel}
            onSave={onSave}
          />
            </Col>
          </Row>
        </Modal.Body>
      </Modal.Dialog>
    );
  }
}

FormModal.propTypes = {
  data: React.PropTypes.shape().isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
  schema: React.PropTypes.shape().isRequired,
};
