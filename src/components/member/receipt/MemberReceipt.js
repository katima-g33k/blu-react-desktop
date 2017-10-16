import React, { Component, PropTypes } from 'react';
import { Col, Row } from 'react-bootstrap';
import moment from 'moment';

import AlignedData from '../../general/AlignedData';
import Table from '../../general/Table';

const formatDate = (date) => {
  if (date) {
    return moment(date).format('YYYY-MM-DD');
  }

  return '';
};
const columns = [
  {
    dataField: 'id',
    isKey: true,
    hidden: true,
  },
  {
    dataField: 'name',
    label: 'Titre',
    defaultSort: true,
    tdStyle: { whiteSpace: 'normal' },
    dataFormat: (cell, { item }) => item.name,
    sortFunc: (a, b, order) => {
      if (a.item.name < b.item.name) {
        return order === 'asc' ? -1 : 1;
      }

      if (a.item.name > b.item.name) {
        return order === 'asc' ? 1 : -1;
      }

      return 0;
    },
  },
  {
    dataField: 'author',
    label: 'Auteur.e.s',
    tdStyle: { whiteSpace: 'normal' },
    dataFormat: (cell, { item }) => item.authorString,
  },
  {
    dataField: 'edition',
    label: 'Édition',
    dataFormat: (cell, { item }) => item.edition,
    width: '45px',
  },
  {
    dataField: 'editor',
    label: 'Éditeur',
    tdStyle: { whiteSpace: 'normal' },
    dataFormat: (cell, { item }) => item.editor,
    width: '100px',
  },
  {
    dataField: 'dateAdded',
    label: 'Date d\'ajout*',
    dataFormat: date => formatDate(date),
    width: '67px',
  },
  {
    dataField: 'dateSold',
    label: 'Date de vente*',
    dataFormat: date => formatDate(date),
    width: '75px',
  },
  {
    dataField: 'datePaid',
    label: 'Date de remise d\'argent*',
    dataFormat: date => formatDate(date),
    width: '120px',
  },
  {
    dataField: 'priceString',
    label: 'Prix',
    width: '30px',
  },
];

export default class MemberReceipt extends Component {
  constructor(props) {
    super(props);

    this.renderAccount = this.renderAccount.bind(this);
    this.renderAutorisation = this.renderAutorisation.bind(this);
    this.renderConditions = this.renderConditions.bind(this);
    this.renderCopies = this.renderCopies.bind(this);
    this.renderPhone = this.renderPhone.bind(this);
    this.renderNote = this.renderNote.bind(this);
  }

  componentDidMount() {
    print();
    return this.props.onAfterPrint && this.props.onAfterPrint();
  }

  renderCopies() {
    return (
      <Table
        columns={columns}
        data={this.props.member.account.copies}
        options={{
          defaultSortName: columns.find(column => column.defaultSort).dataField,
          defaultSortOrder: 'asc',
        }}
        placeholder={'Aucun exemplaire'}
      />
    );
  }

  renderPhone() {
    const phones = this.props.member.phone;

    return phones.map((phone, index) => (
      <AlignedData
        key={phone.number}
        label={<span>{`Téléphone ${index + 1}`}</span>}
        value={phone.toString()}
        className="userdata"
      />
      ));
  }

  renderAccount() {
    const member = this.props.member;
    const fields = [
      { key: 'name', label: 'Nom' },
      { key: 'no', label: 'Numéro de DA' },
      { key: 'addressString', label: 'Adresse postale' },
      { key: 'email', label: 'Adresse courriel' },
    ];

    return (
      <section>
        <h3>{'Compte étudiant'}</h3>
        {fields.map(field => (
          <AlignedData
            key={field.key}
            label={field.label}
            value={member[field.key]}
            className="userdata"
          />
          ))}
        {this.renderPhone()}
      </section>
    );
  }

  renderAutorisation() {
    const { amount } = this.props;
    const { name } = this.props.member;
    const date = moment().format('LL');
    // eslint-disable-next-line
    const message = `Je, ${name}, atteste que les informations précisées sont valides et que l\'Association Étudiante du Cégep de Sherbrooke (AÉCS) m\'a remis le montant de ${amount} $ en date du ${date}.`;
    return (
      <Row className="autorisation">
        <Row>
          <Col md={12}>
            {message}
          </Col>
        </Row>
        <Row className="signature">
          {'Signature'}
        </Row>
      </Row>
    );
  }

  renderConditions() {
    // eslint-disable-next-line max-len
    const conditions = 'La Banque de Livres Usagés (BLU) de l\'Association Étudiante du Cégep de Sherbrooke (AÉCS) fait la vente des livres déposés en consigne par les étudiant.e.s, qui choisissent le prix. Les déposant.e.s ont la responsabilité de venir collecter l\'argent de leurs ventes. Si un dossier demeure inactif pour une période consécutive de 12 mois, celui-ci est fermé sans préavis. Les livres et le solde restant deviennent la propriété exclusive de la BLU. Les dons de livres, les livres déposés à la BLU qui ne sont utilisés dans aucun cheminement ou encore qui sont remplacés par des éditions plus récentes seront acheminés sans péavis, s\'ils sont d\'une valeur inféreieure à 40 dollars, vers un programme de récupération de volumes à des fins humanitaires. La BLU n\'est pas responsable des vols et des bris de livres et n\'offre aucun remboursement dans de tels cas.';
    return (
      <Row className="conditions">
        <Col md={12}>
          {conditions}
        </Col>
      </Row>
    );
  }

  renderNote() {
    return (
      <Row className="note">
        <Col md={12}>
          {'* Les dates sont inscrites au format (AAAA-MM-JJ)'}
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <div id="receipt">
        <h2>{'Banque de livres usagés'}</h2>
        <p className="semester">{moment.semester()}</p>
        <Row>
          <Col md={4}>
            {this.renderAccount()}
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h3>{'Livres mis en vente'}</h3>
            {this.renderCopies()}
          </Col>
        </Row>
        {this.renderNote()}
        {this.renderAutorisation()}
        {this.renderConditions()}
      </div>
    );
  }
}

MemberReceipt.propTypes = {
  amount: PropTypes.number.isRequired,
  member: PropTypes.shape().isRequired,
  onAfterPrint: PropTypes.func,
};
