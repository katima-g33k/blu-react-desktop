import React, { Component } from 'react';
import PropTypes from 'prop-types';

import InformationModal from './InformationModal';

export default class Modal extends Component {
  static propTypes = {
    display: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  }

  render() {
    return this.props.display ? (
      <InformationModal
        message={this.props.message}
        onClick={this.props.onClick}
        title={this.props.title}
      />
    ) : null;
  }
}
