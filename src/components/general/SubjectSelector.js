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
    value: this.props.value,
  }

  componentDidMount() {
    if (!this.props.subjectsByCategory.length) {
      this.props.onLoad();
    } else {
      this.setOptGroups(this.props.subjectsByCategory);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.subjectsByCategory.length !== nextProps.subjectsByCategory.length) {
      this.setOptGroups(nextProps.subjectsByCategory);
    }

    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  setOptGroups = subjectsByCategory => this.setState({
    optGroups: subjectsByCategory.map(category => ({
      label: category.name,
      options: category.subject.map(subject => ({
        label: subject.name,
        value: `${subject.id}`,
      })),
    })),
  })

  handleOnChange = (event, value) => {
    this.setState({ value });
    this.props.onChange(event, value);
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
