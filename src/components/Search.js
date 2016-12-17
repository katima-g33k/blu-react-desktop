import React, { Component } from 'react';
import { Button, Col, FormControl, Panel, Row } from 'react-bootstrap';
import HTTP from '../lib/HTTP';
import Table from './Table.js';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      search: '',
      data: [],
      columns: [
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
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.renderResults = this.renderResults.bind(this);
  }

  handleChange(event) {
    this.setState({ search: event.target.value });
  }

  handleClick() {
    this.setState({ isLoading: true });
    const data = {
      search: this.state.search,
      deactivated: true,
    };

    HTTP.post('http://localhost/blu-api/member/search', data, (err, res) => {
      if (res) {
        this.setState({
          data: res,
          isLoading: false,
        });
      }
    });
  }

  renderTable() {
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Numéro de membre</th>
            <th>Prénom</th>
            <th>Nom</th>
          </tr>
        </thead>
        <tbody>
          {this.renderResults()}
        </tbody>
      </Table>
    );
  }

  renderResults() {
    return this.state.data.map((member) => {
      return (
        <tr key={member.no}>
          <td>{member.no}</td>
          <td>{member.first_name}</td>
          <td>{member.last_name}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <Panel header="Search">
        <Row>
          <Col sm={10} md={10}>
            <form>
              <FormControl
                type="search"
                onChange={this.handleChange} />
              <Button
                bsStyle="primary"
                type="submit"
                disabled={this.state.isLoading}
                onClick={!this.state.isLoading ? this.handleClick : null}>
                {this.state.isLoading ? 'Loading...' : 'Search'}
              </Button>
            </form>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={10}>
            <Table columns={this.state.columns} data={this.state.data} />
          </Col>
        </Row>
      </Panel>
    );
  }
}
