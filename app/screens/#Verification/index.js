import React from 'react';
import {View, StyleSheet, Text as RNText, Keyboard} from 'react-native';
import {Header, Text, Input, Button, Space, Loading} from '@components';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import Toast from 'react-native-toast-message';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import {AuthActions} from '@actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as size from '@config/size';
import * as color from '@config/color';

const Index = (props) => {
  const phone = props.route.params.phone;
  const confirmation = props.auth.confirmation;

  const [loadingState, setLoadingState] = React.useState(false);
  const [code, setCode] = React.useState('');
  const ref = useBlurOnFulfill({code, cellCount: CELL_COUNT});
  const [_props, getCellOnLayoutHandler] = useClearByFocusCell({
    code,
    setCode,
  });

  const CELL_COUNT = 6;

  React.useEffect(() => {
    if (code.length === 6) {
      Keyboard.dismiss();
      setLoadingState(true);
      confirmCode();
    }
  }, [code]);

  async function confirmCode() {
    try {
      await confirmation.confirm(code);
      if (auth().currentUser.displayName === null) {
        setLoadingState(false);
        props.navigation.navigate('RegisterScreen');
      } else {
        database()
          .ref('/users/' + phone)
          .once('value')
          .then(async (result) => {
            await props.authActions.login(result.val());
            await setLoadingState(false);
            await props.navigation.navigate('InitScreen');
          });
      }
    } catch (error) {
      setLoadingState(false);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Sorry',
        text2: 'Your verification cod is not valid.',
        visibilityTime: 1000,
      });
    }
  }

  return (
    <View style={styles.root}>
      <Toast style={{zIndex: 10000}} ref={(ref) => Toast.setRef(ref)} />
      <Header title="Verification" />
      <View style={styles.body}>
        <View style={styles.textView}>
          <Text fontSize={size.font.s} textAlign="center">
            Code is sent to {phone}.
          </Text>
        </View>
        <Space height={40} />
        <CodeField
          ref={ref}
          {..._props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={code}
          onChangeText={setCode}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <View key={index} onLayout={getCellOnLayoutHandler(index)}>
              <RNText style={[styles.cell, isFocused && styles.focusCell]}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </RNText>
            </View>
          )}
        />
      </View>
      {loadingState && <Loading />}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {auth: state.auth};
};

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },

  body: {
    width: '100%',
    flex: 1,
    padding: size.dimension.screen.padding,
  },

  codeFieldRoot: {justifyContent: 'center'},
  cell: {
    width: 40,
    height: 40,
    margin: 5,
    lineHeight: 30,
    // lineHeight: size.dimension.screen.hairLine,
    borderBottomWidth: 1,
    fontSize: size.font.xl,
    textAlign: 'center',
    borderBottomColor: 'black',
  },
  focusCell: {
    borderBottomColor: color.focus,
  },
  textView: {
    width: '80%',
    alignSelf: 'center',
  },
});
