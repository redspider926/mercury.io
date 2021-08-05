import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Header, Avatar, Input, Button, Space, Loading} from '@components';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import Toast from 'react-native-toast-message';

import * as images from '@config/images';
import * as size from '@config/size';
import * as color from '@config/color';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';

import {AuthActions} from '@actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const Index = (props) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [uri, setUri] = React.useState('');
  const [loadingState, setLoadingState] = React.useState(false);

  async function onRegisterButton() {
    setLoadingState(true);
    const update = {
      displayName: name,
      email: email,
    };

    await auth().currentUser.updateProfile(update);
    const user = auth().currentUser;
    console.log('user', user);
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

    await database()
      .ref('/users/' + user.phoneNumber)
      .set({
        phone: user.phoneNumber,
        name: user.displayName,
        email: email,
        uid: user.uid,
        avatar: avatarUrl,
      })
      .then((result) => {
        console.log('registered successfully!');
        props.authActions.register({
          phone: user.phoneNumber,
          name: user.displayName,
          email: email,
          uid: user.uid,
          avatar: avatarUrl,
        });
        setLoadingState(false);
        props.navigation.navigate('InitScreen');
      });
  }

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

  return (
    <View style={styles.root}>
      <Header title="Register" />
      <ScrollView>
        <View style={styles.body}>
          <Avatar
            source={uri}
            buttonVisible={true}
            onCameraButton={onCameraButton}
            onImageButton={onImageButton}
          />
          <View>
            <Input
              name
              value={name}
              onChangeText={(text) => {
                setName(text);
              }}
            />
            <Space height={10} />
            <Input
              email
              value={email}
              onChangeText={(text) => {
                setEmail(text);
              }}
            />
          </View>

          <Button title="Register" onPress={onRegisterButton} />
        </View>
      </ScrollView>
      {loadingState && <Loading text="Registering user info..." />}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },

  body: {
    height: size.dimension.screen.height - size.dimension.Header.height - 20,
    padding: size.dimension.screen.padding,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

const mapStateToProps = (state) => {
  return {auth: state.auth};
};

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
