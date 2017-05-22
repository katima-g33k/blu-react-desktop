import React, { Component, PropTypes } from 'react';
import { Col, Row } from 'react-bootstrap';
import moment from 'moment';

import AlignedData from '../../general/AlignedData';
import HTTP from '../../../lib/HTTP';
import Member from '../../../lib/models/Member';
import settings from '../../../settings.json';
import Spinner from '../../general/Spinner';
import Table from '../../general/Table';

const formatDate = date => date ? moment(date).format('YYYY-MM-DD') : '';
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
    this.state = {
      member: null,
    };

    this.renderAccount = this.renderAccount.bind(this);
    this.renderAutorisation = this.renderAutorisation.bind(this);
    this.renderCopies = this.renderCopies.bind(this);
    this.renderPhone = this.renderPhone.bind(this);
  }

  componentWillMount() {
    const { no } = this.props.params;

    HTTP.post(`${settings.apiUrl}/member/select`, { no }, (err, res) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      this.setState({ member: new Member(res) });
      print();
      // close();
    });
  }

  renderCopies() {
    return (
      <Table
        columns={columns}
        data={this.state.member.account.copies}
        options={{
          defaultSortName: columns.find(column => column.defaultSort).dataField,
          defaultSortOrder: 'asc',
        }}
        placeholder={'Aucun exemplaire'}
      />
    );
  }

  renderPhone() {
    const phones = this.state.member.phone;

    return phones.map((phone, index) => {
      return (
        <AlignedData
          key={phone.number}
          label={<span>{`Téléphone ${index + 1}`}</span>}
          value={phone.toString()}
        />
      );
    });
  }

  renderAccount() {
    const member = this.state.member;
    const fields = [
      { key: 'name', label: 'Nom' },
      { key: 'no', label: 'Numéro de DA' },
      { key: 'addressString', label: 'Adresse postale' },
      { key: 'email', label: 'Adresse courriel' },
    ];

    return (
      <section>
        <h3>{'Compte étudiant'}</h3>
        <hr/>
        {fields.map(field => {
          return (
            <AlignedData
              key={field.key}
              label={field.label}
              value={member[field.key]}
            />
          );
        })}
        {this.renderPhone()}
      </section>
    );
  }

  renderAutorisation() {
    const { amount } = this.props.params;
    const { name } = this.state.member.name;
    const date = moment().format('LL');
    const signatureStyle = {
      marginTop: 30,
      borderTop: '1px solid black',
    };
    // eslint-disable-next-line
    const message = `Je, ${name}, atteste que les informations précitées sont valides et que l\'Association Étudiante du Cégep de Sherbrooke (AÉCS) m\'a remis le montant de ${amount} $ en date du ${date}.`;
    return (
      <Row>
        {message}
        <Row>
          <Col md={3} style={signatureStyle}>
            {'Signature'}
          </Col>
        </Row>
      </Row>
    );
  }

  render() {
    return this.state.member ? (
      <div>
        <h2>{'Banque de livres usagés'}</h2>
        <Row>
          <Col md={4}>
            {this.renderAccount()}
          </Col>
        </Row>
        <Row>
          <h3>{'Livres mis en vente'}</h3>
          <hr/>
          {this.renderCopies()}
        </Row>
        {this.renderAutorisation()}
      </div>
    ) : <Spinner/>;
  }
}

MemberReceipt.propTypes = {
  params: PropTypes.shape(),
};
