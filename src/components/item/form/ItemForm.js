import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonToolbar,
  Col,
  Form,
  FormGroup,
  Panel,
  Row,
} from 'react-bootstrap';

import {
  Checkbox,
  Input,
  TextArea,
} from '../../general/formInputs';
import I18n from '../../../lib/i18n';
import { Item } from '../../../lib/models';
import AuthorInput from './AuthorInput';
import SubjectSelector from '../../../containers/SubjectSelectorContainer';

const classNames = {
  row: 'form-row',
  buttonGroup: 'form-buttons',
};

export default class ItemForm extends Component {
  static propTypes = {
    id: PropTypes.number,
    item: PropTypes.instanceOf(Item).isRequired,
    onLoad: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  static defaultProps = {
    id: 0,
    subjects: [],
  }

  state = {
    item: this.props.item,
    validation: {
      ean13: true,
      editor: true,
      name: true,
      publication: true,
    },
    subjects: [],
  }

  componentDidMount() {
    if (!this.state.item.id && this.props.id) {
      this.props.onLoad();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.item.id !== nextProps.item.id) {
      this.setState({ item: nextProps.item });
    }
  }

  handleOnChange = (event, value) => this.setState({
    item: {
      ...this.state.item,
      [event.target.id]: value,
    },
  })

  handleOnSave = () => {
    this.props.onSave();
  }

  renderNoEan13 = () => !this.props.id && (
    <Checkbox
      checked={this.state.item.noEan13}
      id="noEan13"
      inputWidth={{ md: 3 }}
      label={I18n('ItemForm.fields.noEan13')}
      onChange={this.handleOnChange}
    />
  )

  renderBookFields = () => this.state.item.isBook && (
    <div>
      <Row
        componentClass={FormGroup}
        className={classNames.row}
        validationState={this.state.validation.editor ? null : 'error'}
      >
        <Input
          id="editor"
          label={I18n('ItemForm.fields.editor')}
          onChange={this.handleOnChange}
          placeholder={I18n('ItemForm.fields.editor')}
          required
          value={this.state.item.editor}
        />
      </Row>
      <Row className={classNames.row}>
        <Input
          id="edition"
          label={I18n('ItemForm.fields.edition')}
          onChange={this.handleOnChange}
          placeholder={I18n('ItemForm.fields.edition')}
          value={this.state.item.edition}
        />
      </Row>
      <Row
        componentClass={FormGroup}
        className={classNames.row}
        validationState={this.state.validation.publication ? null : 'error'}
      >
        <Input
          id="publication"
          label={I18n('ItemForm.fields.publication')}
          onChange={this.handleOnChange}
          placeholder={I18n('ItemForm.fields.publication')}
          required
          value={this.state.item.publication}
        />
      </Row>
      <Row className={classNames.row}>
        <AuthorInput
          authors={this.state.item.author}
          id="author"
          onChange={this.handleOnChange}
        />
      </Row>
    </div>
  )

  render() {
    const { id } = this.props;
    const { isBook } = this.state.item;
    const type = isBook ? 'book' : 'item';

    return (
      <Panel header={I18n('ItemForm.title')}>
        <Col md={8}>
          <Form>
            <Row componentClass="h3">
              {I18n(`ItemForm.subtitle.${type}.${id ? 'edit' : 'add'}`)}
            </Row>
            <Row>
              <Row>
                <Checkbox
                  checked={isBook}
                  id="isBook"
                  label={I18n('ItemForm.fields.isBook')}
                  onChange={this.handleOnChange}
                />
              </Row>
              <Row
                componentClass={FormGroup}
                className={classNames.row}
                validationState={this.state.validation.name ? null : 'error'}
              >
                <Input
                  id="name"
                  label={I18n('ItemForm.fields.name')}
                  onChange={this.handleOnChange}
                  placeholder={I18n('ItemForm.fields.name')}
                  required
                  value={this.state.item.name}
                />
              </Row>
              {this.renderBookFields()}
              <Row className={classNames.row}>
                <SubjectSelector
                  onChange={this.handleOnChange}
                  value={this.state.item.subject.id}
                />
              </Row>
              <Row
                componentClass={FormGroup}
                className={classNames.row}
                validationState={this.state.validation.ean13 ? null : 'error'}
              >
                <Input
                  disabled={this.state.item.noEan13}
                  id="ean13"
                  inputWidth={{ md: 3 }}
                  label={I18n('ItemForm.fields.ean13')}
                  labelWidth={{ md: 3 }}
                  onChange={this.handleOnChange}
                  placeholder={I18n('ItemForm.fields.ean13')}
                  required
                  type={Input.TYPES.NUMBER}
                  value={this.state.item.ean13 ? `${this.state.item.ean13}` : ''}
                />
                {this.renderNoEan13()}
              </Row>
              <Row className={classNames.row}>
                <TextArea
                  id="comment"
                  label={I18n(`ItemForm.fields.comment.${type}`)}
                  onChange={this.handleOnChange}
                  placeholder={I18n(`ItemForm.fields.comisBook ? 'book' : 'item'ment.${type}`)}
                  value={this.state.item.comment}
                />
              </Row>
            </Row>
            <Row>
              <ButtonToolbar className={classNames.buttonGroup}>
                <Button onClick={this.props.onCancel}>
                  {I18n('actions.cancel')}
                </Button>
                <Button
                  bsStyle="primary"
                  onClick={this.handleOnSave}
                >
                  {I18n('actions.save')}
                </Button>
              </ButtonToolbar>
            </Row>
          </Form>
        </Col>
      </Panel>
    );
  }
}
