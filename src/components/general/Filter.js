import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Input from './Input';
import Checkbox from './Checkbox';

const TYPES = {
  CHECKBOX: 'checkbox',
  CUSTOM: 'custom',
  INPUT: 'input',
};

const styles = {
  container: {
    display: 'inline-block',
    marginLeft: 15,
    marginRight: 15,
  },
};

export default class Filter extends Component {
  static propTypes = {
    customComponent: PropTypes.node,
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.oneOf(Object.values(TYPES)).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]).isRequired,
  };

  static defaultProps = {
    customComponent: null,
    id: null,
  };

  static TYPES = TYPES;

  get filters() {
    return {
      [TYPES.CHECKBOX]: (
        <Checkbox
          checked={!!this.props.value}
          id={this.props.id}
          inputWidth={{}}
          label={this.props.label}
          onChange={this.props.onChange}
        />
      ),
      [TYPES.CUSTOM]: this.props.customComponent,
      [TYPES.INPUT]: (
        <Input
          id={this.props.id}
          inputWidth={{}}
          labelWidth={{}}
          onChange={this.props.onChange}
          placeholder={this.props.label}
          value={`${this.props.value}`}
        />
      ),
    };
  }

  render() {
    return (
      <div style={styles.container}>
        {this.filters[this.props.type]}
      </div>
    );
  }
}
