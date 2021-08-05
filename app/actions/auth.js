import * as actionTypes from './actionTypes';

export function register(user) {
  return {
    type: actionTypes.REGISTER,
    payload: user,
  };
}

export function login(user) {
  return {
    type: actionTypes.LOGIN,
    payload: user,
  };
}

export function logout() {
  return {
    type: actionTypes.LOGOUT,
  };
}

export function setConfirmation(confirmation) {
  return {
    type: actionTypes.SET_CONFIRMATION,
    payload: confirmation,
  };
}

export function setPhoneNumber(phoneNumber) {
  return {
    type: actionTypes.SET_PHONENUMBER,
    payload: phoneNumber,
  };
}
