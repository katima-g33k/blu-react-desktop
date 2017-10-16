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
  Row,
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

  componentDidMount() {
    const formElements = document.getElementsByTagName('form')[0].elements;
    const focusable = ['number', 'text', 'textarea'];

    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];

      if (focusable.includes(element.type)) {
        element.focus();
        break;
      }
    }
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
    const inputWidth = input.inputWidth || { md: 9, mdOffset: 3, sm: 10, smOffset: 2 };
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
      <div key={`checkbox${input.key}`}>
        <Col {...inputWidth}>
          <Checkbox
            id={input.key}
            onChange={actions.onChange}
            checked={checked}
          >
            {input.label}
          </Checkbox>
        </Col>
      </div>
    );
  }

  renderOptions(options) {
    return options.map((option, index) => (
      <option
        key={index}
        value={option.value}
      >
        {option.label}
      </option>
    ));
  }

  renderOptgroups(optgroups) {
    return optgroups.map((optgroup, index) => (
      <optgroup
        key={`optgroup${index}`}
        label={optgroup.label}
      >
        {this.renderOptions(optgroup.options)}
      </optgroup>
    ));
  }

  renderSelect(input) {
    const {
      default: defaultVal,
      key,
      optgroups,
      options,
      value: valueFn,
    } = input;
    const labelWidth = input.labelWidth || { md: 3, sm: 2 };
    const inputWidth = input.inputWidth || { md: 9, sm: 10 };
    const data = this.state.data;
    const onChange = this.onChange;
    const value = valueFn ? valueFn(data[key], data) || defaultVal : data[key] || defaultVal;
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
      <div key={`select${input.key}`}>
        <Col componentClass={ControlLabel} {...labelWidth}>
          {input.label}
        </Col>
        <Col {...inputWidth}>
          <FormControl
            componentClass="select"
            value={value}
            onChange={actions.onChange}
          >
            {optgroups ? this.renderOptgroups(optgroups) : this.renderOptions(options || [])}
          </FormControl>
        </Col>
      </div>
    );
  }

  renderTextarea(input) {
    const inputWidth = input.inputWidth || { md: 9, mdOffset: 3, sm: 10, smOffset: 2 };
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
      <Col key={`textarea${input.key}`} {...inputWidth}>
        <ControlLabel style={{ paddingBottom: 5 }}>
          {input.label}
        </ControlLabel>
        <FormControl
          componentClass="textarea"
          placeholder={input.placeholder}
          onChange={actions.onChange}
          value={value}
        />
      </Col>
    );
  }

  renderInput(input) {
    const labelWidth = input.labelWidth || { md: 3, sm: 2 };
    const inputWidth = input.inputWidth || { md: 9, sm: 10 };
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
      <div key={`input${input.key}`}>
        <Col
          componentClass={ControlLabel}
          {...labelWidth}
        >
          {input.label}
        </Col>
        <Col
          {...inputWidth}
        >
          <FormControl
            type={input.type}
            placeholder={input.placeholder}
            onChange={actions.onChange}
            value={value || ''}
            disabled={input.disabled}
          />
          <FormControl.Feedback />
        </Col>
      </div>
    );
  }

  renderInline(fields) {
    return fields.map(field => this.renderField(field));
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
    return fields.map((field) => {
      const key = field.key || field.inline[0].key;
      const validationState = (field.invalid || (field.inline && field.inline[0].invalid)) && 'error';

      return (
        <FormGroup
          controlId={key}
          key={key}
          validationState={validationState}
        >
          {field.inline ? this.renderInline(field.inline) : this.renderField(field)}
        </FormGroup>
      );
    });
  }

  renderSections(sections) {
    return sections.map((section, index) => {
      const { fields, title, titleClass } = section;

      return (
        <Row key={`section${index}`}>
          {title ? (
            <Col componentClass={titleClass || 'h2'}>
              {title}
            </Col>
          ) : ''}
          {this.renderFields(fields)}
          <hr />
        </Row>
      );
    });
  }

  render() {
    const { options, sections, titleClass } = this.state.schema;
    const { confirmButtonText, onCancel } = this.props;

    return (
      <Form {...options}>
        <Col componentClass={titleClass || 'h1'}>
          {this.state.schema.title}
        </Col>
        {this.renderSections(sections)}
        <ButtonToolbar style={{ float: 'right' }}>
          {onCancel && (
            <Button onClick={onCancel}>
              {'Annuler'}
            </Button>
          )}
          <Button
            bsStyle="primary"
            type="submit"
            onClick={this.onSave}
          >
            {confirmButtonText || 'Sauvegarder'}
          </Button>
        </ButtonToolbar>
      </Form>
    );
  }
}

AutoForm.propTypes = {
  confirmButtonText: React.PropTypes.string,
  data: React.PropTypes.shape().isRequired,
  schema: React.PropTypes.shape().isRequired,
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func.isRequired,
};

AutoForm.defaultProps = {
  data: {},
  onSave: () => {},
  schema: {},
};
