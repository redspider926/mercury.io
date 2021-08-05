import * as actionTypes from '../actions/actionTypes';

const initialState = [];
const chat = (devices = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.DEVICE_CONNECT:
      return devices.some((device) => device === action.payload)
        ? devices
        : [...devices, action.payload];

    case actionTypes.DEVICE_LOST:
      return devices.filter((device) => device !== action.payload);

    case actionTypes.DEVICE_INIT:
      return [];

    default:
      return devices;
  }
};

export default chat;
