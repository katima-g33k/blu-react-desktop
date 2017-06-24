import React, { Component } from 'react';
import { Col, Panel } from 'react-bootstrap';

import I18n from '../../../lib/i18n/i18n';
import AutoForm from '../../general/AutoForm';

export default class MemberForm extends Component {
  render() {
    return (
      <Panel header={I18n.t('MemberForm.title')}>
        <Col md={8}>
          <AutoForm
            schema={this.props.schema}
            data={this.props.member}
            onCancel={this.props.onCancel}
            onSave={this.props.onSave}
          />
        </Col>
        {this.props.modal}
      </Panel>
    );
  }
}

MemberForm.propTypes = {
  member: React.PropTypes.shape(),
  modal: React.PropTypes.shape(),
  onCancel: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  schema: React.PropTypes.shape().isRequired,
};
