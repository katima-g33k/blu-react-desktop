import { historyPush } from '../routeActions';
import {
  OPEN_ITEM,
  OPEN_MEMBER,
} from '../actionTypes';

const open = {
  item: id => ({
    id,
    type: OPEN_ITEM,
  }),
  member: no => ({
    no,
    type: OPEN_MEMBER,
  }),
};

export default (type, id) => (dispatch) => {
  dispatch(historyPush(`${type}/view/${id}`));
  dispatch(open[type](id));
};
