import React, { Component } from 'react';
import { Col, Panel } from 'react-bootstrap';
import I18n from '../../../lib/i18n/i18n';
import AutoForm from '../../general/AutoForm';

export default class ItemForm extends Component {
  render() {
    return (
      <Panel header={I18n.t('ItemForm.title')}>
        <Col md={8}>
          <AutoForm
            schema={this.props.schema}
            data={this.props.data}
            onCancel={() => {}}
            onSave={() => {}}
          />
        </Col>
      </Panel>);
  }
}

ItemForm.propTypes = {
  data: React.PropTypes.shape(),
  schema: React.PropTypes.shape(),
};
