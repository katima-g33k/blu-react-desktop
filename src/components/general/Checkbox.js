import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox as RBCheckbox } from 'react-bootstrap';

export default class Checkbox extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    checked: false,
    id: '',
  }

  render() {
    return (
      <RBCheckbox
        checked={this.props.checked}
        id={this.props.id}
        onChange={this.props.onChange}
      >
        {this.props.label}
      </RBCheckbox>
    );
  }
}
