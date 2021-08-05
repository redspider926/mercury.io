import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Header, Avatar, Input, Button, Space, Loading} from '@components';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {AuthActions} from '@actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import database from '@react-native-firebase/database';

import Toast from 'react-native-toast-message';

import * as images from '@config/images';
import * as size from '@config/size';
import * as color from '@config/color';

const Index = (props) => {
  const [name, setName] = React.useState(props.auth.user.name);
  const [email, setEmail] = React.useState(props.auth.user.phone);

  const [uri, setUri] = React.useState(props.auth.user.avatar);
  const [loadingState, setLoadingState] = React.useState(false);

  const onUpdateButton = async () => {
    setLoadingState(true);
    await database()
      .ref('/users/' + props.auth.user.phone)
      .set({
        phone: props.auth.user.phone,
        name: name,
        email: email,
        uid: props.auth.user.uid,
        avatar: props.auth.user.avatar,
        bridgefyId: props.bridgefy.id,
      })
      .then((result) => {
        props.authActions.register({
          phone: props.auth.user.phone,
          name: name,
          email: email,
          uid: props.auth.user.uid,
          avatar: props.bridgefy.avatar,
        });
        setLoadingState(false);
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Hello',
          text2: 'Your profile info was successfully updated.',
          visibilityTime: 1000,
        });
      })
      .catch((error) => {
        console.log('profile update', error);
      });
  };

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
      <Toast style={{zIndex: 10000}} ref={(ref) => Toast.setRef(ref)} />
      <Header title="My Prfoile" networkState />
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

          <Button title="Save" onPress={onUpdateButton} />
        </View>
      </ScrollView>
      {loadingState && <Loading text="Updating your profile info..." />}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },

  body: {
    height:
      size.dimension.screen.height -
      size.dimension.Header.height -
      60 -
      getStatusBarHeight(),
    padding: size.dimension.screen.padding,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

const mapStateToProps = (state) => {
  return {auth: state.auth, network: state.network, bridgefy: state.bridgefy};
};

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
