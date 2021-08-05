import React from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {Header, Icon, Contact} from '@components';

import * as images from '@config/images';
import * as size from '@config/size';
import * as color from '@config/color';

import database from '@react-native-firebase/database';
import uuid from 'react-native-uuid';

import {
  AuthActions,
  ContactActions,
  NetworkActions,
  ChatActions,
} from '@actions';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const Index = (props) => {
  const myPhone = props.auth.user.phone;
  const myName = props.auth.user.name;
  const myAvatar = props.auth.user.avatar;
  const myBridgefyId = props.bridgefy.id;

  const contacts = props.contacts;

  return (
    <View style={styles.root}>
      <Header title="Contact" networkState />
      <View style={styles.body}>
        <FlatList
          style={styles.flatList}
          data={contacts}
          keyExtractor={(item, index) => 'contacts' + index}
          renderItem={(item) => (
            <Contact
              avatar={item.item.avatar}
              name={item.item.name}
              phone={item.item.phone}
              state={item.item.contacts[myPhone].state}
              onAcceptButton={async () => {
                //create chat between two users.
                const usersData = {};
                usersData[myPhone] = {
                  name: myName,
                  avatar: myAvatar,
                  bridgefyId: myBridgefyId,
                  //bridgefyId here
                };
                usersData[item.item.phone] = {
                  name: item.item.name,
                  avatar: item.item.avatar,
                  bridgefyId: item.item.bridgefyId,
                  //bridgefyId here
                };
                const chatId = uuid.v4();
                await database()
                  .ref('/chats/' + chatId)
                  .set({users: usersData, chatId: chatId, type: 'DIRECT'});
                await database()
                  .ref('/users/' + myPhone + '/contacts/' + item.item.phone)
                  .set({chatId: chatId, match: true, state: '11'});
                await database()
                  .ref('/users/' + item.item.phone + '/contacts/' + myPhone)
                  .set({chatId: chatId, match: true, state: '11'});
              }}
              onRejectButton={async () => {
                await database()
                  .ref('/users/' + myPhone + '/contacts/' + item.item.phone)
                  .set({chatId: 'chat', match: true, state: '00'});
                await database()
                  .ref('/users/' + item.item.phone + '/contacts/' + myPhone)
                  .set({chatId: 'chat', match: true, state: '00'});
              }}
              onChatButton={() => {
                props.navigation.navigate('MessageScreen', {
                  chatId: item.item.contacts[myPhone].chatId,
                });
              }}
            />
          )}
        />

        <TouchableOpacity
          style={[
            styles.addContact,
            props.network.isOnline === false && {
              backgroundColor: color.darkGray,
            },
          ]}
          onPress={() => props.navigation.navigate('NewContactScreen')}
          disabled={props.network.isOnline === false}>
          <Icon source={images.icons.plus} tintColor={color.white} size={20} />
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

  addContact: {
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
