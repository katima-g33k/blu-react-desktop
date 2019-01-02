import { connect } from 'react-redux';
import ProfileStats from '../components/general/ProfileStats';

const mapStateToProps = ({ copyStore }) => ({
  copies: copyStore.copies,
});

const mapDispatchToProps = () => ({});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  copies: stateProps.copies,
  priceStats: ownProps.priceStats,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ProfileStats);
