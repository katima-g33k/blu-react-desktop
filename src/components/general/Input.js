import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  ControlLabel,
  FormControl,
} from 'react-bootstrap';

const styles = {
  label: {
    marginTop: '7px',
    textAlign: 'right',
  },
};

const types = {
  EMAIL: 'email',
  PHONE: 'phone',
  NUMBER: 'number',
  TEXT: 'text',
};

export default class Input extends Component {
  static propTypes = {
    data: PropTypes.shape(),
    disabled: PropTypes.bool,
    id: PropTypes.string,
    inputWidth: PropTypes.shape(),
    label: PropTypes.string,
    labelWidth: PropTypes.shape(),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    type: PropTypes.oneOf(Object.values(types)),
    value: PropTypes.string,
  }

  static defaultProps = {
    data: {},
    disabled: false,
    id: '',
    inputWidth: { md: 9, sm: 10 },
    label: '',
    labelWidth: { md: 3, sm: 2 },
    placeholder: '',
    required: false,
    type: types.TEXT,
    value: '',
  }

  static TYPES = types

  onChange = event => this.props.onChange(event, event.target.value)

  getDataAttributes = () => Object.keys(this.props.data).reduce((acc, cur) => ({
    ...acc,
    [`data-${cur}`]: this.props.data[cur],
  }), {})

  renderLabel = () => this.props.label && (
    <Col
      {...this.props.labelWidth}
      componentClass={ControlLabel}
      style={styles.label}
    >
      {this.props.label}{this.props.required && '*'}
    </Col>
  )

  render() {
    return (
      <div>
        {this.renderLabel()}
        <Col {...this.props.inputWidth}>
          <FormControl
            {...this.getDataAttributes()}
            disabled={this.props.disabled}
            id={this.props.id}
            onChange={this.onChange}
            placeholder={this.props.placeholder}
            type={this.props.type}
            value={this.props.value}
          />
        </Col>
      </div>
    );
  }
}
