import React, { Component, PropTypes } from 'react';
import { Col, Row } from 'react-bootstrap';

export default class AlignedData extends Component {
  render() {
    const {
      className,
      componentClass = 'div',
      label,
      value,
    } = this.props;

    return (
      <Row
        className={className}
        componentClass={componentClass}
        style={{ marginTop: 5, marginBottom: 5 }}
      >
        <Col md={4}>{label}</Col>
        <Col>{value}</Col>
      </Row>
    );
  }
}

const propType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.object,
]).isRequired;

AlignedData.propTypes = {
  className: PropTypes.string,
  componentClass: PropTypes.string,
  label: propType,
  value: propType,
};
