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
    dataFormat: (cell, row) => row.item.name,
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
    dataFormat: (cell, row) => row.item.authorString,
  },
  {
    dataField: 'edition',
    label: 'Édition',
    dataFormat: (cell, row) => row.item.edition,
  },
  {
    dataField: 'publication',
    label: 'Année de parution',
    dataFormat: (cell, row) => row.item.publication,
  },
  {
    dataField: 'editor',
    label: 'Éditeur',
    tdStyle: { whiteSpace: 'normal' },
    dataFormat: (cell, row) => row.item.editor,
  },
  {
    dataField: 'dateAdded',
    label: 'Date d\'ajout (AAAA-MM-JJ)',
    dataFormat: date => formatDate(date),
  },
  {
    dataField: 'dateSold',
    label: 'Date de vente (AAAA-MM-JJ)',
    dataFormat: date => formatDate(date),
  },
  {
    dataField: 'datePaid',
    label: 'Date de remise d\'argent (AAAA-MM-JJ)',
    dataFormat: date => formatDate(date),
  },
  {
    dataField: 'priceString',
    label: 'Prix',
  },
];

export default class MemberReceipt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      member: null,
    };

    this.renderAccount = this.renderAccount.bind(this);
    this.renderCopies = this.renderCopies.bind(this);
    this.renderPhone = this.renderPhone.bind(this);
  }

  componentWillMount() {
    const no = this.props.params.no;

    HTTP.post(`${settings.apiUrl}/member/select`, { no }, (err, res) => {
      if (err) {
        // TODO: Display error message
        return;
      }

      this.setState({ member: new Member(res) });
    });
  }

  componentDidMount() {
    // window.print();
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
          {this.renderCopies()}
        </Row>
      </div>
    ) : <Spinner/>;
  }
}

MemberReceipt.propTypes = {
  params: PropTypes.shape(),
};
