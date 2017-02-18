import React, { Component } from 'react';

import HTTP from '../../../lib/HTTP';
import Member from '../../../lib/models/Member';
import MemberForm from './MemberForm';
import memberFormSchema from './memberFormSchema';
import settings from '../../../settings.json';

const removeEmptyPropperties = (data) => {
  Object.keys(data).forEach(key => {
    if (data[key] === null) {
      delete data[key];
    } else if (typeof data[key] === 'string' && data[key] === '') {
      delete data[key];
    } else if (typeof data[key] === 'number' && data[key] === 0) {
      delete data[key];
    } else if (Array.isArray(data[key]) && !data[key].length) {
      delete data[key];
    } else if (typeof data[key] === 'object') {
      const property = removeEmptyPropperties(data[key]);
      if (!Object.keys(property).length) {
        delete data[key];
      }
    }
  });

  return data;
};

export default class MemberFormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      states: [],
      member: new Member(),
    };

    this.cancel = this.cancel.bind(this);
    this.insert = this.insert.bind(this);
    this.save = this.save.bind(this);
    this.update = this.update.bind(this);

    this.schema = memberFormSchema;
    this.schema.title = !this.props.params.no ? 'Ajouter un membre' : 'Modifier un membre';
  }

  componentWillMount() {
    HTTP.post(`${settings.apiUrl}/state/select`, {}, (err, states) => {
      if (states) {
        this.setState({ states });
        const stateSelect = this.schema.sections[1].fields.find(field => field.key === 'state');
        stateSelect.options = this.state.states.map(state => ({ value: state, label: state }));
      }
    });

    if (this.props.params.no) {
      const no = this.props.params.no;
      HTTP.post(`${settings.apiUrl}/member/select`, { no }, (err, res) => {
        if (res) {
          this.setState({ member: new Member(res) });
        }
      });
    }
  }

  cancel(event) {
    event.preventDefault();
    const no = this.props.params.no;
    this.props.router.push(no ? `/member/view/${no}` : '/search');
  }

  insert(data) {
    HTTP.post(`${settings.apiUrl}/member/insert`, data, (err) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      this.props.router.push({
        pathname: `/member/view/${data.no}`,
      });
    });
  }

  save(event, member) {
    event.preventDefault();
    const no = this.props.params.no;
    const data = removeEmptyPropperties({ ...member });
    return no ? this.update(no, data) : this.insert(data);
  }

  update(no, data) {
    HTTP.post(`${settings.apiUrl}/member/update`, { no, member: data }, (err) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      this.props.router.push({
        pathname: `/member/view/${data.no}`,
      });
    });
  }

  render() {
    const member = this.state.member;
    delete member.account;

    return (
      <MemberForm
        member={member}
        onCancel={this.cancel}
        onSave={this.save}
        schema={this.schema}
      />
    );
  }
}

MemberFormContainer.propTypes = {
  params: React.PropTypes.shape(),
  router: React.PropTypes.shape(),
};
