import { connect } from 'react-redux';

import { SearchColumns } from '../lib/TableColumns';
import Search from '../components/search/Search';
import { updateSearchValue, updateType, updateArchives, search } from '../actions/searchActions';

const mapStateToProps = ({ search }) => ({
  ...search,
  columns: SearchColumns[search.type],
  modal: null,
});

const mapDispatchToProps = dispatch => ({
  cancelSearch: () => dispatch({}),
  handleArchive: () => dispatch(updateArchives()),
  handleInput: event => dispatch(updateSearchValue(event.target.value)),
  handleSearch: (value, type, archives) => dispatch(search(value, type, archives)),
  handleType: event => dispatch(updateType(event.target.value)),
  onAddButton: () => dispatch({}),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  handleSearch: (event) => {
    event.preventDefault();
    dispatchProps.handleSearch(stateProps.value, stateProps.type, stateProps.archives);
  },
});


export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Search);
