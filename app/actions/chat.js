import * as actionTypes from './actionTypes';

export function setChats(chats) {
  return {
    type: actionTypes.SET_CHATS,
    payload: chats,
  };
}

export function addMessage(chatId, messageId, message) {
  return {
    type: actionTypes.ADD_MESSAGE,
    payload: {
      chatId: chatId,
      messageId: messageId,
      message: message,
    },
  };
}
