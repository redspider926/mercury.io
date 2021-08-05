import * as actionTypes from '../actions/actionTypes';

const initialState = [];
const chats = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SET_CHATS:
      return action.payload;

    case actionTypes.ADD_MESSAGE:
      state.map((chat) => {
        const tempChat = chat;
        if (chat.chatId === action.payload.chatId) {
          tempChat[action.payload.messageId] = action.payload.message;
        }
        return tempChat;
      });
      return state;
    default:
      return state;
  }
};

export default chats;
