import * as actionTypes from './actionTypes';

export function setOnline() {
  return {
    type: actionTypes.SET_ONLINE,
  };
}

export function setOffline() {
  return {
    type: actionTypes.SET_OFFLINE,
  };
}
