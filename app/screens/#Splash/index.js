import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from '@components';
import * as size from '@config/size';
import * as color from '@config/color';
import * as images from '@config/images';

import {AuthActions} from '@actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const Index = (props) => {
  const isAuth = props.auth.isAuth;
  React.useEffect(() => {
    setTimeout(() => {
      if (isAuth === true) {
        props.navigation.navigate('InitScreen');
      } else {
        props.navigation.navigate('PhoneScreen');
      }
    }, 2000);
  }, []);

  return (
    <View style={styles.root}>
      <Text fontSize={size.font.xl} fonrColor={color.primary}>
        Mercury
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 1,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
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
