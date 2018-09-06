import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox as RBCheckbox, Col } from 'react-bootstrap';

export default class Checkbox extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    id: PropTypes.string,
    inputWidth: PropTypes.shape(),
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    checked: false,
    id: '',
    inputWidth: { md: 9, mdOffset: 3, sm: 10, smOffset: 2 },
  }

  onChange = event => this.props.onChange(event, !this.props.checked)

  render() {
    return (
      <Col {...this.props.inputWidth}>
        <RBCheckbox
          checked={this.props.checked}
          id={this.props.id}
          onChange={this.onChange}
        >
          {this.props.label}
        </RBCheckbox>
      </Col>
    );
  }
}
