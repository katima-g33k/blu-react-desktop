/* eslint react/no-did-mount-set-state: 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import I18n from '../../lib/i18n';
import { Select } from './formInputs';

export default class SubjectSelector extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    onLoad: PropTypes.func,
    subjectsByCategory: PropTypes.arrayOf(PropTypes.shape()),
    value: Select.propTypes.value,
  }

  static defaultProps = {
    onChange: () => {},
    onLoad: () => {},
    subjectsByCategory: [],
    value: null,
  }

  state = {
    optGroups: [],
    subjectsByValue: {},
    value: this.props.value,
  }

  componentDidMount() {
    if (!this.props.subjectsByCategory.length) {
      this.props.onLoad();
    } else {
      this.setState({
        optGroups: this.getOptGroups(this.props.subjectsByCategory),
        subjectsByValue: this.getSubjectsByValue(this.props.subjectsByCategory),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.subjectsByCategory.length !== nextProps.subjectsByCategory.length) {
      this.setState({
        optGroups: this.getOptGroups(nextProps.subjectsByCategory),
        subjectsByValue: this.getSubjectsByValue(nextProps.subjectsByCategory),
      });
    }

    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  getOptGroups = subjectsByCategory => subjectsByCategory.map(category => ({
    label: category.name,
    options: category.subject.map(subject => ({
      label: subject.name,
      value: `${subject.id}`,
    })),
  }))

  getSubjectsByValue = subjectsByCategory => subjectsByCategory.reduce((acc, category) => {
    category.subject.forEach((subject) => {
      acc[subject.id] = {
        ...subject,
        category: {
          id: category.id,
          name: category.name,
        },
      };
    });

    return acc;
  }, {});

  handleOnChange = (event, value) => {
    this.setState({ value });
    this.props.onChange(event, this.state.subjectsByValue[value]);
  }

  render() {
    return (
      <Select
        id="subject"
        label={I18n('ItemForm.fields.subject')}
        onChange={this.handleOnChange}
        optgroups={this.state.optGroups}
        value={this.state.value}
      />
    );
  }
}
