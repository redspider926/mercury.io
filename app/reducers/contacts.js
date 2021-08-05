import * as actionTypes from '../actions/actionTypes';

const initialState = [];

const contacts = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SET_CONTACTS:
      return action.payload;

    default:
      return state;
  }
};

export default contacts;
