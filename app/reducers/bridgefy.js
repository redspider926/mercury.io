import * as actionTypes from '../actions/actionTypes';

const initialState = {
  isStarted: false,
  id: '',
};

const bridgefy = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.BRIDGEFY_START:
      return {
        isStarted: true,
        id: action.payload,
      };

    case actionTypes.BRIDGEFY_STOP:
      return {
        isStarted: false,
        id: '',
      };

    default:
      return state;
  }
};

export default bridgefy;
