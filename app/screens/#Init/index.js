import React, {useEffect} from 'react';
import {NativeEventEmitter, PermissionsAndroid, Platform} from 'react-native';
import RNBridgefy from 'react-native-bridgefy';
import database from '@react-native-firebase/database';

import {Loading} from '@components';

import {
  AuthActions,
  ContactActions,
  NetworkActions,
  ChatActions,
  BridgefyActions,
  DeviceActions,
} from '@actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const BRDG_LICENSE_KEY = '9dfc32fc-3fd2-4ec4-bb7b-a35bf45722f4';

import {useNetInfo} from '@react-native-community/netinfo';

const bridgefyEmitter = new NativeEventEmitter(RNBridgefy);

const Index = (props) => {
  const myPhone = props.auth.user.phone;
  const myName = props.auth.user.name;
  let bridgefyId = '';
  const netInfo = useNetInfo();

  React.useEffect(() => {
    console.log('NETWORK', netInfo.details);
    if (netInfo.details === null) {
      props.networkActions.setOffline();
    } else {
      if (netInfo.details.ipAddress !== undefined) {
        props.networkActions.setOnline();
      } else {
        props.networkActions.setOffline();
      }
    }
  }, [netInfo]);

  React.useEffect(() => {
    database()
      .ref('/users/')
      .orderByChild('contacts/' + myPhone + '/match')
      .equalTo(true)
      .once('value')
      .then((snapshot) => {
        if (snapshot.val() !== null && snapshot.val() !== undefined) {
          props.contactActions.setContacts(Object.values(snapshot.val()));
        } else {
          props.contactActions.setContacts([]);
        }
      })
      .catch((error) => {});
    database()
      .ref('/users/')
      .orderByChild('contacts/' + myPhone + '/match')
      .equalTo(true)
      .on('value', (snapshot) => {
        if (snapshot.val() !== null && snapshot.val() !== undefined) {
          props.contactActions.setContacts(Object.values(snapshot.val()));
        } else {
          props.contactActions.setContacts([]);
        }
      });
    database()
      .ref('/chats')
      .orderByChild('users/' + myPhone + '/name')
      .equalTo(myName)
      .once('value')
      .then((snapshot) => {
        if (snapshot.val() !== null && snapshot.val() !== undefined) {
          props.chatActions.setChats(Object.values(snapshot.val()));
        } else {
          props.chatActions.setChats([]);
        }
      })
      .catch();
    database()
      .ref('/chats')
      .orderByChild('users/' + myPhone + '/name')
      .equalTo(myName)
      .on('value', (snapshot) => {
        if (snapshot.val() !== null && snapshot.val() !== undefined) {
          props.chatActions.setChats(Object.values(snapshot.val()));
        } else {
          props.chatActions.setChats([]);
        }
      });
    return function cleanup() {};
  }, []);

  useEffect(() => {
    initListeners();
    initBrdg();

    return () => {
      if (props.bridgefy.isStarted) {
        RNBridgefy.stop();
      }
      clearListeners();
    };
  }, []);

  let clearListeners = () => {
    console.log('clear listeners');
    bridgefyEmitter.removeAllListeners('onMessageReceived');
    bridgefyEmitter.removeAllListeners('onBroadcastMessageReceived');
    bridgefyEmitter.removeAllListeners('onMessageFailed');
    bridgefyEmitter.removeAllListeners('onMessageSent');
    if (Platform.OS === 'android') {
      bridgefyEmitter.removeAllListeners('onMessageDataProgress');
    }
    bridgefyEmitter.removeAllListeners('onMessageReceivedException');
    bridgefyEmitter.removeAllListeners('onStarted');
    bridgefyEmitter.removeAllListeners('onStartError');
    bridgefyEmitter.removeAllListeners('onStopped');
    bridgefyEmitter.removeAllListeners('onDeviceConnected');
    bridgefyEmitter.removeAllListeners('onDeviceLost');
    bridgefyEmitter.removeAllListeners('onEventOccurred');
  };

  let initListeners = () => {
    console.log('INITIATING THE BRDG RN LISTENERS');
    bridgefyEmitter.addListener('onMessageReceived', (message) => {
      console.log('onMessageReceived: ' + JSON.stringify(message));
      const _message = JSON.parse(message.content.message);
      const chatId = message.content.chatId;
      const messageId = _message.messageId;

      database()
        .ref('/chats/' + chatId + '/messages/' + messageId)
        .set({
          ..._message,
          createdAt: Date.now(),
          messageId: messageId,
          deleted: false,
        });

      props.chatActions.addMessage(chatId, messageId, _message);
    });

    // This event is launched when a broadcast message has been received, the structure
    // of the dictionary received is explained in the appendix.
    bridgefyEmitter.addListener('onBroadcastMessageReceived', (message) => {
      console.log('onBroadcastMessageReceived: ' + JSON.stringify(message));
    });

    // This event is launched when a message could not be sent, it receives an error
    // whose structure will be explained in the appendix
    bridgefyEmitter.addListener('onMessageFailed', (evt) => {
      console.log('onMessageFailed: ' + evt);
    });

    // This event is launched when a message was sent, contains the message
    // itself, and the structure of message is explained in the appendix.
    bridgefyEmitter.addListener('onMessageSent', (message) => {
      console.log('onMessageSent: ' + JSON.stringify(message));
      // props.bridgefyActions.messageRefresh(message.uuid);
    });

    if (Platform.OS === 'android') {
      bridgefyEmitter.addListener('onMessageDataProgress', (evt) => {
        console.log('onMessageDataProgress: ' + evt.percentageProgress);
      });
    }

    // This event is launched when a message was received but it contains errors,
    // the structure for this kind of error is explained in the appendix.
    // This method is launched exclusively on Android.
    bridgefyEmitter.addListener('onMessageReceivedException', (evt) => {
      console.log('onMessageReceivedException: ' + evt);
    });

    //
    // Device listeners
    //

    // This event is launched when the service has been started successfully, it receives
    // a device dictionary that will be descripted in the appendix.
    bridgefyEmitter.addListener('onStarted', async (device) => {
      // For now, device is an empty dictionary
      console.log('-------BRIDGEFY SDK STARTED--------', device);
      database()
        .ref('/users/' + myPhone + '/bridgefyId')
        .set(bridgefyId)
        .then((result) =>
          console.log('register bridgefyId to firebase success', result),
        )
        .catch((error) =>
          console.log('register bridgefyId to firebase success', error),
        );
      await props.bridgefyActions.bridgefyStart(bridgefyId);
      await props.deviceActions.deviceInit();
      props.navigation.navigate('TabNav');
    });

    // This event is launched when the RNBridgefy service fails on the start, it receives
    // a dictionary (error) that will be explained in the appendix.
    bridgefyEmitter.addListener('onStartError', (evt) => {
      console.log('onStartError: ', evt);
    });

    // This event is launched when the RNBridgefy service stops.
    bridgefyEmitter.addListener('onStopped', (evt) => {
      console.log('onStopped');
      props.bridgefyActions.bridgefyStop();
    });

    // This method is launched when a device is nearby and has established connection with the local user.
    // It receives a device dictionary.
    bridgefyEmitter.addListener('onDeviceConnected', (device) => {
      console.log('onDeviceConnected: ' + JSON.stringify(device));
      props.deviceActions.deviceConnect(device.userId);
    });
    // This method is launched when there is a disconnection of a user.
    bridgefyEmitter.addListener('onDeviceLost', (device) => {
      console.log('onDeviceLost: ' + JSON.stringify(device));
      props.deviceActions.deviceLost(device.userId);
    });

    // This is method is launched exclusively on iOS devices, notifies about certain actions like when
    // the bluetooth interface  needs to be activated, when internet is needed and others.
    bridgefyEmitter.addListener('onEventOccurred', (event) => {
      console.log(
        'Event code: ' + event.code + ' Description: ' + event.description,
      );
    });
  };

  let initBrdg = () => {
    function doInitBrdg() {
      RNBridgefy.init(BRDG_LICENSE_KEY)
        .then((brdgClient) => {
          console.log('Brdg client = ', brdgClient);
          bridgefyId = brdgClient.userUuid;
          //   userId = brdgClient.userUuid;
          RNBridgefy.start({
            autoConnect: true,
            engineProfile: 'BFConfigProfileDefault',
            energyProfile: 'HIGH_PERFORMANCE',
            encryption: true,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ])
        .then((result) => {
          if (
            result['android.permission.ACCESS_COARSE_LOCATION'] ||
            result['android.permission.ACCESS_FINE_LOCATION']
          ) {
            doInitBrdg();
          } else {
          }
        })
        .catch((e) => {});
    } else {
      doInitBrdg();
    }
  };

  return <Loading />;
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    contacts: state.contacts,
    network: state.network,
    bridgefy: state.bridgefy,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
    contactActions: bindActionCreators(ContactActions, dispatch),
    networkActions: bindActionCreators(NetworkActions, dispatch),
    chatActions: bindActionCreators(ChatActions, dispatch),
    bridgefyActions: bindActionCreators(BridgefyActions, dispatch),
    deviceActions: bindActionCreators(DeviceActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
