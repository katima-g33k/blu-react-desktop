import React, { Component } from 'react';
import _ from 'lodash';
import { browserHistory } from 'react-router';
import moment from 'moment';

import API from '../../../lib/API';
import capitalize from '../../../lib/capitalize';
import { ConfirmModal, InformationModal } from '../../general/modals';
import Member from '../../../lib/models/Member';
import MemberForm from './MemberForm';
import memberFormSchema from './memberFormSchema';

const formatData = (member) => {
  const data = member;

  data.firstName = capitalize(data.firstName);
  data.lastName = capitalize(data.lastName);

  if (data.noNo) {
    delete data.noNo;
    delete data.no;
  } else if (data.no.length === 7) {
    data.no = `${+data.no.substr(0, 2) <= +moment().format('YY') ? '20' : '19'}${data.no}`;
  }

  if (data.city.name) {
    data.city.name = capitalize(data.city.name);
    data.city.state.code = data.city.state.code || 'QC';
  } else {
    delete data.city;
  }

  if (data.zip) {
    data.zip = data.zip.replace(/\s/g, '').toUpperCase();
  }

  if (data.address) {
    data.address = capitalize(data.address);
  }

  data.phone = data.phone.filter(phone => phone.number);

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
      no: props.params && props.params.no,
      redirectTo: null,
      showModal: null,
      states: [],
    };

    this.schema = _.cloneDeep(memberFormSchema);
    this.schema.title = !props.params.no ? 'Ajouter un membre' : 'Modifier un membre';
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

    if (this.state.no) {
      API.member.select(this.state.no, (error, res) => {
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

  closeModal = () => this.setState({ error: null, isUpdate: null, showModal: null })

  cancel = (event) => {
    event.preventDefault();
    const { no } = this.state;
    browserHistory.push(no ? `/member/view/${no}` : '/search');
  }

  exists = async (no, data) => {
    const distinct = {
      no: `${no}` !== data.no ? data.no : undefined,
      email: this.state.email !== data.email ? data.email : undefined,
    };

    if (!distinct.no && !distinct.email) {
      return false;
    }

    return new Promise((resolve, reject) => {
      API.member.exists(distinct, (error, res) => {
        if (error) {
          return reject(error);
        }

        return resolve(res.no);
      });
    });
  }

  insert = (data) => {
    API.member.insert(data, (error, res) => {
      if (error) {
        this.setState({ error });
        return;
      }

      this.goToMember(res.no || data.no);
    });
  }

  handleMerge = () => {
    const duplicate = this.state.no;
    const no = this.state.redirectTo;

    API.member.merge({ duplicate, no }, (error) => {
      if (error) {
        this.setState({ error });
        return;
      }

      this.setState({ showModal: 'merged' });
    });
  }

  handleNo = () => {
    const { member, no } = this.state;
    const isEdit = !!no;
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

  save = async (member) => {
    const no = this.props.params && this.props.params.no;
    const data = formatData({ ...member });
    const existingUser = await this.exists(no, data);

    if (existingUser) {
      return this.setState({ isUpdate: !!no, showModal: 'exists', redirectTo: existingUser });
    }

    if (data.zip) {
      data.zip = data.zip.replace(/\s/g, '').toUpperCase();
    }

    return no ? this.update(no, data) : this.insert(data);
  }

  update = (no, data) => {
    API.member.update(no, data, (error) => {
      if (error) {
        this.setState({ error });
        return;
      }

      this.goToMember(data.no);
    });
  }

  goToMember = (no) => browserHistory.push(`/member/view/${no}`)

  handleGoToMember = () => this.goToMember(this.state.redirectTo)

  getModal = () => {
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
