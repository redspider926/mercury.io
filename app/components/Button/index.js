import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Text from '../Text';

import * as size from '@config/size';
import * as color from '@config/color';

const Index = (props) => {
  const {title, disabled, onPress = () => {}} = props;
  return (
    <TouchableOpacity
      style={[styles.root, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}>
      <Text fontColor={color.white} fontSize={size.font.m}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '50%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: size.dimension.Button.height,
    backgroundColor: color.primary,
    borderRadius: size.dimension.Button.borderRadius,
  },

  disabled: {
    backgroundColor: color.darkGray,
  },
});

export default Index;
