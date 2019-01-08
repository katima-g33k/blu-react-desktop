import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonToolbar,
  Col,
  Form,
  Panel,
  Row,
} from 'react-bootstrap';

import I18n from '../../lib/i18n';
import { Input } from '../general/formInputs';

const {
  Body,
  Heading,
} = Panel;

export default class Login extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
  }

  state = {
    password: '',
    username: '',
  }

  handleOnChange = (event, value) => this.setState({
    ...this.state,
    [event.target.id]: value,
  })

  handleOnLogin = () => this.props.onLogin(this.state.username, this.state.password)

  render() {
    return (
      <Row id={this.constructor.name}>
        <Col md={6} mdOffset={3}>
          <Panel>
            <Heading>
              {I18n('Login.title')}
            </Heading>
            <Body>
              <Row>
                <Col md={10} mdOffset={1}>
                  <Form onSubmit={event => event.preventDefault()}>
                    <Row>
                      <Row>
                        <Input
                          id="username"
                          label={I18n('Login.fields.username')}
                          onChange={this.handleOnChange}
                          value={this.state.username}
                        />
                      </Row>
                      <Row>
                        <Input
                          id="password"
                          label={I18n('Login.fields.password')}
                          onChange={this.handleOnChange}
                          type={Input.TYPES.PASSWORD}
                          value={this.state.password}
                        />
                      </Row>
                    </Row>
                    <Row>
                      <ButtonToolbar>
                        <Button
                          bsStyle="primary"
                          onClick={this.handleOnLogin}
                          type="submit"
                        >
                          {I18n('actions.login')}
                        </Button>
                      </ButtonToolbar>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </Body>
          </Panel>
        </Col>
      </Row>
    );
  }
}
