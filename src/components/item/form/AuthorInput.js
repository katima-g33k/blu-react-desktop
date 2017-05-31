import React, { Component, PropTypes } from 'react';
import {
  Button,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Glyphicon,
} from 'react-bootstrap';

const MAX_AUTHORS = 5;
const LABELS = {
  firstName: 'Prénom',
  lastName: 'Nom',
};


export default class AuthorInput extends Component {
  constructor(props) {
    super(props);

    this.renderAddAuthor = this.renderAddAuthor.bind(this);
    this.renderAuthor = this.renderAuthor.bind(this);
    this.renderInput = this.renderInput.bind(this);
  }

  renderAddAuthor() {
    const { onAddButton } = this.props;

    return (
      <Button
        block
        bsStyle={'success'}
        onClick={onAddButton}
      >
        <Glyphicon glyph={'plus'} />
      </Button>
    );
  }

  renderAuthor(author = {}, index = 1) {
    const { data, invalid, onRemoveButton } = this.props;

    return (
      <FormGroup
        controlId={`author${index}`}
        key={`author${index}`}
        validationState={invalid && author.lastName === '' && 'error'}
      >
        {this.renderInput(author, 'lastName', true)}
        {this.renderInput(author, 'firstName')}
        {data.length > 1 && (
          <Col sm={1} md={1}>
            <Button
              bsStyle="danger"
              onClick={event => onRemoveButton(event, author)}
            >
              <Glyphicon glyph="remove" />
            </Button>
          </Col>
        )}
      </FormGroup>
    );
  }

  renderInput(author, field, feedback) {
    const { onChange } = this.props;

    return (
      <Col sm={5} md={5}>
        <Col componentClass={ControlLabel} sm={2} md={3}>
          {LABELS[field]}
        </Col>
        <Col sm={9} md={8}>
          <FormControl
            data-field={field}
            placeholder={LABELS[field]}
            onChange={event => onChange(event, author)}
            type="text"
            value={author[field]}
          />
          {feedback && <FormControl.Feedback />}
        </Col>
      </Col>
    );
  }

  render() {
    const authors = this.props.data;
    const inputWidth = { md: 10, mdOffset: 2, sm: 11, smOffset: 1 };

    return (
      <Col {...inputWidth} componentClass="fieldset">
        <legend>{'Auteur.e.s'}</legend>
        {authors.map((author, index) => this.renderAuthor(author, index + 1))}
        {authors.length < MAX_AUTHORS && this.renderAddAuthor()}
      </Col>
    );

  }
}

AuthorInput.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  invalid: PropTypes.string,
  onAddButton: PropTypes.func,
  onChange: PropTypes.func,
  onRemoveButton: PropTypes.func,
};
