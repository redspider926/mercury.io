import * as actionTypes from './actionTypes';

export function bridgefyStart(bridgefyId) {
  return {
    type: actionTypes.BRIDGEFY_START,
    payload: bridgefyId,
  };
}

export function bridgefyStop() {
  return {
    type: actionTypes.BRIDGEFY_STOP,
  };
}

export function messageRefresh(refreshKey) {
  return {
    type: actionTypes.MESSAGE_REFRESH,
    payload: refreshKey,
  };
}
