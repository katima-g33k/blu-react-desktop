import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

import SearchContainer from '../../search/SearchContainer';

export default class SearchModal extends Component {
  render() {
    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>
            {this.props.title || 'Recherche'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SearchContainer
            type={this.props.type}
            onRowClick={this.props.onRowClick}
            noHeader
            disableArchive={this.props.disableArchive}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.props.onCancel}
          >
            {'Annuler'}
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}

SearchModal.propTypes = {
  disableArchive: React.PropTypes.bool,
  onCancel: React.PropTypes.func.isRequired,
  onRowClick: React.PropTypes.func.isRequired,
  title: React.PropTypes.string,
  type: React.PropTypes.string.isRequired,
};
