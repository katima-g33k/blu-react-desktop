import React, { Component } from 'react';
import {
  Button,
  Checkbox,
  Col,
  FormControl,
  FormGroup,
  Panel,
  Radio,
  Row,
} from 'react-bootstrap';
import HTTP from '../lib/HTTP';
import Table from './Table.js';

const columns = {
  member: [
    {
      key: 'no',
      label: 'Numéro de membre',
      id: true,
    },
    {
      key: 'first_name',
      label: 'Prénom',
    },
    {
      key: 'last_name',
      label: 'Nom',
    },
  ],
  item: [
    {
      key: 'id',
      id: true,
    },
    {
      key: 'name',
      label: 'Titre',
    },
    {
      key: 'editor',
      label: 'Éditeur',
    },
    {
      key: 'edition',
      label: 'Édition',
    },
    {
      key: 'publication',
      label: 'Année de parutation',
    },
    {
      key: 'author',
      label: 'Auteurs',
      value(authors) {
        if (!Array.isArray(authors)) {
          return '';
        }
        return authors.map((author) => `${author.first_name} ${author.last_name}`).join(', ');
      },
    },
  ],
};
export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      search: '',
      data: [],
      columns: columns.member,
      type: 'member',
      archives: false,
    };
    this.search = this.search.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleType = this.handleType.bind(this);
    this.handleArchive = this.handleArchive.bind(this);
  }

  handleInput(event) {
    this.setState({ search: event.target.value });
  }

  search(event) {
    event.preventDefault();
    this.setState({ isLoading: true });
    const data = {
      search: this.state.search,
      deactivated: this.state.archives,
    };

    HTTP.post(`http://localhost/blu-api/${this.state.type}/search`, data, (err, res) => {
      if (res) {
        this.setState({
          data: res,
          isLoading: false,
        });
      }
    });
  }

  handleType(event) {
    const type = event.target.value;
    this.setState({
      type,
      columns: columns[type],
      data: [],
    });
  }

  handleArchive() {
    this.setState({ archives: !this.state.archives });
  }

  render() {
    return (
      <Panel header="Search">
        <Row>
          <Col sm={10} md={10}>
            <form>
              <FormControl
                type="search"
                onChange={this.handleInput} />
                <FormGroup>
                   <Radio
                    name="type"
                    value="member"
                    inline
                    checked={this.state.type === 'member'}
                    onChange={this.handleType}>Membre</Radio>
                   <Radio
                    name="type"
                    value="item"
                    inline
                    checked={this.state.type === 'item'}
                    onChange={this.handleType}>Ouvrage</Radio>
                 </FormGroup>
              <Checkbox
                onChange={this.handleArchive}
                checked={this.state.archives}>Chercher dans les archives</Checkbox>
              <Button
                bsStyle="primary"
                type="submit"
                disabled={this.state.isLoading}
                onClick={!this.state.isLoading ? this.search : null}>
                {this.state.isLoading ? 'Loading...' : 'Search'}
              </Button>
            </form>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={10}>
            <h3>Résultats ({this.state.data.length})</h3>
            <Table columns={this.state.columns} data={this.state.data} highlight={this.state.search} />
          </Col>
        </Row>
      </Panel>
    );
  }
}
