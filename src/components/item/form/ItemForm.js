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
import {
  authorIsValid,
  ean13IsValid,
  editorIsValid,
  nameIsValid,
  publicationIsValid,
} from '../../../lib/itemHelper';

const {
  Body,
  Footer,
  Heading,
  Title,
} = Panel;

const classNames = {
  row: 'form-row',
  buttonGroup: 'form-buttons',
};

export default class ItemForm extends Component {
  static propTypes = {
    ean13: PropTypes.string,
    exists: PropTypes.func.isRequired,
    id: PropTypes.number,
    item: PropTypes.instanceOf(Item).isRequired,
    onCancel: PropTypes.func.isRequired,
    fetch: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  };

  static defaultProps = {
    ean13: '',
    id: 0,
  };

  state = {
    ean13: this.props.item.ean13,
    item: this.props.item,
    validation: {
      author: true,
      ean13: true,
      editor: true,
      name: true,
      publication: true,
    },
  };

  componentDidMount() {
    if (!this.state.item.id && this.props.id) {
      this.props.fetch();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.item.id !== nextProps.item.id) {
      this.setState({
        ean13: nextProps.item.ean13,
        item: nextProps.item,
      });
    }
  }

  isValid = () => {
    const { item } = this.state;
    const validation = {
      author: authorIsValid(item),
      ean13: !!this.props.ean13 || ean13IsValid(item),
      editor: editorIsValid(item),
      name: nameIsValid(item),
      publication: publicationIsValid(item),
    };

    this.setState({ validation });
    return Object.values(validation).every(value => value);
  };

  itemExists = () => {
    if (this.state.item.ean13 === this.state.ean13) {
      return false;
    }

    return this.props.exists(this.state.item.ean13);
  };

  handleOnChange = (event, value) => {
    const property = event.target.id;

    this.setState(state => ({
      item: {
        ...state.item,
        [property]: value,
      },
    }));
  };

  handleIsBook = (event, value) => this.setState(state => ({
    item: {
      ...state.item,
      isBook: value,
      editor: '',
      edition: '',
      publication: '',
      author: [],
    },
  }));

  handleNoEan13 = (event, value) => this.setState(state => ({
    item: {
      ...state.item,
      ean13: '',
      noEan13: value,
    },
  }));

  handleOnSave = async () => {
    if (!this.isValid() || await this.itemExists()) {
      return;
    }

    this.props.onSave({
      ...this.state.item,
      ean13: this.props.ean13 || this.state.item.ean13,
    });
  };

  renderIsBook = () => !this.props.id && (
    <Row>
      <Checkbox
        checked={this.state.item.isBook}
        id="isBook"
        label={I18n('ItemForm.fields.isBook')}
        onChange={this.handleIsBook}
      />
    </Row>
  );

  renderNoEan13 = () => {
    if (this.props.id || this.props.ean13) {
      return null;
    }

    return (
      <Checkbox
        checked={this.state.item.noEan13}
        id="noEan13"
        inputWidth={{ md: 3 }}
        label={I18n('ItemForm.fields.noEan13')}
        onChange={this.handleNoEan13}
        style={{ marginTop: -15 }}
      />
    );
  };

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
  );

  render() {
    const { id } = this.props;
    const { isBook } = this.state.item;
    const type = isBook ? 'book' : 'item';

    return (
      <Panel>
        <Heading>
          <Title>
            {I18n('ItemForm.title')}
          </Title>
        </Heading>
        <Body>
          <Col md={8}>
            <Form>
              <Row componentClass="h3">
                {I18n(`ItemForm.subtitle.${type}.${id ? 'edit' : 'add'}`)}
              </Row>
              <Row>
                {this.renderIsBook()}
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
                    disabled={!!(this.props.ean13 || this.state.item.noEan13)}
                    id="ean13"
                    inputWidth={{ md: 3 }}
                    label={I18n('ItemForm.fields.ean13')}
                    labelWidth={{ md: 3 }}
                    onChange={this.handleOnChange}
                    placeholder={I18n('ItemForm.fields.ean13')}
                    required
                    type={Input.TYPES.NUMBER}
                    value={this.state.item.ean13 ? `${this.state.item.ean13}` : this.props.ean13}
                  />
                  {this.renderNoEan13()}
                </Row>
                <Row className={classNames.row}>
                  <TextArea
                    id="comment"
                    label={I18n(`ItemForm.fields.comment.${type}`)}
                    onChange={this.handleOnChange}
                    placeholder={I18n(`ItemForm.fields.comment.${type}`)}
                    value={this.state.item.comment}
                  />
                </Row>
              </Row>
            </Form>
          </Col>
        </Body>
        <Footer>
          <Row>
            <Col md={12}>
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
            </Col>
          </Row>
        </Footer>
      </Panel>
    );
  }
}
