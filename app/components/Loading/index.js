import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import Text from '../Text';
import Space from '../Space';

import * as images from '@config/images';
import * as size from '@config/size';
import * as color from '@config/color';

const Index = (props) => {
  const {text = 'Loading...'} = props;
  return (
    <View style={styles.root}>
      <Text fontSize={size.font.s} fontColor={color.white}>
        {text}
      </Text>
      <Space height={20} />
      <ActivityIndicator size="large" color={color.white} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000055',
  },
});

export default Index;
