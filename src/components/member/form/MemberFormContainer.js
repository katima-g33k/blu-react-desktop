import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import API from '../../../lib/API';
import { ConfirmModal, InformationModal } from '../../general/modals';
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
      email: '',
      error: null,
      isAdmin: JSON.parse(sessionStorage.getItem('user')).isAdmin,
      member: new Member(),
      no: this.props.params && this.props.params.no,
      redirectTo: null,
      showModal: null,
      states: [],
    };

    this.cancel = this.cancel.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleMerge = this.handleMerge.bind(this);
    this.exists = this.exists.bind(this);
    this.getModal = this.getModal.bind(this);
    this.handleNo = this.handleNo.bind(this);
    this.insert = this.insert.bind(this);
    this.save = this.save.bind(this);
    this.update = this.update.bind(this);
    this.goToMember = this.goToMember.bind(this);
    this.handleGoToMember = this.handleGoToMember.bind(this);

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

        this.setState({ member: new Member(res), email: res.email });
      });
    } else if (this.props.location.query.no) {
      const { no } = this.props.location.query;
      this.setState({ member: new Member({ no }) });
    }
  }

  closeModal() {
    this.setState({ error: null, isUpdate: null, showModal: null });
  }

  cancel(event) {
    event.preventDefault();
    const { no } = this.props.params;
    browserHistory.push(no ? `/member/view/${no}` : '/search');
  }

  async exists(no, data) {
    const distinct = {
      no: `${no}` !== data.no ? data.no : undefined,
      email: this.state.email !== data.email ? data.email : undefined,
    };

    return new Promise(resolve => API.member.exists(distinct, (error) => resolve(!error)));
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

  handleMerge() {
    const member = this.state.member;
    const data = {};

    if (member.no !== this.state.no) {
      data.no = member.no;
      data.duplicate = this.state.no;
    } else {
      data.email = member.email;
      data.duplicate = this.state.email;
    }

    API.member.merge(data, (error) => {
      if (error) {
        this.setState({ error });
        return;
      }

      this.setState({ showModal: 'merged', redirectTo: data.no });
    });
  }

  handleNo() {
    const { member } = this.state;
    const isEdit = !!(this.props.params && this.props.params.no);
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

  async save(member) {
    const no = this.props.params && this.props.params.no;
    const data = removeEmptyPropperties({ ...member });

    if (await this.exists(no, data)) {
      return this.setState({ isUpdate: !!no, showModal: 'exists', redirectTo: data.no });
    }

    if (data.zip) {
      data.zip = data.zip.replace(/\s/g, '').toUpperCase();
    }

    return no ? this.update(no, data) : this.insert(data);
  }

  update(no, data) {
    API.member.update(no, data, (error) => {
      if (error) {
        this.setState({ error });
        return;
      }

      this.goToMember(data.no);
    });
  }

  goToMember(no) {
    browserHistory.push(`/member/view/${no}`);
  }

  handleGoToMember() {
    this.goToMember(this.state.redirectTo);
  }

  getModal() {
    const { error, isAdmin, isUpdate, showModal } = this.state;

    if (error) {
      return (
        <InformationModal
          message={error.message}
          onClick={this.closeModal}
          title={`Erreur ${error.code}`}
        />
      );
    }

    switch (showModal) {
      case 'exists':
        if (!isUpdate) {
          return (
            <ConfirmModal
              message={'Un membre avec les informations saisies existent déjà. Voulez-vous aller à sa fiche ?'}
              onCancel={this.closeModal}
              onConfirm={this.handleGoToMember}
              title={'Erreur = Membre existant'}
            />
          );
        }

        if (isAdmin) {
          // eslint-disable-next-line max-len
          const message = 'Les informations que vous avez inscrites correspondent à un compte déjà existant. Voulez-vous fusionner ce compte avec le compte correspondant ?';

          return (
            <ConfirmModal
              customActions={[
                {
                  label: 'Annuler',
                  onClick: this.closeModal,
                },
                {
                  bsStyle: 'danger',
                  label: 'Fusionner',
                  onClick: this.handleMerge,
                },
              ]}
              message={message}
              title={'Erreur - Compte existant'}
            />
          );
        }

        return (
          <InformationModal
            message={'Les informations que vous avez inscrites correspondent à un compte déjà existant.'}
            onClick={this.closeModal}
            title={'Compte déjà existant'}
          />
        );
      case 'merged':
        return (
          <InformationModal
            message={'Les comptes ont été fusionnés, vous serez redirigé au compte du membre.'}
            onClick={this.handleGoToMember}
            title={'Comptes fussionés'}
          />
        );
      default:
        return null;
    }
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
