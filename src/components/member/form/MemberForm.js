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
} from '../../general/formInputs';
import {
  emailIsValid,
  formatPhoneNumber,
  formatZip,
  memberNoIsValid,
  nameIsValid,
  phoneIsValid,
  zipIsValid,
} from '../../../lib/memberHelper';
import i18n from '../../../lib/i18n';
import { Member } from '../../../lib/models';
import StateSelector from '../../../containers/StateSelectorContainer';

import './memberForm.css';

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

export default class MemberForm extends Component {
  static propTypes = {
    exists: PropTypes.func.isRequired,
    member: PropTypes.instanceOf(Member).isRequired,
    no: PropTypes.number,
    onCancel: PropTypes.func.isRequired,
    fetch: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  };

  static defaultProps = {
    no: 0,
  };

  state = {
    member: this.props.member,
    validation: {
      email: true,
      firstName: true,
      lastName: true,
      no: true,
      phone0: true,
      phone1: true,
      zip: true,
    },
  };

  componentDidMount() {
    if (!this.state.member.no && this.props.no) {
      this.props.fetch();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.member.no !== nextProps.member.no) {
      this.setState({ member: nextProps.member });
    }
  }

  isValid = () => {
    const { member } = this.state;
    const validation = {
      email: emailIsValid(member.email),
      firstName: nameIsValid(member.firstName),
      lastName: nameIsValid(member.lastName),
      no: memberNoIsValid(member),
      phone0: phoneIsValid(member.phone[0].number),
      phone1: phoneIsValid(member.phone[1].number),
      zip: zipIsValid(member.zip),
    };

    this.setState({ validation });
    return Object.values(validation).every(value => value);
  };

  memberExists = () => {
    const data = {};

    if (!this.state.member.noNo && this.state.member.no !== this.props.member.no) {
      data.no = this.state.member.no;
    }

    if (this.state.member.email !== this.props.member.email) {
      data.email = this.state.member.email;
    }

    return this.props.exists(data);
  };

  handleNoMemberNoOnChange = (event, value) => this.setState(state => ({
    ...state,
    member: {
      ...state.member,
      no: 0,
      noNo: value,
    },
  }));

  handleCtyOnChange = (event, value) => this.setState(state => ({
    ...state,
    member: {
      ...state.member,
      city: {
        ...state.member.city,
        id: 0,
        name: value,
      },
    },
  }));

  handlePhoneOnChange = (event, value) => {
    const { field, index } = event.target.dataset;
    const { member } = this.state;

    member.phone[index][field] = field === 'number' ? value.replace(/\D/g, '') : value;
    this.setState({ member });
  };

  handleOnChange = (event, value) => {
    const { id } = event.target;

    this.setState(state => ({
      ...state,
      member: {
        ...state.member,
        [id]: value,
      },
    }));
  };

  handleOnSave = async () => {
    if (!this.isValid() || await this.memberExists()) {
      return;
    }

    this.props.onSave(this.state.member);
  };

  renderNoMemberNo = () => !this.props.no && (
    <Checkbox
      checked={this.state.member.noNo}
      id="noNo"
      inputWidth={{ md: 3 }}
      label={i18n('MemberForm.fields.noNo')}
      onChange={this.handleNoMemberNoOnChange}
      style={{ marginTop: -15 }}
    />
  );

  renderPhone = index => (
    <Row
      componentClass={FormGroup}
      className={classNames.row}
      validationState={this.state.validation[`phone${index}`] ? null : 'error'}
    >
      <Input
        data={{ field: 'number', index }}
        id={`phone${index}`}
        inputWidth={{ md: 3 }}
        label={i18n('MemberForm.fields.phone.label', { index: index + 1 })}
        labelWidth={{ md: 3 }}
        onChange={this.handlePhoneOnChange}
        placeholder={i18n('MemberForm.fields.phone.placeholder')}
        type={Input.TYPES.PHONE}
        value={formatPhoneNumber(this.state.member.phone[index].number)}
      />
      <Input
        data={{ field: 'note', index }}
        id={`note${index}`}
        inputWidth={{ md: 3 }}
        label={i18n('MemberForm.fields.phone.note')}
        labelWidth={{ md: 1 }}
        onChange={this.handlePhoneOnChange}
        style={{ marginTop: -15 }}
        value={this.state.member.phone[index].note}
      />
    </Row>
  );

  render() {
    return (
      <Panel>
        <Heading>
          <Title>
            {i18n('MemberForm.title')}
          </Title>
        </Heading>
        <Body>
          <Col md={8}>
            <Form>
              <Row componentClass="h3">
                {i18n(`MemberForm.subtitle.${this.props.no ? 'edit' : 'add'}`)}
              </Row>
              <Row>
                <Row className={classNames.row}>
                  <Checkbox
                    checked={this.state.member.isParent}
                    id="isParent"
                    label={i18n('MemberForm.fields.isParent')}
                    onChange={this.handleOnChange}
                  />
                </Row>
                <Row
                  componentClass={FormGroup}
                  className={classNames.row}
                  validationState={this.state.validation.firstName ? null : 'error'}
                >
                  <Input
                    id="firstName"
                    label={i18n('MemberForm.fields.firstName')}
                    onChange={this.handleOnChange}
                    placeholder={i18n('MemberForm.fields.firstName')}
                    required
                    value={this.state.member.firstName}
                  />
                </Row>
                <Row
                  componentClass={FormGroup}
                  className={classNames.row}
                  validationState={this.state.validation.lastName ? null : 'error'}
                >
                  <Input
                    id="lastName"
                    label={i18n('MemberForm.fields.lastName')}
                    onChange={this.handleOnChange}
                    placeholder={i18n('MemberForm.fields.lastName')}
                    required
                    value={this.state.member.lastName}
                  />
                </Row>
                <Row
                  componentClass={FormGroup}
                  className={classNames.row}
                  validationState={this.state.validation.no ? null : 'error'}
                >
                  <Input
                    disabled={this.state.member.noNo}
                    id="no"
                    inputWidth={{ md: 3 }}
                    label={i18n('MemberForm.fields.no.label')}
                    labelWidth={{ md: 3 }}
                    onChange={this.handleOnChange}
                    placeholder={i18n('MemberForm.fields.no.placeholder')}
                    required
                    type={Input.TYPES.NUMBER}
                    value={this.state.member.no ? `${this.state.member.no}` : ''}
                  />
                  {this.renderNoMemberNo()}
                </Row>
              </Row>
              <Row>
                <Col componentClass="h4">
                  {i18n('MemberForm.subtitle.contact')}
                </Col>
                <Row className={classNames.row}>
                  <Input
                    id="address"
                    label={i18n('MemberForm.fields.address')}
                    onChange={this.handleOnChange}
                    placeholder={i18n('MemberForm.fields.address')}
                    value={this.state.member.address}
                  />
                </Row>
                <Row className={classNames.row}>
                  <Input
                    id="zip"
                    label={i18n('MemberForm.fields.zip.label')}
                    onChange={this.handleOnChange}
                    placeholder={i18n('MemberForm.fields.zip.placeholder')}
                    isValid={this.state.validation.zip}
                    value={formatZip(this.state.member.zip)}
                  />
                </Row>
                <Row className={classNames.row}>
                  <Input
                    id="city"
                    label={i18n('MemberForm.fields.city')}
                    onChange={this.handleCtyOnChange}
                    placeholder={i18n('MemberForm.fields.city')}
                    value={this.state.member.city.name}
                  />
                </Row>
                <Row className={classNames.row}>
                  <StateSelector
                    onChange={this.handleOnChange}
                    value={this.state.member.city.state.code}
                  />
                </Row>
                <Row
                  componentClass={FormGroup}
                  className={classNames.row}
                  validationState={this.state.validation.email ? null : 'error'}
                >
                  <Input
                    id="email"
                    label={i18n('MemberForm.fields.email.label')}
                    onChange={this.handleOnChange}
                    placeholder={i18n('MemberForm.fields.email.placeholder')}
                    required
                    type={Input.TYPES.EMAIL}
                    value={this.state.member.email}
                  />
                </Row>
                {this.renderPhone(0)}
                {this.renderPhone(1)}
              </Row>
            </Form>
          </Col>
        </Body>
        <Footer>
          <Row>
            <Col md={12}>
              <ButtonToolbar className={classNames.buttonGroup}>
                <Button onClick={this.props.onCancel}>
                  {i18n('actions.cancel')}
                </Button>
                <Button
                  bsStyle="primary"
                  onClick={this.handleOnSave}
                >
                  {i18n('actions.save')}
                </Button>
              </ButtonToolbar>
            </Col>
          </Row>
        </Footer>
      </Panel>
    );
  }
}
