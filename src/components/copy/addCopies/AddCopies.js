import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Col,
  Glyphicon,
  Panel,
  Row,
} from 'react-bootstrap';
import { Link } from 'react-router';

import {
  ActionPanel,
  Table,
} from '../../general';
import {
  Copy,
  Item,
  Member,
} from '../../../lib/models';
import i18n from '../../../lib/i18n';
import ItemForm from '../../../containers/ItemFormContainer';
import Search from '../../../containers/SearchContainer';

const {
  Body,
  Heading,
  Title,
} = Panel;


const styles = {
  link: {
    color: '#000',
    textDecoration: 'none',
  },
};

export default class AddCopies extends Component {
  static propTypes = {
    copies: PropTypes.arrayOf(PropTypes.instanceOf(Copy)),
    fetchItem: PropTypes.func.isRequired,
    handleOnAddCopy: PropTypes.func.isRequired,
    item: PropTypes.instanceOf(Item),
    member: PropTypes.instanceOf(Member).isRequired,
    onLoad: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    scannedItem: PropTypes.shape(),
  };

  static defaultProps = {
    copies: [],
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
    if (nextProps.item.id) {
      this.props.handleOnAddCopy(nextProps.item);
      return;
    }

    if (this.props.scannedItem && !nextProps.scannedItem) {
      return;
    }

    if (nextProps.scannedItem.id) {
      this.props.fetchItem(nextProps.scannedItem.id);
      return;
    }

    this.setState({
      isSearch: false,
      ean13: nextProps.scannedItem.ean13,
    });
  }

  get actions() {
    return [{
      label: i18n('actions.done'),
      href: `/member/view/${this.props.member.no}`,
      style: 'primary',
    }];
  }

  columns = [
    {
      dataField: 'id',
      isKey: true,
      hidden: true,
    },
    {
      dataField: 'title',
      label: i18n('AddCopies.table.columns.title'),
      tdStyle: { whiteSpace: 'normal' },
      dataFormat: (cell, { item: { name } }) => name,
    },
    {
      dataField: 'price',
      label: i18n('AddCopies.table.columns.price'),
      width: '40px',
      dataFormat: price => `${price} $`,
    },
    {
      dataField: 'actions',
      label: '',
      dataAlign: 'center',
      width: '100px',
      dataFormat: (cell, copy) => {
        const actions = [(
          <Button
            bsStyle="default"
            onClick={() => this.props.onUpdate(copy)}
          >
            <Glyphicon glyph="pencil" />
          </Button>
        )];

        if (!copy.reservation) {
          actions.push((
            <Button
              bsStyle="danger"
              onClick={() => this.props.onRemove(copy)}
            >
              <Glyphicon glyph="trash" />
            </Button>
          ));
        }

        return (
          <div>
            {actions}
          </div>
        );
      },
    },
  ];

  toggleView = () => this.setState(state => ({ isSearch: !state.isSearch }));

  renderSearch = () => (
    <Search
      disableTypeSelection
      noHeader
      type={Search.TYPES.ITEM}
      onRowClick={this.props.handleOnAddCopy}
      onAddButton={this.toggleView}
    />
  );

  renderForm = () => (
    <ItemForm
      ean13={this.state.ean13}
      onCancel={this.toggleView}
      onSaveCallback={this.props.handleOnAddCopy}
    />
  );

  render() {
    return (
      <Row>
        <Col md={10}>
          <Panel>
            <Heading>{i18n('AddCopies.title')}</Heading>
            <Body>
              <Title>
                <h2>
                  <Link
                    to={`/member/view/${this.props.member.no}`}
                    style={styles.link}
                  >
                    {this.props.member.name}
                  </Link>
                </h2>
              </Title>
              <Row>
                <Col md={4}>
                  <Table
                    columns={this.columns}
                    data={this.props.copies}
                    striped
                  />
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
          <ActionPanel actions={this.actions} />
        </Col>
      </Row>
    );
  }
}
