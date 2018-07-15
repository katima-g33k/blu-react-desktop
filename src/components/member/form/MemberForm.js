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
import I18n from '../../../lib/i18n';
import { Member } from '../../../lib/models';
import StateSelector from '../../../containers/StateSelectorContainer';

import './memberForm.css';

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
  }

  static defaultProps = {
    no: 0,
  }

  state = {
    member: this.props.member,
    states: [],
    validation: {
      email: true,
      firstName: true,
      lastName: true,
      no: true,
      phone0: true,
      phone1: true,
      zip: true,
    },
  }

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
    const validation = {
      email: emailIsValid(this.state.member.email),
      firstName: nameIsValid(this.state.member.firstName),
      lastName: nameIsValid(this.state.member.lastName),
      no: memberNoIsValid(this.state.member),
      phone0: phoneIsValid(this.state.member.phone[0].number),
      phone1: phoneIsValid(this.state.member.phone[1].number),
      zip: zipIsValid(this.state.member.zip),
    };

    this.setState({ validation });
    return Object.values(validation).every(value => value);
  }

  memberExists = () => {
    const data = {};

    if (!this.state.member.noNo && this.state.member.no !== this.props.member.no) {
      data.no = this.state.member.no;
    }

    if (this.state.member.email !== this.props.member.email) {
      data.email = this.state.member.email;
    }

    return this.props.exists(data);
  }

  handleNoMemberNoOnChange = (event, value) => this.setState({
    member: {
      ...this.state.member,
      no: 0,
      noNo: value,
    },
  })

  handleCtyOnChange = (event, value) => this.setState({
    member: {
      ...this.state.member,
      city: {
        ...this.state.member.city,
        id: 0,
        name: value,
      },
    },
  })

  handlePhoneOnChange = (event, value) => {
    const { field, index } = event.target.dataset;
    const member = this.state.member;

    member.phone[index][field] = field === 'number' ? value.replace(/\D/g, '') : value;
    this.setState({ member });
  }

  handleOnChange = (event, value) => this.setState({
    member: {
      ...this.state.member,
      [event.target.id]: value,
    },
  })

  handleOnSave = async () => {
    if (!this.isValid() || await this.memberExists()) {
      return;
    }

    this.props.onSave(this.state.member);
  }

  renderNoMemberNo = () => !this.props.no && (
    <Checkbox
      checked={this.state.member.noNo}
      id="noNo"
      inputWidth={{ md: 3 }}
      label={I18n('MemberForm.fields.noNo')}
      onChange={this.handleNoMemberNoOnChange}
    />
  )

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
        label={I18n('MemberForm.fields.phone.label', { index: index + 1 })}
        labelWidth={{ md: 3 }}
        onChange={this.handlePhoneOnChange}
        placeholder={I18n('MemberForm.fields.phone.placeholder')}
        type={Input.TYPES.PHONE}
        value={formatPhoneNumber(this.state.member.phone[index].number)}
      />
      <Input
        data={{ field: 'note', index }}
        id={`note${index}`}
        inputWidth={{ md: 3 }}
        label={I18n('MemberForm.fields.phone.note')}
        labelWidth={{ md: 1 }}
        onChange={this.handlePhoneOnChange}
        value={this.state.member.phone[index].note}
      />
    </Row>
  )

  render() {
    return (
      <Col md={12}>
        <Panel header={I18n('MemberForm.title')}>
          <Col md={8}>
            <Form>
              <Row componentClass="h3">
                {I18n(`MemberForm.subtitle.${this.props.no ? 'edit' : 'add'}`)}
              </Row>
              <Row>
                <Row className={classNames.row}>
                  <Checkbox
                    checked={this.state.member.isParent}
                    id="isParent"
                    label={I18n('MemberForm.fields.isParent')}
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
                    label={I18n('MemberForm.fields.firstName')}
                    onChange={this.handleOnChange}
                    placeholder={I18n('MemberForm.fields.firstName')}
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
                    label={I18n('MemberForm.fields.lastName')}
                    onChange={this.handleOnChange}
                    placeholder={I18n('MemberForm.fields.lastName')}
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
                    label={I18n('MemberForm.fields.no.label')}
                    labelWidth={{ md: 3 }}
                    onChange={this.handleOnChange}
                    placeholder={I18n('MemberForm.fields.no.placeholder')}
                    required
                    type={Input.TYPES.NUMBER}
                    value={this.state.member.no ? `${this.state.member.no}` : ''}
                  />
                  {this.renderNoMemberNo()}
                </Row>
              </Row>
              <Row>
                <Col componentClass="h4">
                  {I18n('MemberForm.subtitle.contact')}
                </Col>
                <Row className={classNames.row}>
                  <Input
                    id="address"
                    label={I18n('MemberForm.fields.address')}
                    onChange={this.handleOnChange}
                    placeholder={I18n('MemberForm.fields.address')}
                    value={this.state.member.address}
                  />
                </Row>
                <Row className={classNames.row}>
                  <Input
                    id="zip"
                    label={I18n('MemberForm.fields.zip.label')}
                    onChange={this.handleOnChange}
                    placeholder={I18n('MemberForm.fields.zip.placeholder')}
                    value={formatZip(this.state.member.zip)}
                  />
                </Row>
                <Row className={classNames.row}>
                  <Input
                    id="city"
                    label={I18n('MemberForm.fields.city')}
                    onChange={this.handleCtyOnChange}
                    placeholder={I18n('MemberForm.fields.city')}
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
                    label={I18n('MemberForm.fields.email.label')}
                    onChange={this.handleOnChange}
                    placeholder={I18n('MemberForm.fields.email.placeholder')}
                    required
                    type={Input.TYPES.EMAIL}
                    value={this.state.member.email}
                  />
                </Row>
                {this.renderPhone(0)}
                {this.renderPhone(1)}
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
      </Col>
    );
  }
}
