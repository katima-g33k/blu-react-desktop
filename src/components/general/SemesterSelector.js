import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Select from './Select';

const options = moment.semester('list').map(({ code, name }) => ({
  label: name,
  value: code,
}));

export default class SemesterSelector extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
  }

  static defaultProps = {
    value: moment.semester('code'),
  }

  render() {
    return (
      <Select
        options={options}
        label={this.props.label}
        onChange={this.props.onChange}
        value={this.props.value}
      />
    );
  }
}
