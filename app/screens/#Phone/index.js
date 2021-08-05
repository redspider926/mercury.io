import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Header, Text, Input, Button, Space, Loading} from '@components';

import Toast from 'react-native-toast-message';

import * as images from '@config/images';
import * as size from '@config/size';
import * as color from '@config/color';

import auth from '@react-native-firebase/auth';

import {AuthActions} from '@actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const Index = (props) => {
  const [phone, setPhone] = React.useState('');
  const [loadingState, setLoadingState] = React.useState(false);

  React.useEffect(() => {
    if (props.auth.isAuth === true) {
      props.navigation.navigate('InitScreen');
    }
  }, []);
  const onSendButton = () => {
    signInWithPhoneNumber();
  };

  const getRealPhoneNumberString = (phoneNumber) => {
    let str = '+';
    for (let _index in phoneNumber) {
      if (phoneNumber[_index] >= '0' && phoneNumber[_index] <= '9') {
        str += phoneNumber[_index];
      }
    }
    console.log(str);
    return str;
  };

  async function signInWithPhoneNumber() {
    setLoadingState(true);
    let confirmation;
    auth()
      .signInWithPhoneNumber(phone)
      .then(async (result) => {
        confirmation = result;
        setLoadingState(false);
        await props.authActions.setPhoneNumber(phone);
        await props.authActions.setConfirmation(confirmation);
        setLoadingState(false);
        props.navigation.navigate('VerificationScreen', {
          phone: getRealPhoneNumberString(phone),
        });
      })
      .catch((error) => {
        console.log(error);
        setLoadingState(false);
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Sorry',
          text2: 'Phone number is not valid.',
          visibilityTime: 1000,
        });
      });
  }

  return (
    <View style={styles.root}>
      <Toast style={{zIndex: 10000}} ref={(ref) => Toast.setRef(ref)} />
      <Header title="Phone" />
      <View style={styles.body}>
        <View style={styles.textView}>
          <Text fontSize={size.font.s} textAlign="center">
            You will receive 6 digit code to verify next.
          </Text>
        </View>
        <Space height={20} />

        <Input
          phone
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
          }}
        />
        <Space flex={1} />
        <Button
          title="Send"
          onPress={() => {
            onSendButton();
          }}
        />
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
    flex: 1,
    padding: size.dimension.screen.padding,
  },

  textView: {
    width: '70%',
    alignSelf: 'center',
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
