import {combineReducers} from 'redux';

import auth from './auth';
import bridgefy from './bridgefy';
import network from './network';
import chats from './chats';
import contacts from './contacts';
import devices from './devices';

export default combineReducers({
  auth,
  bridgefy,
  network,
  chats,
  contacts,
  devices,
});
