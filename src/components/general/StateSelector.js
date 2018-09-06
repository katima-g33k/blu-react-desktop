/* eslint react/no-did-mount-set-state: 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DEFAULT_STATE_VALUE } from '../../lib/constants';
import I18n from '../../lib/i18n';
import { Select } from './formInputs';
import { State } from '../../lib/models';

export default class StateSelector extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    fetch: PropTypes.func,
    states: PropTypes.arrayOf(PropTypes.instanceOf(State)),
    value: Select.propTypes.value,
  }

  static defaultProps = {
    onChange: () => {},
    fetch: () => {},
    states: [],
    value: null,
  }

  state = {
    options: [],
    statesByCode: {},
    value: this.props.value,
  }

  componentDidMount() {
    if (!this.props.states.length) {
      this.props.fetch();
    } else {
      this.setState({
        options: this.getOptions(this.props.states),
        statesByCode: this.getStatesByCode(this.props.states),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.states.length !== nextProps.states.length) {
      this.setState({
        options: this.getOptions(nextProps.states),
        statesByCode: this.getStatesByCode(nextProps.states),
      });
    }

    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  getOptions = states => states.map(state => ({
    label: state.name,
    value: state.code,
  }))

  getStatesByCode = states => states.reduce((acc, state) => ({
    ...acc,
    [state.code]: state,
  }), {})

  handleOnChange = (event, value) => {
    this.setState({ value });
    this.props.onChange(event, this.state.statesByCode[value]);
  }

  render() {
    return (
      <Select
        default={DEFAULT_STATE_VALUE}
        id="state"
        label={I18n('MemberForm.fields.state')}
        onChange={this.handleOnChange}
        options={this.state.options}
        value={this.state.value}
      />
    );
  }
}
