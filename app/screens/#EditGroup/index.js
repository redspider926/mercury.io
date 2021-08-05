import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {Header, Text, Button, Space, Contact, Loading} from '@components';

import database from '@react-native-firebase/database';

import Toast from 'react-native-toast-message';

import * as images from '@config/images';
import * as size from '@config/size';
import * as color from '@config/color';

import {AuthActions} from '@actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const Index = (props) => {
  const users = props.route.params.users;
  const users_ = props.route.params.users_;
  const name = props.route.params.name;
  const chatId = props.route.params.chatId;
  console.log('chatId', chatId);

  const contacts = props.contacts;
  const [loadingState, setLoadingState] = React.useState(false);
  const [selectedFriendPhones, setSelectedFriendPhones] = React.useState([]);

  async function onAddButton() {
    setLoadingState(true);
    const usersData = {};

    for (let index in selectedFriendPhones) {
      const friendPhone = selectedFriendPhones[index];
      usersData[friendPhone] = {
        name: contacts.find((contact) => contact.phone === friendPhone).name,
        avatar: contacts.find((contact) => contact.phone === friendPhone)
          .avatar,
        bridgefyId: contacts.find((contact) => contact.phone === friendPhone)
          .bridgefyId,
      };
    }

    await database()
      .ref('/chats/' + chatId + '/users')
      .set({...users_, ...usersData})
      .then((result) => {
        setLoadingState(false);
        props.navigation.goBack();
      })
      .catch((error) => {
        setLoadingState(false);
      });
  }

  return (
    <View style={styles.root}>
      <Header
        title={`Edit ${name} group`}
        navigation={props.navigation}
        leftButton
      />
      <View style={styles.body}>
        <Text fontSize={size.font.xs}>Current members</Text>
        <FlatList
          style={styles.flatList}
          data={contacts.filter((contact) =>
            users.some((user) => user === contact.phone),
          )}
          keyExtractor={(item, index) => 'invitation' + index}
          renderItem={(item) => (
            <Contact
              name={item.item.name}
              phone={item.item.phone}
              avatar={item.item.avatar}
            />
          )}
        />

        <Text fontSize={size.font.xs}>Add members</Text>
        <FlatList
          style={styles.flatList}
          data={contacts.filter((contact) =>
            users.every((user) => user !== contact.phone),
          )}
          keyExtractor={(item, index) => 'invitation' + index}
          renderItem={(item) => (
            <Contact
              name={item.item.name}
              phone={item.item.phone}
              avatar={item.item.avatar}
              toggleItem
              onSelect={() => {
                console.log('selectedfriendPhones', selectedFriendPhones);
                if (
                  selectedFriendPhones.some(
                    (selectedFriendPhone) =>
                      selectedFriendPhone === item.item.phone,
                  )
                ) {
                  setSelectedFriendPhones(
                    selectedFriendPhones.filter(
                      (selectedFriendPhone) =>
                        selectedFriendPhone !== item.item.phone,
                    ),
                  );
                } else {
                  setSelectedFriendPhones([
                    ...selectedFriendPhones,
                    item.item.phone,
                  ]);
                }
              }}
              selected={selectedFriendPhones.some(
                (selectedFriendPhone) =>
                  selectedFriendPhone === item.item.phone,
              )}
            />
          )}
        />
        <Button title="Add members" disabled={false} onPress={onAddButton} />
      </View>
      {loadingState && <Loading />}
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
    marginTop: 10,
    marginBottom: 10,
  },
});

const mapStateToProps = (state) => {
  return {auth: state.auth, bridgefy: state.bridgefy, contacts: state.contacts};
};

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
