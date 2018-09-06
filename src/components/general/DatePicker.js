import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  ControlLabel,
  FormControl,
  Row,
} from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import moment from 'moment';

const styles = {
  label: {
    paddingTop: '6px',
  },
};

export default class DatePicker extends Component {
  static propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.instanceOf(Date),
      PropTypes.instanceOf(moment),
    ]),
  };

  static defaultProps = {
    label: '',
    value: moment(),
  }

  render() {
    return (
      <Row>
        <Col
          componentClass={ControlLabel}
          md={2}
          style={styles.label}
        >
          {this.props.label}
        </Col>
        <Col md={10}>
          <FormControl
            componentClass={ReactDatePicker}
            onChange={this.props.onChange}
            selected={this.props.value}
          />
        </Col>
      </Row>
    );
  }
}
