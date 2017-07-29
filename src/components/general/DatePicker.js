import React, { Component, PropTypes } from 'react';
import { Col, ControlLabel, FormControl, Row } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';

export default class DatePicker extends Component {
  render() {
    const { label, onChange, value } = this.props;

    return (
      <Row>
        <Col
          componentClass={ControlLabel}
          md={2}
          style={{ paddingTop: '6px' }}
        >
          {label}
        </Col>
        <Col md={10}>
          <FormControl
            componentClass={ReactDatePicker}
            onChange={onChange}
            selected={value}
          />
        </Col>
      </Row>
    );
  }
}

DatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape(),
};
