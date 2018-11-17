import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from '../../../lib/i18n';
import { ActionPanel } from '../../general';

export default class AddCopiesActionPanel extends Component {
  static propTypes = {
    onDone: PropTypes.func.isRequired,
  };

  actions = [{
    label: i18n('actions.done'),
    onClick: this.props.onDone,
    style: 'primary',
  }];

  render() {
    return (<ActionPanel actions={this.actions} />);
  }
}
