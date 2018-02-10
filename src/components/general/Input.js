import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';

export default class Input extends Component {
  static propTypes = {
    id: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string,
  }

  static defaultProps = {
    checked: false,
    id: '',
    value: '',
  }

  render() {
    return (
      <FormControl
        id={this.props.id}
        onChange={this.props.onChange}
        placeholder={this.props.placeholder}
        type="text"
        value={this.props.value}
      />
    );
  }
}
