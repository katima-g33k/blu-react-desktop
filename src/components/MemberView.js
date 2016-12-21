import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import Table from './Table';
import HTTP from '../lib/HTTP';
import moment from 'moment';
import { CommentColumns, MemberCopyColumns } from '../lib/TableColumns';
import ProfileStats from './ProfileStats';

const formatDate = (date) => {
  return date ? moment(date).format('LL') : '';
};

export default class MemberView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      member: {},
    };
    this.isActive = this.isActive.bind(this);
    this.rendeGeneralInformation = this.rendeGeneralInformation.bind(this);
    this.renderAddress = this.renderAddress.bind(this);
    this.renderPhones = this.renderPhones.bind(this);
    this.renderAccountState = this.renderAccountState.bind(this);
    this.getDeactivationDate = this.getDeactivationDate.bind(this);
    this.renderComments = this.renderComments.bind(this);
    this.renderStats = this.renderStats.bind(this);
    this.renderCopies = this.renderCopies.bind(this);
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

  isActive() {
    const account = this.state.member.account;
    const limit = moment().subtract(1, 'years');
    return !account || limit.isSameOrBefore(account.last_activity);
  }

  getDeactivationDate(lastActivity) {
    return lastActivity ? formatDate(moment(lastActivity).add(1, 'year')) : '';
  }

  renderAddress() {
    const member = this.state.member;
    const street = member.address;
    const zip = member.zip || '';
    const city = member.city ? member.city.name : '';
    const state = member.city && member.city.state ? member.city.state.code : '';
    const address = street ? `${street}, ${city} (${state}) ${zip}` : '';

    return (<p>Addresse : {address}</p>);
  }

  renderPhones() {
    const member = this.state.member;
    const phones = member.phone || [];

    return phones.map((phone, index) => {
      const number = phone.number.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      const note = phone.note ? `(${phone.note})` : '';

      return (<p key={`phone${index}`}>Téléphone {index + 1} : {number} {note}</p>);
    });
  }

  rendeGeneralInformation() {
    const member = this.state.member;
    return (
      <section>
        <h4>Informations générales</h4>
        <p>Numéro du compte : {member.no || ''}</p>
        {this.renderAddress()}
        <p>Courriel : {member.email || ''}</p>
        {this.renderPhones()}
      </section>
    );
  }

  renderAccountState() {
    const account = this.state.member ? this.state.member.account || {} : {};
    return (
      <section>
        <h4>État du compte</h4>
        <p>{`État d'activation : ${this.isActive() ? 'Actif' : 'Désactivé'}`}</p>
        <p>{`Date d'inscription : ${formatDate(account.registration)}`}</p>
        <p>Dernière activité : {formatDate(account.last_activity)}</p>
        <p>Date de désactivation : {this.getDeactivationDate(account.last_activity)}</p>
      </section>
    );
  }

  renderComments() {
    const member = this.state.member;
    const account = member.account || {};
    const comments = account.comment || [];

    return (
      <section>
        <h4>Notes et Commentaires</h4>
        <Table columns={CommentColumns} data={comments} placeholder="Aucun commentaire"/>
      </section>
    );
  }

  renderStats() {
    return (
      <section>
        <h3>Statistiques</h3>
        <ProfileStats member={this.state.member}/>
      </section>
    );
  }

  renderCopies() {
    const account = this.state.member.account || {};
    const copies = (account.copies || []).map((copy) => {
      const c = {
        id: copy.id,
        name: copy.item.name,
        editor: copy.item.editor,
        edition: copy.item.edition,
        price: copy.price,
        added: copy.transaction.filter((t) => t.code === 'ADD'),
        sold: copy.transaction.filter((t) => t.code === 'SELL' || t.code === 'SELL_PARENT'),
        paid: copy.transaction.filter((t) => t.code === 'PAY'),
      };

      return c;
    });

    return (
      <section>
        <h4>Liste des exemplaires</h4>
        <Table columns={MemberCopyColumns} data={copies} placeholder="Aucun exemplaire"/>
      </section>
    );
  }

  render() {
    const member = this.state.member;
    return (
      <Panel header="Membre" bsStyle={this.isActive() ? 'default' : 'danger'}>
        <h3> {`${member.first_name || ''} ${member.last_name || ''}`}</h3>
        {this.rendeGeneralInformation()}
        {this.renderAccountState()}
        {this.renderComments()}
        {this.renderStats()}
        {this.renderCopies()}
      </Panel>
    );
  }
}

MemberView.propTypes = {
  params: React.PropTypes.shape(),
};
