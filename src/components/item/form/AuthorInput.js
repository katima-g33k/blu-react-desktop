/* eslint react/no-did-update-set-state: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Col,
  FormGroup,
  Glyphicon,
} from 'react-bootstrap';

import { Author } from '../../../lib/models';
import I18n from '../../../lib/i18n';
import { Input } from '../../general/formInputs';

const MAX_AUTHORS = 5;
const ADD_BUTTON_GRID = {
  md: 6,
  mdOffset: 3,
  sm: 8,
  smOffset: 2,
};

export default class AuthorInput extends Component {
  static propTypes = {
    authors: PropTypes.arrayOf(PropTypes.instanceOf(Author)),
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    authors: [new Author()],
  }

  state = {
    authors: this.props.authors.length ? this.props.authors : [new Author()],
    focus: null,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      authors: nextProps.authors.length ? nextProps.authors : [new Author()],
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(this.state.focus && !nextState.focus);
  }

  componentDidUpdate() {
    if (this.state.focus) {
      const { field, index } = this.state.focus;
      const el = document.querySelector(`[data-field='${field}'][data-index='${index}']`);
      const pos = el.value.length;

      el.focus();
      el.setSelectionRange(pos, pos);
      this.setState({ focus: null });
    }
  }


  getEvent = eventData => ({
    ...eventData,
    target: {
      ...eventData.target,
      id: this.props.id,
    },
  })

  handleOnChange = (event) => {
    const { authors } = this.state;
    const { field, index } = event.target.dataset;

    authors[index][field] = event.target.value;

    this.setState({ focus: { field, index } });
    this.props.onChange(this.getEvent(event), authors);
  }

  handleOnDelete = (event, index) => {
    const authors = this.state.authors.filter((author, curIndex) => index !== curIndex);
    this.props.onChange(this.getEvent(event), authors);
  }

  handleOnAdd = (event) => {
    const authors = [...this.state.authors, new Author()];
    this.props.onChange(this.getEvent(event), authors);
  }

  renderAuthorInput = (author, index) => (
    <FormGroup key={`${author}${index}`}>
      <Input
        data={{
          field: 'lastName',
          index,
        }}
        inputWidth={{ md: 3, sm: 4 }}
        label={I18n('ItemForm.fields.author.label', { index: index + 1 })}
        onChange={this.handleOnChange}
        placeholder={I18n('ItemForm.fields.author.placeholder.lastName')}
        value={author.lastName}
      />
      <Input
        data={{
          field: 'firstName',
          index,
        }}
        inputWidth={{ md: 3, sm: 4 }}
        onChange={this.handleOnChange}
        placeholder={I18n('ItemForm.fields.author.placeholder.firstName')}
        value={author.firstName}
      />
      <Button
        bsStyle={'danger'}
        onClick={event => this.handleOnDelete(event, index)}
      >
        <Glyphicon glyph={'trash'} />
      </Button>
    </FormGroup>
  )

  renderAuthorInputs = () => this.state.authors.map(this.renderAuthorInput)

  renderAddButton = () => this.props.authors.length < MAX_AUTHORS && (
    <Col {...ADD_BUTTON_GRID}>
      <Button
        block
        bsStyle={'success'}
        onClick={this.handleOnAdd}
      >
        <Glyphicon glyph={'plus'} />
      </Button>
    </Col>
  )

  render() {
    return (
      <div>
        {this.renderAuthorInputs()}
        {this.renderAddButton()}
      </div>
    );
  }
}
