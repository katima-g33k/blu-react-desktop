import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert as RBAlert } from 'react-bootstrap';

const styles = {
  marginBottom: 0,
};

export default class Alert extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
  };

  render() {
    return (
      <RBAlert bsStyle="warning" style={styles}>
        {this.props.label}
      </RBAlert>
    );
  }
}
