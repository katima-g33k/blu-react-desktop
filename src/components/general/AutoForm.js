import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  Checkbox,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
} from 'react-bootstrap';

export default class AutoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data || {},
      canSave: true,
      schema: props.schema || {},
    };

    this.canSave = this.canSave.bind(this);
    this.onSave = this.onSave.bind(this);
    this.renderSections = this.renderSections.bind(this);
    this.renderCheckbox = this.renderCheckbox.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.renderSelect = this.renderSelect.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCheckChange = this.onCheckChange.bind(this);
    this.renderFields = this.renderFields.bind(this);
    this.renderInline = this.renderInline.bind(this);
    this.renderField = this.renderField.bind(this);
    this.renderOptgroups = this.renderOptgroups.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      data: props.data || this.state.data,
      schema: props.schema || this.state.schema,
    });
  }

  canSave() {
    let canSave = true;
    const { data, schema } = this.state;
    const required = [];

    schema.sections.forEach(({ fields }) => {
      fields.forEach((field) => {
        if (field.inline) {
          field.inline.forEach((inlineField) => {
            if (inlineField.required) {
              required.push(inlineField);
            }
          });
        } else if (field.required) {
          required.push(field);
        }
      });
    });

    required.forEach((requiredField) => {
      const field = requiredField;
      const { key, validationFn } = field;
      if (validationFn) {
        if (!validationFn(data)) {
          field.invalid = true;
          canSave = false;
        } else {
          delete field.invalid;
        }
      } else if (!data[key]) {
        field.invalid = true;
        canSave = false;
      } else {
        delete field.invalid;
      }
    });

    this.setState({ canSave, schema });
    return canSave;
  }

  onChange(event, inputOnChange) {
    const data = inputOnChange || this.state.data;

    if (!inputOnChange) {
      data[event.target.id] = event.target.value;
    }

    this.setState({ data });
  }

  onCheckChange(event, inputOnChange) {
    const data = inputOnChange || this.state.data;

    if (!inputOnChange) {
      data[event.target.id] = event.target.checked;
    }

    this.setState({ data });
  }

  onSave(event) {
    event.preventDefault();

    if (this.canSave()) {
      this.props.onSave(this.state.data);
    } else {
      // TODO: display message
    }
  }

  renderCheckbox(input) {
    const data = this.state.data;
    const checked = input.value ? input.value(data[input.key], data) : data[input.key];
    const onChange = this.onCheckChange;
    const actions = {
      onChange(event) {
        if (input.onChange) {
          onChange(event, input.onChange(event, data));
        } else {
          onChange(event);
        }
      },
    };
    return (
      <FormGroup key={input.key}>
        <Col smOffset={2} mdOffset={3} sm={10} md={9}>
          <Checkbox
            id={input.key}
            onChange={actions.onChange}
            checked={checked}
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

  renderOptgroups(optgroups) {
    return optgroups.map((optgroup, index) => {
      return (
        <optgroup
          key={`optgroup${index}`}
          label={optgroup.label}
        >
          {this.renderOptions(optgroup.options)}
        </optgroup>
      );
    });
  }

  renderSelect(input) {
    const data = this.state.data;
    const onChange = this.onChange;
    const value = input.value ? input.value(data[input.key], data) || input.default : data[input.key] || input.default;
    const actions = {
      onChange(event) {
        if (input.onChange) {
          onChange(event, input.onChange(event, data));
        } else {
          onChange(event);
        }
      },
    };

    return (
      <FormGroup key={input.key} controlId={input.key}>
        <Col componentClass={ControlLabel} sm={2} md={3}>
          {input.label}
        </Col>
        <Col sm={10} md={9}>
          <FormControl
            componentClass='select'
            value={value}
            onChange={actions.onChange}
          >
            {input.optgroups ? this.renderOptgroups(input.optgroups) : this.renderOptions(input.options || [])}
          </FormControl>
        </Col>
      </FormGroup>
    );
  }

  renderTextarea(input) {
    const data = this.state.data;
    const value = input.value ? input.value(data[input.key], data) : data[input.key];
    const onChange = this.onChange;
    const actions = {
      onChange(event) {
        if (input.onChange) {
          onChange(event, input.onChange(event, data));
        } else {
          onChange(event);
        }
      },
    };

    return (
      <FormGroup key={input.key} controlId={input.key}>
        <ControlLabel>{input.label}</ControlLabel>
        <FormControl
          componentClass="textarea"
          placeholder={input.placeholder}
          onChange={actions.onChange}
          value={value}
        />
      </FormGroup>
    );
  }

  renderInput(input) {
    const data = this.state.data;
    const value = input.value ? input.value(data[input.key], data) : data[input.key];
    const onChange = this.onChange;
    const actions = {
      onChange(event) {
        if (input.onChange) {
          onChange(event, input.onChange(event, data));
        } else {
          onChange(event);
        }
      },
    };

    return (
      <FormGroup
        controlId={input.key}
        key={input.key}
        validationState={input.invalid && 'error'}
      >
        <Col componentClass={ControlLabel} sm={2} md={3}>
          {input.label}
        </Col>
        <Col sm={10} md={9}>
          <FormControl
            type={input.type}
            placeholder={input.placeholder}
            onChange={actions.onChange}
            value={value || ''}
            disabled={input.disabled}
          />
          <FormControl.Feedback />
        </Col>
      </FormGroup>
    );
  }

  renderInline(fields) {
    const width = Math.floor(12 / fields.length);
    const inlineFields = fields.map((field, index) => {
      return (
        <Col
          md={width}
          key={`inline${index}`}
        >
          {this.renderField(field)}
        </Col>
      );
    });

    return (
      <Col key={fields[0].key}>{inlineFields}</Col>
    );
  }

  renderField(field) {
    const keys = field.key.split('.');
    let value = this.state.data;
    keys.forEach((key) => {
      value = value ? value[key] : value;
    });

    switch (field.type) {
      case 'checkbox':
        return this.renderCheckbox(field);
      case 'custom':
        return (
          <field.component
            {...field}
            data={value}
          />
        );
      case 'select':
        return this.renderSelect(field);
      case 'textarea':
        return this.renderTextarea(field);
      default:
        return this.renderInput(field);
    }
  }

  renderFields(fields) {
    return fields.map(field => field.inline ? this.renderInline(field.inline) : this.renderField(field));
  }

  renderSections(sections) {
    return sections.map((section, index) => {
      const { fields, title, titleClass } = section;

      return (
        <FormGroup key={`section${index}`}>
          {title ? (
            <Col componentClass={titleClass || 'h2'}>
              {title}
            </Col>
          ) : ''}
          {this.renderFields(fields)}
          <hr/>
        </FormGroup>
      );
    });
  }

  render() {
    const { options, sections, titleClass } = this.state.schema;
    const { onCancel } = this.props;

    return (
      <Form {...options}>
        <Col componentClass={titleClass || 'h1'}>
          {this.state.schema.title}
        </Col>
        {this.renderSections(sections)}
        <ButtonToolbar>
          <Button onClick={onCancel}>
            {'Annuler'}
          </Button>
          <Button
            bsStyle="primary"
            onClick={this.onSave}
          >
            {'Sauvegarder'}
          </Button>
        </ButtonToolbar>
      </Form>
    );
  }
}

AutoForm.propTypes = {
  data: React.PropTypes.shape().isRequired,
  schema: React.PropTypes.shape().isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
};
