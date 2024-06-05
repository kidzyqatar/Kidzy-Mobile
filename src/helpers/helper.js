import constants from '../constants/constants';
import {setReload} from '../store/reducers/global';

export const formatDate = value => {
  `${(value.getMonth() + 1).toString().padStart(2, '0')}-${value
    .getDate()
    .toString()
    .padStart(2, '0')}-${value.getFullYear()}`;
};

export const handleReload = (type, currentStatus, dispatch) => {
  let newStatus = '';
  if (type == 'SOFT') {
    if (
      currentStatus == constants.HARD_RELOAD_TRUE ||
      currentStatus == constants.HARD_RELOAD_FALSE
    ) {
      newStatus = constants.SOFT_RELOAD_TRUE;
    } else {
      newStatus =
        currentStatus == constants.SOFT_RELOAD_TRUE
          ? constants.SOFT_RELOAD_FALSE
          : constants.SOFT_RELOAD_TRUE;
    }
  } else {
    if (
      currentStatus == constants.SOFT_RELOAD_TRUE ||
      currentStatus == constants.SOFT_RELOAD_FALSE
    ) {
      newStatus = constants.HARD_RELOAD_TRUE;
    } else {
      newStatus =
        currentStatus == constants.HARD_RELOAD_TRUE
          ? constants.HARD_RELOAD_FALSE
          : constants.HARD_RELOAD_TRUE;
    }
  }
  // console.log('Old Status  ====>', currentStatus);
  // console.log('New Status  ====>', newStatus);
  dispatch(setReload(newStatus));
};
