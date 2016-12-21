import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import I18n from '../lib/i18n/i18n';

export default class ItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (<Panel header={I18n.t('ItemForm.title')} />);
  }
}
