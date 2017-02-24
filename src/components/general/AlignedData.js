import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';

export default class AlignedData extends Component {
  render() {
    return (
      <Row
        className={this.props.className}
        componentClass={this.props.componentClass || 'div'}
        style={{ marginTop: 5, marginBottom: 5 }}
      >
        <Col md={4}>{this.props.label}</Col>
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
  className: React.PropTypes.string,
  componentClass: React.PropTypes.string,
  label: propType,
  value: propType,
};
