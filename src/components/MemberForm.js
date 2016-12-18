import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';

export default class MemberForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (<Panel header="Formulaire du membre" />);
  }
}
