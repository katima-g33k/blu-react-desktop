import { connect } from 'react-redux';

import { updateFilter } from '../actions/copyTableActions';
import CopyTable from '../components/copy/table/CopyTable';
import columns from '../components/copy/table/columns';

const mapStateToProps = ({ copyTableStore }) => ({
  ...copyTableStore,
});

const mapDispatchToProps = dispatch => ({
  updateFilter: (filter, value) => dispatch(updateFilter(filter, value)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  updateFilter: (event) => {
    const filter = event.target.id;
    const value = filter === 'search' ? event.target.value : event.target.checked;

    dispatchProps.updateFilter(filter, value);
  },
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CopyTable);
