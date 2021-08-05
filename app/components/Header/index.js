import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Text from '../Text';
import Icon from '../Icon';
import * as images from '@config/images';
import * as size from '@config/size';
import * as color from '@config/color';

import {NetworkActions} from '@actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const Index = (props) => {
  const {navigation, leftButton, title, networkState} = props;
  return (
    <View style={styles.root}>
      {leftButton && (
        <TouchableOpacity
          style={styles.left}
          onPress={() => navigation.goBack()}>
          <Icon source={images.icons.back} tintColor={color.white} size={20} />
        </TouchableOpacity>
      )}
      <Text fontColor={color.white} fontSize={size.font.m}>
        {title}
      </Text>
      {networkState && (
        <View style={styles.right}>
          {props.network.isOnline === false ? (
            <Icon source={images.icons.offline} tintColor={color.third} />
          ) : (
            <Icon source={images.icons.online} tintColor={color.green} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    height: size.dimension.Header.height,
  },

  right: {
    position: 'absolute',
    right: size.dimension.screen.padding,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  left: {
    position: 'absolute',
    left: size.dimension.screen.padding,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  online: {
    width: 30,
    height: 30,
    backgroundColor: color.white,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  offline: {
    width: 30,
    height: 30,
    backgroundColor: color.darkGray,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => {
  return {network: state.network};
};

const mapDispatchToProps = (dispatch) => {
  return {
    networkActions: bindActionCreators(NetworkActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
