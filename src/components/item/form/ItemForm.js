import React, { Component } from 'react';
import { Col, Panel } from 'react-bootstrap';
import I18n from '../../../lib/i18n/i18n';
import AutoForm from '../../general/AutoForm';

export default class ItemForm extends Component {
  render() {
    const { data, modal, onCancel, onSave, schema } = this.props;

    return (
      <Panel header={I18n.t('ItemForm.title')}>
        <Col md={8}>
          <AutoForm
            schema={schema}
            data={data}
            onCancel={onCancel}
            onSave={onSave}
          />
        </Col>
        {modal}
      </Panel>
    );
  }
}

ItemForm.propTypes = {
  data: React.PropTypes.shape(),
  modal: React.PropTypes.shape(),
  onCancel: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  schema: React.PropTypes.shape().isRequired,
};
