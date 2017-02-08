import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';

export default class AlignedData extends Component {
  render() {
    return (
      <Row componentClass={this.props.componentClass || 'div'}>
        <Col md={3}>{this.props.label}</Col>
        <Col>{this.props.value}</Col>
      </Row>
    );
  }
}

const propType = React.PropTypes.oneOfType([
  React.PropTypes.string,
  React.PropTypes.object,
]).isRequired;

AlignedData.propTypes = {
  label: propType,
  value: propType,
  componentClass: React.PropTypes.string,
};
