import { connect } from 'react-redux';

import CopyTable from '../components/copy/table/CopyTable';

const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});
const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CopyTable);
