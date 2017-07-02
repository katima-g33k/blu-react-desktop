import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import API from '../../../lib/API';
import { InformationModal } from '../../general/modals';
import Member from '../../../lib/models/Member';
import MemberForm from './MemberForm';
import memberFormSchema from './memberFormSchema';

const removeEmptyPropperties = (data) => {
  Object.keys(data).forEach((key) => {
    if (data[key] === null || (typeof data[key] === 'boolean' && key !== 'is_parent')) {
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
      error: null,
      states: [],
      member: new Member(),
    };

    this.cancel = this.cancel.bind(this);
    this.getModal = this.getModal.bind(this);
    this.handleNo = this.handleNo.bind(this);
    this.insert = this.insert.bind(this);
    this.save = this.save.bind(this);
    this.update = this.update.bind(this);

    this.schema = memberFormSchema;
    this.schema.title = !this.props.params.no ? 'Ajouter un membre' : 'Modifier un membre';
    this.handleNo();
  }

  componentWillMount() {
    API.state.select((error, res) => {
      if (error) {
        this.setState({ error });
        return;
      }

      const stateSelect = this.schema.sections[1].fields.find(field => field.key === 'state');
      stateSelect.options = res.map(state => ({ value: state, label: state }));

      this.setState({ states: res });
    });

    if (this.props.params.no) {
      API.member.select(this.props.params.no, (error, res) => {
        if (error) {
          this.setState({ error });
          return;
        }

        this.setState({ member: new Member(res) });
      });
    } else if (this.props.location.query.no) {
      const { no } = this.props.location.query;
      this.setState({ member: new Member({ no }) });
    }
  }

  cancel(event) {
    event.preventDefault();
    const { no } = this.props.params;
    browserHistory.push(no ? `/member/view/${no}` : '/search');
  }

  insert(data) {
    API.member.insert(data, (error, res) => {
      if (error) {
        this.setState({ error });
        return;
      }

      const no = res.no || data.no;
      browserHistory.push(`/member/view/${no}`);
    });
  }

  handleNo() {
    const { member } = this.state;
    const isEdit = !!this.props.params.no;
    const inlineNo = this.schema.sections[0].fields.find(field => field.key === 'no');

    if (isEdit) {
      inlineNo.inline = inlineNo.inline.filter(field => field.key === 'no');
    } else {
      const noInput = inlineNo.inline.find(field => field.key === 'no');

      inlineNo.inline.find(field => field.key === 'noNo').onChange = (event) => {
        member.no = null;
        noInput.disabled = event.target.checked;

        this.setState({ member });
      };
    }
  }

  save(member) {
    const { no } = this.props.params;
    const data = removeEmptyPropperties({ ...member });

    return no ? this.update(no, data) : this.insert(data);
  }

  update(no, data) {
    API.member.update(no, data, (error) => {
      if (error) {
        this.setState({ error });
        return;
      }

      browserHistory.push(`/member/view/${data.no}`);
    });
  }

  getModal() {
    const { error } = this.state;

    return error && (
      <InformationModal
        message={error.message}
        onClick={() => this.setState({ error: null })}
        title={`Erreur ${error.code}`}
      />
    );
  }

  render() {
    const member = this.state.member;
    delete member.account;

    return (
      <MemberForm
        member={member}
        modal={this.getModal()}
        onCancel={this.cancel}
        onSave={this.save}
        schema={this.schema}
      />
    );
  }
}

MemberFormContainer.propTypes = {
  params: React.PropTypes.shape(),
  location: React.PropTypes.shape(),
  router: React.PropTypes.shape(),
};
