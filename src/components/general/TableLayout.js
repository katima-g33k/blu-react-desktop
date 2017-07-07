import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

import Table from './Table';

export default class TableLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <section>
        <h4>{this.props.title}</h4>
        {this.props.actions && this.props.actions.map(action => (
          <Button
            key={action.name}
            bsStyle={action.bsStyle}
            onClick={action.onClick}
          >
            {action.icon ? (<Glyphicon glyph={action.icon} style={{ paddingRight: '10px' }} />) : null}
            {action.label}
          </Button>
        ))}

        <Table
          columns={this.props.columns}
          data={this.props.data}
          placeholder={this.props.placeholder || 'Aucune donnée'}
          striped
        />
        {this.props.modal}
      </section>
    );
  }
}

TableLayout.propTypes = {
  actions: React.PropTypes.array,
  columns: React.PropTypes.array.isRequired,
  data: React.PropTypes.array.isRequired,
  modal: React.PropTypes.shape(),
  placeholder: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
};
