import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import HTTP from '../lib/HTTP';
import moment from 'moment';

export default class MemberView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      member: {},
    };
    this.renderDate = this.renderDate.bind(this);
  }

  componentWillMount() {
    const url = 'http://localhost/blu-api/member/select';
    const data = {
      no: this.props.params.no,
    };

    HTTP.post(url, data, (err, member) => {
      if (member) {
        this.setState({ member });
      }
    });
  }

  renderDate() {
    if (this.state.member.account) {
      const account = this.state.member.account;
      const date = moment(account.registration).format('YYYY/MM/DD');
      return (<p>{date}</p>);
    }

    return ('');
  }

  render() {
    return (
      <Panel header="Membre">
        <h2>
          {`${this.state.member.first_name || ''} ${this.state.member.last_name || ''}`}
        </h2>
        {this.renderDate()}
      </Panel>
    );
  }
}

MemberView.propTypes = {
  params: React.PropTypes.shape(),
};
