import * as actionTypes from './actionTypes';

export function deviceConnect(deviceId) {
  return {
    type: actionTypes.DEVICE_CONNECT,
    payload: deviceId,
  };
}

export function deviceLost(deviceId) {
  return {
    type: actionTypes.DEVICE_LOST,
    payload: deviceId,
  };
}

export function deviceInit() {
  return {
    type: actionTypes.DEVICE_INIT,
  };
}
