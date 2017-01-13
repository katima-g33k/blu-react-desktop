import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  Checkbox,
  Col,
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
} from 'react-bootstrap';

export default class AutoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data || {},
      schema: props.schema || [],
    };

    this.renderSection = this.renderSection.bind(this);
    this.renderCheckbox = this.renderCheckbox.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.renderSelect = this.renderSelect.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.renderActions = this.renderActions.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCheckChange = this.onCheckChange.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      data: props.data || this.state.data,
      schema: props.schema || this.state.schema,
    });
  }

  onChange(event) {
    const data = this.state.data;
    data[event.target.id] = event.target.value;
    this.setState({ data });
  }

  onCheckChange(event) {
    const data = this.state.data;
    data[event.target.id] = event.target.checked;
    this.setState({ data });
  }

  renderCheckbox(input, index) {
    return (
      <FormGroup key={index}>
        <Col smOffset={2} mdOffset={3} sm={10} md={9}>
          <Checkbox
            id={input.key}
            onChange={this.onCheckChange}
            checked={!!this.state.data[input.key]}
          >
            {input.label}
          </Checkbox>
        </Col>
      </FormGroup>
    );
  }

  renderOptions(options) {
    return options.map((option, index) => {
      return (
        <option
          key={index}
          value={option.value}
        >
          {option.label}
        </option>
      );
    });
  }

  renderSelect(input, index) {
    return (
      <FormGroup key={index} controlId={input.key}>
        <Col componentClass={ControlLabel} sm={2} md={3}>
          {input.label}
        </Col>
        <Col sm={10} md={9}>
          <FormControl
            componentClass={input.type}
            value={input.default}
            onChange={this.onChange}
          >
            {this.renderOptions(input.options)}
          </FormControl>
        </Col>
      </FormGroup>
    );
  }

  renderInput(input, index) {
    const value = this.state.data[input.key];
    return (
      <FormGroup key={index} controlId={input.key}>
        <Col componentClass={ControlLabel} sm={2} md={3}>
          {input.label}
        </Col>
        <Col sm={10} md={9}>
          <FormControl
            type={input.type}
            placeholder={input.placeholder}
            onChange={this.onChange}
            value={value}
          />
        </Col>
      </FormGroup>
    );
  }

  renderSection(fields) {
    return fields.map((input, index) => {
      const keys = input.key.split('.');
      let value = this.state.data;
      keys.forEach((key) => {
        value = value ? value[key] : value;
      });

      if (input.type === 'checkbox') {
        return this.renderCheckbox(input, index);
      }

      if (input.type === 'select') {
        return this.renderSelect(input, index);
      }

      return this.renderInput(input, index);
    });
  }

  renderActions(actions) {
    const buttons = actions.map((action, index) => {
      return (
        <Button
          key={`action${index}`}
          {...action.options}
        >
          {action.label}
        </Button>
      );
    });

    return (
      <FormGroup>
        <Col smOffset={2} mdOffset={3} sm={10} md={9}>
          <ButtonToolbar>
            {buttons}
          </ButtonToolbar>
        </Col>
      </FormGroup>
    );
  }

  render() {
    return (
      <Form {...this.props.options}>
        <h3>{this.props.title}</h3>
        {this.renderSection(this.props.schema)}
      </Form>
    );
  }
}

AutoForm.propTypes = {
  actions: React.PropTypes.shape(),
  data: React.PropTypes.shape(),
  options: React.PropTypes.shape(),
  schema: React.PropTypes.array,
  title: React.PropTypes.string,
  titleClass: React.PropTypes.string,
};
