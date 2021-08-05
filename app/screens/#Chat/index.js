import React from 'react';
import {View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {Header, Icon, Chat} from '@components';

import Toast from 'react-native-toast-message';

import * as images from '@config/images';
import * as size from '@config/size';
import * as color from '@config/color';

import database from '@react-native-firebase/database';

import {AuthActions, ChatActions} from '@actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const Index = (props) => {
  const chats = props.chats;
  const myPhone = props.auth.user.phone;

  const getChatName = (chat) => {
    if (chat.type === 'DIRECT') {
      const usersPhone = Object.keys(chat.users);
      const friendPhone = usersPhone.find((userPhone) => userPhone !== myPhone);
      return chat.users[friendPhone].name;
    } else if (chat.type === 'GROUP') {
      return chat.name;
    }
  };

  const getChatAvatar = (chat) => {
    if (chat.type === 'DIRECT') {
      const usersPhone = Object.keys(chat.users);
      const friendPhone = usersPhone.find((userPhone) => userPhone !== myPhone);
      return chat.users[friendPhone].avatar;
    } else if (chat.type === 'GROUP') {
      return chat.avatar;
    }
  };

  const getFinalMessage = (chat) => {
    if (chat.messages !== null && chat.messages !== undefined) {
      let messages = Object.values(chat.messages);
      messages = messages.filter((message) => message.deleted === false);
      if (messages.length === 0) {
        return 'empty chat';
      } else {
        const text = messages[messages.length - 1].text;
        if (text.length > 25) {
          return text.slice(0, 25) + '...';
        } else {
          if (text.length === 0) {
            return 'image';
          } else {
            return text;
          }
        }
      }
    } else {
      return 'empty chat';
    }
  };

  return (
    <View style={styles.root}>
      <Header title="Chat" networkState />
      <View style={styles.body}>
        <FlatList
          style={styles.flatList}
          data={chats}
          keyExtractor={(item, index) => 'chats' + index}
          renderItem={(item) => (
            <Chat
              type={item.item.type}
              name={getChatName(item.item)}
              avatar={getChatAvatar(item.item)}
              finalMessage={getFinalMessage(item.item)}
              // notification={item.item.notification}
              onPress={() =>
                props.navigation.navigate('MessageScreen', {
                  chatId: item.item.chatId,
                  users: item.item.users,
                })
              }
            />
          )}
        />
        <TouchableOpacity
          style={[
            styles.myGroups,
            props.network.isOnline === false && {
              backgroundColor: color.darkGray,
            },
          ]}
          disabled={props.network.isOnline === false}
          onPress={() => props.navigation.navigate('MyGroupScreen')}>
          <Icon source={images.icons.group} tintColor={color.white} size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },

  body: {
    flexGrow: 1,
    padding: size.dimension.screen.padding,
  },

  flatList: {
    flex: 1,
  },

  myGroups: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    bottom: 20,
    right: 20,
    backgroundColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => {
  return {auth: state.auth, chats: state.chats, network: state.network};
};

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
    chatActions: bindActionCreators(ChatActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
