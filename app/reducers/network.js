import * as actionTypes from '../actions/actionTypes';

const initialState = {
  isOnline: true,
};

const network = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SET_OFFLINE:
      return {
        isOnline: false,
      };
    case actionTypes.SET_ONLINE:
      return {
        isOnline: true,
      };

    default:
      return state;
  }
};

export default network;
