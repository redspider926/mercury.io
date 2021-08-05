import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  Image,
  Text,
} from 'react-native';
import {Header} from '@components';
import {GiftedChat, Bubble, Send} from 'react-native-gifted-chat';

import Toast from 'react-native-toast-message';

import * as images from '@config/images';
import * as size from '@config/size';
import * as color from '@config/color';

import database from '@react-native-firebase/database';

import {AuthActions, ChatActions} from '@actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import RNBridgefy from 'react-native-bridgefy';

const Index = (props) => {
  const chatId = props.route.params.chatId;

  const tempMessages = props.chats.find((chat) => chat.chatId === chatId)
    .messages;
  const users = props.chats.find((chat) => chat.chatId === chatId).users;
  console.log('users', users);
  console.log('chatId', chatId);

  let messages = [];
  if (tempMessages !== undefined && tempMessages !== null) {
    messages = Object.values(tempMessages);
  }

  const [messageText, setMessageText] = React.useState('');

  const uid = props.auth.user.uid;
  const myName = props.auth.user.name;
  const myAvatar = props.auth.user.avatar;

  const userBridgefyIds = Object.values(users)
    .map((user) => user.bridgefyId)
    .filter(
      (bId) =>
        bId !== props.bridgefy.id &&
        props.devices.some((device) => device === bId),
    );

  const onSend = (_messages) => {
    console.log('userBridgefyIds', userBridgefyIds);
    const message = _messages[0];
    const createdAt = Date.now();
    const messageId = createdAt.toString() + uid;
    if (userBridgefyIds.length === 0 && props.network.isOnline === false) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Sorry',
        text2:
          'You are offline, also no friends connected with you by bridgefy',
        visibilityTime: 4000,
      });
    } else {
      for (let i in userBridgefyIds) {
        RNBridgefy.sendMessage({
          content: {
            message: JSON.stringify({
              ...message,
              createdAt: createdAt,
              deleted: false,
              messageId: messageId,
            }),
            chatId: chatId,
            senderNetworkState: props.network.isOnline,
          },
          receiver_id: userBridgefyIds[i],
        });
      }

      database()
        .ref('/chats/' + chatId + '/messages/' + messageId)
        .set({
          ...message,
          createdAt: createdAt,
          deleted: false,
          messageId: messageId,
        });
    }
  };

  return (
    <View style={styles.root}>
      <Header
        title="Message"
        navigation={props.navigation}
        leftButton
        networkState
      />
      <FlatList
        style={styles.flatList}
        horizontal={true}
        data={Object.values(users).filter(
          (user) => user.bridgefyId !== props.bridgefy.id,
        )}
        // data={Object.values(users)}
        keyExtractor={(item, index) => 'user' + index}
        renderItem={(item, index) => {
          return (
            <View style={styles.user}>
              <ImageBackground
                source={images.images.avatar}
                style={[
                  styles.avatar,
                  {alignItems: 'center', justifyContent: 'center'},
                ]}
                imageStyle={{borderRadius: 30}}>
                <Image source={{uri: item.item.avatar}} style={styles.avatar} />
                <View
                  style={[
                    styles.state,
                    {
                      backgroundColor: props.devices.some(
                        (device) => device === item.item.bridgefyId,
                      )
                        ? '#00ff00'
                        : '#bbbbbb',
                    },
                  ]}
                />
              </ImageBackground>
              <Text style={styles.name}>{item.item.name}</Text>
            </View>
          );
        }}
      />
      <Toast
        style={{zIndex: 10000, elevation: 11}}
        ref={(ref) => Toast.setRef(ref)}
      />
      <GiftedChat
        text={messageText}
        onInputTextChanged={(text) => setMessageText(text)}
        messages={messages
          .filter((message) => message.deleted === false)
          .sort((a, b) => {
            return a.createdAt < b.createdAt;
          })}
        onSend={(_messages) => {
          onSend(_messages);
        }}
        user={{
          _id: uid,
          name: myName,
          avatar: myAvatar,
        }}
        renderBubble={(bubbleProps) => {
          return (
            <Bubble
              {...bubbleProps}
              textStyle={{
                left: {
                  color: color.white,
                },
                right: {
                  color: color.white,
                },
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: color.third,
                },
                right: {
                  backgroundColor: color.primary,
                },
              }}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 1,
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 30,
    borderColor: color.black,
    borderWidth: 1,
  },

  flatList: {
    flexGrow: 0,
    height: 70,
    backgroundColor: color.white,
    elevation: 10,
  },

  name: {
    color: color.black,
  },

  user: {
    height: 70,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  state: {
    width: 10,
    height: 10,
    backgroundColor: '#00ff00',
    borderRadius: 5,
    position: 'absolute',
    bottom: -1,
    right: -1,
    borderWidth: 1,
    borderColor: color.black,
    overflow: 'visible',
  },
});

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    chats: state.chats,
    network: state.network,
    devices: state.devices,
    bridgefy: state.bridgefy,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
    chatActions: bindActionCreators(ChatActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
