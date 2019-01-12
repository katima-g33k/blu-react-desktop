import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Panel,
  Row,
} from 'react-bootstrap';

import i18n from '../../../lib/i18n';
import { Item } from '../../../lib/models';

import ActionPanel from '../../../containers/AddCopiesActionPanelContainer';
import AddedCopiesTable from '../../../containers/AddedCopiesTableContainer';
import { Alert } from '../../general';
import ItemForm from '../../../containers/ItemFormContainer';
import Search from '../../../containers/SearchContainer';

const { Body, Heading, Title } = Panel;

export default class AddCopies extends Component {
  static propTypes = {
    fetchItem: PropTypes.func.isRequired,
    handleOnAddCopy: PropTypes.func.isRequired,
    item: PropTypes.instanceOf(Item),
    memberName: PropTypes.string.isRequired,
    onLoad: PropTypes.func.isRequired,
    scannedItem: PropTypes.shape(),
  };

  static defaultProps = {
    item: null,
    scannedItem: null,
  };

  state = {
    ean13: null,
    isSearch: true,
  };

  componentDidMount() {
    this.props.onLoad();
  }

  componentWillReceiveProps(nextProps) {
    // TODO: Find a way to handle scanning same item twice in a row
    if (!this.state.isSearch) {
      return;
    }

    if ((this.props.scannedItem || {}).ean13 === (nextProps.scannedItem || {}).ean13) {
      if (nextProps.item.id) {
        this.props.handleOnAddCopy(nextProps.item);
      }

      return;
    }

    if (nextProps.scannedItem && nextProps.scannedItem.id) {
      this.props.fetchItem(nextProps.scannedItem.id);
      return;
    }

    if (!this.state.isSearch) {
      this.toggleView();
    } else if (nextProps.scannedItem && nextProps.scannedItem.ean13) {
      this.toggleView(nextProps.scannedItem.ean13);
    }
  }

  toggleView = (ean13 = null) => this.setState(state => ({ ean13, isSearch: !state.isSearch }));

  renderSearch = () => (
    <Search
      disableTypeSelection
      noHeader
      onAddButton={this.toggleView}
      onRowClick={this.props.handleOnAddCopy}
      type={Search.TYPES.ITEM}
    />
  );

  renderForm = () => (
    <ItemForm
      ean13={this.state.ean13 || ''}
      onCancel={this.toggleView}
      onSaveCallback={this.props.handleOnAddCopy}
    />
  );

  render() {
    return (
      <Row>
        <Col md={10}>
          <Panel>
            <Heading>
              <Title>{i18n('AddCopies.title')}</Title>
            </Heading>
            <Alert label={i18n('AddCopies.warning')} />
            <Body>
              <h2>
                {this.props.memberName}
              </h2>
              <Row>
                <Col md={4}>
                  <AddedCopiesTable />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  {this.state.isSearch ? this.renderSearch() : this.renderForm()}
                </Col>
              </Row>
            </Body>
          </Panel>
        </Col>
        <Col md={2}>
          <ActionPanel />
        </Col>
      </Row>
    );
  }
}
