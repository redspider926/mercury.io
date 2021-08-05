import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Linking, Platform} from 'react-native';
import {Header, Loading, Input, Button, Icon, Text, Space} from '@components';
import Clipboard from '@react-native-community/clipboard';
import Share from 'react-native-share';

import Toast from 'react-native-toast-message';

import * as images from '@config/images';
import * as size from '@config/size';
import * as color from '@config/color';

import database from '@react-native-firebase/database';

import dynamicLinks from '@react-native-firebase/dynamic-links';

import {AuthActions} from '@actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Index = (props) => {
  const [loadingState, setLoadingState] = React.useState(false);
  const [dynamicLink, setDynamicLink] = React.useState('');
  const [result, setResult] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const myPhone = props.auth.user.phone;

  async function inviteFriend() {
    //check phone is valid here
    if (getRealPhone(phone) === myPhone) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Sorry',
        text2: 'You can not invite youself',
        visibilityTime: 1000,
      });

      return false;
    }

    setLoadingState(true);
    let contacts = [];
    await database()
      .ref('/users/' + myPhone + '/contacts')
      .once('value')
      .then((snapshot) => {
        setLoadingState(false);
        if (snapshot.val() !== undefined && snapshot.val() !== null) {
          contacts = Object.keys(snapshot.val());
        }
      })
      .catch();

    //check phone is in the your contact here
    if (contacts.some((contact) => contact === getRealPhone(phone))) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Sorry',
        text2: 'You can not invite friend who is in your contact.',
        visibilityTime: 1000,
      });

      return false;
    }

    setLoadingState(true);

    await database()
      .ref('/users/' + myPhone + '/contacts/' + getRealPhone(phone))
      .set({chatId: 'chat', match: true, state: '10'})
      .then()
      .catch();
    await database()
      .ref('/users/' + getRealPhone(phone) + '/phone')
      .set(getRealPhone(phone))
      .then()
      .catch();
    await database()
      .ref('/users/' + getRealPhone(phone) + '/contacts/' + myPhone)
      .set({chatId: 'chat', match: true, state: '01'})
      .then()
      .catch();
    setLoadingState(false);

    Toast.show({
      type: 'success',
      position: 'top',
      text1: 'Hello',
      text2: 'You successfully invited a friend.',
      visibilityTime: 1000,
    });

    const link = await dynamicLinks().buildLink({
      link: 'https://google.com',
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: 'https://mercury926.page.link',
      // optional setup which updates Firebase analytics campaign
      // "banner". This also needs setting up before hand
      analytics: {
        campaign: 'banner',
      },
    });

    setDynamicLink(link);

    // get dynamic link here
  }

  const getRealPhone = (str) => {
    let tempStr = '';
    for (let index in str) {
      if ((str[index] >= '0' && str[index] <= '9') || str[index] === '+') {
        tempStr += str[index];
      }
    }
    return tempStr;
  };

  return (
    <View style={styles.root}>
      <Toast style={{zIndex: 10000}} ref={(ref) => Toast.setRef(ref)} />
      <Header
        title="Invite"
        navigation={props.navigation}
        leftButton
        networkState
      />
      <ScrollView>
        <View style={styles.body}>
          <Input
            phone
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
            }}
          />
          <Button
            title="Invite"
            onPress={inviteFriend}
            disabled={!props.network.isOnline}
          />
          {dynamicLink.length > 0 && (
            <View style={{width: '100%'}}>
              <Text fontSize={size.font.s} textAlign="center">
                You can invite a friend to Mercury app using this link.
              </Text>
              <Space height={20} />
              <View style={styles.linkView}>
                <View style={{width: '65%'}}>
                  <Text fontSize={size.font.s}>{dynamicLink}</Text>
                </View>

                <Space flex={1} />
                <TouchableOpacity
                  style={styles.circleButton}
                  onPress={() => {
                    Clipboard.setString(dynamicLink);
                    Toast.show({
                      type: 'success',
                      position: 'top',
                      text1: 'Hello',
                      text2: 'Your link successfully copied to clipboard.',
                      visibilityTime: 1000,
                    });
                  }}>
                  <Icon
                    source={images.icons.paste}
                    tintColor={color.white}
                    size={20}
                  />
                </TouchableOpacity>

                <Space width={10} />
                <TouchableOpacity
                  style={styles.circleButton}
                  onPress={async () => {
                    const url =
                      Platform.OS === 'android'
                        ? `sms:${phone}?body=yourMessage`
                        : `sms:${phone}`;

                    Linking.canOpenURL(url)
                      .then((supported) => {
                        if (!supported) {
                          console.log('Unsupported url: ' + url);
                        } else {
                          return Linking.openURL(url);
                        }
                      })
                      .catch((err) => console.error('An error occurred', err));
                  }}>
                  <Icon
                    source={images.icons.share}
                    tintColor={color.white}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* dynamic link copy view here */}
        </View>
      </ScrollView>
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
    height: size.dimension.screen.height - size.dimension.Header.height - 20,
    padding: size.dimension.screen.padding,
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  linkView: {
    width: '100%',
    height: 80,
    borderWidth: size.dimension.screen.hairLine,
    borderColor: color.darkGray,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },

  circleButton: {
    height: 40,
    width: 40,
    backgroundColor: color.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => {
  return {auth: state.auth, network: state.network};
};

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
