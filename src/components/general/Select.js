import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  ControlLabel,
  FormControl,
  Row,
} from 'react-bootstrap';

const styles = {
  label: {
    marginTop: '7px',
    textAlign: 'right',
  },
};

export default class Select extends Component {
  static propTypes = {
    default: PropTypes.string,
    id: PropTypes.string,
    inputWidth: PropTypes.shape(),
    label: PropTypes.string.isRequired,
    labelWidth: PropTypes.shape(),
    onChange: PropTypes.func.isRequired,
    optgroups: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      })),
    })),
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    default: '',
    id: '',
    inputWidth: { md: 9, sm: 10 },
    labelWidth: { md: 3, sm: 2 },
    optgroups: [],
    options: [],
    value: '',
  }

  onChange = event => this.props.onChange(event, event.target.value)

  renderOption = ({ label, value }) => (
    <option
      key={value}
      value={value}
    >
      {label}
    </option>
  )

  renderOptions = (options = this.props.options) => options.map(this.renderOption)

  renderOptgroup = ({ label, options }) => (
    <optgroup
      key={label}
      label={label}
    >
      {this.renderOptions(options)}
    </optgroup>
  )

  renderOptgroups = () => this.props.optgroups.map(this.renderOptgroup)

  renderContent = () => {
    if (this.props.optgroups.length) {
      return this.renderOptgroups();
    }

    return this.renderOptions();
  }

  render() {
    return (
      <div>
        <Col
          {...this.props.labelWidth}
          componentClass={ControlLabel}
          style={styles.label}
        >
          {this.props.label}
        </Col>
        <Col {...this.props.inputWidth}>
          <FormControl
            componentClass="select"
            id={this.props.id}
            onChange={this.onChange}
            value={this.props.value || this.props.default}
          >
            {this.renderContent()}
          </FormControl>
        </Col>
      </div>
    );
  }
}
