import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {
  Header,
  Input,
  Button,
  Space,
  Contact,
  Avatar,
  Text,
  Loading,
} from '@components';

import Toast from 'react-native-toast-message';

import * as images from '@config/images';
import * as size from '@config/size';
import * as color from '@config/color';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';

import {AuthActions} from '@actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const Index = (props) => {
  const contacts = props.contacts;
  const myPhone = props.auth.user.phone;
  const myName = props.auth.user.name;
  const myAvatar = props.auth.user.avatar;
  const myBridgefyId = props.bridgefy.id;
  const [selectedFriendPhones, setSelectedFriendPhones] = React.useState([]);

  const [uri, setUri] = React.useState('');
  const [groupName, setGroupName] = React.useState('');

  const [loadingState, setLoadingState] = React.useState(false);

  const onCameraButton = () => {
    launchCamera(
      {
        mediaType: 'photo',
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        console.log('camera response', response);
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
        } else {
          setUri(response.uri);
        }
      },
    );
  };

  const onImageButton = () => {
    launchImageLibrary(
      {
        maxWidth: 256,
        maxHeight: 256,
        noData: true,
        mediaType: 'photo',
        storageOptions: {
          skipBackup: true,
        },
      },
      (response) => {
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
        } else {
          setUri(response.uri);
        }
      },
    );
  };

  async function onCreateButton() {
    if (groupName === '') {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Sorry',
        text2: 'You must type a group name.',
        visibilityTime: 1000,
      });
    } else {
      if (selectedFriendPhones.length === 0) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Sorry',
          text2: 'You should choose more than one friend in contact',
          visibilityTime: 1000,
        });
      } else {
        setLoadingState(true);
        const chatId = uuid.v4();
        const usersData = {};
        usersData[myPhone] = {
          name: myName,
          avatar: myAvatar,
          bridgefyId: myBridgefyId,
        };
        for (let index in selectedFriendPhones) {
          const friendPhone = selectedFriendPhones[index];
          usersData[friendPhone] = {
            name: contacts.find((contact) => contact.phone === friendPhone)
              .name,
            avatar: contacts.find((contact) => contact.phone === friendPhone)
              .avatar,
            bridgefyId: contacts.find(
              (contact) => contact.phone === friendPhone,
            ).bridgefyId,
          };
        }

        var imageRef = storage().ref('/avatars').child(uuid.v1());

        let avatarUrl =
          'https://firebasestorage.googleapis.com/v0/b/mercury-28d74.appspot.com/o/avatars%2Favatar.jpg?alt=media&token=a880d435-7150-4f42-bf8d-c680806e6d9a';

        if (uri) {
          await imageRef
            .putFile(uri)
            .then(async (snapshot) => {
              avatarUrl = await imageRef.getDownloadURL();
            })
            .catch();
        }

        database()
          .ref('/chats/' + chatId)
          .set({
            users: usersData,
            chatId: chatId,
            type: 'GROUP',
            name: groupName,
            avatar: avatarUrl,
          })

          .then((result) => {
            setLoadingState(false);
            props.navigation.goBack();
          })
          .catch((error) => {
            setLoadingState(false);
          });
      }
    }
  }

  return (
    <View style={styles.root}>
      <Toast style={{zIndex: 10000}} ref={(ref) => Toast.setRef(ref)} />
      <Header title="New Group" navigation={props.navigation} leftButton />
      <View style={styles.body}>
        <Avatar
          source={uri}
          onPress={onCameraButton}
          onCameraButton={onCameraButton}
          onImageButton={onImageButton}
        />
        <Space height={20} />
        <Input
          group
          value={groupName}
          onChangeText={(text) => {
            setGroupName(text);
          }}
        />
        <Space height={10} />
        <Text fontSize={size.font.xs}>
          Please choose friends for new group.
        </Text>
        <Space height={10} />
        <FlatList
          style={styles.flatList}
          data={contacts}
          keyExtractor={(item, index) => 'invitation' + index}
          renderItem={(item) => (
            <Contact
              avatar={item.item.avatar}
              name={item.item.name}
              phone={item.item.phone}
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
        <Button title="Create Group" onPress={onCreateButton} />
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
    flex: 1,
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
